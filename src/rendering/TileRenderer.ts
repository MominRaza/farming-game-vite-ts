import { getContext } from './Canvas';
import { TILE_COLORS } from './RenderConstants';
import * as TileSystem from '../tiles';
import { drawCarrotCrop, drawWheatCrop, drawTomatoCrop, drawCornCrop, drawTileBackground, drawTileGrid } from './painters';

// Draw crop patterns based on crop data
export function drawCropPatterns(cropData: TileSystem.CropData, x: number, y: number, size: number): void {
    const centerX = x + size / 2;
    const centerY = y + size / 2;

    let stage: 'seeds' | 'growing' | 'mature' = 'seeds';

    switch (cropData.stage) {
        case TileSystem.CropStage.SEED:
            stage = 'seeds';
            break;
        case TileSystem.CropStage.GROWING:
            stage = 'growing';
            break;
        case TileSystem.CropStage.MATURE:
            stage = 'mature';
            break;
    }    switch (cropData.type) {
        case TileSystem.CropType.CARROT:
            drawCarrotCrop(centerX, centerY, size, stage);
            break;
        case TileSystem.CropType.WHEAT:
            drawWheatCrop(centerX, centerY, size, stage);
            break;
        case TileSystem.CropType.TOMATO:
            drawTomatoCrop(centerX, centerY, size, stage);
            break;
        case TileSystem.CropType.CORN:
            drawCornCrop(centerX, centerY, size, stage);
            break;
    }
}

// Draw home occupation
export function drawHomeOccupation(x: number, y: number, size: number): void {
    const ctx = getContext();
    if (!ctx) return;

    const centerX = x + size / 2;
    const centerY = y + size / 2;

    // Draw a simple house shape
    ctx.fillStyle = '#8B4513'; // Brown for house
    const houseSize = size * 0.6;
    ctx.fillRect(centerX - houseSize / 2, centerY - houseSize / 4, houseSize, houseSize / 2);

    // Draw roof
    ctx.fillStyle = '#654321'; // Darker brown for roof
    ctx.beginPath();
    ctx.moveTo(centerX - houseSize / 2, centerY - houseSize / 4);
    ctx.lineTo(centerX, centerY - houseSize / 2);
    ctx.lineTo(centerX + houseSize / 2, centerY - houseSize / 4);
    ctx.closePath();
    ctx.fill();
}

// Draw a single tile
export function drawTile(x: number, y: number, tile: TileSystem.Tile, tileSize: number): void {
    const tileX = x * tileSize;
    const tileY = y * tileSize;
    const centerX = tileX + tileSize / 2;
    const centerY = tileY + tileSize / 2;

    // Draw tile background based on base type
    if (tile.type === TileSystem.TileType.GRASS) {
        drawTileBackground(centerX, centerY, tileSize, 'grass');
    } else if (tile.type === TileSystem.TileType.DIRT) {
        // Check if dirt is watered (for both empty dirt and dirt with crops)
        const isDirtWatered = tile.wateredTime && isWaterEffective(tile.wateredTime);

        // Use tilled background if occupied by crops, otherwise dirt (watered or normal)
        if (tile.occupation === TileSystem.OccupationType.CROP) {
            drawTileBackground(centerX, centerY, tileSize, 'tilled');
        } else {
            // Empty dirt - show watered or normal dirt
            drawTileBackground(centerX, centerY, tileSize, isDirtWatered ? 'watered-dirt' : 'dirt');
        }
    } else {
        // Fallback to color constants for other tile types (road, locked)
        const ctx = getContext();
        if (ctx) {
            const fillColor = TILE_COLORS[tile.type as keyof typeof TILE_COLORS] || TILE_COLORS.grass;
            ctx.fillStyle = fillColor;
            ctx.fillRect(tileX, tileY, tileSize, tileSize);
        }
    }

    // Draw tile grid
    drawTileGrid(centerX, centerY, tileSize);

    // Draw occupations
    if (tile.occupation === TileSystem.OccupationType.HOME) {
        drawHomeOccupation(tileX, tileY, tileSize);
    } else if (tile.occupation === TileSystem.OccupationType.CROP && tile.cropData) {
        drawCropPatterns(tile.cropData, tileX, tileY, tileSize);
    }

    // Draw watered indicator if crop is watered
    if (tile.occupation === TileSystem.OccupationType.CROP &&
        tile.cropData &&
        tile.cropData.wateredTime &&
        isWaterEffective(tile.cropData.wateredTime) &&
        tile.cropData.stage < TileSystem.CropStage.MATURE) {
        drawWaterDroplets(centerX, centerY, tileSize);
    }
}

// Check if water is still effective
function isWaterEffective(wateredTime: number): boolean {
    return Date.now() - wateredTime < TileSystem.WATER_DURATION;
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
