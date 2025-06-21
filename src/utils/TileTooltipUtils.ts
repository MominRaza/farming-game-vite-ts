import { TileType, CropType, CropStage, OccupationType } from '../tiles/systems/TileTypes';
import { getTile, isTileAccessible } from '../tiles';
import { getCropGrowthProgress, getRemainingGrowthTime, isWatered, getRemainingWaterTime } from '../tiles/systems/CropSystem';

// Get detailed information about a tile for tooltip display
export function getTileTooltipInfo(grid: any, x: number, y: number): string | null {
    const tile = getTile(grid, x, y);
    if (!tile) return null;

    const isAccessible = isTileAccessible(grid, x, y);

    let content = `<div><strong>Tile (${x}, ${y})</strong></div>`;

    // Base tile type information
    const tileTypeDisplay = {
        [TileType.GRASS]: { name: 'Grass', icon: '🌱', desc: 'Natural grassland' },
        [TileType.DIRT]: { name: 'Dirt', icon: '🟫', desc: 'Farmable soil' },
        [TileType.ROAD]: { name: 'Road', icon: '🛤️', desc: 'Stone pathway' },
        [TileType.LOCKED]: { name: 'Locked', icon: '🔒', desc: 'Locked area' }
    };

    const tileInfo = tileTypeDisplay[tile.type];
    content += `<div>${tileInfo.icon} ${tileInfo.name}</div>`;
    content += `<div style="color: #ccc; font-size: 11px;">${tileInfo.desc}</div>`;

    // Accessibility status
    if (!isAccessible) {
        content += `<div style="color: #ff6666; margin-top: 5px;">🔒 Area locked</div>`;
        content += `<div style="color: #ccc; font-size: 11px;">Unlock the section to interact</div>`;
        return content;
    }

    // Occupation information
    if (tile.occupation === OccupationType.HOME) {
        content += `<div style="margin-top: 5px;">🏠 <strong>Home</strong></div>`;
        content += `<div style="color: #ccc; font-size: 11px;">Your cozy homestead</div>`;
    } else if (tile.occupation === OccupationType.CROP && tile.cropData) {
        const crop = tile.cropData;

        // Crop type information
        const cropInfo = {
            [CropType.CARROT]: { name: 'Carrot', icon: '🥕', color: '#ff8c00' },
            [CropType.WHEAT]: { name: 'Wheat', icon: '🌾', color: '#daa520' },
            [CropType.TOMATO]: { name: 'Tomato', icon: '🍅', color: '#ff6347' }
        };

        const cropDisplay = cropInfo[crop.type];
        content += `<div style="margin-top: 5px; color: ${cropDisplay.color};">${cropDisplay.icon} <strong>${cropDisplay.name}</strong></div>`;

        // Growth stage
        const stageNames = {
            [CropStage.SEED]: 'Seed',
            [CropStage.GROWING]: 'Growing',
            [CropStage.MATURE]: 'Mature'
        };

        const stageName = stageNames[crop.stage];
        const stageEmoji = crop.stage === CropStage.SEED ? '🌱' :
            crop.stage === CropStage.GROWING ? '🌿' : '✨';

        content += `<div style="color: #90EE90;">${stageEmoji} ${stageName}</div>`;

        // Growth progress
        if (crop.stage !== CropStage.MATURE) {
            const progress = getCropGrowthProgress(crop);
            const progressPercent = Math.round(progress * 100);
            const remainingTime = getRemainingGrowthTime(crop);
            const remainingSeconds = Math.ceil(remainingTime / 1000);

            content += `<div style="color: #ccc; font-size: 11px;">Growth: ${progressPercent}%</div>`;
            if (remainingSeconds > 0) {
                content += `<div style="color: #ccc; font-size: 11px;">Time left: ${remainingSeconds}s</div>`;
            }
        }        // Water status
        if (isWatered(crop)) {
            const waterTimeLeft = getRemainingWaterTime(crop);
            const waterSeconds = Math.ceil(waterTimeLeft / 1000);
            content += `<div style="color: #4FC3F7;">💧 Watered (${waterSeconds}s left)</div>`;
            if (crop.stage !== CropStage.MATURE) {
                content += `<div style="color: #ccc; font-size: 11px;">+50% growth speed</div>`;
            }
        } else if (tile.type === TileType.DIRT && crop.stage !== CropStage.MATURE) {
            content += `<div style="color: #666; font-size: 11px;">Can be watered for faster growth</div>`;
        }

        // Harvest ready
        if (crop.stage === CropStage.MATURE) {
            content += `<div style="color: #00ff00; margin-top: 3px;">🎉 Ready to harvest!</div>`;
        }
    } else {
        // Empty tile - show what can be done
        if (tile.type === TileType.GRASS) {
            content += `<div style="color: #ccc; font-size: 11px; margin-top: 5px;">Can place: Home 🏠</div>`;
        } else if (tile.type === TileType.DIRT) {
            content += `<div style="color: #ccc; font-size: 11px; margin-top: 5px;">Can plant: Crops 🌱</div>`;
        }
    }

    return content;
}
