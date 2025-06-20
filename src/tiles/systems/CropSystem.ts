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
export const GROWTH_TIMES = {
    SEED_TO_GROWING: 5000,  // 5 seconds from seed to growing
    GROWING_TO_MATURE: 10000 // 10 seconds from growing to mature
};

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
            let newStage = tile.growthStage;
            let newType = tile.type;

            // Check if it's time to advance to next growth stage
            if (tile.growthStage === 0 && timeSincePlanted >= GROWTH_TIMES.SEED_TO_GROWING) {
                newStage = 1;
                newType = getNextGrowthStage(tile.type, 1);
                hasChanges = true;
            } else if (tile.growthStage === 1 && timeSincePlanted >= GROWTH_TIMES.SEED_TO_GROWING + GROWTH_TIMES.GROWING_TO_MATURE) {
                newStage = 2;
                newType = getNextGrowthStage(tile.type, 2);
                hasChanges = true;
            }

            // Update the tile if growth occurred
            if (newStage !== tile.growthStage) {
                grid.tiles.set(key, {
                    ...tile,
                    type: newType,
                    growthStage: newStage
                });
            }
        }
    });

    return hasChanges;
}
