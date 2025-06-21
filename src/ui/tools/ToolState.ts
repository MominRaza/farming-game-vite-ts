import type { ToolTypeValue } from './ToolTypes';
import { ToolType } from './ToolTypes';

// Current selected tool state
export let selectedTool: ToolTypeValue = ToolType.NONE;

// Set the selected tool (UI update will be handled externally)
export function setSelectedTool(tool: ToolTypeValue): void {
    selectedTool = tool;
    console.log(`Selected tool: ${tool}`);
}

// Get the current selected tool
export function getSelectedTool(): ToolTypeValue {
    return selectedTool;
}
