import * as TileSystem from './tiles/TileSystem';
import { gameState, TILE_SIZE } from './GameState';

// Add a simple debug UI to show coordinates and scale
export function setupDebugUI(): void {
    const uiContainer = document.getElementById('ui-container');

    if (!uiContainer) return;

    const debugDiv = document.createElement('div');
    debugDiv.className = 'debug-info';
    uiContainer.appendChild(debugDiv);

    // Update debug info on mouse move
    window.addEventListener('mousemove', (e) => {
        const { x, y } = TileSystem.screenToGrid(
            e.clientX,
            e.clientY,
            gameState.offsetX,
            gameState.offsetY,
            gameState.scale,
            TILE_SIZE
        );

        if (TileSystem.isInBounds(gameState.grid, x, y)) {
            debugDiv.textContent = `Grid: ${x}, ${y} | Scale: ${gameState.scale.toFixed(2)}`;
        }
    });
}
