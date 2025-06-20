import { ToolType } from './ToolTypes';
import { setSelectedTool, getSelectedTool } from './ToolState';

// Update tool button styles to show which is selected
export function updateToolButtons(): void {
    const grassBtn = document.getElementById('grass-tool-btn');
    const dirtBtn = document.getElementById('dirt-tool-btn');
    const roadBtn = document.getElementById('road-tool-btn');
    const carrotBtn = document.getElementById('carrot-seeds-btn');
    const wheatBtn = document.getElementById('wheat-seeds-btn');
    const tomatoBtn = document.getElementById('tomato-seeds-btn');

    const selectedTool = getSelectedTool();

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
        }
    `;
    document.head.appendChild(style);

    // Add event listeners for tool selection
    setupToolEventListeners();
    setupKeyboardShortcuts();

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

    if (grassBtn) {
        grassBtn.addEventListener('click', () => {
            setSelectedTool(ToolType.GRASS);
            updateToolButtons();
        });
    }

    if (dirtBtn) {
        dirtBtn.addEventListener('click', () => {
            setSelectedTool(ToolType.DIRT);
            updateToolButtons();
        });
    }

    if (roadBtn) {
        roadBtn.addEventListener('click', () => {
            setSelectedTool(ToolType.ROAD);
            updateToolButtons();
        });
    }

    if (carrotBtn) {
        carrotBtn.addEventListener('click', () => {
            setSelectedTool(ToolType.CARROT_SEEDS);
            updateToolButtons();
        });
    }

    if (wheatBtn) {
        wheatBtn.addEventListener('click', () => {
            setSelectedTool(ToolType.WHEAT_SEEDS);
            updateToolButtons();
        });
    }

    if (tomatoBtn) {
        tomatoBtn.addEventListener('click', () => {
            setSelectedTool(ToolType.TOMATO_SEEDS);
            updateToolButtons();
        });
    }
}

// Setup keyboard shortcuts
function setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', (e) => {
        switch (e.key.toLowerCase()) {
            case 'g':
                setSelectedTool(ToolType.GRASS);
                updateToolButtons();
                break;
            case 'd':
                setSelectedTool(ToolType.DIRT);
                updateToolButtons();
                break;
            case 'r':
                setSelectedTool(ToolType.ROAD);
                updateToolButtons();
                break;
            case 'c':
                setSelectedTool(ToolType.CARROT_SEEDS);
                updateToolButtons();
                break;
            case 'w':
                setSelectedTool(ToolType.WHEAT_SEEDS);
                updateToolButtons();
                break;
            case 't':
                setSelectedTool(ToolType.TOMATO_SEEDS);
                updateToolButtons();
                break;
        }
    });
}
