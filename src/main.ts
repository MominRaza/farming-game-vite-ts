import './style.css';
import { centerView, gameState } from './GameState';
import { render, initCanvas, getCanvas, startRenderLoop } from './rendering';
import { setupInputHandlers, setupToolsUI } from './ui';
import { setupDebugUI } from './DebugUI';
import * as TileSystem from './tiles';

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

    // Start the render loop
    startRenderLoop();

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
