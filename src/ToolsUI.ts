import * as TileSystem from './tiles';
import { gameState } from './GameState';

// Tool types that players can use
export const ToolType = {
    GRASS: 'grass',
    DIRT: 'dirt',
    ROAD: 'road',
    CARROT_SEEDS: 'carrot_seeds',
    WHEAT_SEEDS: 'wheat_seeds',
    TOMATO_SEEDS: 'tomato_seeds'
} as const;

export type ToolTypeValue = typeof ToolType[keyof typeof ToolType];

// Current selected tool state
export let selectedTool: ToolTypeValue = ToolType.GRASS;

// Set the selected tool
export function setSelectedTool(tool: ToolTypeValue): void {
    selectedTool = tool;
    updateToolButtons();
    console.log(`Selected tool: ${tool}`);
}

// Get the current selected tool
export function getSelectedTool(): ToolTypeValue {
    return selectedTool;
}

// Apply the selected tool to a tile
export function applyToolToTile(x: number, y: number): void {
    // Check if the tile is accessible (not in a locked section)
    if (!TileSystem.isTileAccessible(gameState.grid, x, y)) {
        console.log(`Cannot interact with locked section at tile ${x}, ${y}`);
        return;
    }

    const tile = TileSystem.getTile(gameState.grid, x, y);
    if (!tile) return;

    // Don't modify home tiles
    if (tile.type === TileSystem.TileType.HOME) {
        console.log('Cannot modify home tiles!');
        return;
    }    // Apply the selected tool
    switch (selectedTool) {
        case ToolType.GRASS:
            if (tile.type !== TileSystem.TileType.GRASS) {
                TileSystem.setTile(gameState.grid, x, y, TileSystem.TileType.GRASS);
                console.log(`Applied grass at ${x}, ${y}`);
                showToolFeedback(x, y, '🌱');
            }
            break;
        case ToolType.DIRT:
            if (tile.type !== TileSystem.TileType.DIRT) {
                TileSystem.setTile(gameState.grid, x, y, TileSystem.TileType.DIRT);
                console.log(`Applied dirt at ${x}, ${y}`);
                showToolFeedback(x, y, '🟫');
            }
            break;
        case ToolType.ROAD:
            if (tile.type !== TileSystem.TileType.ROAD) {
                TileSystem.setTile(gameState.grid, x, y, TileSystem.TileType.ROAD);
                console.log(`Applied road at ${x}, ${y}`);
                showToolFeedback(x, y, '🛤️');
            }
            break; case ToolType.CARROT_SEEDS:
            if (tile.type === TileSystem.TileType.DIRT) {
                TileSystem.plantSeed(gameState.grid, x, y, TileSystem.TileType.CARROT_SEEDS);
                console.log(`Planted carrot seeds at ${x}, ${y}`);
                showToolFeedback(x, y, '🥕');
            } else {
                console.log(`Carrot seeds can only be planted on dirt! Tile at ${x}, ${y} is ${tile.type}`);
                showErrorMessage('Carrot seeds can only be planted on dirt tiles!');
            }
            break;
        case ToolType.WHEAT_SEEDS:
            if (tile.type === TileSystem.TileType.DIRT) {
                TileSystem.plantSeed(gameState.grid, x, y, TileSystem.TileType.WHEAT_SEEDS);
                console.log(`Planted wheat seeds at ${x}, ${y}`);
                showToolFeedback(x, y, '🌾');
            } else {
                console.log(`Wheat seeds can only be planted on dirt! Tile at ${x}, ${y} is ${tile.type}`);
                showErrorMessage('Wheat seeds can only be planted on dirt tiles!');
            }
            break;
        case ToolType.TOMATO_SEEDS:
            if (tile.type === TileSystem.TileType.DIRT) {
                TileSystem.plantSeed(gameState.grid, x, y, TileSystem.TileType.TOMATO_SEEDS);
                console.log(`Planted tomato seeds at ${x}, ${y}`);
                showToolFeedback(x, y, '🍅');
            } else {
                console.log(`Tomato seeds can only be planted on dirt! Tile at ${x}, ${y} is ${tile.type}`);
                showErrorMessage('Tomato seeds can only be planted on dirt tiles!');
            }
            break;
    }
}

// Show visual feedback when a tool is applied
function showToolFeedback(x: number, y: number, emoji: string): void {
    // This is a simple console feedback for now
    // In the future, this could show visual effects on the canvas
    console.log(`${emoji} Applied at tile (${x}, ${y})`);
}

// Show error message when tool cannot be applied
function showErrorMessage(message: string): void {
    // Create a temporary error message element
    const errorDiv = document.createElement('div');
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        position: fixed;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 69, 0, 0.9);
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: bold;
        z-index: 1000;
        pointer-events: none;
        animation: errorFadeInOut 2s ease-in-out;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;

    // Add animation CSS if not already present
    if (!document.querySelector('#error-animation-style')) {
        const style = document.createElement('style');
        style.id = 'error-animation-style';
        style.textContent = `
            @keyframes errorFadeInOut {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(errorDiv);

    // Remove message after animation
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 2000);
}

// Update tool button styles to show which is selected
function updateToolButtons(): void {
    const grassBtn = document.getElementById('grass-tool-btn');
    const dirtBtn = document.getElementById('dirt-tool-btn');
    const roadBtn = document.getElementById('road-tool-btn');
    const carrotBtn = document.getElementById('carrot-seeds-btn');
    const wheatBtn = document.getElementById('wheat-seeds-btn');
    const tomatoBtn = document.getElementById('tomato-seeds-btn');

    if (grassBtn) {
        grassBtn.className = selectedTool === ToolType.GRASS ? 'tool-btn active' : 'tool-btn';
    }
    if (dirtBtn) {
        dirtBtn.className = selectedTool === ToolType.DIRT ? 'tool-btn active' : 'tool-btn';
    }
    if (roadBtn) {
        roadBtn.className = selectedTool === ToolType.ROAD ? 'tool-btn active' : 'tool-btn';
    }
    if (carrotBtn) {
        carrotBtn.className = selectedTool === ToolType.CARROT_SEEDS ? 'tool-btn active' : 'tool-btn';
    }
    if (wheatBtn) {
        wheatBtn.className = selectedTool === ToolType.WHEAT_SEEDS ? 'tool-btn active' : 'tool-btn';
    }
    if (tomatoBtn) {
        tomatoBtn.className = selectedTool === ToolType.TOMATO_SEEDS ? 'tool-btn active' : 'tool-btn';
    }
}

// Setup the tools UI
export function setupToolsUI(): void {
    const uiContainer = document.getElementById('ui-container');
    if (!uiContainer) return;

    const toolsDiv = document.createElement('div');
    toolsDiv.className = 'tools-panel'; toolsDiv.style.cssText = `
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
    `;

    toolsDiv.innerHTML = `
        <div style="font-weight: bold; color: #ffd700; margin-bottom: 5px;">🛠️ Tools</div>
        <div style="display: flex; gap: 8px; align-items: center;">
            <div style="font-size: 12px; color: #aaa;">Basic:</div>
            <button id="grass-tool-btn" class="tool-btn active" title="Grass Tool - Revert tiles back to grass (Press G)">
                🌱 <span style="font-size: 10px; opacity: 0.7;">(G)</span>
            </button>
            <button id="dirt-tool-btn" class="tool-btn" title="Dirt Tool - Create farmable land (Press D)">
                🟫 <span style="font-size: 10px; opacity: 0.7;">(D)</span>
            </button>
            <button id="road-tool-btn" class="tool-btn" title="Road Tool - Build paths (Press R)">
                🛤️ <span style="font-size: 10px; opacity: 0.7;">(R)</span>
            </button>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
            <div style="font-size: 12px; color: #aaa;">Seeds:</div>
            <button id="carrot-seeds-btn" class="tool-btn" title="Carrot Seeds - Plant on dirt (Press C)">
                🥕 <span style="font-size: 10px; opacity: 0.7;">(C)</span>
            </button>
            <button id="wheat-seeds-btn" class="tool-btn" title="Wheat Seeds - Plant on dirt (Press W)">
                🌾 <span style="font-size: 10px; opacity: 0.7;">(W)</span>
            </button>
            <button id="tomato-seeds-btn" class="tool-btn" title="Tomato Seeds - Plant on dirt (Press T)">
                🍅 <span style="font-size: 10px; opacity: 0.7;">(T)</span>
            </button>
        </div>
        <div style="font-size: 11px; color: #ccc; text-align: center;">
            Seeds can only be planted on dirt tiles
        </div>
    `;

    uiContainer.appendChild(toolsDiv);    // Add CSS for tool buttons
    const style = document.createElement('style');
    style.textContent = `        .tool-btn {
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
        }
    `;
    document.head.appendChild(style);    // Add event listeners for tool selection
    const grassBtn = document.getElementById('grass-tool-btn');
    const dirtBtn = document.getElementById('dirt-tool-btn');
    const roadBtn = document.getElementById('road-tool-btn');
    const carrotBtn = document.getElementById('carrot-seeds-btn');
    const wheatBtn = document.getElementById('wheat-seeds-btn');
    const tomatoBtn = document.getElementById('tomato-seeds-btn');

    if (grassBtn) {
        grassBtn.addEventListener('click', () => {
            setSelectedTool(ToolType.GRASS);
        });
    }

    if (dirtBtn) {
        dirtBtn.addEventListener('click', () => {
            setSelectedTool(ToolType.DIRT);
        });
    }

    if (roadBtn) {
        roadBtn.addEventListener('click', () => {
            setSelectedTool(ToolType.ROAD);
        });
    }

    if (carrotBtn) {
        carrotBtn.addEventListener('click', () => {
            setSelectedTool(ToolType.CARROT_SEEDS);
        });
    }

    if (wheatBtn) {
        wheatBtn.addEventListener('click', () => {
            setSelectedTool(ToolType.WHEAT_SEEDS);
        });
    }

    if (tomatoBtn) {
        tomatoBtn.addEventListener('click', () => {
            setSelectedTool(ToolType.TOMATO_SEEDS);
        });
    }

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'g') {
            setSelectedTool(ToolType.GRASS);
        } else if (e.key.toLowerCase() === 'd') {
            setSelectedTool(ToolType.DIRT);
        } else if (e.key.toLowerCase() === 'r') {
            setSelectedTool(ToolType.ROAD);
        } else if (e.key.toLowerCase() === 'c') {
            setSelectedTool(ToolType.CARROT_SEEDS);
        } else if (e.key.toLowerCase() === 'w') {
            setSelectedTool(ToolType.WHEAT_SEEDS);
        } else if (e.key.toLowerCase() === 't') {
            setSelectedTool(ToolType.TOMATO_SEEDS);
        }
    });

    console.log('Tools UI initialized');
}
