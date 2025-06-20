import { getContext } from './Canvas';
import { TILE_COLORS, TILE_BORDER_COLORS } from './RenderConstants';
import * as TileSystem from '../tiles';

// Draw a home structure at specified position (for 2x2 home tiles)
export function drawHome(startX: number, startY: number, tileSize: number): void {
    const ctx = getContext();
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

// Draw crop patterns for all growth stages
export function drawCropPatterns(tileType: string, x: number, y: number, size: number): void {
    const ctx = getContext();
    if (!ctx) return;

    const centerX = x + size / 2;
    const centerY = y + size / 2;
    const radius = Math.max(2, size / 16); // Scale with tile size

    switch (tileType) {
        // Carrot stages
        case TileSystem.TileType.CARROT_SEEDS:
            // Draw small orange dots for carrot seeds
            ctx.fillStyle = '#ff8c00';
            for (let i = 0; i < 3; i++) {
                const offsetX = (i - 1) * size / 6;
                const offsetY = (Math.random() - 0.5) * size / 6;
                ctx.beginPath();
                ctx.arc(centerX + offsetX, centerY + offsetY, radius, 0, Math.PI * 2);
                ctx.fill();
            }
            break;

        case TileSystem.TileType.CARROT_GROWING:
            // Draw small green sprouts for growing carrots
            ctx.fillStyle = '#32cd32';
            for (let i = 0; i < 4; i++) {
                const offsetX = (i - 1.5) * size / 8;
                const offsetY = -size / 6;
                ctx.fillRect(centerX + offsetX - 1, centerY + offsetY, 2, size / 4);
            }
            break;

        case TileSystem.TileType.CARROT_MATURE:
            // Draw full carrot with green top
            ctx.fillStyle = '#ff6347';
            ctx.fillRect(centerX - size / 8, centerY, size / 4, size / 6);
            ctx.fillStyle = '#32cd32';
            for (let i = 0; i < 3; i++) {
                const offsetX = (i - 1) * size / 12;
                ctx.fillRect(centerX + offsetX - 1, centerY - size / 6, 2, size / 4);
            }
            break;

        // Wheat stages
        case TileSystem.TileType.WHEAT_SEEDS:
            // Draw small golden dots for wheat seeds
            ctx.fillStyle = '#ffd700';
            for (let i = 0; i < 4; i++) {
                const angle = (i / 4) * Math.PI * 2;
                const offsetX = Math.cos(angle) * size / 8;
                const offsetY = Math.sin(angle) * size / 8;
                ctx.beginPath();
                ctx.arc(centerX + offsetX, centerY + offsetY, radius, 0, Math.PI * 2);
                ctx.fill();
            }
            break;

        case TileSystem.TileType.WHEAT_GROWING:
            // Draw growing wheat stalks
            ctx.fillStyle = '#9acd32';
            for (let i = 0; i < 6; i++) {
                const offsetX = (i - 2.5) * size / 10;
                ctx.fillRect(centerX + offsetX - 1, centerY - size / 4, 2, size / 2);
            }
            break;

        case TileSystem.TileType.WHEAT_MATURE:
            // Draw mature wheat with grain heads
            ctx.fillStyle = '#daa520';
            for (let i = 0; i < 5; i++) {
                const offsetX = (i - 2) * size / 8;
                ctx.fillRect(centerX + offsetX - 1, centerY - size / 3, 2, size / 2);
                // Grain head
                ctx.fillStyle = '#ffd700';
                ctx.fillRect(centerX + offsetX - 2, centerY - size / 3, 4, size / 8);
                ctx.fillStyle = '#daa520';
            }
            break;

        // Tomato stages
        case TileSystem.TileType.TOMATO_SEEDS:
            // Draw small red dots for tomato seeds
            ctx.fillStyle = '#dc143c';
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 2; j++) {
                    const offsetX = (i - 0.5) * size / 4;
                    const offsetY = (j - 0.5) * size / 4;
                    ctx.beginPath();
                    ctx.arc(centerX + offsetX, centerY + offsetY, radius * 1.2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            break;

        case TileSystem.TileType.TOMATO_GROWING:
            // Draw tomato plant with small green fruits
            ctx.fillStyle = '#228b22';
            // Stem
            ctx.fillRect(centerX - 1, centerY - size / 4, 2, size / 2);
            // Small green tomatoes
            ctx.fillStyle = '#32cd32';
            for (let i = 0; i < 3; i++) {
                const offsetX = (i - 1) * size / 6;
                const offsetY = -size / 8;
                ctx.beginPath();
                ctx.arc(centerX + offsetX, centerY + offsetY, radius * 1.5, 0, Math.PI * 2);
                ctx.fill();
            }
            break;

        case TileSystem.TileType.TOMATO_MATURE:
            // Draw tomato plant with ripe red tomatoes
            ctx.fillStyle = '#228b22';
            // Stem
            ctx.fillRect(centerX - 1, centerY - size / 4, 2, size / 2);
            // Ripe red tomatoes
            ctx.fillStyle = '#ff4444';
            for (let i = 0; i < 3; i++) {
                const offsetX = (i - 1) * size / 6;
                const offsetY = -size / 8;
                ctx.beginPath();
                ctx.arc(centerX + offsetX, centerY + offsetY, radius * 2, 0, Math.PI * 2);
                ctx.fill();
            }
            break;
    }
}

// Draw a single tile
export function drawTile(x: number, y: number, tile: TileSystem.Tile, tileSize: number): void {
    const ctx = getContext();
    if (!ctx) return;

    const tileX = x * tileSize;
    const tileY = y * tileSize;

    // Fill tile background
    const fillColor = TILE_COLORS[tile.type as keyof typeof TILE_COLORS] || TILE_COLORS.grass;
    ctx.fillStyle = fillColor;
    ctx.fillRect(tileX, tileY, tileSize, tileSize);

    // Draw tile border
    const borderColor = TILE_BORDER_COLORS[tile.type as keyof typeof TILE_BORDER_COLORS] || TILE_BORDER_COLORS.grass;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(tileX, tileY, tileSize, tileSize);    // Draw crop patterns for crop tiles
    if (tile.type !== TileSystem.TileType.GRASS &&
        tile.type !== TileSystem.TileType.DIRT &&
        tile.type !== TileSystem.TileType.ROAD &&
        tile.type !== TileSystem.TileType.FENCE &&
        tile.type !== TileSystem.TileType.LOCKED &&
        tile.type !== TileSystem.TileType.HOME) {
        drawCropPatterns(tile.type, tileX, tileY, tileSize);
    }
}
