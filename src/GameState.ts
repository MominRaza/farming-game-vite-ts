// Constants
export const GRID_SIZE = 60; // 60x60 grid
export const TILE_SIZE = 64; // Size of each tile in pixels (doubled for better visual detail)

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
    const grid = TileSystem.createGrid(GRID_SIZE, GRID_SIZE, TileSystem.TileType.GRASS);

    // Place the home in the center section
    TileSystem.placeHomeInCenterSection(grid); return {
        grid,
        scale: 1, // Start at normal zoom level
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
    const gridHeight = gameState.grid.height * TILE_SIZE; gameState.offsetX = (viewportWidth - gridWidth) / 2;
    gameState.offsetY = (viewportHeight - gridHeight) / 2;
}
