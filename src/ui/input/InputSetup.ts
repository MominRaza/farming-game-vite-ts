import { startDrag, endDrag, handleMouseMove, handleMouseClick, handleMouseLeave } from './MouseHandler';
import { handleTouchStart, handleTouchMove, handleTouchEnd } from './TouchHandler';
import { handleZoom } from './ZoomHandler';

// Setup all input handlers
export function setupInputHandlers(canvas: HTMLCanvasElement): void {
    // Set up event listeners for dragging
    canvas.addEventListener('mousedown', (e) => {
        // Check if this is a left click for dragging
        if (e.button === 0) {
            startDrag(e);
        }
    });

    // Handle clicks for tile interaction and lock icons
    canvas.addEventListener('click', (e) => {
        handleMouseClick(e, canvas);
    }); window.addEventListener('mousemove', (e) => {
        handleMouseMove(e);
    });
    window.addEventListener('mouseup', endDrag);

    // Clean up tooltips when mouse leaves canvas
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Set up event listeners for touch (mobile)
    canvas.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    // Set up zoom with mouse wheel
    canvas.addEventListener('wheel', handleZoom);

    console.log('Input handlers initialized');
}
