# Adding New Seeds - Developer Guide

## Overview
The farming game now uses a **centralized seed configuration system** that makes adding new seeds incredibly easy. All seed properties (growth times, costs, colors, rendering) are defined in one place.

## How to Add a New Seed

### Step 1: Add the Crop Type (Required)
Add your new crop type to `src/tiles/systems/TileTypes.ts`:
```typescript
export const CropType = {
    CARROT: 'carrot',
    WHEAT: 'wheat',
    TOMATO: 'tomato',
    CORN: 'corn',         // <- Add new crop type here
    PUMPKIN: 'pumpkin'    // <- Example: Adding pumpkin
} as const;
```

### Step 2: Add Seed Configuration (Required)
Add the complete seed configuration to `src/config/SeedConfig.ts`:
```typescript
export const SEED_CONFIGS: Record<CropTypeValue, SeedConfig> = {
    // ...existing seeds...
      // NEW SEED: Just add configuration here!
    [CropType.PUMPKIN]: {
        name: 'Pumpkin',
        description: 'Big orange pumpkins perfect for autumn!',
        icon: '🎃',
        buyPrice: 20,        // Cost to buy seeds
        sellValue: 45,       // Value when harvested
        growthTimes: {
            seedToGrowing: 50000,   // 50 seconds to start growing
            growingToMature: 100000 // 100 seconds to mature (150s total)
        },
        colors: {
            seed: '#ff6600',     // Orange seed color
            growing: '#228b22',  // Green growing color
            mature: '#ff8c00'    // Orange mature color
        },
        shortcutKey: 'p',        // Keyboard shortcut for planting
        rarity: 'rare'           // Optional: rarity level
    }
};
```

### Step 3: Add Painter Function (Required)
Add a painter function to `src/rendering/painters/CropPainter.ts`:
```typescript
// Draw pumpkin crop patterns for all growth stages
export function drawPumpkinCrop(centerX: number, centerY: number, size: number, stage: 'seeds' | 'growing' | 'mature'): void {
    drawCropWithColors(centerX, centerY, size, stage, CropType.PUMPKIN, (ctx, centerX, centerY, size, color) => {
        const radius = Math.max(2, size / 16);

        switch (stage) {
            case 'seeds':
                // Custom seed visual
                ctx.fillStyle = color;
                // ... draw seeds
                break;

            case 'growing':
                // Custom growing visual
                ctx.fillStyle = color;
                // ... draw growing plant
                break;

            case 'mature':
                // Custom mature visual
                ctx.fillStyle = color;
                // ... draw mature pumpkin
                break;
        }
    });
}
```

### Step 4: Update Renderer (Required)
Add the painter to `src/rendering/TileRenderer.ts`:
```typescript
// Import the new painter
import { drawCarrotCrop, drawWheatCrop, drawTomatoCrop, drawCornCrop, drawPumpkinCrop, ... } from './painters';

// Add case to the switch statement
switch (cropData.type) {
    case TileSystem.CropType.CARROT:
        drawCarrotCrop(centerX, centerY, size, stage);
        break;
    // ... other cases ...
    case TileSystem.CropType.PUMPKIN:
        drawPumpkinCrop(centerX, centerY, size, stage);
        break;
}
```

## That's It! 🎉

Once you add these 4 things, your new seed will automatically work everywhere:

### ✅ Automatically Generated Features:
- **Tool System**: Pumpkin seeds tool is automatically created
- **Shop Integration**: Buy/sell prices are automatically used
- **Economic System**: Profit calculations work automatically
- **Growth System**: Growth times are automatically applied
- **UI Integration**: Tooltips, displays, and interactions work
- **Keyboard Shortcuts**: Shortcut key automatically works in UI and tooltips
- **Save/Load**: New seed data is automatically saved
- **Color System**: All rendering uses your defined colors

### ✅ No Changes Needed In:
- `ToolTypes.ts` - Automatically generates `PUMPKIN_SEEDS` tool
- `CoinSystem.ts` - Automatically uses your buy/sell prices
- `TileTooltipUtils.ts` - Automatically shows seed info and costs
- `CropSystem.ts` - Automatically uses your growth times
- Any UI components - They all read from the centralized config

## Example: Complete Corn Seed Implementation

Here's how we added corn (already implemented as an example):

**1. TileTypes.ts:**
```typescript
CORN: 'corn'  // Added to CropType enum
```

**2. SeedConfig.ts:**
```typescript
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
    shortcutKey: 'o',       // 'O' for cOrn (since 'C' was taken by carrot)
    rarity: 'rare'
}
```

**3. CropPainter.ts:**
```typescript
export function drawCornCrop(centerX, centerY, size, stage) {
    // Implementation with visual patterns for all 3 stages
}
```

**4. TileRenderer.ts:**
```typescript
case TileSystem.CropType.CORN:
    drawCornCrop(centerX, centerY, size, stage);
    break;
```

And corn works everywhere automatically! 🌽

## Benefits of This System

### 🎯 **Single Source of Truth**
- All seed properties in one place (`SeedConfig.ts`)
- No scattered constants across multiple files
- Easy to maintain and update

### 🔧 **Easy Extension**
- Adding a new seed takes ~5 minutes
- Most code is automatically generated
- No need to hunt down all the places to update

### 🛡️ **Type Safety**
- TypeScript ensures all configurations are complete
- Compile-time errors if you miss anything
- Auto-completion helps you fill in properties

### 🏗️ **Scalable Architecture**
- Can easily add 10, 20, or 100+ seeds
- System handles dynamic tool generation
- UI automatically adapts to new seeds

### 🎨 **Flexible Customization**
- Each seed can have unique growth times
- Custom colors for each growth stage
- Flexible economic properties
- Optional metadata (rarity, level requirements, etc.)

## Advanced Features

### Optional Properties
You can add optional properties to seeds:
```typescript
requiredLevel: 5,           // Minimum player level
seasonalBonus: 1.5,         // Bonus multiplier in certain seasons
specialEffects: ['frost_resistant', 'high_yield'],
unlockCondition: 'complete_quest_1'
```

### Keyboard Shortcuts
Each seed automatically gets a keyboard shortcut for quick planting:
```typescript
// Choose unique shortcut keys to avoid conflicts
shortcutKey: 'p',  // Press 'P' to select pumpkin seeds

// Current seed shortcuts:
// 'w' - Wheat seeds
// 'c' - Carrot seeds  
// 't' - Tomato seeds
// 'o' - Corn seeds (cOrn, since 'c' was taken)
```

**Automatic Features:**
- Shortcut appears in button tooltips
- Shortcut works immediately when pressed
- Shortcut is displayed on the tool button
- No additional code needed - completely dynamic!

### Dynamic Pricing
The system supports dynamic pricing based on rarity or other factors:
```typescript
// In SeedConfig.ts, you could add:
getPriceMultiplier(rarity: string): number {
    switch (rarity) {
        case 'common': return 1.0;
        case 'uncommon': return 1.5;
        case 'rare': return 2.0;
        case 'legendary': return 3.0;
        default: return 1.0;
    }
}
```

## Future Enhancements

This system is designed to easily support future features:
- **Seasonal crops** (only available certain times)
- **Crop mutations** (special variants)
- **Cross-breeding** (combine seeds to create new ones)
- **Quality levels** (bronze, silver, gold crops)
- **Farming specializations** (speed vs profit optimizations)

The centralized configuration makes all of these features easy to implement!
