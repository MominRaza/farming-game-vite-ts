// TileSystem.ts - Module for handling tile-related operations

// Tile types as string constants
export const TileType = {
    GRASS: 'grass',
    DIRT: 'dirt',
    ROAD: 'road',
    FENCE: 'fence',
    LOCKED: 'locked',
    // Add more types here as the game expands
} as const;

export type TileTypeValue = typeof TileType[keyof typeof TileType];

// Interface for a single tile
export interface Tile {
    type: TileTypeValue;
    x: number;
    y: number;
    sectionX?: number; // Which section this tile belongs to (0-4)
    sectionY?: number; // Which section this tile belongs to (0-4)
}

// Interface for a section
export interface Section {
    x: number; // Section coordinates (0-4)
    y: number; // Section coordinates (0-4)
    isLocked: boolean;
    hasFence: boolean;
}

// Interface for the grid
export interface Grid {
    width: number;
    height: number;
    tiles: Map<string, Tile>;
    sections: Section[][]; // 5x5 array of sections
}

// Constants for section management
export const SECTION_SIZE = 12; // Each section is 12x12 tiles
export const SECTIONS_PER_ROW = 5; // 5x5 sections
export const CENTER_SECTION_X = 2; // Center section coordinates
export const CENTER_SECTION_Y = 2;

// Create a position key from x,y coordinates
export function positionKey(x: number, y: number): string {
    return `${x},${y}`;
}

// Get section coordinates from tile coordinates
export function getTileSectionCoords(tileX: number, tileY: number): { sectionX: number, sectionY: number } {
    return {
        sectionX: Math.floor(tileX / SECTION_SIZE),
        sectionY: Math.floor(tileY / SECTION_SIZE)
    };
}

// Check if a section is the center section
export function isCenterSection(sectionX: number, sectionY: number): boolean {
    return sectionX === CENTER_SECTION_X && sectionY === CENTER_SECTION_Y;
}

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
                hasFence: isCenter // Center section has fence around it
            };
        }
    }

    return sections;
}

// Check if a tile should be a fence based on its position
function shouldBeFence(tileX: number, tileY: number, sections: Section[][]): boolean {
    const { sectionX, sectionY } = getTileSectionCoords(tileX, tileY);

    // Only add fences around unlocked sections that have hasFence = true
    if (sectionX < 0 || sectionX >= SECTIONS_PER_ROW || sectionY < 0 || sectionY >= SECTIONS_PER_ROW) {
        return false;
    }

    const section = sections[sectionX][sectionY];
    if (!section.hasFence) {
        return false;
    }

    // Get position within the section
    const localX = tileX % SECTION_SIZE;
    const localY = tileY % SECTION_SIZE;

    // Check if it's on the border of the section
    return localX === 0 || localX === SECTION_SIZE - 1 || localY === 0 || localY === SECTION_SIZE - 1;
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
                } else if (shouldBeFence(x, y, sections)) {
                    tileType = TileType.FENCE;
                }
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

// Section management functions

// Get a section by its coordinates
export function getSection(grid: Grid, sectionX: number, sectionY: number): Section | undefined {
    if (sectionX >= 0 && sectionX < SECTIONS_PER_ROW && sectionY >= 0 && sectionY < SECTIONS_PER_ROW) {
        return grid.sections[sectionX][sectionY];
    }
    return undefined;
}

// Unlock a section and update its tiles
export function unlockSection(grid: Grid, sectionX: number, sectionY: number, addFence: boolean = false): void {
    const section = getSection(grid, sectionX, sectionY);
    if (!section || !section.isLocked) {
        return; // Section doesn't exist or is already unlocked
    }

    section.isLocked = false;
    section.hasFence = addFence;

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
            if (isInBounds(grid, x, y)) {
                let newType: TileTypeValue = TileType.GRASS; // Default type for unlocked sections

                if (section.isLocked) {
                    newType = TileType.LOCKED;
                } else if (section.hasFence && shouldBeFence(x, y, grid.sections)) {
                    newType = TileType.FENCE;
                }

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
