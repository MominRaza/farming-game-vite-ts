import './style.css';
import { centerView, gameState } from './GameState';
import { render, initCanvas, getCanvas } from './Renderer';
import { setupInputHandlers } from './InputHandler';
import { setupDebugUI } from './DebugUI';
import { setupToolsUI } from './ToolsUI';
import * as TileSystem from './tiles/TileSystem';

// Initialize the game
function initGame(): void {
    // Initialize canvas first
    initCanvas();

    const canvas = getCanvas();
    if (!canvas) {
        console.error('Canvas not found!');
        return;
    }

    // Center the view on the grid
    centerView();

    // Setup input handlers for interaction
    setupInputHandlers(canvas);

    // Render the initial state
    render();

    console.log('Canvas-based farming game initialized successfully!');
}

// Game loop for crop growth
function gameLoop(): void {
    // Update crop growth
    const hasGrowthChanges = TileSystem.updateCropGrowth(gameState.grid);

    // Re-render if crops have grown
    if (hasGrowthChanges) {
        render();
    }
}

// Start the game loop
function startGameLoop(): void {
    // Update every second
    setInterval(gameLoop, 1000);
    console.log('Growth system started - crops will grow over time!');
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    setupDebugUI();
    setupToolsUI();
    startGameLoop();
});
