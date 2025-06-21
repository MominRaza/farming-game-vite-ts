import { TileType } from '../tiles/systems/TileTypes';
import type { TileTypeValue } from '../tiles/systems/TileTypes';
import { CENTER_SECTION_X, CENTER_SECTION_Y } from '../tiles/systems/TileUtils';

// Coin values for different crops
export const CROP_VALUES = {
    [TileType.CARROT_MATURE]: 5,
    [TileType.WHEAT_MATURE]: 3,
    [TileType.TOMATO_MATURE]: 8
} as const;

// Get coin value for a crop type
export function getCropValue(cropType: TileTypeValue): number {
    return CROP_VALUES[cropType as keyof typeof CROP_VALUES] || 0;
}

// Award coins for harvesting a crop
export function awardCoins(gameState: { coins: number }, cropType: TileTypeValue): number {
    const value = getCropValue(cropType);
    gameState.coins += value;
    return value;
}

// Format coins for display
export function formatCoins(coins: number): string {
    return coins.toLocaleString();
}

// Tool costs for different actions
export const TOOL_COSTS = {
    GRASS: 1,
    DIRT: 2,
    ROAD: 5,
    CARROT_SEEDS: 3,
    WHEAT_SEEDS: 2,
    TOMATO_SEEDS: 4,
    HARVEST: 0 // Harvesting is free
} as const;

// Get cost for a tool action
export function getToolCost(toolType: string): number {
    return TOOL_COSTS[toolType as keyof typeof TOOL_COSTS] || 0;
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

// Section unlock costs based on distance from center
export const SECTION_UNLOCK_COSTS = {
    DISTANCE_1: 50,  // Adjacent to center (3x3 area around center)
    DISTANCE_2: 100, // 5x5 area (corners and edges)
} as const;

// Calculate the distance from center section (using Chebyshev distance)
export function getSectionDistanceFromCenter(sectionX: number, sectionY: number): number {
    const deltaX = Math.abs(sectionX - CENTER_SECTION_X);
    const deltaY = Math.abs(sectionY - CENTER_SECTION_Y);
    return Math.max(deltaX, deltaY);
}

// Get unlock cost for a section based on its distance from center
export function getSectionUnlockCost(sectionX: number, sectionY: number): number {
    // Center section is already unlocked, so no cost
    if (sectionX === CENTER_SECTION_X && sectionY === CENTER_SECTION_Y) {
        return 0;
    }

    const distance = getSectionDistanceFromCenter(sectionX, sectionY);
    
    if (distance === 1) {
        // 3x3 area around center (8 sections)
        return SECTION_UNLOCK_COSTS.DISTANCE_1;
    } else if (distance === 2) {
        // 5x5 area outer ring (16 sections)
        return SECTION_UNLOCK_COSTS.DISTANCE_2;
    }
    
    // Should not happen in a 5x5 grid, but return a high cost as fallback
    return SECTION_UNLOCK_COSTS.DISTANCE_2 * 2;
}

// Check if player can afford to unlock a section
export function canAffordSectionUnlock(gameState: { coins: number }, sectionX: number, sectionY: number): boolean {
    const cost = getSectionUnlockCost(sectionX, sectionY);
    return gameState.coins >= cost;
}

// Spend coins to unlock a section
export function spendCoinsForUnlock(gameState: { coins: number }, sectionX: number, sectionY: number): { success: boolean; cost: number } {
    const cost = getSectionUnlockCost(sectionX, sectionY);

    if (gameState.coins >= cost) {
        gameState.coins -= cost;
        return { success: true, cost };
    }

    return { success: false, cost };
}
