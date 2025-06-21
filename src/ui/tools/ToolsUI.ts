import { ToolType } from './ToolTypes';
import type { ToolTypeValue } from './ToolTypes';
import { setSelectedTool, getSelectedTool } from './ToolState';
import { SaveLoadService } from '../../services';
import { gameState, loadGameState } from '../../GameState';
import { render } from '../../rendering';
import { updateCoinDisplay } from '../coin';
import * as CoinSystem from '../../systems/CoinSystem';
import { getAllSeedConfigs, getSeedToolType, getSeedShortcutMappings } from '../../config/SeedConfig';

// Update tool button styles to show which is selected
export function updateToolButtons(): void {
    updateToolButtonStates();
}

// Setup the tools UI
export function setupToolsUI(): void {
    const uiContainer = document.getElementById('ui-container');
    if (!uiContainer) return;

    const toolsDiv = document.createElement('div');
    toolsDiv.className = 'tools-panel';
    toolsDiv.style.cssText = `
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
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
    `;    // Generate seed buttons dynamically
    const seedConfigs = getAllSeedConfigs();
    const seedButtons = Object.entries(seedConfigs).map(([cropType, config]) => {
        const toolType = getSeedToolType(cropType as any);
        const toolCost = CoinSystem.getToolCost(toolType.toUpperCase());
        const hotkey = config.shortcutKey.toUpperCase(); // Use the shortcut from config
        const buttonId = `${cropType}-seeds-btn`;

        return `<button id="${buttonId}" class="tool-btn" title="${config.name} Seeds - Plant on dirt (Press ${hotkey}) - Cost: ${toolCost} coins">
            ${config.icon} <span style="font-size: 9px; opacity: 0.7;">(${hotkey}) ${toolCost}💰</span>
        </button>`;
    }).join('');

    toolsDiv.innerHTML = `
        <div style="font-weight: bold; color: #ffd700; margin-bottom: 5px;">🛠️ Tools</div>
        <div style="display: flex; gap: 8px; align-items: center;">
            <div style="font-size: 12px; color: #aaa;">Basic:</div>
            <button id="grass-tool-btn" class="tool-btn" title="Grass Tool - Revert tiles back to grass (Press G) - Cost: ${CoinSystem.getToolCost('GRASS')} coins">
                🌱 <span style="font-size: 9px; opacity: 0.7;">(G) ${CoinSystem.getToolCost('GRASS')}💰</span>
            </button>
            <button id="dirt-tool-btn" class="tool-btn" title="Dirt Tool - Create farmable land (Press D) - Cost: ${CoinSystem.getToolCost('DIRT')} coins">
                🟫 <span style="font-size: 9px; opacity: 0.7;">(D) ${CoinSystem.getToolCost('DIRT')}💰</span>
            </button>
            <button id="road-tool-btn" class="tool-btn" title="Road Tool - Build paths (Press R) - Cost: ${CoinSystem.getToolCost('ROAD')} coins">
                🛤️ <span style="font-size: 9px; opacity: 0.7;">(R) ${CoinSystem.getToolCost('ROAD')}💰</span>
            </button>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
            <div style="font-size: 12px; color: #aaa;">Seeds:</div>
            ${seedButtons}
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
            <div style="font-size: 12px; color: #aaa;">Farm:</div>
            <button id="water-tool-btn" class="tool-btn" title="Water Tool - Speed up crop growth by 50% or darken dirt tiles (Press A) - Cost: ${CoinSystem.getToolCost('WATER')} coins">
                💧 <span style="font-size: 9px; opacity: 0.7;">(A) ${CoinSystem.getToolCost('WATER')}💰</span>
            </button>
            <button id="harvest-tool-btn" class="tool-btn" title="Harvest Tool - Harvest mature crops (Press H) - FREE!">
                🌾✨ <span style="font-size: 9px; opacity: 0.7;">(H) FREE</span>
            </button>
        </div>        <div style="font-size: 11px; color: #ccc; text-align: center;">
            Most tools cost coins • Water speeds up crop growth by 50% or darkens dirt<br>
            Seeds can only be planted on dirt tiles<br>
            Growth times: ${Object.entries(seedConfigs).map(([_, config]) => `${config.name} (${(config.growthTimes.seedToGrowing + config.growthTimes.growingToMature) / 1000}s)`).join(' • ')}<br>
            <span style="color: #ffd700;">💾 Ctrl+S: Save | 📁 Ctrl+L: Load | ❌ ESC: Deselect Tool</span>
        </div>
    `;

    uiContainer.appendChild(toolsDiv);

    // Add CSS for tool buttons
    const style = document.createElement('style');
    style.textContent = `
        .tool-btn {
            background: linear-gradient(145deg, #444, #333);
            border: 2px solid #666;
            color: white;
            padding: 8px 12px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            transition: all 0.3s ease;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
            min-width: 70px;
        }
        
        .tool-btn:hover {
            background: linear-gradient(145deg, #555, #444);
            border-color: #888;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        
        .tool-btn.active {
            background: linear-gradient(145deg, #4CAF50, #45a049);
            border-color: #45a049;
            box-shadow: 0 0 15px rgba(76, 175, 80, 0.6);
            transform: translateY(-1px);
        }
        
        .tool-btn.active:hover {
            background: linear-gradient(145deg, #45a049, #3d8b40);
            box-shadow: 0 0 20px rgba(76, 175, 80, 0.8);
        }        .tool-btn.disabled {
            background: linear-gradient(145deg, #666, #555);
            border-color: #777;
            color: #999;
            opacity: 0.6;
        }
        
        .tool-btn.disabled:hover {
            background: linear-gradient(145deg, #666, #555);
            transform: none;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
    `;
    document.head.appendChild(style);    // Add event listeners for tool selection
    setupToolEventListeners();
    setupKeyboardShortcuts();

    // Update button states based on current coins
    updateToolButtonStates();

    console.log('Tools UI initialized');
}

// Setup event listeners for tool buttons
function setupToolEventListeners(): void {
    const grassBtn = document.getElementById('grass-tool-btn');
    const dirtBtn = document.getElementById('dirt-tool-btn');
    const roadBtn = document.getElementById('road-tool-btn');
    const waterBtn = document.getElementById('water-tool-btn');
    const harvestBtn = document.getElementById('harvest-tool-btn');

    // Basic tools
    if (grassBtn) {
        grassBtn.addEventListener('click', () => {
            const currentTool = getSelectedTool();
            if (currentTool === ToolType.GRASS) {
                setSelectedTool(ToolType.NONE);
            } else {
                setSelectedTool(ToolType.GRASS);
            }
            updateToolButtonStates();
        });
    }

    if (dirtBtn) {
        dirtBtn.addEventListener('click', () => {
            const currentTool = getSelectedTool();
            if (currentTool === ToolType.DIRT) {
                setSelectedTool(ToolType.NONE);
            } else {
                setSelectedTool(ToolType.DIRT);
            }
            updateToolButtonStates();
        });
    }

    if (roadBtn) {
        roadBtn.addEventListener('click', () => {
            const currentTool = getSelectedTool();
            if (currentTool === ToolType.ROAD) {
                setSelectedTool(ToolType.NONE);
            } else {
                setSelectedTool(ToolType.ROAD);
            }
            updateToolButtonStates();
        });
    }

    // Dynamic seed buttons
    const seedConfigs = getAllSeedConfigs();
    Object.keys(seedConfigs).forEach(cropType => {
        const buttonId = `${cropType}-seeds-btn`;
        const btn = document.getElementById(buttonId);
        const toolType = getSeedToolType(cropType as any);

        if (btn) {
            btn.addEventListener('click', () => {
                const currentTool = getSelectedTool();
                if (currentTool === toolType) {
                    setSelectedTool(ToolType.NONE);
                } else {
                    setSelectedTool(toolType as any);
                }
                updateToolButtonStates();
            });
        }
    });

    if (waterBtn) {
        waterBtn.addEventListener('click', () => {
            const currentTool = getSelectedTool();
            if (currentTool === ToolType.WATER) {
                setSelectedTool(ToolType.NONE);
            } else {
                setSelectedTool(ToolType.WATER);
            }
            updateToolButtonStates();
        });
    } if (harvestBtn) {
        harvestBtn.addEventListener('click', () => {
            const currentTool = getSelectedTool();
            if (currentTool === ToolType.HARVEST) {
                setSelectedTool(ToolType.NONE);
            } else {
                setSelectedTool(ToolType.HARVEST);
            }
            updateToolButtonStates();
        });
    }
}

// Setup keyboard shortcuts
function setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', (e) => {
        // Check for Ctrl+S (Save) and Ctrl+L (Load) first
        if (e.ctrlKey || e.metaKey) {
            if (e.key.toLowerCase() === 's') {
                e.preventDefault(); // Prevent browser save dialog
                const success = SaveLoadService.saveGame(gameState);
                showSaveNotification(success ? 'Game saved successfully!' : 'Failed to save game!', success);
                return;
            } if (e.key.toLowerCase() === 'l') {
                e.preventDefault(); // Prevent browser location bar focus
                const savedData = SaveLoadService.loadGame();
                if (savedData) {
                    const loadedState = loadGameState(savedData.gameState);
                    Object.assign(gameState, loadedState);
                    render();
                    updateCoinDisplay(); // Update coin display with loaded data
                    showSaveNotification('Game loaded successfully!', true);
                } else {
                    showSaveNotification('No saved game found!', false);
                }
                return;
            }
        }        // Tool shortcuts (only if no modifier keys are pressed)
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
            const key = e.key.toLowerCase();

            // Special shortcuts
            if (key === 'escape') {
                setSelectedTool(ToolType.NONE);
                updateToolButtonStates();
                return;
            }

            // Non-seed tool shortcuts
            switch (key) {
                case 'g':
                    setSelectedTool(ToolType.GRASS);
                    updateToolButtonStates();
                    return;
                case 'd':
                    setSelectedTool(ToolType.DIRT);
                    updateToolButtonStates();
                    return;
                case 'r':
                    setSelectedTool(ToolType.ROAD);
                    updateToolButtonStates();
                    return;
                case 'a':
                    setSelectedTool(ToolType.WATER);
                    updateToolButtonStates();
                    return;
                case 'h':
                    setSelectedTool(ToolType.HARVEST);
                    updateToolButtonStates();
                    return;
            }            // Dynamic seed shortcuts
            const seedShortcuts = getSeedShortcutMappings();
            if (seedShortcuts[key]) {
                const cropType = seedShortcuts[key];
                const seedToolType = getSeedToolType(cropType) as ToolTypeValue;
                setSelectedTool(seedToolType);
                updateToolButtonStates();
                return;
            }
        }
    });
}

// Show save/load notification
function showSaveNotification(message: string, isSuccess: boolean): void {
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

    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 2000);
}

// Update tool button states based on coin availability
export function updateToolButtonStates(): void {
    const selectedTool = getSelectedTool();

    // Update basic tool buttons
    const grassBtn = document.getElementById('grass-tool-btn');
    const dirtBtn = document.getElementById('dirt-tool-btn');
    const roadBtn = document.getElementById('road-tool-btn');
    const waterBtn = document.getElementById('water-tool-btn');
    const harvestBtn = document.getElementById('harvest-tool-btn');

    // Check affordability for basic tools
    const canAffordGrass = CoinSystem.canAfford(gameState, 'GRASS');
    const canAffordDirt = CoinSystem.canAfford(gameState, 'DIRT');
    const canAffordRoad = CoinSystem.canAfford(gameState, 'ROAD');
    const canAffordWater = CoinSystem.canAfford(gameState, 'WATER');

    if (grassBtn) {
        grassBtn.className = `tool-btn ${selectedTool === ToolType.GRASS ? 'active' : ''} ${!canAffordGrass ? 'disabled' : ''}`;
    }
    if (dirtBtn) {
        dirtBtn.className = `tool-btn ${selectedTool === ToolType.DIRT ? 'active' : ''} ${!canAffordDirt ? 'disabled' : ''}`;
    }
    if (roadBtn) {
        roadBtn.className = `tool-btn ${selectedTool === ToolType.ROAD ? 'active' : ''} ${!canAffordRoad ? 'disabled' : ''}`;
    }
    if (waterBtn) {
        waterBtn.className = `tool-btn ${selectedTool === ToolType.WATER ? 'active' : ''} ${!canAffordWater ? 'disabled' : ''}`;
    }
    if (harvestBtn) {
        harvestBtn.className = selectedTool === ToolType.HARVEST ? 'tool-btn active' : 'tool-btn';
    }

    // Update dynamic seed buttons
    const seedConfigs = getAllSeedConfigs();
    Object.keys(seedConfigs).forEach(cropType => {
        const buttonId = `${cropType}-seeds-btn`;
        const btn = document.getElementById(buttonId);
        const toolType = getSeedToolType(cropType as any);

        if (btn) {
            const canAfford = CoinSystem.canAfford(gameState, toolType.toUpperCase());
            const isActive = selectedTool === toolType;
            btn.className = `tool-btn ${isActive ? 'active' : ''} ${!canAfford ? 'disabled' : ''}`;
        }
    });
}
