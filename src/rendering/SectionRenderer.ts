import { getCanvas, getContext } from './Canvas';
import { gameState, TILE_SIZE } from '../GameState';
import * as TileSystem from '../tiles/TileSystem';

let cachedScaledTileSize = TILE_SIZE;

export function setCachedScaledTileSize(size: number): void {
    cachedScaledTileSize = size;
}

// Draw section dividers to visually separate sections
export function drawSectionDividers(): void {
    const canvas = getCanvas();
    const ctx = getContext();
    if (!canvas || !ctx) return;

    const sectionPixelSize = TileSystem.SECTION_SIZE * cachedScaledTileSize;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;

    // Draw vertical section dividers
    for (let sectionX = 0; sectionX <= TileSystem.SECTIONS_PER_ROW; sectionX++) {
        const x = sectionX * sectionPixelSize + gameState.offsetX;
        if (x >= -10 && x <= canvas.width + 10) {
            ctx.beginPath();
            ctx.moveTo(x, gameState.offsetY - 10);
            ctx.lineTo(x, gameState.offsetY + gameState.grid.height * cachedScaledTileSize + 10);
            ctx.stroke();
        }
    }

    // Draw horizontal section dividers
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
export function drawLockedSections(): void {
    const canvas = getCanvas();
    const ctx = getContext();
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
export function drawLockIcon(centerX: number, centerY: number, size: number): void {
    const ctx = getContext();
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
