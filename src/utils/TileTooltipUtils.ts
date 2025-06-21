import { TileType, CropStage, OccupationType } from '../tiles/systems/TileTypes';
import { getTile, isTileAccessible } from '../tiles';
import { getCropGrowthProgress, getRemainingGrowthTime, isWatered, getRemainingWaterTime } from '../tiles/systems/CropSystem';
import type { ToolTypeValue } from '../ui/tools/ToolTypes';
import { getToolCost, canAfford } from '../systems/CoinSystem';
import { getSeedConfig, getAllSeedConfigs } from '../config/SeedConfig';

// Get detailed information about a tile for tooltip display
export function getTileTooltipInfo(grid: any, x: number, y: number, selectedTool: ToolTypeValue, currentCoins: number): string | null {
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
    }; const tileInfo = tileTypeDisplay[tile.type];
    content += `<div>${tileInfo.icon} ${tileInfo.name}</div>`;
    content += `<div style="color: #ccc; font-size: 11px;">${tileInfo.desc}</div>`;

    // Selected tool information
    if (selectedTool !== 'none') {
        const toolDisplay = getToolDisplayInfo(selectedTool);
        const toolCost = getToolCost(selectedTool);
        const canAffordTool = canAfford({ coins: currentCoins }, selectedTool);

        content += `<div style="margin-top: 8px; padding: 5px; border-top: 1px solid #444;">`;
        content += `<div style="color: #ffd700;"><strong>🛠️ Selected: ${toolDisplay.name}</strong></div>`;

        if (toolCost > 0) {
            content += `<div style="color: ${canAffordTool ? '#90EE90' : '#ff6666'}; font-size: 11px;">`;
            content += `Cost: ${toolCost} coins ${canAffordTool ? '✓' : '✗'}`;
            content += `</div>`;
        }

        // Show what will happen when clicked
        const actionResult = getToolActionPreview(selectedTool, tile, isAccessible);
        if (actionResult) {
            content += `<div style="color: #87CEEB; font-size: 11px; margin-top: 2px;">${actionResult}</div>`;
        }
        content += `</div>`;
    } else {
        content += `<div style="margin-top: 8px; padding: 5px; border-top: 1px solid #444; color: #ccc; font-size: 11px;">`;
        content += `No tool selected - Click will do nothing`;
        content += `</div>`;
    }

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

        // Get crop info from centralized config
        const seedConfig = getSeedConfig(crop.type);
        content += `<div style="margin-top: 5px; color: ${seedConfig.colors.mature};">${seedConfig.icon} <strong>${seedConfig.name}</strong></div>`;

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

// Helper function to get tool display information
function getToolDisplayInfo(toolType: ToolTypeValue): { name: string; icon: string } {
    // Get all seed configs for dynamic seed tools
    const seedConfigs = getAllSeedConfigs();

    const toolInfo: Record<string, { name: string; icon: string }> = {
        'grass': { name: 'Grass Tool', icon: '🌱' },
        'dirt': { name: 'Dirt Tool', icon: '🟫' },
        'road': { name: 'Road Tool', icon: '🛤️' },
        'harvest': { name: 'Harvest Tool', icon: '🔨' },
        'water': { name: 'Water Tool', icon: '💧' },
        'none': { name: 'None', icon: '❌' }
    };

    // Add seed tools dynamically
    Object.entries(seedConfigs).forEach(([cropType, config]) => {
        const toolKey = `${cropType}_seeds`;
        toolInfo[toolKey] = { name: `${config.name} Seeds`, icon: config.icon };
    });

    return toolInfo[toolType] || { name: 'Unknown', icon: '❓' };
}

// Helper function to preview what will happen when a tool is used on a tile
function getToolActionPreview(toolType: ToolTypeValue, tile: any, isAccessible: boolean): string | null {
    if (!isAccessible) {
        return 'Cannot use - area is locked';
    }

    // Check if tile has a home (can't be modified)
    if (tile.occupation === OccupationType.HOME) {
        return 'Cannot modify - home is here';
    }

    switch (toolType) {
        case 'grass':
            if (tile.type === TileType.GRASS && !tile.occupation) {
                return 'Already grass - no change';
            }
            return 'Will convert to grass';

        case 'dirt':
            if (tile.type === TileType.DIRT && !tile.occupation) {
                return 'Already dirt - no change';
            }
            return 'Will convert to dirt';

        case 'road':
            if (tile.type === TileType.ROAD) {
                return 'Already road - no change';
            }
            return 'Will convert to road'; case 'harvest':
            if (tile.occupation !== OccupationType.CROP) {
                return 'No crops to harvest';
            }
            if (tile.cropData?.stage !== CropStage.MATURE) {
                return 'Crop not ready yet';
            }
            return 'Will harvest mature crop';

        case 'water':
            if (tile.type !== TileType.DIRT || tile.occupation !== OccupationType.CROP) {
                return 'Can only water crops on dirt';
            }
            if (!tile.cropData) {
                return 'No crop to water';
            }
            if (tile.cropData.stage === CropStage.MATURE) {
                return 'Mature crops do not need water';
            }
            if (isWatered(tile.cropData)) {
                return 'Already watered';
            }
            return 'Will water crop (+50% growth speed)';

        default:
            // Check if it's a seed tool
            if (toolType.endsWith('_seeds')) {
                if (tile.type !== TileType.DIRT) {
                    return 'Can only plant on dirt';
                }
                if (tile.occupation) {
                    return 'Tile is occupied';
                }
                const cropType = toolType.replace('_seeds', '');
                const seedConfig = getSeedConfig(cropType as any);
                return `Will plant ${seedConfig.name}`;
            }
            return null;
    }
}
