// Base tile types - only these can be placed as terrain
export const TileType = {
    GRASS: 'grass',
    DIRT: 'dirt',
    ROAD: 'road',
    LOCKED: 'locked' // For locked sections
} as const;

export type TileTypeValue = typeof TileType[keyof typeof TileType];

// Crop types - these occupy dirt tiles
export const CropType = {
    CARROT: 'carrot',
    WHEAT: 'wheat',
    TOMATO: 'tomato'
} as const;

export type CropTypeValue = typeof CropType[keyof typeof CropType];

// Crop growth stages
export const CropStage = {
    SEED: 0,
    GROWING: 1,
    MATURE: 2
} as const;

export type CropStageValue = typeof CropStage[keyof typeof CropStage];

// Occupation types - what can occupy base tiles
export const OccupationType = {
    HOME: 'home', // Can only occupy grass
    CROP: 'crop'  // Can only occupy dirt
} as const;

export type OccupationTypeValue = typeof OccupationType[keyof typeof OccupationType];

// Water system constants
export const WATER_DURATION = 60000; // Water lasts for 60 seconds (1 minute)
export const WATER_GROWTH_MULTIPLIER = 1.5; // 50% faster growth when watered

// Interface for crop data on dirt tiles
export interface CropData {
    type: CropTypeValue;
    stage: CropStageValue;
    plantedTime: number;
    wateredTime?: number; // When the tile was last watered
}

// Interface for a single tile
export interface Tile {
    type: TileTypeValue; // Base tile type (grass, dirt, road, locked)
    x: number;
    y: number;
    sectionX?: number; // Which section this tile belongs to (0-4)
    sectionY?: number; // Which section this tile belongs to (0-4)

    // Occupation data
    occupation?: OccupationTypeValue; // What occupies this tile (home, crop)
    cropData?: CropData; // Crop information if occupied by crop
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
