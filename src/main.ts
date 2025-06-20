import './style.css';
import { centerView } from './GameState';
import { render } from './Renderer';
import { setupInputHandlers } from './InputHandler';
import { setupDebugUI } from './DebugUI';

// Initialize the game
function initGame(): void {
    const tileContainer = document.getElementById('tile-container');

    if (!tileContainer) {
        console.error('Tile container not found!');
        return;
    }

    // Center the view on the grid
    centerView();

    // Setup input handlers for interaction
    setupInputHandlers(tileContainer);

    // Render the initial state
    render();
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    setupDebugUI();
});
