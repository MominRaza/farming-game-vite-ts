import type { Grid, TileTypeValue } from './TileTypes';
import { TileType } from './TileTypes';
import { positionKey } from './TileUtils';

// Plant a seed at the specified position
export function plantSeed(grid: Grid, x: number, y: number, seedType: TileTypeValue): void {
    const key = positionKey(x, y);
    if (x >= 0 && x < grid.width && y >= 0 && y < grid.height) {
        grid.tiles.set(key, {
            type: seedType,
            x,
            y,
            plantedTime: Date.now(),
            growthStage: 0 // 0 = seed stage
        });
    }
}

// Growth timing constants (in milliseconds)
// Wheat: fastest (30s total), Carrot: medium (60s total), Tomato: slowest (90s total)
export const CROP_GROWTH_TIMES = {
    WHEAT: {
        SEED_TO_GROWING: 10000,   // 10 seconds
        GROWING_TO_MATURE: 20000  // 20 seconds (30s total)
    },
    CARROT: {
        SEED_TO_GROWING: 20000,   // 20 seconds  
        GROWING_TO_MATURE: 40000  // 40 seconds (60s total)
    },
    TOMATO: {
        SEED_TO_GROWING: 30000,   // 30 seconds
        GROWING_TO_MATURE: 60000  // 60 seconds (90s total)
    }
} as const;

// Get growth times for a specific crop type
function getCropGrowthTimes(cropType: TileTypeValue): { seedToGrowing: number, growingToMature: number } {
    if (cropType === TileType.WHEAT_SEEDS || cropType === TileType.WHEAT_GROWING) {
        return { 
            seedToGrowing: CROP_GROWTH_TIMES.WHEAT.SEED_TO_GROWING,
            growingToMature: CROP_GROWTH_TIMES.WHEAT.GROWING_TO_MATURE
        };
    } else if (cropType === TileType.CARROT_SEEDS || cropType === TileType.CARROT_GROWING) {
        return { 
            seedToGrowing: CROP_GROWTH_TIMES.CARROT.SEED_TO_GROWING,
            growingToMature: CROP_GROWTH_TIMES.CARROT.GROWING_TO_MATURE
        };
    } else if (cropType === TileType.TOMATO_SEEDS || cropType === TileType.TOMATO_GROWING) {
        return { 
            seedToGrowing: CROP_GROWTH_TIMES.TOMATO.SEED_TO_GROWING,
            growingToMature: CROP_GROWTH_TIMES.TOMATO.GROWING_TO_MATURE
        };
    }
    
    // Fallback to carrot times
    return { 
        seedToGrowing: CROP_GROWTH_TIMES.CARROT.SEED_TO_GROWING,
        growingToMature: CROP_GROWTH_TIMES.CARROT.GROWING_TO_MATURE
    };
}

// Get the next growth stage for a crop type
function getNextGrowthStage(currentType: TileTypeValue, stage: number): TileTypeValue {
    switch (currentType) {
        case TileType.CARROT_SEEDS:
            return stage === 1 ? TileType.CARROT_GROWING : TileType.CARROT_MATURE;
        case TileType.CARROT_GROWING:
            return TileType.CARROT_MATURE;
        case TileType.WHEAT_SEEDS:
            return stage === 1 ? TileType.WHEAT_GROWING : TileType.WHEAT_MATURE;
        case TileType.WHEAT_GROWING:
            return TileType.WHEAT_MATURE;
        case TileType.TOMATO_SEEDS:
            return stage === 1 ? TileType.TOMATO_GROWING : TileType.TOMATO_MATURE;
        case TileType.TOMATO_GROWING:
            return TileType.TOMATO_MATURE;
        default:
            return currentType;
    }
}

// Update crop growth for all tiles
export function updateCropGrowth(grid: Grid): boolean {
    let hasChanges = false;
    const currentTime = Date.now();

    grid.tiles.forEach((tile, key) => {
        if (tile.plantedTime && tile.growthStage !== undefined) {
            const timeSincePlanted = currentTime - tile.plantedTime;
            const growthTimes = getCropGrowthTimes(tile.type);
            let newStage = tile.growthStage;
            let newType = tile.type;

            // Apply watering speed boost if tile is watered
            const effectiveTimeSincePlanted = tile.isWatered ? 
                Math.floor(timeSincePlanted * 1.5) : // 50% faster growth when watered
                timeSincePlanted;

            // Check if it's time to advance to next growth stage
            if (tile.growthStage === 0 && effectiveTimeSincePlanted >= growthTimes.seedToGrowing) {
                newStage = 1;
                newType = getNextGrowthStage(tile.type, 1);
                hasChanges = true;
            } else if (tile.growthStage === 1 && effectiveTimeSincePlanted >= growthTimes.seedToGrowing + growthTimes.growingToMature) {
                newStage = 2;
                newType = getNextGrowthStage(tile.type, 2);
                hasChanges = true;
            }

            // Update the tile if growth occurred
            if (newStage !== tile.growthStage) {
                grid.tiles.set(key, {
                    ...tile,
                    type: newType,
                    growthStage: newStage,
                    // Clear watering status when crop advances stage
                    isWatered: newStage === 2 ? false : tile.isWatered
                });
            }
        }
    });

    return hasChanges;
}

// Check if a crop is mature and ready for harvest
export function isCropMature(tileType: TileTypeValue): boolean {
    return tileType === TileType.CARROT_MATURE ||
        tileType === TileType.WHEAT_MATURE ||
        tileType === TileType.TOMATO_MATURE;
}

// Harvest a mature crop and return it to dirt
export function harvestCrop(grid: Grid, x: number, y: number): { success: boolean; cropType?: TileTypeValue } {
    const key = positionKey(x, y);
    const tile = grid.tiles.get(key);

    if (!tile) {
        return { success: false };
    }

    if (!isCropMature(tile.type)) {
        return { success: false };
    }

    const cropType = tile.type;

    // Convert back to dirt after harvest
    grid.tiles.set(key, {
        type: TileType.DIRT,
        x,
        y,
        sectionX: tile.sectionX,
        sectionY: tile.sectionY
        // Remove planting-related properties
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
    if (!tile.plantedTime || tile.growthStage === undefined) {
        return { success: false, message: 'Nothing to water here!' };
    }

    // Check if crop is already mature
    if (tile.growthStage === 2) {
        return { success: false, message: 'This crop is already fully grown!' };
    }

    // Check if already watered
    if (tile.isWatered) {
        return { success: false, message: 'This crop is already watered!' };
    }

    // Water the crop
    grid.tiles.set(key, {
        ...tile,
        isWatered: true
    });

    return { success: true, message: 'Crop watered! It will grow 50% faster.' };
}

// Check if a tile can be watered
export function canWaterTile(grid: Grid, x: number, y: number): boolean {
    const key = positionKey(x, y);
    const tile = grid.tiles.get(key);

    if (!tile || !tile.plantedTime || tile.growthStage === undefined) {
        return false;
    }

    return tile.growthStage < 2 && !tile.isWatered;
}
