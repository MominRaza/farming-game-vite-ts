import * as TileSystem from './tiles/TileSystem';
import { gameState } from './GameState';

// Tool types that players can use
export const ToolType = {
    GRASS: 'grass',
    DIRT: 'dirt',
    ROAD: 'road'
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
            break;
    }
}

// Show visual feedback when a tool is applied
function showToolFeedback(x: number, y: number, emoji: string): void {
    // This is a simple console feedback for now
    // In the future, this could show visual effects on the canvas
    console.log(`${emoji} Applied at tile (${x}, ${y})`);
}

// Update tool button styles to show which is selected
function updateToolButtons(): void {
    const grassBtn = document.getElementById('grass-tool-btn');
    const dirtBtn = document.getElementById('dirt-tool-btn');
    const roadBtn = document.getElementById('road-tool-btn');

    if (grassBtn) {
        grassBtn.className = selectedTool === ToolType.GRASS ? 'tool-btn active' : 'tool-btn';
    }
    if (dirtBtn) {
        dirtBtn.className = selectedTool === ToolType.DIRT ? 'tool-btn active' : 'tool-btn';
    }
    if (roadBtn) {
        roadBtn.className = selectedTool === ToolType.ROAD ? 'tool-btn active' : 'tool-btn';
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
        z-index: 100;        display: flex;
        gap: 10px;
        align-items: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        border: 2px solid rgba(255, 255, 255, 0.1);
    `; toolsDiv.innerHTML = `
        <div style="margin-right: 15px; font-weight: bold; color: #ffd700;">🛠️ Tools:</div>
        <button id="grass-tool-btn" class="tool-btn active" title="Grass Tool - Revert tiles back to grass (Press G or 3)">
            🌱 Grass <span style="font-size: 10px; opacity: 0.7;">(G)</span>
        </button>
        <button id="dirt-tool-btn" class="tool-btn" title="Dirt Tool - Create farmable land where you can grow crops (Press 1 or D)">
            🟫 Dirt <span style="font-size: 10px; opacity: 0.7;">(1)</span>
        </button>
        <button id="road-tool-btn" class="tool-btn" title="Road Tool - Build paths connecting your home to the farm (Press 2 or R)">
            🛤️ Road <span style="font-size: 10px; opacity: 0.7;">(2)</span>
        </button>
        <div style="margin-left: 15px; font-size: 11px; color: #ccc;">
            Click tiles to apply selected tool
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

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'g' || e.key === '3') {
            setSelectedTool(ToolType.GRASS);
        } else if (e.key === '1' || e.key.toLowerCase() === 'd') {
            setSelectedTool(ToolType.DIRT);
        } else if (e.key === '2' || e.key.toLowerCase() === 'r') {
            setSelectedTool(ToolType.ROAD);
        }
    });

    console.log('Tools UI initialized');
}
