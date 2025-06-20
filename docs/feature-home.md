# Home Feature

## Overview
The home feature adds a 2x2 house structure to the center of the unlocked area (center section) of the game grid.

## Implementation Details

### Location
- **Position**: Center-top of the center section (section 2,2)
- **Size**: 2x2 tiles
- **Coordinates**: Calculated as `(sectionStartX + 5, sectionStartY + 2)` to `(sectionStartX + 6, sectionStartY + 3)`

### Visual Design
The home is rendered as a detailed house with:
- **Base**: Brown rectangular foundation
- **Roof**: Triangular brown roof with overhang
- **Door**: Dark brown door with golden doorknob
- **Windows**: Two light blue windows with cross patterns
- **Outline**: Dark brown borders for definition

### Technical Implementation

#### New Tile Type
- Added `HOME: 'home'` to the `TileType` constants
- Added corresponding colors in the renderer

#### Key Functions
- `placeHomeInCenterSection(grid)`: Places the 2x2 home in the center section
- `isHomeTile(grid, x, y)`: Checks if a tile is part of the home
- `getHomeBounds()`: Returns the boundaries of the home structure
- `drawHome(startX, startY, tileSize)`: Renders the detailed home graphics

#### Rendering Logic
- Home tiles are rendered as a single cohesive structure instead of individual tiles
- The home is drawn only once for the top-left tile of the 2x2 area
- Special handling prevents duplicate rendering of the home structure

#### Interaction
- Clicking on home tiles triggers a special message
- Home tiles are protected from being converted to other tile types
- Future expansions could include home-specific interactions (inventory, crafting, etc.)

## Usage
The home is automatically placed when the game initializes. Players can see and interact with it in the center section of the game world.

## Future Enhancements
- Add interior views or home upgrade mechanics
- Implement storage or crafting functionality
- Add home-based quest or resource management systems
- Allow home customization or expansion
