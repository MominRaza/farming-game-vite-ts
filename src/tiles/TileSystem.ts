// TileSystem.ts - Module for handling tile-related operations

// Tile types as string constants
export const TileType = {
    GRASS: 'grass',
    DIRT: 'dirt',
    ROAD: 'road',
    // Add more types here as the game expands
} as const;

export type TileTypeValue = typeof TileType[keyof typeof TileType];

// Interface for a single tile
export interface Tile {
    type: TileTypeValue;
    x: number;
    y: number;
}

// Interface for the grid
export interface Grid {
    width: number;
    height: number;
    tiles: Map<string, Tile>;
}

// Create a position key from x,y coordinates
export function positionKey(x: number, y: number): string {
    return `${x},${y}`;
}

// Create a new grid with default tiles
export function createGrid(width: number, height: number, defaultType: TileTypeValue = TileType.GRASS): Grid {
    const tiles = new Map<string, Tile>();

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const key = positionKey(x, y);
            tiles.set(key, { type: defaultType, x, y });
        }
    }

    return { width, height, tiles };
}

// Get a tile at a specific position
export function getTile(grid: Grid, x: number, y: number): Tile | undefined {
    const key = positionKey(x, y);
    return grid.tiles.get(key);
}

// Set a tile at a specific position
export function setTile(grid: Grid, x: number, y: number, type: TileTypeValue): void {
    const key = positionKey(x, y);
    if (x >= 0 && x < grid.width && y >= 0 && y < grid.height) {
        grid.tiles.set(key, { type, x, y });
    }
}

// Convert screen coordinates to grid coordinates
export function screenToGrid(
    screenX: number,
    screenY: number,
    offsetX: number,
    offsetY: number,
    scale: number,
    tileSize: number
): { x: number, y: number } {
    const gridX = Math.floor((screenX - offsetX) / (tileSize * scale));
    const gridY = Math.floor((screenY - offsetY) / (tileSize * scale));
    return { x: gridX, y: gridY };
}

// Check if coordinates are within the grid bounds
export function isInBounds(grid: Grid, x: number, y: number): boolean {
    return x >= 0 && x < grid.width && y >= 0 && y < grid.height;
}

// Get neighboring tiles (useful for future features)
export function getNeighbors(grid: Grid, x: number, y: number): Tile[] {
    const neighbors: Tile[] = [];
    const directions = [
        { dx: -1, dy: 0 }, // left
        { dx: 1, dy: 0 },  // right
        { dx: 0, dy: -1 }, // up
        { dx: 0, dy: 1 }   // down
    ];

    for (const dir of directions) {
        const nx = x + dir.dx;
        const ny = y + dir.dy;

        if (isInBounds(grid, nx, ny)) {
            const tile = getTile(grid, nx, ny);
            if (tile) {
                neighbors.push(tile);
            }
        }
    }

    return neighbors;
}
