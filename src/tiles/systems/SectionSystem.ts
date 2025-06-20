import type { Grid, Section, Tile, TileTypeValue } from './TileTypes';
import { TileType } from './TileTypes';
import {
    SECTIONS_PER_ROW,
    SECTION_SIZE,
    getTileSectionCoords
} from './TileUtils';
import { getTile, setTile } from './GridSystem';

// Get a section from the grid
export function getSection(grid: Grid, sectionX: number, sectionY: number): Section | undefined {
    if (sectionX >= 0 && sectionX < SECTIONS_PER_ROW && sectionY >= 0 && sectionY < SECTIONS_PER_ROW) {
        return grid.sections[sectionX][sectionY];
    }
    return undefined;
}

// Unlock a section and update its tiles
export function unlockSection(grid: Grid, sectionX: number, sectionY: number): void {
    const section = getSection(grid, sectionX, sectionY);
    if (!section || !section.isLocked) {
        return; // Section doesn't exist or is already unlocked
    }

    section.isLocked = false;
    section.hasFence = false; // Never add fences when unlocking

    // Update all tiles in this section
    updateSectionTiles(grid, sectionX, sectionY);
}

// Lock a section and update its tiles
export function lockSection(grid: Grid, sectionX: number, sectionY: number): void {
    const section = getSection(grid, sectionX, sectionY);
    if (!section || section.isLocked) {
        return; // Section doesn't exist or is already locked
    }

    section.isLocked = true;
    section.hasFence = false;

    // Update all tiles in this section
    updateSectionTiles(grid, sectionX, sectionY);
}

// Update all tiles in a section based on section status
function updateSectionTiles(grid: Grid, sectionX: number, sectionY: number): void {
    const section = getSection(grid, sectionX, sectionY);
    if (!section) return;

    const startX = sectionX * SECTION_SIZE;
    const startY = sectionY * SECTION_SIZE;

    for (let x = startX; x < startX + SECTION_SIZE; x++) {
        for (let y = startY; y < startY + SECTION_SIZE; y++) {
            if (x >= 0 && x < grid.width && y >= 0 && y < grid.height) {
                let newType: TileTypeValue = TileType.GRASS; // Default type for unlocked sections

                if (section.isLocked) {
                    newType = TileType.LOCKED;
                }
                // No fence logic - unlocked sections remain as grass

                setTile(grid, x, y, newType);
            }
        }
    }
}

// Get all tiles in a section
export function getSectionTiles(grid: Grid, sectionX: number, sectionY: number): Tile[] {
    const tiles: Tile[] = [];
    const startX = sectionX * SECTION_SIZE;
    const startY = sectionY * SECTION_SIZE;

    for (let x = startX; x < startX + SECTION_SIZE; x++) {
        for (let y = startY; y < startY + SECTION_SIZE; y++) {
            const tile = getTile(grid, x, y);
            if (tile) {
                tiles.push(tile);
            }
        }
    }

    return tiles;
}

// Check if a tile position is accessible (not locked)
export function isTileAccessible(grid: Grid, x: number, y: number): boolean {
    const { sectionX, sectionY } = getTileSectionCoords(x, y);
    const section = getSection(grid, sectionX, sectionY);
    return section ? !section.isLocked : false;
}

// Get section information summary
export function getSectionInfo(grid: Grid): { total: number, unlocked: number, locked: number } {
    let total = 0;
    let unlocked = 0;
    let locked = 0;

    for (let x = 0; x < SECTIONS_PER_ROW; x++) {
        for (let y = 0; y < SECTIONS_PER_ROW; y++) {
            total++;
            const section = grid.sections[x][y];
            if (section.isLocked) {
                locked++;
            } else {
                unlocked++;
            }
        }
    }

    return { total, unlocked, locked };
}
