// Utility functions for tile coordinates and validation
export function positionKey(x: number, y: number): string {
    return `${x},${y}`;
}

// Get section coordinates from tile coordinates
export function getTileSectionCoords(tileX: number, tileY: number): { sectionX: number, sectionY: number } {
    const sectionX = Math.floor(tileX / SECTION_SIZE);
    const sectionY = Math.floor(tileY / SECTION_SIZE);
    return { sectionX, sectionY };
}

// Check if a section is the center section
export function isCenterSection(sectionX: number, sectionY: number): boolean {
    return sectionX === CENTER_SECTION_X && sectionY === CENTER_SECTION_Y;
}

// Check if coordinates are within grid bounds
export function isInBounds(gridWidth: number, gridHeight: number, x: number, y: number): boolean {
    return x >= 0 && x < gridWidth && y >= 0 && y < gridHeight;
}

// Constants for section management
export const SECTION_SIZE = 12; // Each section is 12x12 tiles
export const SECTIONS_PER_ROW = 5; // 5x5 sections
export const CENTER_SECTION_X = 2; // Center section coordinates
export const CENTER_SECTION_Y = 2;
