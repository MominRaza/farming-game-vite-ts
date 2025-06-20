// Main rendering exports
export { initCanvas, getCanvas } from './Canvas';
export { render, startRenderLoop } from './RenderLoop';
export { screenToTileCoords, screenToSectionCoords, isOverLockIcon } from './CoordinateUtils';

// Individual renderers (for potential future customization)
export { drawHome, drawCropPatterns, drawTile } from './TileRenderer';
export { drawSectionDividers, drawLockedSections, drawLockIcon } from './SectionRenderer';

// Constants
export { TILE_COLORS, TILE_BORDER_COLORS } from './RenderConstants';
