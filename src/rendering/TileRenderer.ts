import { getContext } from './Canvas';
import { TILE_COLORS } from './RenderConstants';
import * as TileSystem from '../tiles';
import { drawCarrotCrop, drawWheatCrop, drawTomatoCrop, drawTileBackground, drawTileGrid } from './painters';

// Draw crop patterns for all growth stages
export function drawCropPatterns(tileType: string, x: number, y: number, size: number): void {
    const centerX = x + size / 2;
    const centerY = y + size / 2;

    switch (tileType) {
        // Carrot stages
        case TileSystem.TileType.CARROT_SEEDS:
            drawCarrotCrop(centerX, centerY, size, 'seeds');
            break;
        case TileSystem.TileType.CARROT_GROWING:
            drawCarrotCrop(centerX, centerY, size, 'growing');
            break;
        case TileSystem.TileType.CARROT_MATURE:
            drawCarrotCrop(centerX, centerY, size, 'mature');
            break;

        // Wheat stages
        case TileSystem.TileType.WHEAT_SEEDS:
            drawWheatCrop(centerX, centerY, size, 'seeds');
            break;
        case TileSystem.TileType.WHEAT_GROWING:
            drawWheatCrop(centerX, centerY, size, 'growing');
            break;
        case TileSystem.TileType.WHEAT_MATURE:
            drawWheatCrop(centerX, centerY, size, 'mature');
            break;

        // Tomato stages
        case TileSystem.TileType.TOMATO_SEEDS:
            drawTomatoCrop(centerX, centerY, size, 'seeds');
            break;
        case TileSystem.TileType.TOMATO_GROWING:
            drawTomatoCrop(centerX, centerY, size, 'growing');
            break;
        case TileSystem.TileType.TOMATO_MATURE:
            drawTomatoCrop(centerX, centerY, size, 'mature');
            break;
    }
}

// Draw a single tile
export function drawTile(x: number, y: number, tile: TileSystem.Tile, tileSize: number): void {
    const tileX = x * tileSize;
    const tileY = y * tileSize;
    const centerX = tileX + tileSize / 2;
    const centerY = tileY + tileSize / 2;

    // Draw tile background based on type
    if (tile.type === TileSystem.TileType.GRASS) {
        drawTileBackground(centerX, centerY, tileSize, 'grass');
    } else if (tile.type === TileSystem.TileType.DIRT) {
        drawTileBackground(centerX, centerY, tileSize, 'dirt');
    } else if (tile.type.includes('SEEDS') || tile.type.includes('GROWING') || tile.type.includes('MATURE')) {
        drawTileBackground(centerX, centerY, tileSize, 'tilled');
    } else {
        // Fallback to color constants for other tile types
        const ctx = getContext();
        if (ctx) {
            const fillColor = TILE_COLORS[tile.type as keyof typeof TILE_COLORS] || TILE_COLORS.grass;
            ctx.fillStyle = fillColor;
            ctx.fillRect(tileX, tileY, tileSize, tileSize);
        }
    }

    // Draw tile grid
    drawTileGrid(centerX, centerY, tileSize);    // Draw crop patterns for crop tiles
    if (tile.type !== TileSystem.TileType.GRASS &&
        tile.type !== TileSystem.TileType.DIRT &&
        tile.type !== TileSystem.TileType.ROAD &&
        tile.type !== TileSystem.TileType.FENCE &&
        tile.type !== TileSystem.TileType.LOCKED &&
        tile.type !== TileSystem.TileType.HOME) {
        drawCropPatterns(tile.type, tileX, tileY, tileSize);
    }

    // Draw watered indicator if tile is watered
    if (tile.isWatered && tile.plantedTime && tile.growthStage !== undefined && tile.growthStage < 2) {
        drawWaterDroplets(centerX, centerY, tileSize);
    }
}

// Draw water droplets to indicate watered tiles
function drawWaterDroplets(centerX: number, centerY: number, tileSize: number): void {
    const ctx = getContext();
    if (!ctx) return;

    // Draw small blue water droplets around the tile
    ctx.fillStyle = 'rgba(0, 150, 255, 0.8)';
    
    const dropletSize = Math.max(2, tileSize / 16);
    const positions = [
        { x: centerX - tileSize * 0.3, y: centerY - tileSize * 0.3 },
        { x: centerX + tileSize * 0.3, y: centerY - tileSize * 0.2 },
        { x: centerX - tileSize * 0.2, y: centerY + tileSize * 0.25 },
        { x: centerX + tileSize * 0.25, y: centerY + tileSize * 0.3 }
    ];

    positions.forEach(pos => {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, dropletSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Add white highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(pos.x - dropletSize * 0.3, pos.y - dropletSize * 0.3, dropletSize * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Reset color for next droplet
        ctx.fillStyle = 'rgba(0, 150, 255, 0.8)';
    });
}
