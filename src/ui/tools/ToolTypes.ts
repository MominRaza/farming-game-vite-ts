// Tool types that players can use
export const ToolType = {
    GRASS: 'grass',
    DIRT: 'dirt',
    ROAD: 'road',
    CARROT_SEEDS: 'carrot_seeds',
    WHEAT_SEEDS: 'wheat_seeds',
    TOMATO_SEEDS: 'tomato_seeds'
} as const;

export type ToolTypeValue = typeof ToolType[keyof typeof ToolType];
