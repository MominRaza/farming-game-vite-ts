import { TileType } from '../tiles/systems/TileTypes';
import type { TileTypeValue } from '../tiles/systems/TileTypes';

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
