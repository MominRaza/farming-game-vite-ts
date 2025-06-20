import { gameState } from '../../GameState';
import { render } from '../../rendering';

// Event handlers for touch (mobile)
export function handleTouchStart(e: TouchEvent): void {
    if (e.touches.length === 1) {
        gameState.isDragging = true;
        gameState.lastMouseX = e.touches[0].clientX;
        gameState.lastMouseY = e.touches[0].clientY;
    }
}

export function handleTouchMove(e: TouchEvent): void {
    if (!gameState.isDragging || e.touches.length !== 1) return;

    const deltaX = e.touches[0].clientX - gameState.lastMouseX;
    const deltaY = e.touches[0].clientY - gameState.lastMouseY;

    gameState.offsetX += deltaX;
    gameState.offsetY += deltaY;

    gameState.lastMouseX = e.touches[0].clientX;
    gameState.lastMouseY = e.touches[0].clientY;

    render();

    // Prevent default to avoid scrolling
    e.preventDefault();
}

export function handleTouchEnd(): void {
    gameState.isDragging = false;
}
