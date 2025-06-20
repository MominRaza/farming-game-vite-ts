import './style.css';
import { centerView } from './GameState';
import { render, initCanvas, getCanvas } from './Renderer';
import { setupInputHandlers } from './InputHandler';
import { setupDebugUI } from './DebugUI';

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

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    setupDebugUI();
});
