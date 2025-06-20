# Project Architecture

This document describes the modular architecture of the farming game codebase after refactoring.

## Directory Structure

```
src/
├── config/           # Configuration constants
│   ├── GameConfig.ts
│   └── index.ts
├── rendering/        # All rendering-related modules
│   ├── painters/     # Specialized drawing functions
│   │   ├── CropPainter.ts
│   │   ├── HomePainter.ts
│   │   ├── TilePainter.ts
│   │   └── index.ts
│   ├── Canvas.ts
│   ├── CoordinateUtils.ts
│   ├── RenderConstants.ts
│   ├── RenderLoop.ts
│   ├── SectionRenderer.ts
│   ├── TileRenderer.ts
│   └── index.ts
├── tiles/            # Tile system and game logic
│   ├── systems/      # Specialized tile systems
│   │   ├── CropSystem.ts
│   │   ├── GridSystem.ts
│   │   ├── HomeSystem.ts
│   │   ├── SectionSystem.ts
│   │   ├── TileTypes.ts
│   │   ├── TileUtils.ts
│   │   └── index.ts
│   └── index.ts
├── types/            # Shared type definitions
│   ├── Common.ts
│   └── index.ts
├── ui/               # User interface modules
│   ├── input/        # Input handling
│   │   ├── InputSetup.ts
│   │   ├── MouseHandler.ts
│   │   ├── TouchHandler.ts
│   │   ├── ZoomHandler.ts
│   │   └── index.ts
│   ├── tools/        # Tool system
│   │   ├── ToolActions.ts
│   │   ├── ToolState.ts
│   │   ├── ToolTypes.ts
│   │   ├── ToolsUI.ts
│   │   └── index.ts
│   └── index.ts
├── utils/            # Utility functions
│   ├── DOMUtils.ts
│   ├── MathUtils.ts
│   └── index.ts
├── DebugUI.ts        # Debug interface
├── GameState.ts      # Global game state
├── main.ts           # Application entry point
└── style.css         # Styles
```

## Module Responsibilities

### `config/`
- **GameConfig.ts**: Game constants and configuration settings
- Centralizes all configuration to avoid magic numbers

### `rendering/`
- **Canvas.ts**: Canvas initialization and context management
- **RenderLoop.ts**: Main rendering loop and frame management
- **TileRenderer.ts**: Tile drawing coordination
- **SectionRenderer.ts**: Section dividers and locked area rendering
- **CoordinateUtils.ts**: Screen-to-game coordinate transformations
- **RenderConstants.ts**: Rendering colors and visual constants

#### `rendering/painters/`
- **HomePainter.ts**: Specialized home structure drawing
- **CropPainter.ts**: Crop rendering for all growth stages
- **TilePainter.ts**: Basic tile backgrounds and borders

### `tiles/`
- Unified entry point for all tile-related functionality

#### `tiles/systems/`
- **TileTypes.ts**: Type definitions and enums
- **GridSystem.ts**: Grid coordinate management
- **SectionSystem.ts**: Section-based world organization
- **CropSystem.ts**: Crop lifecycle management
- **HomeSystem.ts**: Home placement logic
- **TileUtils.ts**: Utility functions for tile operations

### `ui/`
- Unified entry point for all UI functionality

#### `ui/input/`
- **MouseHandler.ts**: Mouse event processing
- **TouchHandler.ts**: Touch event processing
- **ZoomHandler.ts**: Zoom/scale management
- **InputSetup.ts**: Input system initialization

#### `ui/tools/`
- **ToolTypes.ts**: Tool type definitions
- **ToolState.ts**: Tool state management
- **ToolActions.ts**: Tool action implementations
- **ToolsUI.ts**: Tool interface rendering

### `types/`
- **Common.ts**: Shared TypeScript type definitions
- Provides consistent types across modules

### `utils/`
- **MathUtils.ts**: Mathematical utility functions
- **DOMUtils.ts**: DOM manipulation helpers
- Reusable utility functions to avoid code duplication

## Design Principles

1. **Single Responsibility**: Each module has one clear purpose
2. **High Cohesion**: Related functionality is grouped together
3. **Low Coupling**: Modules depend on interfaces, not implementations
4. **Clear Separation**: UI, rendering, game logic, and utilities are separated
5. **Index Files**: Each directory provides a clean public API through index.ts

## Import Strategy

- Use the index.ts files for importing from modules
- Example: `import { drawHome } from '../rendering'` instead of `'../rendering/painters/HomePainter'`
- This allows internal refactoring without breaking imports

## Benefits of This Architecture

1. **Maintainability**: Small, focused files are easier to understand and modify
2. **Testability**: Individual modules can be tested in isolation
3. **Reusability**: Utility functions and painters can be reused across the application
4. **Scalability**: New features can be added without modifying existing modules
5. **Developer Experience**: Clear organization makes it easy to find relevant code

## Migration Summary

The original monolithic files were successfully split:

- `Renderer.ts` (535 lines) → `rendering/` modules (5 files)
- `TileSystem.ts` (425 lines) → `tiles/systems/` modules (6 files)
- `ToolsUI.ts` (338 lines) → `ui/tools/` modules (4 files)  
- `InputHandler.ts` (211 lines) → `ui/input/` modules (4 files)
- `TileRenderer.ts` (217 lines) → 75 lines + `painters/` modules (3 files)

All functionality was preserved while significantly improving code organization.
