import { ToolType } from './ToolTypes';
import { getSelectedTool } from './ToolState';
import { gameState } from '../../GameState';
import { SaveLoadService } from '../../services';
import * as TileSystem from '../../tiles';
import * as CropSystem from '../../tiles/systems/CropSystem';
import * as CoinSystem from '../../systems/CoinSystem';
import { updateCoinDisplay, showCoinEarnedAnimation } from '../coin';
import { updateToolButtonStates } from './ToolsUI';
import { getSeedConfig, getCropTypeFromToolType } from '../../config/SeedConfig';

// Auto-save functionality with throttling to prevent excessive saves
let autoSaveTimeout: number | null = null;

function autoSave(): void {
    // Clear any existing timeout
    if (autoSaveTimeout !== null) {
        clearTimeout(autoSaveTimeout);
    }

    // Set a new timeout to save after 1 second of inactivity
    autoSaveTimeout = setTimeout(() => {
        SaveLoadService.saveGame(gameState);
        console.log('Auto-saved game progress');
        autoSaveTimeout = null;
    }, 1000);
}

// Apply the selected tool to a tile
export function applyToolToTile(x: number, y: number): void {
    // Check if the tile is accessible (not in a locked section)
    if (!TileSystem.isTileAccessible(gameState.grid, x, y)) {
        console.log(`Cannot interact with locked section at tile ${x}, ${y}`);
        return;
    }

    const tile = TileSystem.getTile(gameState.grid, x, y);
    if (!tile) return;    // Don't modify tiles with homes
    if (tile.occupation === TileSystem.OccupationType.HOME) {
        console.log('Cannot modify tiles with homes!');
        return;
    } const selectedTool = getSelectedTool();

    // If no tool is selected, do nothing
    if (selectedTool === ToolType.NONE) {
        console.log('No tool selected - click ignored');
        return;
    }

    // Apply the selected tool
    switch (selectedTool) {
        case ToolType.GRASS: if (tile.type !== TileSystem.TileType.GRASS) {
            // Don't allow placing grass on tiles with crops
            if (tileHasCrops(tile)) {
                showErrorMessage('Cannot place grass on tiles with crops! Harvest the crops first.');
                return;
            }

            // Check if player can afford the grass tool
            if (!CoinSystem.canAfford(gameState, 'GRASS')) {
                showErrorMessage(`Not enough coins! Grass costs ${CoinSystem.getToolCost('GRASS')} coins.`);
                return;
            }

            // Spend coins for the action
            const grassCost = CoinSystem.spendCoins(gameState, 'GRASS');

            TileSystem.setTile(gameState.grid, x, y, TileSystem.TileType.GRASS);
            console.log(`Applied grass at ${x}, ${y} - Cost: ${grassCost.cost} coins`);
            showToolFeedback(x, y, '🌱');
            updateCoinDisplay();
            updateToolButtonStates(); // Update button states after spending coins
            autoSave();
        }
            break; case ToolType.DIRT: if (tile.type !== TileSystem.TileType.DIRT) {
                // Don't allow placing dirt on tiles with crops
                if (tileHasCrops(tile)) {
                    showErrorMessage('Cannot place dirt on tiles with crops! Harvest the crops first.');
                    return;
                }

                // Check if player can afford the dirt tool
                if (!CoinSystem.canAfford(gameState, 'DIRT')) {
                    showErrorMessage(`Not enough coins! Dirt costs ${CoinSystem.getToolCost('DIRT')} coins.`);
                    return;
                }

                // Spend coins for the action
                const dirtCost = CoinSystem.spendCoins(gameState, 'DIRT');

                TileSystem.setTile(gameState.grid, x, y, TileSystem.TileType.DIRT);
                console.log(`Applied dirt at ${x}, ${y} - Cost: ${dirtCost.cost} coins`);
                showToolFeedback(x, y, '🟫');
                updateCoinDisplay();
                updateToolButtonStates(); // Update button states after spending coins
                autoSave();
            }
            break; case ToolType.ROAD: if (tile.type !== TileSystem.TileType.ROAD) {
                // Don't allow placing roads on tiles with crops
                if (tileHasCrops(tile)) {
                    showErrorMessage('Cannot place roads on tiles with crops! Harvest the crops first.');
                    return;
                }

                // Check if player can afford the road tool
                if (!CoinSystem.canAfford(gameState, 'ROAD')) {
                    showErrorMessage(`Not enough coins! Road costs ${CoinSystem.getToolCost('ROAD')} coins.`);
                    return;
                }

                // Spend coins for the action
                const roadCost = CoinSystem.spendCoins(gameState, 'ROAD');

                TileSystem.setTile(gameState.grid, x, y, TileSystem.TileType.ROAD);
                console.log(`Applied road at ${x}, ${y} - Cost: ${roadCost.cost} coins`);
                showToolFeedback(x, y, '🛤️');
                updateCoinDisplay();
                updateToolButtonStates(); // Update button states after spending coins
                autoSave();
            }
            break; default:
            // Handle seed tools dynamically
            const toolString = selectedTool as string;
            if (toolString.endsWith('_seeds')) {
                const cropType = getCropTypeFromToolType(toolString);
                if (cropType && tile.type === TileSystem.TileType.DIRT && !tile.occupation) {
                    const seedConfig = getSeedConfig(cropType);
                    const toolCost = CoinSystem.getToolCost(toolString.toUpperCase());

                    // Check if player can afford seeds
                    if (!CoinSystem.canAfford(gameState, toolString.toUpperCase())) {
                        showErrorMessage(`Not enough coins! ${seedConfig.name} seeds cost ${toolCost} coins.`);
                        return;
                    }

                    // Spend coins for the seeds
                    const seedCost = CoinSystem.spendCoins(gameState, toolString.toUpperCase());

                    const planted = CropSystem.plantSeed(gameState.grid, x, y, cropType);
                    if (planted) {
                        console.log(`Planted ${seedConfig.name} seeds at ${x}, ${y} - Cost: ${seedCost.cost} coins`);
                        showToolFeedback(x, y, seedConfig.icon);
                        updateCoinDisplay();
                        updateToolButtonStates(); // Update button states after spending coins
                        autoSave();
                    } else {
                        showErrorMessage(`Failed to plant ${seedConfig.name} seeds!`);
                    }
                } else if (cropType) {
                    const seedConfig = getSeedConfig(cropType);
                    console.log(`${seedConfig.name} seeds can only be planted on empty dirt! Tile at ${x}, ${y} is ${tile.type}${tile.occupation ? ' occupied by ' + tile.occupation : ''}`);
                    showErrorMessage(`${seedConfig.name} seeds can only be planted on empty dirt tiles!`);
                }
            }
            break; case ToolType.WATER:
            // Check if the tile can be watered (crop or dirt)
            if (CropSystem.canWaterAnyTile(gameState.grid, x, y)) {
                // Check if player can afford watering
                if (!CoinSystem.canAfford(gameState, 'WATER')) {
                    showErrorMessage(`Not enough coins to water! Cost: ${CoinSystem.getToolCost('WATER')} coins.`);
                    return;
                }

                // Spend coins and water the tile (crop or dirt)
                const paymentResult = CoinSystem.spendCoins(gameState, 'WATER');
                if (paymentResult.success) {
                    const waterResult = CropSystem.waterAnyTile(gameState.grid, x, y);
                    if (waterResult.success) {
                        console.log(`Watered tile at ${x}, ${y} - Cost ${paymentResult.cost} coins`);
                        showToolFeedback(x, y, '💧✨');

                        // Update coin display and button states
                        updateCoinDisplay();
                        updateToolButtonStates();
                        autoSave();
                    } else {
                        showErrorMessage(waterResult.message || 'Cannot water this tile!');
                    }
                }
            } else {
                showErrorMessage('Nothing to water here! Water crops or empty dirt tiles.');
            }
            break; case ToolType.HARVEST:
            const harvestResult = CropSystem.harvestCrop(gameState.grid, x, y);
            if (harvestResult.success) {
                let cropEmoji = '🌾';
                let cropName = 'crop';

                if (harvestResult.cropType === TileSystem.CropType.CARROT) {
                    cropEmoji = '🥕';
                    cropName = 'carrots';
                } else if (harvestResult.cropType === TileSystem.CropType.WHEAT) {
                    cropEmoji = '🌾';
                    cropName = 'wheat';
                } else if (harvestResult.cropType === TileSystem.CropType.TOMATO) {
                    cropEmoji = '🍅';
                    cropName = 'tomatoes';
                }

                // Award coins for the harvest - we need to convert CropType to a string for the coin system
                const cropTypeString = harvestResult.cropType! as string;
                const coinsEarned = CoinSystem.awardCoins(gameState, cropTypeString as any);

                console.log(`Harvested ${cropName} at ${x}, ${y} - Earned ${coinsEarned} coins!`);
                showToolFeedback(x, y, `✨${cropEmoji}`);

                // Update coin display and show earning animation
                updateCoinDisplay();
                updateToolButtonStates(); // Update button states after earning coins
                showCoinEarnedAnimation(coinsEarned);

                autoSave();
            } else {
                console.log(`No mature crops to harvest at ${x}, ${y}`);
                showErrorMessage('No mature crops to harvest here!');
            }
            break;
    }
}

// Show visual feedback when a tool is applied
function showToolFeedback(x: number, y: number, emoji: string): void {
    // This is a simple console feedback for now
    // In the future, this could show visual effects on the canvas
    console.log(`${emoji} Applied at tile (${x}, ${y})`);
}

// Show error message when tool cannot be applied
export function showErrorMessage(message: string): void {
    // Create a temporary error message element
    const errorDiv = document.createElement('div');
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        position: fixed;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 69, 0, 0.9);
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: bold;
        z-index: 1000;
        pointer-events: none;
        animation: errorFadeInOut 2s ease-in-out;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;

    // Add animation CSS if not already present
    if (!document.querySelector('#error-animation-style')) {
        const style = document.createElement('style');
        style.id = 'error-animation-style';
        style.textContent = `
            @keyframes errorFadeInOut {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(errorDiv);

    // Remove message after animation
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 2000);
}

// Helper function to check if a tile has crops
function tileHasCrops(tile: any): boolean {
    return tile.occupation === TileSystem.OccupationType.CROP && tile.cropData;
}
