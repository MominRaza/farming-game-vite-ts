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
