import type { CropTypeValue } from '../tiles/systems/TileTypes';
import { CENTER_SECTION_X, CENTER_SECTION_Y } from '../tiles/systems/TileUtils';
import { getSeedConfig, getAllSeedConfigs } from '../config/SeedConfig';

// Get coin values from centralized config
export function getCropValue(cropType: CropTypeValue): number {
    return getSeedConfig(cropType).sellValue;
}

// Get all crop values for reference
export function getAllCropValues(): Record<CropTypeValue, number> {
    const configs = getAllSeedConfigs();
    const values: Record<string, number> = {};

    Object.entries(configs).forEach(([cropType, config]) => {
        values[cropType] = config.sellValue;
    });

    return values as Record<CropTypeValue, number>;
}

// Award coins for harvesting a crop
export function awardCoins(gameState: { coins: number }, cropType: CropTypeValue | string): number {
    let value = 0;

    if (typeof cropType === 'string') {
        // Handle string crop types (backwards compatibility)
        try {
            const config = getSeedConfig(cropType as CropTypeValue);
            value = config.sellValue;
        } catch {
            // If crop type not found, default to 0
            value = 0;
        }
    } else {
        value = getCropValue(cropType);
    }

    gameState.coins += value;
    return value;
}

// Format coins for display
export function formatCoins(coins: number): string {
    return coins.toLocaleString();
}

// Tool costs for different actions
export function getToolCosts(): Record<string, number> {
    const configs = getAllSeedConfigs();
    const costs: Record<string, number> = {
        GRASS: 1,
        DIRT: 2,
        ROAD: 5,
        WATER: 2,
        HARVEST: 0
    };

    // Add seed costs from centralized config
    Object.entries(configs).forEach(([cropType, config]) => {
        costs[`${cropType.toUpperCase()}_SEEDS`] = config.buyPrice;
    });

    return costs;
}

// Get cost for a tool action
export function getToolCost(toolType: string): number {
    const costs = getToolCosts();
    return costs[toolType.toUpperCase()] || 0;
}

// Check if player can afford a tool action
export function canAfford(gameState: { coins: number }, toolType: string): boolean {
    const cost = getToolCost(toolType);
    return gameState.coins >= cost;
}

// Spend coins for a tool action
export function spendCoins(gameState: { coins: number }, toolType: string): { success: boolean; cost: number } {
    const cost = getToolCost(toolType);

    if (gameState.coins >= cost) {
        gameState.coins -= cost;
        return { success: true, cost };
    }

    return { success: false, cost };
}

// Section unlock costs - base cost and scaling
export const SECTION_UNLOCK_CONFIG = {
    BASE_COST: 30,        // Starting cost for first unlock
    COST_INCREASE: 20,    // Cost increase per unlocked section
    ADJACENCY_BONUS: 0.8, // Multiplier for adjacent sections (20% discount)
} as const;

// Check if a section is adjacent (directly neighboring) to any unlocked section
export function isSectionAdjacentToUnlocked(grid: any, targetX: number, targetY: number): boolean {
    // Check all 4 cardinal directions + 4 diagonal directions (8-way adjacency)
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    for (const [dx, dy] of directions) {
        const checkX = targetX + dx;
        const checkY = targetY + dy;

        // Skip if out of bounds
        if (checkX < 0 || checkX >= 5 || checkY < 0 || checkY >= 5) {
            continue;
        }

        // Check if this adjacent section is unlocked
        const section = grid.sections[checkX][checkY];
        if (section && !section.isLocked) {
            return true;
        }
    }

    return false;
}

// Count total unlocked sections (excluding center)
export function countUnlockedSections(grid: any): number {
    let count = 0;
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            const section = grid.sections[x][y];
            if (section && !section.isLocked) {
                // Don't count the center section in pricing
                if (!(x === CENTER_SECTION_X && y === CENTER_SECTION_Y)) {
                    count++;
                }
            }
        }
    }
    return count;
}

// Get unlock cost for a section based on progressive pricing
export function getSectionUnlockCost(sectionX: number, sectionY: number, grid?: any): number {
    // Center section is already unlocked, so no cost
    if (sectionX === CENTER_SECTION_X && sectionY === CENTER_SECTION_Y) {
        return 0;
    }

    // If no grid provided, return base cost (fallback)
    if (!grid) {
        return SECTION_UNLOCK_CONFIG.BASE_COST;
    }

    // Calculate progressive cost based on already unlocked sections
    const unlockedCount = countUnlockedSections(grid);
    let cost = SECTION_UNLOCK_CONFIG.BASE_COST + (unlockedCount * SECTION_UNLOCK_CONFIG.COST_INCREASE);

    // Apply adjacency discount if section is adjacent to unlocked area
    if (isSectionAdjacentToUnlocked(grid, sectionX, sectionY)) {
        cost = Math.floor(cost * SECTION_UNLOCK_CONFIG.ADJACENCY_BONUS);
    }

    return Math.max(cost, SECTION_UNLOCK_CONFIG.BASE_COST); // Minimum cost
}

// Check if a section can be unlocked (must be adjacent to unlocked area)
export function canUnlockSection(grid: any, sectionX: number, sectionY: number): boolean {
    // Center section is always unlocked
    if (sectionX === CENTER_SECTION_X && sectionY === CENTER_SECTION_Y) {
        return false; // Already unlocked
    }

    // Check if section is already unlocked
    const section = grid.sections[sectionX][sectionY];
    if (!section || !section.isLocked) {
        return false; // Already unlocked
    }

    // Must be adjacent to an unlocked section
    return isSectionAdjacentToUnlocked(grid, sectionX, sectionY);
}

// Check if player can afford to unlock a section
export function canAffordSectionUnlock(gameState: { coins: number; grid?: any }, sectionX: number, sectionY: number): boolean {
    const cost = getSectionUnlockCost(sectionX, sectionY, gameState.grid);
    return gameState.coins >= cost;
}

// Spend coins to unlock a section
export function spendCoinsForUnlock(gameState: { coins: number; grid?: any }, sectionX: number, sectionY: number): { success: boolean; cost: number } {
    const cost = getSectionUnlockCost(sectionX, sectionY, gameState.grid);

    if (gameState.coins >= cost) {
        gameState.coins -= cost;
        return { success: true, cost };
    }

    return { success: false, cost };
}
