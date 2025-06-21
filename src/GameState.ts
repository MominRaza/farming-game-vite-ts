// Constants
export const GRID_SIZE = 60; // 60x60 grid
export const TILE_SIZE = 64; // Size of each tile in pixels (doubled for better visual detail)

import * as TileSystem from './tiles';

// Game state interface
export interface GameState {
    grid: TileSystem.Grid;
    scale: number;
    offsetX: number;
    offsetY: number;
    isDragging: boolean;
    lastMouseX: number;
    lastMouseY: number;
    coins: number;
}

// Create initial game state
export function createInitialState(): GameState {
    const grid = TileSystem.createGrid(GRID_SIZE, GRID_SIZE, TileSystem.TileType.GRASS);    // Place the home in the center section
    TileSystem.placeHomeInCenterSection(grid);

    return {
        grid,
        scale: 1, // Start at normal zoom level
        offsetX: 0,
        offsetY: 0,
        isDragging: false,
        lastMouseX: 0,
        lastMouseY: 0,
        coins: 0 // Start with 0 coins
    };
}

// Load game state from saved data
export function loadGameState(savedData: any): GameState {
    // Reconstruct the Map from the serialized array
    const tilesMap = new Map<string, any>();
    if (savedData.grid && savedData.grid.tiles && Array.isArray(savedData.grid.tiles)) {
        for (const [key, value] of savedData.grid.tiles) {
            tilesMap.set(key, value);
        }
    } return {
        grid: {
            width: savedData.grid?.width || GRID_SIZE,
            height: savedData.grid?.height || GRID_SIZE,
            tiles: tilesMap,
            sections: savedData.grid?.sections || []
        },
        scale: savedData.scale || 1,
        offsetX: savedData.offsetX || 0,
        offsetY: savedData.offsetY || 0,
        isDragging: false,
        lastMouseX: 0,
        lastMouseY: 0,
        coins: savedData.coins || 0 // Load saved coins or start with 0
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
