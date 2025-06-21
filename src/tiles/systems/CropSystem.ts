import type { Grid, CropTypeValue, CropData } from './TileTypes';
import { TileType, CropType, CropStage, OccupationType, WATER_DURATION, WATER_GROWTH_MULTIPLIER } from './TileTypes';
import { positionKey } from './TileUtils';

// Plant a seed at the specified position (only on dirt tiles)
export function plantSeed(grid: Grid, x: number, y: number, cropType: CropTypeValue): boolean {
    const key = positionKey(x, y);
    const tile = grid.tiles.get(key);

    if (!tile || tile.type !== TileType.DIRT) {
        return false; // Can only plant on dirt tiles
    }

    if (tile.occupation) {
        return false; // Tile is already occupied
    }

    if (x >= 0 && x < grid.width && y >= 0 && y < grid.height) {
        const cropData: CropData = {
            type: cropType,
            stage: CropStage.SEED,
            plantedTime: Date.now()
        };

        grid.tiles.set(key, {
            ...tile,
            occupation: OccupationType.CROP,
            cropData
        });
        return true;
    }

    return false;
}

// Growth timing constants (in milliseconds)
export const CROP_GROWTH_TIMES = {
    [CropType.WHEAT]: {
        SEED_TO_GROWING: 10000,   // 10 seconds
        GROWING_TO_MATURE: 20000  // 20 seconds (30s total)
    },
    [CropType.CARROT]: {
        SEED_TO_GROWING: 20000,   // 20 seconds  
        GROWING_TO_MATURE: 40000  // 40 seconds (60s total)
    },
    [CropType.TOMATO]: {
        SEED_TO_GROWING: 30000,   // 30 seconds
        GROWING_TO_MATURE: 60000  // 60 seconds (90s total)
    }
} as const;

// Check if water is still effective (within duration)
function isWaterEffective(wateredTime: number | undefined): boolean {
    if (!wateredTime) return false;
    return Date.now() - wateredTime < WATER_DURATION;
}

// Public function to check if a crop is currently watered
export function isWatered(cropData: CropData): boolean {
    return isWaterEffective(cropData.wateredTime);
}

// Get remaining water time in milliseconds
export function getRemainingWaterTime(cropData: CropData): number {
    if (!cropData.wateredTime) return 0;
    const elapsed = Date.now() - cropData.wateredTime;
    return Math.max(0, WATER_DURATION - elapsed);
}

// Get crop growth progress as a percentage (0-1)
export function getCropGrowthProgress(cropData: CropData): number {
    const currentTime = Date.now();
    const timeSincePlanted = currentTime - cropData.plantedTime;
    const growthTimes = getCropGrowthTimes(cropData.type);

    // Apply watering speed boost if tile is watered
    const effectiveTimeSincePlanted = isWaterEffective(cropData.wateredTime) ?
        timeSincePlanted * WATER_GROWTH_MULTIPLIER :
        timeSincePlanted;

    if (cropData.stage === CropStage.SEED) {
        return Math.min(1, effectiveTimeSincePlanted / growthTimes.seedToGrowing);
    } else if (cropData.stage === CropStage.GROWING) {
        const timeInGrowingStage = effectiveTimeSincePlanted - growthTimes.seedToGrowing;
        return Math.min(1, timeInGrowingStage / growthTimes.growingToMature);
    }

    return 1; // Mature crops are 100% complete
}

// Get remaining growth time for current stage in milliseconds
export function getRemainingGrowthTime(cropData: CropData): number {
    if (cropData.stage === CropStage.MATURE) return 0;

    const currentTime = Date.now();
    const timeSincePlanted = currentTime - cropData.plantedTime;
    const growthTimes = getCropGrowthTimes(cropData.type);

    // Apply watering speed boost if tile is watered
    const effectiveTimeSincePlanted = isWaterEffective(cropData.wateredTime) ?
        timeSincePlanted * WATER_GROWTH_MULTIPLIER :
        timeSincePlanted;

    if (cropData.stage === CropStage.SEED) {
        const timeNeeded = growthTimes.seedToGrowing;
        const timeRemaining = timeNeeded - effectiveTimeSincePlanted;
        return Math.max(0, timeRemaining / (isWaterEffective(cropData.wateredTime) ? WATER_GROWTH_MULTIPLIER : 1));
    } else if (cropData.stage === CropStage.GROWING) {
        const timeNeeded = growthTimes.seedToGrowing + growthTimes.growingToMature;
        const timeRemaining = timeNeeded - effectiveTimeSincePlanted;
        return Math.max(0, timeRemaining / (isWaterEffective(cropData.wateredTime) ? WATER_GROWTH_MULTIPLIER : 1));
    }

    return 0;
}

// Get growth times for a specific crop type
function getCropGrowthTimes(cropType: CropTypeValue): { seedToGrowing: number, growingToMature: number } {
    return {
        seedToGrowing: CROP_GROWTH_TIMES[cropType].SEED_TO_GROWING,
        growingToMature: CROP_GROWTH_TIMES[cropType].GROWING_TO_MATURE
    };
}

// Update crop growth for all tiles
export function updateCropGrowth(grid: Grid): boolean {
    let hasChanges = false;
    const currentTime = Date.now();

    grid.tiles.forEach((tile, key) => {
        if (tile.occupation === OccupationType.CROP && tile.cropData) {
            const { cropData } = tile;
            const timeSincePlanted = currentTime - cropData.plantedTime;
            const growthTimes = getCropGrowthTimes(cropData.type);

            // Check if water is still effective
            const isWatered = isWaterEffective(cropData.wateredTime);

            // Apply watering speed boost if tile is watered
            const effectiveTimeSincePlanted = isWatered ?
                Math.floor(timeSincePlanted * WATER_GROWTH_MULTIPLIER) :
                timeSincePlanted;

            let newStage = cropData.stage;

            // Check if it's time to advance to next growth stage
            if (cropData.stage === CropStage.SEED && effectiveTimeSincePlanted >= growthTimes.seedToGrowing) {
                newStage = CropStage.GROWING;
                hasChanges = true;
            } else if (cropData.stage === CropStage.GROWING &&
                effectiveTimeSincePlanted >= growthTimes.seedToGrowing + growthTimes.growingToMature) {
                newStage = CropStage.MATURE;
                hasChanges = true;
            }

            // Update the tile if growth occurred or water expired
            if (newStage !== cropData.stage || (!isWatered && cropData.wateredTime)) {
                const updatedCropData: CropData = {
                    ...cropData,
                    stage: newStage,
                    // Clear watered time if water expired
                    wateredTime: isWatered ? cropData.wateredTime : undefined
                };

                grid.tiles.set(key, {
                    ...tile,
                    cropData: updatedCropData
                });
            }
        }
    });

    return hasChanges;
}

// Check if a crop is mature and ready for harvest
export function isCropMature(tile: any): boolean {
    return tile.occupation === OccupationType.CROP &&
        tile.cropData &&
        tile.cropData.stage === CropStage.MATURE;
}

// Harvest a mature crop and return it to dirt
export function harvestCrop(grid: Grid, x: number, y: number): { success: boolean; cropType?: CropTypeValue } {
    const key = positionKey(x, y);
    const tile = grid.tiles.get(key);

    if (!tile || !isCropMature(tile)) {
        return { success: false };
    }

    const cropType = tile.cropData!.type;

    // Convert back to plain dirt after harvest
    grid.tiles.set(key, {
        ...tile,
        occupation: undefined,
        cropData: undefined
    });

    return { success: true, cropType };
}

// Water a crop to speed up its growth
export function waterCrop(grid: Grid, x: number, y: number): { success: boolean; message?: string } {
    const key = positionKey(x, y);
    const tile = grid.tiles.get(key);

    if (!tile) {
        return { success: false, message: 'No tile found' };
    }

    // Check if tile has a crop that can be watered
    if (tile.occupation !== OccupationType.CROP || !tile.cropData) {
        return { success: false, message: 'Nothing to water here!' };
    }

    // Check if crop is already mature
    if (tile.cropData.stage === CropStage.MATURE) {
        return { success: false, message: 'This crop is already fully grown!' };
    }

    // Check if already watered and water is still effective
    if (isWaterEffective(tile.cropData.wateredTime)) {
        return { success: false, message: 'This crop is already watered!' };
    }

    // Water the crop
    const updatedCropData: CropData = {
        ...tile.cropData,
        wateredTime: Date.now()
    };

    grid.tiles.set(key, {
        ...tile,
        cropData: updatedCropData
    });

    return { success: true, message: `Crop watered! It will grow ${Math.round((WATER_GROWTH_MULTIPLIER - 1) * 100)}% faster for ${WATER_DURATION / 1000} seconds.` };
}

// Check if a tile can be watered
export function canWaterTile(grid: Grid, x: number, y: number): boolean {
    const key = positionKey(x, y);
    const tile = grid.tiles.get(key);

    if (!tile || tile.occupation !== OccupationType.CROP || !tile.cropData) {
        return false;
    }

    return tile.cropData.stage < CropStage.MATURE && !isWaterEffective(tile.cropData.wateredTime);
}
