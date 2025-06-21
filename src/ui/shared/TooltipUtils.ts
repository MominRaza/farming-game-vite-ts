// Shared tooltip utilities for consistent tooltip behavior across the game

export interface TooltipOptions {
    id: string;
    content: string;
    mouseX: number;
    mouseY: number;
    maxWidth?: number;
}

// Show a tooltip at the specified position
export function showTooltip(options: TooltipOptions): void {
    // Remove any existing tooltip with the same ID
    removeTooltip(options.id);

    const tooltip = document.createElement('div');
    tooltip.id = options.id;
    tooltip.innerHTML = options.content;

    tooltip.style.cssText = `
        position: fixed;
        left: ${options.mouseX + 10}px;
        top: ${options.mouseY + 10}px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 10px;
        border-radius: 8px;
        font-size: 12px;
        z-index: 1001;
        pointer-events: none;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        max-width: ${options.maxWidth || 200}px;
        line-height: 1.4;
    `;

    document.body.appendChild(tooltip);
}

// Remove a tooltip by ID
export function removeTooltip(id: string): void {
    const existing = document.getElementById(id);
    if (existing) {
        existing.remove();
    }
}

// Remove all tooltips
export function removeAllTooltips(): void {
    const tooltips = document.querySelectorAll('[id$="-tooltip"]');
    tooltips.forEach(tooltip => tooltip.remove());
}
