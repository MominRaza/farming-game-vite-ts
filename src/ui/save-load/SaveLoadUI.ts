import { SaveLoadService } from '../../services';
import type { GameState } from '../../GameState';
import { loadGameState } from '../../GameState';
import { render } from '../../rendering';
import { updateCoinDisplay } from '../coin';

export function setupSaveLoadUI(gameState: GameState): void {
    createSaveLoadButtons(gameState);
    setupSaveLoadEventListeners(gameState);
}

function createSaveLoadButtons(_gameState: GameState): void {
    const uiContainer = document.getElementById('ui-container');
    if (!uiContainer) return;

    const saveLoadDiv = document.createElement('div');
    saveLoadDiv.className = 'save-load-panel';
    saveLoadDiv.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 15px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 100;
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        border: 2px solid rgba(255, 255, 255, 0.1);
        min-width: 200px;
    `;

    const hasSave = SaveLoadService.hasSavedGame();
    const saveInfo = SaveLoadService.getSaveInfo();
    const saveDate = saveInfo ? new Date(saveInfo.timestamp).toLocaleDateString() : 'No save';

    saveLoadDiv.innerHTML = `
        <div style="font-weight: bold; color: #ffd700; margin-bottom: 5px;">💾 Save & Load</div>
        
        <button id="save-game-btn" class="save-load-btn save-btn" title="Save your current progress">
            💾 Save Game
        </button>
        
        <button id="load-game-btn" class="save-load-btn load-btn ${!hasSave ? 'disabled' : ''}" 
                title="Load your saved progress" ${!hasSave ? 'disabled' : ''}>
            📁 Load Game
        </button>
        
        <div style="font-size: 11px; color: #ccc; text-align: center; margin-top: 5px;">
            Last save: ${saveDate}
        </div>
        
        <div style="display: flex; gap: 5px; margin-top: 5px;">
            <button id="export-save-btn" class="save-load-btn export-btn ${!hasSave ? 'disabled' : ''}" 
                    title="Export save file" ${!hasSave ? 'disabled' : ''}>
                📤 Export
            </button>
            <button id="import-save-btn" class="save-load-btn import-btn" title="Import save file">
                📥 Import
            </button>
        </div>
        
        <input type="file" id="import-file-input" accept=".json" style="display: none;">
    `;

    uiContainer.appendChild(saveLoadDiv);

    // Add CSS for save/load buttons
    const style = document.createElement('style');
    style.textContent = `
        .save-load-btn {
            background: linear-gradient(145deg, #444, #333);
            border: 2px solid #666;
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            transition: all 0.3s ease;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
            min-width: 100px;
        }
        
        .save-load-btn:hover:not(.disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        
        .save-btn:hover:not(.disabled) {
            background: linear-gradient(145deg, #4CAF50, #45a049);
            border-color: #45a049;
        }
        
        .load-btn:hover:not(.disabled) {
            background: linear-gradient(145deg, #2196F3, #1976D2);
            border-color: #1976D2;
        }
        
        .export-btn:hover:not(.disabled) {
            background: linear-gradient(145deg, #FF9800, #F57C00);
            border-color: #F57C00;
        }
        
        .import-btn:hover:not(.disabled) {
            background: linear-gradient(145deg, #9C27B0, #7B1FA2);
            border-color: #7B1FA2;
        }
        
        .save-load-btn.disabled {
            opacity: 0.5;
            cursor: not-allowed;
            background: linear-gradient(145deg, #333, #222);
            border-color: #444;
        }
        
        .export-btn, .import-btn {
            min-width: 80px;
            font-size: 11px;
        }
    `;
    document.head.appendChild(style);
}

function setupSaveLoadEventListeners(gameState: GameState): void {
    // Save game button
    const saveBtn = document.getElementById('save-game-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const success = SaveLoadService.saveGame(gameState);
            showNotification(success ? 'Game saved successfully!' : 'Failed to save game!', success);
            updateSaveLoadUI(); // Refresh the UI to show new save info
        });
    }    // Load game button
    const loadBtn = document.getElementById('load-game-btn');
    if (loadBtn) {
        loadBtn.addEventListener('click', () => {
            const savedData = SaveLoadService.loadGame();
            if (savedData) {
                // Update the game state with loaded data
                const loadedState = loadGameState(savedData.gameState);
                Object.assign(gameState, loadedState);

                // Re-render the game with loaded state
                render();

                // Update coin display with loaded coins
                updateCoinDisplay();

                showNotification('Game loaded successfully!', true);
            } else {
                showNotification('Failed to load game!', false);
            }
        });
    }

    // Export save button
    const exportBtn = document.getElementById('export-save-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            SaveLoadService.exportSave();
        });
    }

    // Import save button
    const importBtn = document.getElementById('import-save-btn');
    const fileInput = document.getElementById('import-file-input') as HTMLInputElement;

    if (importBtn && fileInput) {
        importBtn.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const success = await SaveLoadService.importSave(file);
                if (success) {
                    showNotification('Save file imported successfully!', true);
                    updateSaveLoadUI(); // Refresh the UI
                }
                // Reset file input
                fileInput.value = '';
            }
        });
    }
}

function updateSaveLoadUI(): void {
    // Remove existing save/load panel and recreate it
    const existingPanel = document.querySelector('.save-load-panel');
    if (existingPanel) {
        existingPanel.remove();
    }

    // Note: We'd need to pass gameState here, but for now we'll just refresh the save info
    const saveInfoDiv = document.querySelector('.save-load-panel div:last-child');
    if (saveInfoDiv) {
        const saveInfo = SaveLoadService.getSaveInfo();
        const saveDate = saveInfo ? new Date(saveInfo.timestamp).toLocaleDateString() : 'No save';
        saveInfoDiv.textContent = `Last save: ${saveDate}`;
    }
}

function showNotification(message: string, isSuccess: boolean): void {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${isSuccess ? 'rgba(76, 175, 80, 0.95)' : 'rgba(244, 67, 54, 0.95)'};
        color: white;
        padding: 20px 30px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        border: 2px solid ${isSuccess ? '#4CAF50' : '#f44336'};
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}
