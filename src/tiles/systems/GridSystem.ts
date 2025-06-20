import type { Grid, Tile, Section, TileTypeValue } from './TileTypes';
import { TileType } from './TileTypes';
import {
    positionKey,
    getTileSectionCoords,
    isCenterSection,
    isInBounds,
    SECTIONS_PER_ROW
} from './TileUtils';

// Initialize sections array
function createSections(): Section[][] {
    const sections: Section[][] = [];

    for (let x = 0; x < SECTIONS_PER_ROW; x++) {
        sections[x] = [];
        for (let y = 0; y < SECTIONS_PER_ROW; y++) {
            const isCenter = isCenterSection(x, y);
            sections[x][y] = {
                x,
                y,
                isLocked: !isCenter, // Only center section is unlocked initially
                hasFence: false // No fences around sections
            };
        }
    }

    return sections;
}

// Create a new grid with sections
export function createGrid(width: number, height: number, defaultType: TileTypeValue = TileType.GRASS): Grid {
    const tiles = new Map<string, Tile>();
    const sections = createSections();

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const key = positionKey(x, y);
            const { sectionX, sectionY } = getTileSectionCoords(x, y);

            let tileType = defaultType;
            // Determine tile type based on section status
            if (sectionX >= 0 && sectionX < SECTIONS_PER_ROW && sectionY >= 0 && sectionY < SECTIONS_PER_ROW) {
                const section = sections[sectionX][sectionY];

                if (section.isLocked) {
                    tileType = TileType.LOCKED;
                }
                // No fence logic - unlocked sections remain as default type
            }

            tiles.set(key, {
                type: tileType,
                x,
                y,
                sectionX: sectionX >= 0 && sectionX < SECTIONS_PER_ROW ? sectionX : undefined,
                sectionY: sectionY >= 0 && sectionY < SECTIONS_PER_ROW ? sectionY : undefined
            });
        }
    }

    return { width, height, tiles, sections };
}

// Get a tile from the grid
export function getTile(grid: Grid, x: number, y: number): Tile | undefined {
    const key = positionKey(x, y);
    return grid.tiles.get(key);
}

// Set a tile in the grid
export function setTile(grid: Grid, x: number, y: number, type: TileTypeValue): void {
    const key = positionKey(x, y);
    const existingTile = grid.tiles.get(key);
    if (existingTile) {
        existingTile.type = type;
    }
}

// Get neighboring tiles
export function getNeighbors(grid: Grid, x: number, y: number): Tile[] {
    const neighbors: Tile[] = [];
    const directions = [
        { dx: -1, dy: 0 }, // Left
        { dx: 1, dy: 0 },  // Right
        { dx: 0, dy: -1 }, // Up
        { dx: 0, dy: 1 }   // Down
    ];

    for (const { dx, dy } of directions) {
        const newX = x + dx;
        const newY = y + dy;

        if (isInBounds(grid.width, grid.height, newX, newY)) {
            const neighbor = getTile(grid, newX, newY);
            if (neighbor) {
                neighbors.push(neighbor);
            }
        }
    }

    return neighbors;
}

// Convert screen coordinates to grid coordinates
export function screenToGrid(
    screenX: number,
    screenY: number,
    tileSize: number,
    scale: number,
    offsetX: number,
    offsetY: number
): { x: number, y: number } {
    const scaledTileSize = tileSize * scale;
    const gridX = Math.floor((screenX - offsetX) / scaledTileSize);
    const gridY = Math.floor((screenY - offsetY) / scaledTileSize);
    return { x: gridX, y: gridY };
}
