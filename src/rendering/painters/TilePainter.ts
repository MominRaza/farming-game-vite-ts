import { getContext } from '../Canvas';

// Draw basic tile backgrounds with different patterns
export function drawTileBackground(centerX: number, centerY: number, size: number, type: 'grass' | 'dirt' | 'tilled'): void {
    const ctx = getContext();
    if (!ctx) return;

    const halfSize = size / 2;

    switch (type) {
        case 'grass':
            // Draw grass background with green base and darker grass texture
            ctx.fillStyle = '#228b22';
            ctx.fillRect(centerX - halfSize, centerY - halfSize, size, size);

            // Add grass texture
            ctx.fillStyle = '#2e7d2e';
            for (let i = 0; i < 8; i++) {
                const x = centerX - halfSize + (Math.random() * size);
                const y = centerY - halfSize + (Math.random() * size);
                ctx.fillRect(x, y, 1, 3);
            }
            break;

        case 'dirt':
            // Draw dirt background with brown base
            ctx.fillStyle = '#8b4513';
            ctx.fillRect(centerX - halfSize, centerY - halfSize, size, size);

            // Add dirt texture with darker spots
            ctx.fillStyle = '#654321';
            for (let i = 0; i < 6; i++) {
                const x = centerX - halfSize + (Math.random() * size);
                const y = centerY - halfSize + (Math.random() * size);
                ctx.fillRect(x, y, 2, 2);
            }
            break;

        case 'tilled':
            // Draw tilled soil with dark brown base and furrow lines
            ctx.fillStyle = '#654321';
            ctx.fillRect(centerX - halfSize, centerY - halfSize, size, size);

            // Add furrow lines
            ctx.strokeStyle = '#4a2c17';
            ctx.lineWidth = 1;
            for (let i = 0; i < 4; i++) {
                const y = centerY - halfSize + (i * size / 4) + size / 8;
                ctx.beginPath();
                ctx.moveTo(centerX - halfSize, y);
                ctx.lineTo(centerX + halfSize, y);
                ctx.stroke();
            }
            break;
    }
}

// Draw grid lines for tile boundaries
export function drawTileGrid(centerX: number, centerY: number, size: number, alpha: number = 0.3): void {
    const ctx = getContext();
    if (!ctx) return;

    const halfSize = size / 2;

    ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
    ctx.lineWidth = 1;
    ctx.beginPath();

    // Draw tile boundary
    ctx.rect(centerX - halfSize, centerY - halfSize, size, size);
    ctx.stroke();
}

// Draw tile borders with different styles
export function drawTileBorder(centerX: number, centerY: number, size: number, style: 'selected' | 'highlighted' | 'error'): void {
    const ctx = getContext();
    if (!ctx) return;

    const halfSize = size / 2;

    ctx.lineWidth = 2;

    switch (style) {
        case 'selected':
            ctx.strokeStyle = '#00ff00';
            break;
        case 'highlighted':
            ctx.strokeStyle = '#ffff00';
            break;
        case 'error':
            ctx.strokeStyle = '#ff0000';
            break;
    }

    ctx.beginPath();
    ctx.rect(centerX - halfSize, centerY - halfSize, size, size);
    ctx.stroke();
}
