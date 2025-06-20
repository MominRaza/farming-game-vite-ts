import { gameState } from './GameState';
import { render, screenToTileCoords, isOverLockIcon } from './Renderer';
import * as TileSystem from './tiles/TileSystem';
import { applyToolToTile } from './ToolsUI';

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

// Handle clicking on lock icons to unlock sections
function handleLockIconClick(sectionX: number, sectionY: number): void {
    const section = TileSystem.getSection(gameState.grid, sectionX, sectionY);
    if (section && section.isLocked) {
        console.log(`Unlocking section at (${sectionX}, ${sectionY})`);
        TileSystem.unlockSection(gameState.grid, sectionX, sectionY);

        // Show a message to the user
        showUnlockMessage(sectionX, sectionY);
    }
}

// Show a message when a section is unlocked
function showUnlockMessage(sectionX: number, sectionY: number): void {
    // Create a temporary message element
    const message = document.createElement('div');
    message.textContent = `Section (${sectionX}, ${sectionY}) unlocked!`;
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 200, 0, 0.9);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-size: 18px;
        font-weight: bold;
        z-index: 1000;
        pointer-events: none;
        animation: fadeInOut 2s ease-in-out;
    `;

    // Add animation CSS if not already present
    if (!document.querySelector('#unlock-animation-style')) {
        const style = document.createElement('style');
        style.id = 'unlock-animation-style';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(message);

    // Remove message after animation
    setTimeout(() => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    }, 2000);
}

// Handle mouse move for cursor changes
export function handleMouseMove(e: MouseEvent): void {
    if (gameState.isDragging) {
        drag(e);
        return;
    }

    // Check if hovering over a lock icon to change cursor
    const canvas = e.target as HTMLCanvasElement;
    if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;

        const lockIconCoords = isOverLockIcon(screenX, screenY);
        canvas.style.cursor = lockIconCoords ? 'pointer' : 'grab';
    }
}

// Setup all input handlers
export function setupInputHandlers(canvas: HTMLCanvasElement): void {
    // Set up event listeners for dragging
    canvas.addEventListener('mousedown', (e) => {
        // Check if this is a left click for dragging
        if (e.button === 0) {
            startDrag(e);
        }
    });    // Handle clicks for tile interaction and lock icons
    canvas.addEventListener('click', (e) => {
        if (!gameState.isDragging) {
            const rect = canvas.getBoundingClientRect();
            const screenX = e.clientX - rect.left;
            const screenY = e.clientY - rect.top;

            // First check if clicking on a lock icon
            const lockIconCoords = isOverLockIcon(screenX, screenY);
            if (lockIconCoords) {
                handleLockIconClick(lockIconCoords.sectionX, lockIconCoords.sectionY);
                render();
                return;
            }            // Otherwise handle tile clicks with selected tool
            const tileCoords = screenToTileCoords(screenX, screenY);
            // Check if tile coordinates are within bounds
            if (tileCoords.x >= 0 && tileCoords.x < gameState.grid.width &&
                tileCoords.y >= 0 && tileCoords.y < gameState.grid.height) {
                applyToolToTile(tileCoords.x, tileCoords.y);
                render(); // Re-render after tile interaction
            }
        }
    });

    window.addEventListener('mousemove', (e) => {
        handleMouseMove(e);
    });
    window.addEventListener('mouseup', endDrag);

    // Set up event listeners for touch (mobile)
    canvas.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    // Set up zoom with mouse wheel
    canvas.addEventListener('wheel', handleZoom);
}
