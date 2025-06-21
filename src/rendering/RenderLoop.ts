import { getCanvas, getContext, shouldRedraw, setRedrawComplete, triggerRedraw } from './Canvas';
import { gameState, TILE_SIZE } from '../GameState';
import * as TileSystem from '../tiles';
import { drawCropPatterns } from './TileRenderer';
import { drawHome } from './painters/HomePainter';
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
    const endY = startY + Math.ceil(viewportHeight / cachedScaledTileSize) + 1;    // Only render tiles that are in the visible range and within grid bounds
    // Track if we've already drawn the home to avoid drawing it multiple times
    const homeBounds = TileSystem.getHomeBounds();
    let homeDrawn = false;

    // Check if any part of the home is visible in the viewport
    const homeVisible = homeBounds &&
        homeBounds.startX < Math.min(gameState.grid.width, endX) &&
        homeBounds.startX + 2 > Math.max(0, startX) &&
        homeBounds.startY < Math.min(gameState.grid.height, endY) &&
        homeBounds.startY + 2 > Math.max(0, startY);

    for (let x = Math.max(0, startX); x < Math.min(gameState.grid.width, endX); x++) {
        for (let y = Math.max(0, startY); y < Math.min(gameState.grid.height, endY); y++) {
            const tile = TileSystem.getTile(gameState.grid, x, y);

            if (tile) {
                const tileX = x * cachedScaledTileSize + gameState.offsetX;
                const tileY = y * cachedScaledTileSize + gameState.offsetY;

                // Special handling for home tiles
                if (tile.occupation === TileSystem.OccupationType.HOME) {
                    // Draw the complete home if any part is visible and we haven't drawn it yet
                    if (!homeDrawn && homeVisible) {
                        // Calculate the actual position of the top-left corner of the home
                        const homeStartX = homeBounds.startX * cachedScaledTileSize + gameState.offsetX;
                        const homeStartY = homeBounds.startY * cachedScaledTileSize + gameState.offsetY;
                        drawHome(homeStartX, homeStartY, cachedScaledTileSize);
                        homeDrawn = true;
                    }

                    // If the home isn't visible or drawn, render this tile as grass
                    if (!homeVisible || !homeDrawn) {
                        const grassColor = TILE_COLORS[TileSystem.TileType.GRASS];
                        ctx.fillStyle = grassColor;
                        ctx.fillRect(tileX, tileY, cachedScaledTileSize, cachedScaledTileSize);

                        const borderColor = TILE_BORDER_COLORS[TileSystem.TileType.GRASS];
                        ctx.strokeStyle = borderColor;
                        ctx.lineWidth = 1;
                        ctx.strokeRect(tileX, tileY, cachedScaledTileSize, cachedScaledTileSize);
                    }

                    // Skip normal tile rendering since we handled it above
                    continue;
                }

                // Fill tile background based on base tile type
                const tileColor = (TILE_COLORS as any)[tile.type] || TILE_COLORS[TileSystem.TileType.GRASS];
                ctx.fillStyle = tileColor;
                ctx.fillRect(tileX, tileY, cachedScaledTileSize, cachedScaledTileSize);

                // Draw tile border based on base tile type
                const borderColor = (TILE_BORDER_COLORS as any)[tile.type] || TILE_BORDER_COLORS[TileSystem.TileType.GRASS];
                ctx.strokeStyle = borderColor;
                ctx.lineWidth = 1;
                ctx.strokeRect(tileX, tileY, cachedScaledTileSize, cachedScaledTileSize);

                // Draw crop patterns if tile has crops
                if (tile.occupation === TileSystem.OccupationType.CROP && tile.cropData) {
                    drawCropPatterns(tile.cropData, tileX, tileY, cachedScaledTileSize);
                }
            }
        }
    }

    // Draw section dividers and locked section overlays
    drawSectionDividers();
    drawLockedSections();
}
