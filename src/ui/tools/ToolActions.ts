import { ToolType } from './ToolTypes';
import { getSelectedTool } from './ToolState';
import { gameState } from '../../GameState';
import * as TileSystem from '../../tiles';

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

    const selectedTool = getSelectedTool();

    // Apply the selected tool
    switch (selectedTool) {
        case ToolType.GRASS:
            if (tile.type !== TileSystem.TileType.GRASS) {
                TileSystem.setTile(gameState.grid, x, y, TileSystem.TileType.GRASS);
                console.log(`Applied grass at ${x}, ${y}`);
                showToolFeedback(x, y, '🌱');
            }
            break;
        case ToolType.DIRT:
            if (tile.type !== TileSystem.TileType.DIRT) {
                TileSystem.setTile(gameState.grid, x, y, TileSystem.TileType.DIRT);
                console.log(`Applied dirt at ${x}, ${y}`);
                showToolFeedback(x, y, '🟫');
            }
            break;
        case ToolType.ROAD:
            if (tile.type !== TileSystem.TileType.ROAD) {
                TileSystem.setTile(gameState.grid, x, y, TileSystem.TileType.ROAD);
                console.log(`Applied road at ${x}, ${y}`);
                showToolFeedback(x, y, '🛤️');
            }
            break;
        case ToolType.CARROT_SEEDS:
            if (tile.type === TileSystem.TileType.DIRT) {
                TileSystem.plantSeed(gameState.grid, x, y, TileSystem.TileType.CARROT_SEEDS);
                console.log(`Planted carrot seeds at ${x}, ${y}`);
                showToolFeedback(x, y, '🥕');
            } else {
                console.log(`Carrot seeds can only be planted on dirt! Tile at ${x}, ${y} is ${tile.type}`);
                showErrorMessage('Carrot seeds can only be planted on dirt tiles!');
            }
            break;
        case ToolType.WHEAT_SEEDS:
            if (tile.type === TileSystem.TileType.DIRT) {
                TileSystem.plantSeed(gameState.grid, x, y, TileSystem.TileType.WHEAT_SEEDS);
                console.log(`Planted wheat seeds at ${x}, ${y}`);
                showToolFeedback(x, y, '🌾');
            } else {
                console.log(`Wheat seeds can only be planted on dirt! Tile at ${x}, ${y} is ${tile.type}`);
                showErrorMessage('Wheat seeds can only be planted on dirt tiles!');
            }
            break;
        case ToolType.TOMATO_SEEDS:
            if (tile.type === TileSystem.TileType.DIRT) {
                TileSystem.plantSeed(gameState.grid, x, y, TileSystem.TileType.TOMATO_SEEDS);
                console.log(`Planted tomato seeds at ${x}, ${y}`);
                showToolFeedback(x, y, '🍅');
            } else {
                console.log(`Tomato seeds can only be planted on dirt! Tile at ${x}, ${y} is ${tile.type}`);
                showErrorMessage('Tomato seeds can only be planted on dirt tiles!');
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
