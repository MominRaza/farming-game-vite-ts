import './style.css';
import { centerView, gameState, loadGameState } from './GameState';
import { render, initCanvas, getCanvas, startRenderLoop } from './rendering';
import { setupInputHandlers, setupToolsUI, setupSaveLoadUI, setupCoinDisplay, updateCoinDisplay } from './ui';
import { setupDebugUI } from './DebugUI';
import { SaveLoadService } from './services';
import * as TileSystem from './tiles';

// Initialize the game
function initGame(): void {
    // Initialize canvas first
    initCanvas();

    const canvas = getCanvas();
    if (!canvas) {
        console.error('Canvas not found!');
        return;
    }    // Try to load saved game
    const savedData = SaveLoadService.loadGame();
    if (savedData) {
        const loadedState = loadGameState(savedData.gameState);
        Object.assign(gameState, loadedState);
        console.log('Loaded saved game!');
    } else {
        // Center the view on the grid for new game
        centerView();
    }

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
        // Auto-save when crops grow
        SaveLoadService.saveGame(gameState);
        console.log('Auto-saved due to crop growth');
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
    setupSaveLoadUI(gameState);
    setupCoinDisplay();

    // Update coin display after everything is set up
    setTimeout(() => {
        updateCoinDisplay();
    }, 100);

    startGameLoop();
});
