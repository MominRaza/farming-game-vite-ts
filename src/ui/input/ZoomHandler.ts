import { gameState } from '../../GameState';
import { render } from '../../rendering';

// Handle zoom with mouse wheel
export function handleZoom(e: WheelEvent): void {
    // Calculate the position of the mouse in the world before zooming
    const mouseX = e.clientX - gameState.offsetX;
    const mouseY = e.clientY - gameState.offsetY;

    // Adjust the scale
    const zoomFactor = 0.1;
    const delta = e.deltaY > 0 ? -zoomFactor : zoomFactor;
    const newScale = Math.max(0.25, Math.min(2, gameState.scale + delta));

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
