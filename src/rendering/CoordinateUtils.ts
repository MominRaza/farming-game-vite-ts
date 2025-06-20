import { gameState, TILE_SIZE } from '../GameState';
import * as TileSystem from '../tiles/TileSystem';

export function screenToTileCoords(screenX: number, screenY: number): { x: number, y: number } {
    const x = Math.floor((screenX - gameState.offsetX) / (TILE_SIZE * gameState.scale));
    const y = Math.floor((screenY - gameState.offsetY) / (TILE_SIZE * gameState.scale));
    return { x, y };
}

export function screenToSectionCoords(screenX: number, screenY: number): { sectionX: number, sectionY: number } {
    const { x, y } = screenToTileCoords(screenX, screenY);
    const sectionX = Math.floor(x / TileSystem.SECTION_SIZE);
    const sectionY = Math.floor(y / TileSystem.SECTION_SIZE);
    return { sectionX, sectionY };
}

export function isOverLockIcon(screenX: number, screenY: number): { sectionX: number, sectionY: number } | null {
    const { sectionX, sectionY } = screenToSectionCoords(screenX, screenY);

    const section = TileSystem.getSection(gameState.grid, sectionX, sectionY);
    if (!section || !section.isLocked) {
        return null; // Section is already unlocked
    }

    // Calculate the center of the section in screen coordinates
    const sectionCenterX = (sectionX * TileSystem.SECTION_SIZE + TileSystem.SECTION_SIZE / 2) * TILE_SIZE * gameState.scale + gameState.offsetX;
    const sectionCenterY = (sectionY * TileSystem.SECTION_SIZE + TileSystem.SECTION_SIZE / 2) * TILE_SIZE * gameState.scale + gameState.offsetY;

    // Lock icon size
    const iconSize = 40 * gameState.scale;

    // Check if mouse is within the lock icon bounds
    const distX = Math.abs(screenX - sectionCenterX);
    const distY = Math.abs(screenY - sectionCenterY);

    if (distX <= iconSize / 2 && distY <= iconSize / 2) {
        return { sectionX, sectionY };
    }

    return null;
}
