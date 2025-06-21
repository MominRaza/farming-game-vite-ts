import { ToolType } from './ToolTypes';
import { getSelectedTool } from './ToolState';
import { gameState } from '../../GameState';
import { SaveLoadService } from '../../services';
import * as TileSystem from '../../tiles';
import * as CropSystem from '../../tiles/systems/CropSystem';
import * as CoinSystem from '../../systems/CoinSystem';
import { updateCoinDisplay, showCoinEarnedAnimation } from '../coin';
import { updateToolButtonStates } from './ToolsUI';

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
    if (!tile) return;

    // Don't modify home tiles
    if (tile.type === TileSystem.TileType.HOME) {
        console.log('Cannot modify home tiles!');
        return;
    }

    const selectedTool = getSelectedTool();    // Apply the selected tool
    switch (selectedTool) {
        case ToolType.GRASS:
            if (tile.type !== TileSystem.TileType.GRASS) {
                // Don't allow placing grass on tiles with crops
                if (tileHasCrops(tile.type)) {
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
            break; case ToolType.DIRT:
            if (tile.type !== TileSystem.TileType.DIRT) {
                // Don't allow placing dirt on tiles with crops
                if (tileHasCrops(tile.type)) {
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
            break; case ToolType.ROAD:
            if (tile.type !== TileSystem.TileType.ROAD) {
                // Don't allow placing roads on tiles with crops
                if (tileHasCrops(tile.type)) {
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
            break; case ToolType.CARROT_SEEDS:
            if (tile.type === TileSystem.TileType.DIRT) {
                // Check if player can afford carrot seeds
                if (!CoinSystem.canAfford(gameState, 'CARROT_SEEDS')) {
                    showErrorMessage(`Not enough coins! Carrot seeds cost ${CoinSystem.getToolCost('CARROT_SEEDS')} coins.`);
                    return;
                }

                // Spend coins for the seeds
                const carrotCost = CoinSystem.spendCoins(gameState, 'CARROT_SEEDS'); TileSystem.plantSeed(gameState.grid, x, y, TileSystem.TileType.CARROT_SEEDS);
                console.log(`Planted carrot seeds at ${x}, ${y} - Cost: ${carrotCost.cost} coins`);
                showToolFeedback(x, y, '🥕');
                updateCoinDisplay();
                updateToolButtonStates(); // Update button states after spending coins
                autoSave();
            } else {
                console.log(`Carrot seeds can only be planted on dirt! Tile at ${x}, ${y} is ${tile.type}`);
                showErrorMessage('Carrot seeds can only be planted on dirt tiles!');
            }
            break; case ToolType.WHEAT_SEEDS:
            if (tile.type === TileSystem.TileType.DIRT) {
                // Check if player can afford wheat seeds
                if (!CoinSystem.canAfford(gameState, 'WHEAT_SEEDS')) {
                    showErrorMessage(`Not enough coins! Wheat seeds cost ${CoinSystem.getToolCost('WHEAT_SEEDS')} coins.`);
                    return;
                }

                // Spend coins for the seeds
                const wheatCost = CoinSystem.spendCoins(gameState, 'WHEAT_SEEDS'); TileSystem.plantSeed(gameState.grid, x, y, TileSystem.TileType.WHEAT_SEEDS);
                console.log(`Planted wheat seeds at ${x}, ${y} - Cost: ${wheatCost.cost} coins`);
                showToolFeedback(x, y, '🌾');
                updateCoinDisplay();
                updateToolButtonStates(); // Update button states after spending coins
                autoSave();
            } else {
                console.log(`Wheat seeds can only be planted on dirt! Tile at ${x}, ${y} is ${tile.type}`);
                showErrorMessage('Wheat seeds can only be planted on dirt tiles!');
            } break;
        case ToolType.TOMATO_SEEDS:
            if (tile.type === TileSystem.TileType.DIRT) {
                // Check if player can afford tomato seeds
                if (!CoinSystem.canAfford(gameState, 'TOMATO_SEEDS')) {
                    showErrorMessage(`Not enough coins! Tomato seeds cost ${CoinSystem.getToolCost('TOMATO_SEEDS')} coins.`);
                    return;
                }

                // Spend coins for the seeds
                const tomatoCost = CoinSystem.spendCoins(gameState, 'TOMATO_SEEDS'); TileSystem.plantSeed(gameState.grid, x, y, TileSystem.TileType.TOMATO_SEEDS);
                console.log(`Planted tomato seeds at ${x}, ${y} - Cost: ${tomatoCost.cost} coins`);
                showToolFeedback(x, y, '🍅');
                updateCoinDisplay();
                updateToolButtonStates(); // Update button states after spending coins
                autoSave();
            } else {
                console.log(`Tomato seeds can only be planted on dirt! Tile at ${x}, ${y} is ${tile.type}`);
                showErrorMessage('Tomato seeds can only be planted on dirt tiles!');
            }
            break;

        case ToolType.WATER:
            // Check if the tile can be watered
            if (CropSystem.canWaterTile(gameState.grid, x, y)) {
                // Check if player can afford watering
                if (!CoinSystem.canAfford(gameState, 'WATER')) {
                    showErrorMessage(`Not enough coins to water! Cost: ${CoinSystem.getToolCost('WATER')} coins.`);
                    return;
                }

                // Spend coins and water the crop
                const paymentResult = CoinSystem.spendCoins(gameState, 'WATER');
                if (paymentResult.success) {
                    const waterResult = CropSystem.waterCrop(gameState.grid, x, y);
                    if (waterResult.success) {
                        console.log(`Watered crop at ${x}, ${y} - Cost ${paymentResult.cost} coins`);
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
                showErrorMessage('Nothing to water here! Only growing crops can be watered.');
            }
            break;

        case ToolType.HARVEST:
            const harvestResult = CropSystem.harvestCrop(gameState.grid, x, y);
            if (harvestResult.success) {
                let cropEmoji = '🌾';
                let cropName = 'crop';

                if (harvestResult.cropType === TileSystem.TileType.CARROT_MATURE) {
                    cropEmoji = '🥕';
                    cropName = 'carrots';
                } else if (harvestResult.cropType === TileSystem.TileType.WHEAT_MATURE) {
                    cropEmoji = '🌾';
                    cropName = 'wheat';
                } else if (harvestResult.cropType === TileSystem.TileType.TOMATO_MATURE) {
                    cropEmoji = '🍅';
                    cropName = 'tomatoes';
                }                // Award coins for the harvest
                const coinsEarned = CoinSystem.awardCoins(gameState, harvestResult.cropType!);

                console.log(`Harvested ${cropName} at ${x}, ${y} - Earned ${coinsEarned} coins!`);
                showToolFeedback(x, y, `✨${cropEmoji}`);                // Update coin display and show earning animation
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

// Helper function to check if a tile has crops (seeds, growing, or mature)
function tileHasCrops(tileType: string): boolean {
    return tileType === TileSystem.TileType.CARROT_SEEDS ||
        tileType === TileSystem.TileType.WHEAT_SEEDS ||
        tileType === TileSystem.TileType.TOMATO_SEEDS ||
        tileType === TileSystem.TileType.CARROT_GROWING ||
        tileType === TileSystem.TileType.WHEAT_GROWING ||
        tileType === TileSystem.TileType.TOMATO_GROWING ||
        tileType === TileSystem.TileType.CARROT_MATURE ||
        tileType === TileSystem.TileType.WHEAT_MATURE ||
        tileType === TileSystem.TileType.TOMATO_MATURE;
}
