import type { Grid } from './TileTypes';
import { TileType, OccupationType } from './TileTypes';
import {
    SECTION_SIZE,
    CENTER_SECTION_X,
    CENTER_SECTION_Y,
    positionKey
} from './TileUtils';

// Place a 2x2 home in the center top of the center section (only on grass tiles)
export function placeHomeInCenterSection(grid: Grid): void {
    const centerSectionX = CENTER_SECTION_X;
    const centerSectionY = CENTER_SECTION_Y;

    // Calculate the starting tile coordinates for the center section
    const sectionStartX = centerSectionX * SECTION_SIZE;
    const sectionStartY = centerSectionY * SECTION_SIZE;

    // Place home at center-top of the section (2x2 grid)
    // Center horizontally: (SECTION_SIZE - 2) / 2 = (12 - 2) / 2 = 5
    // Place at top: 2 tiles from the top edge
    const homeStartX = sectionStartX + Math.floor((SECTION_SIZE - 2) / 2);
    const homeStartY = sectionStartY + 2;

    // Place the 2x2 home (only on grass tiles)
    for (let x = homeStartX; x < homeStartX + 2; x++) {
        for (let y = homeStartY; y < homeStartY + 2; y++) {
            if (x >= 0 && x < grid.width && y >= 0 && y < grid.height) {
                const key = positionKey(x, y);
                const tile = grid.tiles.get(key);

                if (tile && tile.type === TileType.GRASS && !tile.occupation) {
                    grid.tiles.set(key, {
                        ...tile,
                        occupation: OccupationType.HOME
                    });
                }
            }
        }
    }
}

// Place a home at the specified position (only on grass tiles)
export function placeHome(grid: Grid, x: number, y: number): boolean {
    const key = positionKey(x, y);
    const tile = grid.tiles.get(key);

    if (!tile || tile.type !== TileType.GRASS) {
        return false; // Can only place home on grass tiles
    }

    if (tile.occupation) {
        return false; // Tile is already occupied
    }

    if (x >= 0 && x < grid.width && y >= 0 && y < grid.height) {
        grid.tiles.set(key, {
            ...tile,
            occupation: OccupationType.HOME
        });
        return true;
    }

    return false;
}

// Remove a home and return to grass
export function removeHome(grid: Grid, x: number, y: number): boolean {
    const key = positionKey(x, y);
    const tile = grid.tiles.get(key);

    if (!tile || tile.occupation !== OccupationType.HOME) {
        return false;
    }

    grid.tiles.set(key, {
        ...tile,
        occupation: undefined
    });

    return true;
}

// Check if a tile has a home
export function hasHome(grid: Grid, x: number, y: number): boolean {
    const key = positionKey(x, y);
    const tile = grid.tiles.get(key);

    return tile?.occupation === OccupationType.HOME;
}

// Check if a tile is part of the home (backwards compatibility)
export function isHomeTile(grid: Grid, x: number, y: number): boolean {
    return hasHome(grid, x, y);
}

// Get home boundaries (returns the calculated bounds)
export function getHomeBounds(): { startX: number, startY: number, endX: number, endY: number } {
    const centerSectionX = CENTER_SECTION_X;
    const centerSectionY = CENTER_SECTION_Y;

    const sectionStartX = centerSectionX * SECTION_SIZE;
    const sectionStartY = centerSectionY * SECTION_SIZE;

    const homeStartX = sectionStartX + Math.floor((SECTION_SIZE - 2) / 2);
    const homeStartY = sectionStartY + 2;

    return {
        startX: homeStartX,
        startY: homeStartY,
        endX: homeStartX + 1,
        endY: homeStartY + 1
    };
}
