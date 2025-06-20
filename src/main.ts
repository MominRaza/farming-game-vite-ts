import './style.css';
import * as TileSystem from './tiles/TileSystem';

// Constants
const GRID_SIZE = 60; // 60x60 grid
const TILE_SIZE = 32; // Size of each tile in pixels

// Game state
interface GameState {
    grid: TileSystem.Grid;
    scale: number;
    offsetX: number;
    offsetY: number;
    isDragging: boolean;
    lastMouseX: number;
    lastMouseY: number;
}

const gameState: GameState = {
    grid: TileSystem.createGrid(GRID_SIZE, GRID_SIZE, TileSystem.TileType.GRASS),
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0
};

// Initialize the game
function initGame() {
    const tileContainer = document.getElementById('tile-container');

    if (!tileContainer) {
        console.error('Tile container not found!');
        return;
    }

    // Center the view on the grid
    centerView();

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

    // Render the initial state
    render();
}

// Center the view on the middle of the grid
function centerView() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const gridWidth = gameState.grid.width * TILE_SIZE;
    const gridHeight = gameState.grid.height * TILE_SIZE;

    gameState.offsetX = (viewportWidth - gridWidth) / 2;
    gameState.offsetY = (viewportHeight - gridHeight) / 2;
}

// Render the game state
function render() {
    const tileContainer = document.getElementById('tile-container');

    if (!tileContainer) return;

    // Clear previous tiles
    tileContainer.innerHTML = '';

    // Calculate the visible range based on the current view
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const scaledTileSize = TILE_SIZE * gameState.scale;

    // Calculate the visible range of tiles
    const startX = Math.floor(-gameState.offsetX / scaledTileSize);
    const startY = Math.floor(-gameState.offsetY / scaledTileSize);
    const endX = startX + Math.ceil(viewportWidth / scaledTileSize) + 1;
    const endY = startY + Math.ceil(viewportHeight / scaledTileSize) + 1;

    // Only render tiles that are in the visible range and within grid bounds
    for (let x = Math.max(0, startX); x < Math.min(gameState.grid.width, endX); x++) {
        for (let y = Math.max(0, startY); y < Math.min(gameState.grid.height, endY); y++) {
            const tile = TileSystem.getTile(gameState.grid, x, y);

            if (tile) {
                const tileElement = document.createElement('div');
                tileElement.className = `tile ${tile.type}`;
                tileElement.style.width = `${scaledTileSize}px`;
                tileElement.style.height = `${scaledTileSize}px`;
                tileElement.style.left = `${x * scaledTileSize + gameState.offsetX}px`;
                tileElement.style.top = `${y * scaledTileSize + gameState.offsetY}px`;

                // Add data attributes for position
                tileElement.dataset.x = x.toString();
                tileElement.dataset.y = y.toString();

                // Add click event listener to interact with tiles (for future use)
                tileElement.addEventListener('click', () => {
                    handleTileClick(x, y);
                });

                tileContainer.appendChild(tileElement);
            }
        }
    }
}

// Handle tile click (placeholder for future interaction)
function handleTileClick(x: number, y: number) {
    console.log(`Clicked tile at position ${x}, ${y}`);
    // In the future, this function will be expanded to handle different interactions
    // For example, changing the tile type or placing objects
}

// Event handlers for mouse dragging
function startDrag(e: MouseEvent) {
    gameState.isDragging = true;
    gameState.lastMouseX = e.clientX;
    gameState.lastMouseY = e.clientY;
}

function drag(e: MouseEvent) {
    if (!gameState.isDragging) return;

    const deltaX = e.clientX - gameState.lastMouseX;
    const deltaY = e.clientY - gameState.lastMouseY;

    gameState.offsetX += deltaX;
    gameState.offsetY += deltaY;

    gameState.lastMouseX = e.clientX;
    gameState.lastMouseY = e.clientY;

    render();
}

function endDrag() {
    gameState.isDragging = false;
}

// Event handlers for touch (mobile)
function handleTouchStart(e: TouchEvent) {
    if (e.touches.length === 1) {
        gameState.isDragging = true;
        gameState.lastMouseX = e.touches[0].clientX;
        gameState.lastMouseY = e.touches[0].clientY;
    }
}

function handleTouchMove(e: TouchEvent) {
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

function handleTouchEnd() {
    gameState.isDragging = false;
}

// Handle zoom with mouse wheel
function handleZoom(e: WheelEvent) {
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

// Add a simple debug UI to show coordinates and scale
function addDebugInfo() {
    const uiContainer = document.getElementById('ui-container');

    if (!uiContainer) return;

    const debugDiv = document.createElement('div');
    debugDiv.className = 'debug-info';
    uiContainer.appendChild(debugDiv);

    // Update debug info on mouse move
    window.addEventListener('mousemove', (e) => {
        const { x, y } = TileSystem.screenToGrid(
            e.clientX,
            e.clientY,
            gameState.offsetX,
            gameState.offsetY,
            gameState.scale,
            TILE_SIZE
        );

        if (TileSystem.isInBounds(gameState.grid, x, y)) {
            debugDiv.textContent = `Grid: ${x}, ${y} | Scale: ${gameState.scale.toFixed(2)}`;
        }
    });
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    addDebugInfo();
});
