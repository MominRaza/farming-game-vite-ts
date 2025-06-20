import * as TileSystem from './tiles/TileSystem';
import { gameState, TILE_SIZE } from './GameState';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let needsRedraw = true;

// Initialize canvas
export function initCanvas(): void {
    canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }

    ctx = canvas.getContext('2d')!;
    if (!ctx) {
        console.error('Could not get canvas context!');
        return;
    }

    // Set canvas size to viewport size
    resizeCanvas();

    // Listen for window resize
    window.addEventListener('resize', resizeCanvas);

    // Enable image smoothing for better scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Start the render loop
    startRenderLoop();
}

function startRenderLoop(): void {
    function renderLoop() {
        if (needsRedraw) {
            actualRender();
            needsRedraw = false;
        }
        requestAnimationFrame(renderLoop);
    }
    renderLoop();
}

function resizeCanvas(): void {
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Mark for redraw after resize
    needsRedraw = true;
}

// Get canvas for input handling
export function getCanvas(): HTMLCanvasElement {
    return canvas;
}

// Tile colors for different types
const TILE_COLORS = {
    [TileSystem.TileType.GRASS]: '#7ec850',
    [TileSystem.TileType.DIRT]: '#9b7653',
    [TileSystem.TileType.ROAD]: '#a9a9a9',
    [TileSystem.TileType.LOCKED]: '#2c2c2c',
    [TileSystem.TileType.HOME]: '#8B4513'
};

const TILE_BORDER_COLORS = {
    [TileSystem.TileType.GRASS]: '#6db43c',
    [TileSystem.TileType.DIRT]: '#876543',
    [TileSystem.TileType.ROAD]: '#888888',
    [TileSystem.TileType.LOCKED]: '#444444',
    [TileSystem.TileType.HOME]: '#654321'
};

// Public render function that marks for redraw
export function render(): void {
    needsRedraw = true;
}

// Performance optimization: cache commonly used values
let lastScale = -1;
let cachedScaledTileSize = TILE_SIZE;

// Actual render implementation using Canvas
function actualRender(): void {
    if (!canvas || !ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Cache scaled tile size if scale changed
    if (lastScale !== gameState.scale) {
        cachedScaledTileSize = TILE_SIZE * gameState.scale;
        lastScale = gameState.scale;
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
            }
        }
    }

    // Draw section dividers and locked section overlays
    drawSectionDividers();
    drawLockedSections();
}

// Draw section dividers to visually separate sections
function drawSectionDividers(): void {
    if (!canvas || !ctx) return;

    const sectionPixelSize = TileSystem.SECTION_SIZE * cachedScaledTileSize;

    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.8;

    // Draw vertical lines
    for (let sectionX = 0; sectionX <= TileSystem.SECTIONS_PER_ROW; sectionX++) {
        const x = sectionX * sectionPixelSize + gameState.offsetX;
        if (x >= -10 && x <= canvas.width + 10) {
            ctx.beginPath();
            ctx.moveTo(x, gameState.offsetY - 10);
            ctx.lineTo(x, gameState.offsetY + gameState.grid.height * cachedScaledTileSize + 10);
            ctx.stroke();
        }
    }

    // Draw horizontal lines
    for (let sectionY = 0; sectionY <= TileSystem.SECTIONS_PER_ROW; sectionY++) {
        const y = sectionY * sectionPixelSize + gameState.offsetY;
        if (y >= -10 && y <= canvas.height + 10) {
            ctx.beginPath();
            ctx.moveTo(gameState.offsetX - 10, y);
            ctx.lineTo(gameState.offsetX + gameState.grid.width * cachedScaledTileSize + 10, y);
            ctx.stroke();
        }
    }

    ctx.globalAlpha = 1.0;
}

// Draw locked section overlays with lock icons
function drawLockedSections(): void {
    if (!canvas || !ctx) return;

    const sectionPixelSize = TileSystem.SECTION_SIZE * cachedScaledTileSize;

    for (let sectionX = 0; sectionX < TileSystem.SECTIONS_PER_ROW; sectionX++) {
        for (let sectionY = 0; sectionY < TileSystem.SECTIONS_PER_ROW; sectionY++) {
            const section = TileSystem.getSection(gameState.grid, sectionX, sectionY);

            if (section && section.isLocked) {
                const sectionScreenX = sectionX * sectionPixelSize + gameState.offsetX;
                const sectionScreenY = sectionY * sectionPixelSize + gameState.offsetY;

                // Check if section is visible
                if (sectionScreenX + sectionPixelSize >= 0 && sectionScreenX <= canvas.width &&
                    sectionScreenY + sectionPixelSize >= 0 && sectionScreenY <= canvas.height) {

                    // Draw semi-transparent overlay
                    ctx.fillStyle = 'rgba(44, 44, 44, 0.7)';
                    ctx.fillRect(sectionScreenX, sectionScreenY, sectionPixelSize, sectionPixelSize);

                    // Draw lock icon in center of section
                    const centerX = sectionScreenX + sectionPixelSize / 2;
                    const centerY = sectionScreenY + sectionPixelSize / 2;
                    drawLockIcon(centerX, centerY, Math.min(sectionPixelSize * 0.15, 40));
                }
            }
        }
    }
}

// Draw a lock icon at specified position
function drawLockIcon(centerX: number, centerY: number, size: number): void {
    if (!ctx) return;

    // Draw lock body (rectangle)
    const lockWidth = size * 1.2;
    const lockHeight = size * 0.8;
    const lockX = centerX - lockWidth / 2;
    const lockY = centerY - lockHeight / 2 + size * 0.2;

    ctx.fillStyle = '#ffdd44';
    ctx.fillRect(lockX, lockY, lockWidth, lockHeight);
    ctx.strokeStyle = '#cc9900';
    ctx.lineWidth = 2;
    ctx.strokeRect(lockX, lockY, lockWidth, lockHeight);

    // Draw lock shackle (arc)
    const shackleRadius = size * 0.6;
    const shackleY = centerY - size * 0.3;

    ctx.strokeStyle = '#cc9900';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(centerX, shackleY, shackleRadius, Math.PI, 0, false);
    ctx.stroke();

    // Draw keyhole
    ctx.fillStyle = '#cc9900';
    ctx.beginPath();
    ctx.arc(centerX, centerY + size * 0.1, size * 0.15, 0, 2 * Math.PI);
    ctx.fill();

    // Keyhole slit
    ctx.fillRect(centerX - size * 0.05, centerY + size * 0.1, size * 0.1, size * 0.3);
}

// Convert screen coordinates to tile coordinates
export function screenToTileCoords(screenX: number, screenY: number): { x: number, y: number } {
    const scaledTileSize = TILE_SIZE * gameState.scale;
    const tileX = Math.floor((screenX - gameState.offsetX) / scaledTileSize);
    const tileY = Math.floor((screenY - gameState.offsetY) / scaledTileSize);
    return { x: tileX, y: tileY };
}

// Get section coordinates from screen coordinates
export function screenToSectionCoords(screenX: number, screenY: number): { sectionX: number, sectionY: number } {
    const sectionPixelSize = TileSystem.SECTION_SIZE * cachedScaledTileSize;
    const sectionX = Math.floor((screenX - gameState.offsetX) / sectionPixelSize);
    const sectionY = Math.floor((screenY - gameState.offsetY) / sectionPixelSize);
    return { sectionX, sectionY };
}

// Check if a screen position is over a lock icon
export function isOverLockIcon(screenX: number, screenY: number): { sectionX: number, sectionY: number } | null {
    const { sectionX, sectionY } = screenToSectionCoords(screenX, screenY);

    // Check if section coordinates are valid
    if (sectionX < 0 || sectionX >= TileSystem.SECTIONS_PER_ROW ||
        sectionY < 0 || sectionY >= TileSystem.SECTIONS_PER_ROW) {
        return null;
    }

    const section = TileSystem.getSection(gameState.grid, sectionX, sectionY);
    if (!section || !section.isLocked) {
        return null;
    }

    // Check if click is near the center of the section (lock icon area)
    const sectionPixelSize = TileSystem.SECTION_SIZE * cachedScaledTileSize;
    const sectionCenterX = sectionX * sectionPixelSize + gameState.offsetX + sectionPixelSize / 2;
    const sectionCenterY = sectionY * sectionPixelSize + gameState.offsetY + sectionPixelSize / 2;

    const lockIconRadius = Math.min(sectionPixelSize * 0.2, 50);
    const distance = Math.sqrt(Math.pow(screenX - sectionCenterX, 2) + Math.pow(screenY - sectionCenterY, 2));

    return distance <= lockIconRadius ? { sectionX, sectionY } : null;
}

// Draw a home structure at specified position (for 2x2 home tiles)
function drawHome(startX: number, startY: number, tileSize: number): void {
    if (!ctx) return;

    const homeWidth = tileSize * 2;
    const homeHeight = tileSize * 2;

    // Draw house base (brown rectangle)
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(startX, startY + homeHeight * 0.3, homeWidth, homeHeight * 0.7);

    // Draw house outline
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY + homeHeight * 0.3, homeWidth, homeHeight * 0.7);

    // Draw roof (triangle)
    ctx.fillStyle = '#A0522D';
    ctx.beginPath();
    ctx.moveTo(startX - tileSize * 0.1, startY + homeHeight * 0.3);
    ctx.lineTo(startX + homeWidth + tileSize * 0.1, startY + homeHeight * 0.3);
    ctx.lineTo(startX + homeWidth / 2, startY);
    ctx.closePath();
    ctx.fill();

    // Draw roof outline
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw door
    const doorWidth = tileSize * 0.4;
    const doorHeight = tileSize * 0.8;
    const doorX = startX + homeWidth / 2 - doorWidth / 2;
    const doorY = startY + homeHeight - doorHeight;

    ctx.fillStyle = '#654321';
    ctx.fillRect(doorX, doorY, doorWidth, doorHeight);
    ctx.strokeStyle = '#4A2C17';
    ctx.lineWidth = 1;
    ctx.strokeRect(doorX, doorY, doorWidth, doorHeight);

    // Draw door knob
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(doorX + doorWidth * 0.8, doorY + doorHeight * 0.5, tileSize * 0.03, 0, 2 * Math.PI);
    ctx.fill();

    // Draw windows
    const windowSize = tileSize * 0.25;
    const windowY = startY + homeHeight * 0.5;

    // Left window
    const leftWindowX = startX + tileSize * 0.3;
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(leftWindowX, windowY, windowSize, windowSize);
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 1;
    ctx.strokeRect(leftWindowX, windowY, windowSize, windowSize);

    // Right window
    const rightWindowX = startX + homeWidth - tileSize * 0.3 - windowSize;
    ctx.fillRect(rightWindowX, windowY, windowSize, windowSize);
    ctx.strokeRect(rightWindowX, windowY, windowSize, windowSize);

    // Draw window crosses
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 1;
    // Left window cross
    ctx.beginPath();
    ctx.moveTo(leftWindowX + windowSize / 2, windowY);
    ctx.lineTo(leftWindowX + windowSize / 2, windowY + windowSize);
    ctx.moveTo(leftWindowX, windowY + windowSize / 2);
    ctx.lineTo(leftWindowX + windowSize, windowY + windowSize / 2);
    ctx.stroke();

    // Right window cross
    ctx.beginPath();
    ctx.moveTo(rightWindowX + windowSize / 2, windowY);
    ctx.lineTo(rightWindowX + windowSize / 2, windowY + windowSize);
    ctx.moveTo(rightWindowX, windowY + windowSize / 2);
    ctx.lineTo(rightWindowX + windowSize, windowY + windowSize / 2);
    ctx.stroke();
}
