import * as TileSystem from './tiles/TileSystem';
import { gameState, TILE_SIZE, handleTileClick } from './GameState';

// Render the game state
export function render(): void {
    const tileContainer = document.getElementById('tile-container');

    if (!tileContainer) return;

    // Clear previous tiles
    tileContainer.innerHTML = '';

    // Calculate the visible range based on the current view
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const scaledTileSize = TILE_SIZE * gameState.scale;

    // Calculate the visible range of tiles
    const startX = Math.floor(-gameState.offsetX / scaledTileSize);
    const startY = Math.floor(-gameState.offsetY / scaledTileSize);
    const endX = startX + Math.ceil(viewportWidth / scaledTileSize) + 1;
    const endY = startY + Math.ceil(viewportHeight / scaledTileSize) + 1;

    // Only render tiles that are in the visible range and within grid bounds
    for (let x = Math.max(0, startX); x < Math.min(gameState.grid.width, endX); x++) {
        for (let y = Math.max(0, startY); y < Math.min(gameState.grid.height, endY); y++) {
            const tile = TileSystem.getTile(gameState.grid, x, y);

            if (tile) {
                const tileElement = document.createElement('div');
                tileElement.className = `tile ${tile.type}`;
                tileElement.style.width = `${scaledTileSize}px`;
                tileElement.style.height = `${scaledTileSize}px`;
                tileElement.style.left = `${x * scaledTileSize + gameState.offsetX}px`;
                tileElement.style.top = `${y * scaledTileSize + gameState.offsetY}px`;

                // Add data attributes for position
                tileElement.dataset.x = x.toString();
                tileElement.dataset.y = y.toString();

                // Add click event listener to interact with tiles (for future use)
                tileElement.addEventListener('click', () => {
                    handleTileClick(x, y);
                });

                tileContainer.appendChild(tileElement);
            }
        }
    }
}
