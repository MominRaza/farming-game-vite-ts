import { ToolType } from './ToolTypes';
import { setSelectedTool, getSelectedTool } from './ToolState';
import { SaveLoadService } from '../../services';
import { gameState, loadGameState } from '../../GameState';
import { render } from '../../rendering';
import { updateCoinDisplay } from '../coin';
import * as CoinSystem from '../../systems/CoinSystem';

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
    `; toolsDiv.innerHTML = `
        <div style="font-weight: bold; color: #ffd700; margin-bottom: 5px;">🛠️ Tools</div>
        <div style="display: flex; gap: 8px; align-items: center;">
            <div style="font-size: 12px; color: #aaa;">Basic:</div>
            <button id="grass-tool-btn" class="tool-btn active" title="Grass Tool - Revert tiles back to grass (Press G) - Cost: ${CoinSystem.getToolCost('GRASS')} coins">
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
            <button id="carrot-seeds-btn" class="tool-btn" title="Carrot Seeds - Plant on dirt (Press C) - Cost: ${CoinSystem.getToolCost('CARROT_SEEDS')} coins">
                🥕 <span style="font-size: 9px; opacity: 0.7;">(C) ${CoinSystem.getToolCost('CARROT_SEEDS')}💰</span>
            </button>
            <button id="wheat-seeds-btn" class="tool-btn" title="Wheat Seeds - Plant on dirt (Press W) - Cost: ${CoinSystem.getToolCost('WHEAT_SEEDS')} coins">  
                🌾 <span style="font-size: 9px; opacity: 0.7;">(W) ${CoinSystem.getToolCost('WHEAT_SEEDS')}💰</span>
            </button>
            <button id="tomato-seeds-btn" class="tool-btn" title="Tomato Seeds - Plant on dirt (Press T) - Cost: ${CoinSystem.getToolCost('TOMATO_SEEDS')} coins">
                🍅 <span style="font-size: 9px; opacity: 0.7;">(T) ${CoinSystem.getToolCost('TOMATO_SEEDS')}💰</span>
            </button>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
            <div style="font-size: 12px; color: #aaa;">Harvest:</div>
            <button id="harvest-tool-btn" class="tool-btn" title="Harvest Tool - Harvest mature crops (Press H) - FREE!">
                🌾✨ <span style="font-size: 9px; opacity: 0.7;">(H) FREE</span>
            </button>
        </div>
        <div style="font-size: 11px; color: #ccc; text-align: center;">
            All tools cost coins except harvesting<br>
            Seeds can only be planted on dirt tiles<br>
            <span style="color: #ffd700;">💾 Ctrl+S: Save | 📁 Ctrl+L: Load</span>
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
    const carrotBtn = document.getElementById('carrot-seeds-btn');
    const wheatBtn = document.getElementById('wheat-seeds-btn');
    const tomatoBtn = document.getElementById('tomato-seeds-btn');
    const harvestBtn = document.getElementById('harvest-tool-btn'); if (grassBtn) {
        grassBtn.addEventListener('click', () => {
            setSelectedTool(ToolType.GRASS);
            updateToolButtonStates();
        });
    }

    if (dirtBtn) {
        dirtBtn.addEventListener('click', () => {
            setSelectedTool(ToolType.DIRT);
            updateToolButtonStates();
        });
    }

    if (roadBtn) {
        roadBtn.addEventListener('click', () => {
            setSelectedTool(ToolType.ROAD);
            updateToolButtonStates();
        });
    }

    if (carrotBtn) {
        carrotBtn.addEventListener('click', () => {
            setSelectedTool(ToolType.CARROT_SEEDS);
            updateToolButtonStates();
        });
    }

    if (wheatBtn) {
        wheatBtn.addEventListener('click', () => {
            setSelectedTool(ToolType.WHEAT_SEEDS);
            updateToolButtonStates();
        });
    }

    if (tomatoBtn) {
        tomatoBtn.addEventListener('click', () => {
            setSelectedTool(ToolType.TOMATO_SEEDS);
            updateToolButtonStates();
        });
    }

    if (harvestBtn) {
        harvestBtn.addEventListener('click', () => {
            setSelectedTool(ToolType.HARVEST);
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
            switch (e.key.toLowerCase()) {
                case 'g':
                    setSelectedTool(ToolType.GRASS);
                    updateToolButtonStates();
                    break;
                case 'd':
                    setSelectedTool(ToolType.DIRT);
                    updateToolButtonStates();
                    break;
                case 'r':
                    setSelectedTool(ToolType.ROAD);
                    updateToolButtonStates();
                    break;
                case 'c':
                    setSelectedTool(ToolType.CARROT_SEEDS);
                    updateToolButtonStates();
                    break;
                case 'w':
                    setSelectedTool(ToolType.WHEAT_SEEDS);
                    updateToolButtonStates();
                    break;
                case 't':
                    setSelectedTool(ToolType.TOMATO_SEEDS);
                    updateToolButtonStates();
                    break;
                case 'h':
                    setSelectedTool(ToolType.HARVEST);
                    updateToolButtonStates();
                    break;
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
    const grassBtn = document.getElementById('grass-tool-btn');
    const dirtBtn = document.getElementById('dirt-tool-btn');
    const roadBtn = document.getElementById('road-tool-btn');
    const carrotBtn = document.getElementById('carrot-seeds-btn');
    const wheatBtn = document.getElementById('wheat-seeds-btn');
    const tomatoBtn = document.getElementById('tomato-seeds-btn');
    const harvestBtn = document.getElementById('harvest-tool-btn');

    const selectedTool = getSelectedTool();

    // Check affordability and update button states
    const canAffordGrass = CoinSystem.canAfford(gameState, 'GRASS');
    const canAffordDirt = CoinSystem.canAfford(gameState, 'DIRT');
    const canAffordRoad = CoinSystem.canAfford(gameState, 'ROAD');
    const canAffordCarrot = CoinSystem.canAfford(gameState, 'CARROT_SEEDS');
    const canAffordWheat = CoinSystem.canAfford(gameState, 'WHEAT_SEEDS');
    const canAffordTomato = CoinSystem.canAfford(gameState, 'TOMATO_SEEDS');

    if (grassBtn) {
        grassBtn.className = `tool-btn ${selectedTool === ToolType.GRASS ? 'active' : ''} ${!canAffordGrass ? 'disabled' : ''}`;
    }
    if (dirtBtn) {
        dirtBtn.className = `tool-btn ${selectedTool === ToolType.DIRT ? 'active' : ''} ${!canAffordDirt ? 'disabled' : ''}`;
    }
    if (roadBtn) {
        roadBtn.className = `tool-btn ${selectedTool === ToolType.ROAD ? 'active' : ''} ${!canAffordRoad ? 'disabled' : ''}`;
    }
    if (carrotBtn) {
        carrotBtn.className = `tool-btn ${selectedTool === ToolType.CARROT_SEEDS ? 'active' : ''} ${!canAffordCarrot ? 'disabled' : ''}`;
    }
    if (wheatBtn) {
        wheatBtn.className = `tool-btn ${selectedTool === ToolType.WHEAT_SEEDS ? 'active' : ''} ${!canAffordWheat ? 'disabled' : ''}`;
    }
    if (tomatoBtn) {
        tomatoBtn.className = `tool-btn ${selectedTool === ToolType.TOMATO_SEEDS ? 'active' : ''} ${!canAffordTomato ? 'disabled' : ''}`;
    }
    if (harvestBtn) {
        harvestBtn.className = selectedTool === ToolType.HARVEST ? 'tool-btn active' : 'tool-btn';
    }
}
