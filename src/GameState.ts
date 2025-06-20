// Constants
export const GRID_SIZE = 60; // 60x60 grid
export const TILE_SIZE = 32; // Size of each tile in pixels

import * as TileSystem from './tiles/TileSystem';

// Game state interface
export interface GameState {
    grid: TileSystem.Grid;
    scale: number;
    offsetX: number;
    offsetY: number;
    isDragging: boolean;
    lastMouseX: number;
    lastMouseY: number;
}

// Create initial game state
export function createInitialState(): GameState {
    return {
        grid: TileSystem.createGrid(GRID_SIZE, GRID_SIZE, TileSystem.TileType.GRASS),
        scale: 1,
        offsetX: 0,
        offsetY: 0,
        isDragging: false,
        lastMouseX: 0,
        lastMouseY: 0
    };
}

// Global game state
export const gameState = createInitialState();

// Center the view on the middle of the grid
export function centerView(): void {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const gridWidth = gameState.grid.width * TILE_SIZE;
    const gridHeight = gameState.grid.height * TILE_SIZE;

    gameState.offsetX = (viewportWidth - gridWidth) / 2;
    gameState.offsetY = (viewportHeight - gridHeight) / 2;
}

// Handle tile click (placeholder for future interaction)
export function handleTileClick(x: number, y: number): void {
    // Check if the tile is accessible (not in a locked section)
    if (!TileSystem.isTileAccessible(gameState.grid, x, y)) {
        console.log(`Cannot interact with locked section at tile ${x}, ${y}`);
        return;
    }

    const tile = TileSystem.getTile(gameState.grid, x, y);
    if (tile) {
        const { sectionX, sectionY } = TileSystem.getTileSectionCoords(x, y);
        console.log(`Clicked tile at position ${x}, ${y} (Section: ${sectionX}, ${sectionY}, Type: ${tile.type})`);

        // Example: Convert grass to dirt when clicked (only in accessible areas)
        if (tile.type === TileSystem.TileType.GRASS) {
            TileSystem.setTile(gameState.grid, x, y, TileSystem.TileType.DIRT);
        } else if (tile.type === TileSystem.TileType.DIRT) {
            TileSystem.setTile(gameState.grid, x, y, TileSystem.TileType.GRASS);
        }
    }
}
