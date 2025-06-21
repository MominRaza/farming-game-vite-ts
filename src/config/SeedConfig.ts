import type { CropTypeValue, CropStageValue } from '../tiles/systems/TileTypes';
import { CropType } from '../tiles/systems/TileTypes';

// Comprehensive seed configuration - Add new seeds here!
export interface SeedConfig {
    // Basic properties
    name: string;
    description: string;
    icon: string;

    // Economic properties
    buyPrice: number;
    sellValue: number;

    // Growth properties
    growthTimes: {
        seedToGrowing: number;    // Time in milliseconds
        growingToMature: number;  // Time in milliseconds
    };

    // Rendering properties
    colors: {
        seed: string;
        growing: string;
        mature: string;
    };

    // UI properties
    shortcutKey: string;  // Keyboard shortcut for planting this seed

    // Optional properties for future expansion
    rarity?: 'common' | 'uncommon' | 'rare' | 'legendary';
    requiredLevel?: number;
    seasonalBonus?: number;
    specialEffects?: string[];
}

// Main seed configuration - ADD NEW SEEDS HERE
export const SEED_CONFIGS: Record<CropTypeValue, SeedConfig> = {
    [CropType.WHEAT]: {
        name: 'Wheat',
        description: 'Fast-growing, basic crop. Great for beginners!',
        icon: '🌾',
        buyPrice: 4,
        sellValue: 8,
        growthTimes: {
            seedToGrowing: 10000,   // 10 seconds
            growingToMature: 20000  // 20 seconds (30s total)
        },
        colors: {
            seed: '#ffd700',    // Golden yellow
            growing: '#9acd32', // Yellow green
            mature: '#daa520'   // Goldenrod
        },
        shortcutKey: 'w',
        rarity: 'common'
    },
    [CropType.CARROT]: {
        name: 'Carrot',
        description: 'Crunchy and nutritious. Takes a bit longer to grow.',
        icon: '🥕',
        buyPrice: 6,
        sellValue: 12,
        growthTimes: {
            seedToGrowing: 20000,   // 20 seconds
            growingToMature: 40000  // 40 seconds (60s total)
        },
        colors: {
            seed: '#ff8c00',    // Dark orange
            growing: '#32cd32', // Lime green
            mature: '#ff6347'   // Orange red
        },
        shortcutKey: 'c',
        rarity: 'common'
    }, [CropType.TOMATO]: {
        name: 'Tomato',
        description: 'Juicy and valuable. Takes patience but worth the wait!',
        icon: '🍅',
        buyPrice: 10,
        sellValue: 20,
        growthTimes: {
            seedToGrowing: 30000,   // 30 seconds
            growingToMature: 60000  // 60 seconds (90s total)
        },
        colors: {
            seed: '#dc143c',    // Crimson
            growing: '#228b22', // Forest green
            mature: '#ff4444'   // Red
        },
        shortcutKey: 't',
        rarity: 'uncommon'
    },
    // NEW SEED EXAMPLE: Just add the configuration here and it works everywhere!
    [CropType.CORN]: {
        name: 'Corn',
        description: 'Golden kernels of goodness. Slow growing but very profitable!',
        icon: '🌽',
        buyPrice: 15,
        sellValue: 32,
        growthTimes: {
            seedToGrowing: 40000,   // 40 seconds
            growingToMature: 80000  // 80 seconds (120s total)
        },
        colors: {
            seed: '#ffd700',    // Gold
            growing: '#228b22', // Forest green
            mature: '#ffff99'   // Light yellow
        },
        shortcutKey: 'o',  // Using 'o' for corn since 'c' is taken by carrot
        rarity: 'rare'
    }
};

// Utility functions to get seed properties
export function getSeedConfig(cropType: CropTypeValue): SeedConfig {
    return SEED_CONFIGS[cropType];
}

export function getAllSeedConfigs(): Record<CropTypeValue, SeedConfig> {
    return SEED_CONFIGS;
}

export function getSeedNames(): string[] {
    return Object.values(SEED_CONFIGS).map(config => config.name);
}

export function getSeedByName(name: string): CropTypeValue | null {
    for (const [cropType, config] of Object.entries(SEED_CONFIGS)) {
        if (config.name.toLowerCase() === name.toLowerCase()) {
            return cropType as CropTypeValue;
        }
    }
    return null;
}

// Get tool type string for seed planting
export function getSeedToolType(cropType: CropTypeValue): string {
    return `${cropType}_seeds`;
}

// Get crop type from tool type
export function getCropTypeFromToolType(toolType: string): CropTypeValue | null {
    const cropName = toolType.replace('_seeds', '');
    return Object.keys(SEED_CONFIGS).find(key => key === cropName) as CropTypeValue || null;
}

// Get growth time helpers
export function getTotalGrowthTime(cropType: CropTypeValue): number {
    const config = getSeedConfig(cropType);
    return config.growthTimes.seedToGrowing + config.growthTimes.growingToMature;
}

export function getGrowthTimeForStage(cropType: CropTypeValue, stage: CropStageValue): number {
    const config = getSeedConfig(cropType);
    switch (stage) {
        case 0: // SEED
            return config.growthTimes.seedToGrowing;
        case 1: // GROWING
            return config.growthTimes.growingToMature;
        default:
            return 0;
    }
}

// Color helpers
export function getSeedColor(cropType: CropTypeValue, stage: 'seed' | 'growing' | 'mature'): string {
    const config = getSeedConfig(cropType);
    return config.colors[stage];
}

// Economic helpers
export function getSeedBuyPrice(cropType: CropTypeValue): number {
    return getSeedConfig(cropType).buyPrice;
}

export function getSeedSellValue(cropType: CropTypeValue): number {
    return getSeedConfig(cropType).sellValue;
}

export function getSeedProfitMargin(cropType: CropTypeValue): number {
    const config = getSeedConfig(cropType);
    return config.sellValue - config.buyPrice;
}

export function getSeedProfitPerSecond(cropType: CropTypeValue): number {
    const profit = getSeedProfitMargin(cropType);
    const totalTime = getTotalGrowthTime(cropType) / 1000; // Convert to seconds
    return profit / totalTime;
}

// Shortcut key helpers
export function getSeedShortcutMappings(): Record<string, CropTypeValue> {
    const mappings: Record<string, CropTypeValue> = {};
    for (const [cropType, config] of Object.entries(SEED_CONFIGS)) {
        mappings[config.shortcutKey] = cropType as CropTypeValue;
    }
    return mappings;
}

export function getSeedShortcutKey(cropType: CropTypeValue): string {
    return getSeedConfig(cropType).shortcutKey;
}
