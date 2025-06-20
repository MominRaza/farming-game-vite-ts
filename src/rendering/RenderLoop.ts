import { getCanvas, getContext, shouldRedraw, setRedrawComplete, triggerRedraw } from './Canvas';
import { gameState, TILE_SIZE } from '../GameState';
import * as TileSystem from '../tiles';
import { drawHome, drawCropPatterns } from './TileRenderer';
import { drawSectionDividers, drawLockedSections, setCachedScaledTileSize } from './SectionRenderer';
import { TILE_COLORS, TILE_BORDER_COLORS } from './RenderConstants';

// Performance optimization: cache commonly used values
let lastScale = -1;
let cachedScaledTileSize = TILE_SIZE;

// Start the render loop
export function startRenderLoop(): void {
    function renderLoop() {
        if (shouldRedraw()) {
            actualRender();
            setRedrawComplete();
        }
        requestAnimationFrame(renderLoop);
    }
    renderLoop();
}

// Main render function
export function render(): void {
    triggerRedraw();
}

// Actual render implementation using Canvas
function actualRender(): void {
    const canvas = getCanvas();
    const ctx = getContext();
    if (!canvas || !ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Cache scaled tile size if scale changed
    if (lastScale !== gameState.scale) {
        cachedScaledTileSize = TILE_SIZE * gameState.scale;
        lastScale = gameState.scale;
        setCachedScaledTileSize(cachedScaledTileSize);
    }

    // Calculate the visible range based on the current view
    const viewportWidth = canvas.width;
    const viewportHeight = canvas.height;

    // Calculate the visible range of tiles
    const startX = Math.floor(-gameState.offsetX / cachedScaledTileSize);
    const startY = Math.floor(-gameState.offsetY / cachedScaledTileSize);
    const endX = startX + Math.ceil(viewportWidth / cachedScaledTileSize) + 1;
    const endY = startY + Math.ceil(viewportHeight / cachedScaledTileSize) + 1;

    // Only render tiles that are in the visible range and within grid bounds
    // Track if we've already drawn the home to avoid drawing it multiple times
    const homeBounds = TileSystem.getHomeBounds();
    let homeDrawn = false;

    for (let x = Math.max(0, startX); x < Math.min(gameState.grid.width, endX); x++) {
        for (let y = Math.max(0, startY); y < Math.min(gameState.grid.height, endY); y++) {
            const tile = TileSystem.getTile(gameState.grid, x, y);

            if (tile) {
                const tileX = x * cachedScaledTileSize + gameState.offsetX;
                const tileY = y * cachedScaledTileSize + gameState.offsetY;

                // Special handling for home tiles
                if (tile.type === TileSystem.TileType.HOME) {
                    // Only draw the home once for the top-left tile of the 2x2 home
                    if (!homeDrawn && x === homeBounds.startX && y === homeBounds.startY) {
                        drawHome(tileX, tileY, cachedScaledTileSize);
                        homeDrawn = true;
                    }
                    // Skip individual tile rendering for home tiles since we draw the whole home
                    continue;
                }

                // Fill tile background (handle fence type gracefully by treating as grass)
                const tileColor = (TILE_COLORS as any)[tile.type] || TILE_COLORS[TileSystem.TileType.GRASS];
                ctx.fillStyle = tileColor;
                ctx.fillRect(tileX, tileY, cachedScaledTileSize, cachedScaledTileSize);

                // Draw tile border (handle fence type gracefully by treating as grass)
                const borderColor = (TILE_BORDER_COLORS as any)[tile.type] || TILE_BORDER_COLORS[TileSystem.TileType.GRASS];
                ctx.strokeStyle = borderColor;
                ctx.lineWidth = 1;
                ctx.strokeRect(tileX, tileY, cachedScaledTileSize, cachedScaledTileSize);

                // Draw crop patterns for all growth stages
                if (tile.type === TileSystem.TileType.CARROT_SEEDS ||
                    tile.type === TileSystem.TileType.WHEAT_SEEDS ||
                    tile.type === TileSystem.TileType.TOMATO_SEEDS ||
                    tile.type === TileSystem.TileType.CARROT_GROWING ||
                    tile.type === TileSystem.TileType.WHEAT_GROWING ||
                    tile.type === TileSystem.TileType.TOMATO_GROWING ||
                    tile.type === TileSystem.TileType.CARROT_MATURE ||
                    tile.type === TileSystem.TileType.WHEAT_MATURE ||
                    tile.type === TileSystem.TileType.TOMATO_MATURE) {
                    drawCropPatterns(tile.type, tileX, tileY, cachedScaledTileSize);
                }
            }
        }
    }

    // Draw section dividers and locked section overlays
    drawSectionDividers();
    drawLockedSections();
}
