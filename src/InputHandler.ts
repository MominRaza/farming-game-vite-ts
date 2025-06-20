import { gameState } from './GameState';
import { render } from './Renderer';

// Event handlers for mouse dragging
export function startDrag(e: MouseEvent): void {
    gameState.isDragging = true;
    gameState.lastMouseX = e.clientX;
    gameState.lastMouseY = e.clientY;
}

export function drag(e: MouseEvent): void {
    if (!gameState.isDragging) return;

    const deltaX = e.clientX - gameState.lastMouseX;
    const deltaY = e.clientY - gameState.lastMouseY;

    gameState.offsetX += deltaX;
    gameState.offsetY += deltaY;

    gameState.lastMouseX = e.clientX;
    gameState.lastMouseY = e.clientY;

    render();
}

export function endDrag(): void {
    gameState.isDragging = false;
}

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

    // Prevent default to avoid scrolling the page
    e.preventDefault();
}

export function handleTouchEnd(): void {
    gameState.isDragging = false;
}

// Handle zoom with mouse wheel
export function handleZoom(e: WheelEvent): void {
    // Calculate the position of the mouse in the world before zooming
    const mouseX = e.clientX - gameState.offsetX;
    const mouseY = e.clientY - gameState.offsetY;

    // Adjust the scale
    const zoomFactor = 0.1;
    const delta = e.deltaY > 0 ? -zoomFactor : zoomFactor;
    const newScale = Math.max(0.5, Math.min(2, gameState.scale + delta));

    // Calculate the position of the mouse in the world after zooming
    const newMouseX = mouseX * (newScale / gameState.scale);
    const newMouseY = mouseY * (newScale / gameState.scale);

    // Adjust the offset to keep the mouse position constant
    gameState.offsetX -= (newMouseX - mouseX);
    gameState.offsetY -= (newMouseY - mouseY);

    // Update the scale
    gameState.scale = newScale;

    render();

    // Prevent default to avoid scrolling the page
    e.preventDefault();
}

// Setup all input handlers
export function setupInputHandlers(tileContainer: HTMLElement): void {
    // Set up event listeners for dragging
    tileContainer.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', endDrag);

    // Set up event listeners for touch (mobile)
    tileContainer.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    // Set up zoom with mouse wheel
    tileContainer.addEventListener('wheel', handleZoom);
}
