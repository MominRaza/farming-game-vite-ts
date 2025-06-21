// Tile types as string constants
export const TileType = {
    GRASS: 'grass',
    DIRT: 'dirt',
    ROAD: 'road',
    FENCE: 'fence',
    LOCKED: 'locked',
    HOME: 'home',
    // Crop seeds
    CARROT_SEEDS: 'carrot_seeds',
    WHEAT_SEEDS: 'wheat_seeds',
    TOMATO_SEEDS: 'tomato_seeds',
    // Crop growth stages
    CARROT_GROWING: 'carrot_growing',
    WHEAT_GROWING: 'wheat_growing',
    TOMATO_GROWING: 'tomato_growing',
    // Mature crops
    CARROT_MATURE: 'carrot_mature',
    WHEAT_MATURE: 'wheat_mature',
    TOMATO_MATURE: 'tomato_mature',
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
    plantedTime?: number; // When the seed was planted (timestamp)
    growthStage?: number; // 0 = seed, 1 = growing, 2 = mature
    isWatered?: boolean; // Whether this tile has been watered (speeds up growth)
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
