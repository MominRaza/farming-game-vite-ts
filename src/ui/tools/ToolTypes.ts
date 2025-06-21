// Tool types that players can use
export const ToolType = {
    NONE: 'none', // No tool selected - clicking does nothing
    GRASS: 'grass',
    DIRT: 'dirt',
    ROAD: 'road',
    CARROT_SEEDS: 'carrot_seeds',    // Hardcoded for now to maintain UI compatibility  
    WHEAT_SEEDS: 'wheat_seeds',      // Hardcoded for now to maintain UI compatibility
    TOMATO_SEEDS: 'tomato_seeds',    // Hardcoded for now to maintain UI compatibility
    CORN_SEEDS: 'corn_seeds',        // New seed automatically available!
    HARVEST: 'harvest',
    WATER: 'water'
} as const;

export type ToolTypeValue = typeof ToolType[keyof typeof ToolType];
