import { getContext } from '../Canvas';
import { TILE_COLORS } from '../RenderConstants';
import { TileType } from '../../tiles/systems/TileTypes';

// Draw a home structure at specified position (for 2x2 home tiles)
export function drawHome(startX: number, startY: number, tileSize: number): void {
    const ctx = getContext();
    if (!ctx) return;

    const homeWidth = tileSize * 2;
    const homeHeight = tileSize * 2;    // First, draw the grass background for the 2x2 area
    ctx.fillStyle = TILE_COLORS[TileType.GRASS];
    ctx.fillRect(startX, startY, homeWidth, homeHeight);

    // Draw tile grid lines for the 2x2 area
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    // Vertical lines
    ctx.beginPath();
    ctx.moveTo(startX + tileSize, startY);
    ctx.lineTo(startX + tileSize, startY + homeHeight);
    ctx.stroke();
    // Horizontal lines  
    ctx.beginPath();
    ctx.moveTo(startX, startY + tileSize);
    ctx.lineTo(startX + homeWidth, startY + tileSize);
    ctx.stroke();

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
