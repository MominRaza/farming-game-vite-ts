# Game State & Data Model

This document describes how the game data is structured and stored in the farming game.

## Main Data Structures
- **Player**: Inventory (seeds, crops, tools), coins, unlocked features.
- **Plot**: State (empty, seeded, growing, mature), crop type, timers, watered/composted status.
- **Shop**: Available seeds/tools, prices.

## Example TypeScript Interfaces
```ts
interface Player {
  coins: number;
  inventory: Inventory;
  tools: Tool[];
}

interface Inventory {
  seeds: Record<string, number>;
  crops: Record<string, number>;
}

interface Plot {
  state: 'empty' | 'seeded' | 'growing' | 'mature';
  cropType?: string;
  watered: boolean;
  composted: boolean;
  timer: number;
}
```

## Data Storage
- Game state is stored in memory and can be saved to localStorage for persistence.
