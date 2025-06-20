// Main rendering exports
export { initCanvas, getCanvas } from './Canvas';
export { render, startRenderLoop } from './RenderLoop';
export { screenToTileCoords, screenToSectionCoords, isOverLockIcon } from './CoordinateUtils';

// Individual renderers (for potential future customization)
export { drawCropPatterns, drawTile } from './TileRenderer';
export { drawSectionDividers, drawLockedSections, drawLockIcon } from './SectionRenderer';

// Painter modules
export * from './painters';

// Constants
export { TILE_COLORS, TILE_BORDER_COLORS } from './RenderConstants';
