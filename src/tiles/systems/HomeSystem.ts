import type { Grid } from './TileTypes';
import { TileType } from './TileTypes';
import {
    SECTION_SIZE,
    CENTER_SECTION_X,
    CENTER_SECTION_Y
} from './TileUtils';
import { getTile, setTile } from './GridSystem';

// Place a 2x2 home in the center top of the center section
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

    // Place the 2x2 home
    for (let x = homeStartX; x < homeStartX + 2; x++) {
        for (let y = homeStartY; y < homeStartY + 2; y++) {
            if (x >= 0 && x < grid.width && y >= 0 && y < grid.height) {
                setTile(grid, x, y, TileType.HOME);
            }
        }
    }
}

// Check if a tile is part of the home
export function isHomeTile(grid: Grid, x: number, y: number): boolean {
    const tile = getTile(grid, x, y);
    return tile ? tile.type === TileType.HOME : false;
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
