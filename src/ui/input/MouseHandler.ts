import { gameState } from '../../GameState';
import { render, screenToTileCoords, isOverLockIcon } from '../../rendering';
import * as TileSystem from '../../tiles';
import { applyToolToTile, showErrorMessage } from '../tools';
import * as CoinSystem from '../../systems/CoinSystem';
import { updateCoinDisplay } from '../coin';
import { updateToolButtonStates } from '../tools/ToolsUI';
import { SaveLoadService } from '../../services';
import { showTooltip, removeTooltip } from '../shared/TooltipUtils';
import { getTileTooltipInfo } from '../../utils/TileTooltipUtils';
import { getSelectedTool } from '../tools/ToolState';
import { ToolType } from '../tools/ToolTypes';

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

// Handle clicking on lock icons to unlock sections
function handleLockIconClick(sectionX: number, sectionY: number): void {
    const section = TileSystem.getSection(gameState.grid, sectionX, sectionY);
    if (section && section.isLocked) {
        // Check if this section can be unlocked (adjacency rule)
        if (!CoinSystem.canUnlockSection(gameState.grid, sectionX, sectionY)) {
            showErrorMessage('This area is too far away! You can only unlock areas adjacent to your current territory.');
            return;
        }

        // Check if player can afford to unlock this section
        const unlockCost = CoinSystem.getSectionUnlockCost(sectionX, sectionY, gameState.grid);

        if (!CoinSystem.canAffordSectionUnlock(gameState, sectionX, sectionY)) {
            showErrorMessage(`Not enough coins to unlock this area! Cost: ${unlockCost} coins.`);
            return;
        }

        // Spend coins to unlock
        const result = CoinSystem.spendCoinsForUnlock(gameState, sectionX, sectionY);

        if (result.success) {
            console.log(`Unlocking section at (${sectionX}, ${sectionY}) for ${result.cost} coins`);
            TileSystem.unlockSection(gameState.grid, sectionX, sectionY);

            // Update UI
            updateCoinDisplay();
            updateToolButtonStates();

            // Auto-save the game
            SaveLoadService.saveGame(gameState);

            // Show a message to the user
            showUnlockMessage(sectionX, sectionY, result.cost);
        }
    }
}

// Show a message when a section is unlocked
function showUnlockMessage(sectionX: number, sectionY: number, cost: number): void {
    // Create a temporary message element
    const message = document.createElement('div');
    message.textContent = `Section (${sectionX}, ${sectionY}) unlocked for ${cost} coins!`;
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

// Show tooltip with section unlock information
function showSectionTooltip(sectionX: number, sectionY: number, mouseX: number, mouseY: number): void {
    const unlockCost = CoinSystem.getSectionUnlockCost(sectionX, sectionY, gameState.grid);
    const canAfford = CoinSystem.canAffordSectionUnlock(gameState, sectionX, sectionY);
    const canUnlock = CoinSystem.canUnlockSection(gameState.grid, sectionX, sectionY);
    const unlockedCount = CoinSystem.countUnlockedSections(gameState.grid);

    const content = `
        <div><strong>Section (${sectionX}, ${sectionY})</strong></div>
        <div>Unlocked areas: ${unlockedCount}</div>
        <div>Unlock cost: ${unlockCost} coins</div>
        <div>Your coins: ${gameState.coins}</div>
        <div style="color: ${!canUnlock ? '#dd6600' : canAfford ? '#00dd00' : '#dd0000'}">
            ${!canUnlock ? 'Too far away!' : canAfford ? 'Click to unlock!' : 'Not enough coins!'}
        </div>
    `;

    showTooltip({
        id: 'section-tooltip',
        content,
        mouseX,
        mouseY,
        maxWidth: 200
    });
}

// Remove section tooltip
function removeSectionTooltip(): void {
    removeTooltip('section-tooltip');
}

// Handle mouse move for cursor changes
export function handleMouseMove(e: MouseEvent): void {
    if (gameState.isDragging) {
        drag(e);
        return;
    }

    // Check if hovering over a lock icon to change cursor and show tooltip
    const canvas = e.target as HTMLCanvasElement;
    if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top; const lockIconCoords = isOverLockIcon(screenX, screenY);
        if (lockIconCoords) {
            // Only show pointer cursor if section can be unlocked
            const canUnlock = CoinSystem.canUnlockSection(gameState.grid, lockIconCoords.sectionX, lockIconCoords.sectionY);
            canvas.style.cursor = canUnlock ? 'pointer' : 'not-allowed';
            showSectionTooltip(lockIconCoords.sectionX, lockIconCoords.sectionY, e.clientX, e.clientY);
            removeTooltip('tile-tooltip'); // Remove tile tooltip when over lock icon
        } else {
            canvas.style.cursor = 'grab';
            removeSectionTooltip();

            // Show tile tooltip if no tool is selected
            const selectedTool = getSelectedTool();
            if (selectedTool === ToolType.NONE) {
                const tileCoords = screenToTileCoords(screenX, screenY);

                // Check if tile coordinates are within bounds
                if (tileCoords.x >= 0 && tileCoords.x < gameState.grid.width &&
                    tileCoords.y >= 0 && tileCoords.y < gameState.grid.height) {

                    const tooltipContent = getTileTooltipInfo(gameState.grid, tileCoords.x, tileCoords.y);
                    if (tooltipContent) {
                        showTooltip({
                            id: 'tile-tooltip',
                            content: tooltipContent,
                            mouseX: e.clientX,
                            mouseY: e.clientY,
                            maxWidth: 250
                        });
                    }
                } else {
                    removeTooltip('tile-tooltip');
                }
            } else {
                removeTooltip('tile-tooltip');
            }
        }
    }
}

// Handle mouse clicks
export function handleMouseClick(e: MouseEvent, canvas: HTMLCanvasElement): void {
    if (!gameState.isDragging) {
        // Remove any tooltips when clicking
        removeTooltip('tile-tooltip');
        removeTooltip('section-tooltip');

        const rect = canvas.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;

        // First check if clicking on a lock icon
        const lockIconCoords = isOverLockIcon(screenX, screenY);
        if (lockIconCoords) {
            handleLockIconClick(lockIconCoords.sectionX, lockIconCoords.sectionY);
            render();
            return;
        }

        // Otherwise handle tile clicks with selected tool
        const tileCoords = screenToTileCoords(screenX, screenY);
        // Check if tile coordinates are within bounds
        if (tileCoords.x >= 0 && tileCoords.x < gameState.grid.width &&
            tileCoords.y >= 0 && tileCoords.y < gameState.grid.height) {
            applyToolToTile(tileCoords.x, tileCoords.y);
            render(); // Re-render after tile interaction
        }
    }
}

// Handle mouse leave to clean up tooltips
export function handleMouseLeave(): void {
    removeTooltip('tile-tooltip');
    removeTooltip('section-tooltip');
}
