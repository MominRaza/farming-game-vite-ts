import * as TileSystem from './tiles/TileSystem';
import { gameState, TILE_SIZE } from './GameState';
import { render } from './Renderer';

// Add a simple debug UI to show coordinates and scale
export function setupDebugUI(): void {
    const uiContainer = document.getElementById('ui-container');

    if (!uiContainer) return;

    const debugDiv = document.createElement('div');
    debugDiv.className = 'debug-info';
    uiContainer.appendChild(debugDiv);

    // Add section control buttons
    const controlDiv = document.createElement('div');
    controlDiv.className = 'section-controls';
    controlDiv.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-size: 12px;
        z-index: 100;
    `; controlDiv.innerHTML = `
        <div>Section Controls:</div>
        <button id="unlock-section-btn" style="margin: 2px; padding: 4px 8px; font-size: 10px;">Unlock Adjacent Section</button>
        <button id="lock-section-btn" style="margin: 2px; padding: 4px 8px; font-size: 10px;">Lock Section</button>
        <button id="unlock-all-btn" style="margin: 2px; padding: 4px 8px; font-size: 10px; background: #4CAF50; color: white;">Unlock All Sections</button>
        <div id="section-stats" style="margin-top: 5px; font-size: 10px;">
            <div>Center: Section (2,2)</div>
            <div>Grid: 60x60 tiles</div>
            <div>Sections: 5x5 (12x12 each)</div>
            <div style="margin-top: 5px; color: #ffdd44;">💡 Click lock icons to unlock sections!</div>
        </div>
    `;

    uiContainer.appendChild(controlDiv);

    // Function to update section statistics
    const updateSectionStats = () => {
        const stats = TileSystem.getSectionInfo(gameState.grid);
        const statsDiv = document.getElementById('section-stats');
        if (statsDiv) {
            statsDiv.innerHTML = `
                <div>Center: Section (2,2)</div>
                <div>Grid: 60x60 tiles</div>
                <div>Sections: 5x5 (12x12 each)</div>
                <div>Unlocked: ${stats.unlocked}/${stats.total}</div>
            `;
        }
    };

    // Initial stats update
    updateSectionStats();    // Add event listeners for section controls
    const unlockBtn = document.getElementById('unlock-section-btn');
    const lockBtn = document.getElementById('lock-section-btn');
    const unlockAllBtn = document.getElementById('unlock-all-btn');

    if (unlockBtn) {
        unlockBtn.addEventListener('click', () => {
            // Unlock section (3,2) - right of center as an example
            TileSystem.unlockSection(gameState.grid, 3, 2);
            render();
            updateSectionStats();
            console.log('Unlocked section (3,2)');
        });
    }

    if (lockBtn) {
        lockBtn.addEventListener('click', () => {
            // Lock section (3,2) as an example
            TileSystem.lockSection(gameState.grid, 3, 2);
            render();
            updateSectionStats();
            console.log('Locked section (3,2)');
        });
    }

    if (unlockAllBtn) {
        unlockAllBtn.addEventListener('click', () => {
            // Unlock all sections for testing
            for (let x = 0; x < TileSystem.SECTIONS_PER_ROW; x++) {
                for (let y = 0; y < TileSystem.SECTIONS_PER_ROW; y++) {
                    TileSystem.unlockSection(gameState.grid, x, y);
                }
            }
            render();
            updateSectionStats();
            console.log('Unlocked all sections');
        });
    }

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
            const { sectionX, sectionY } = TileSystem.getTileSectionCoords(x, y);
            const section = TileSystem.getSection(gameState.grid, sectionX, sectionY);
            const isAccessible = TileSystem.isTileAccessible(gameState.grid, x, y);

            debugDiv.innerHTML = `
                Grid: ${x}, ${y} | Scale: ${gameState.scale.toFixed(2)}<br>
                Section: (${sectionX}, ${sectionY}) | ${section ? (section.isLocked ? 'Locked' : 'Unlocked') : 'Invalid'}<br>
                Accessible: ${isAccessible ? 'Yes' : 'No'}
            `;
        }
    });
}
