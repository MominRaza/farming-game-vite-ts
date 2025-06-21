import type { ToolTypeValue } from './ToolTypes';
import { ToolType } from './ToolTypes';
import { removeTooltip } from '../shared/TooltipUtils';

// Current selected tool state
export let selectedTool: ToolTypeValue = ToolType.NONE;

// Set the selected tool (UI update will be handled externally)
export function setSelectedTool(tool: ToolTypeValue): void {
    selectedTool = tool;
    console.log(`Selected tool: ${tool}`);

    // Remove tile tooltips when a tool is selected
    if (tool !== ToolType.NONE) {
        removeTooltip('tile-tooltip');
    }
}

// Get the current selected tool
export function getSelectedTool(): ToolTypeValue {
    return selectedTool;
}
