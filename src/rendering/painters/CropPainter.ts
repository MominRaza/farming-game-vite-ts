import { getContext } from '../Canvas';

// Draw carrot crop patterns for all growth stages
export function drawCarrotCrop(centerX: number, centerY: number, size: number, stage: 'seeds' | 'growing' | 'mature'): void {
    const ctx = getContext();
    if (!ctx) return;

    const radius = Math.max(2, size / 16);

    switch (stage) {
        case 'seeds':
            // Draw small orange dots for carrot seeds
            ctx.fillStyle = '#ff8c00';
            for (let i = 0; i < 3; i++) {
                const offsetX = (i - 1) * size / 6;
                const offsetY = (Math.random() - 0.5) * size / 6;
                ctx.beginPath();
                ctx.arc(centerX + offsetX, centerY + offsetY, radius, 0, Math.PI * 2);
                ctx.fill();
            }
            break;

        case 'growing':
            // Draw small green sprouts for growing carrots
            ctx.fillStyle = '#32cd32';
            for (let i = 0; i < 4; i++) {
                const offsetX = (i - 1.5) * size / 8;
                const offsetY = -size / 6;
                ctx.fillRect(centerX + offsetX - 1, centerY + offsetY, 2, size / 4);
            }
            break;

        case 'mature':
            // Draw full carrot with green top
            ctx.fillStyle = '#ff6347';
            ctx.fillRect(centerX - size / 8, centerY, size / 4, size / 6);
            ctx.fillStyle = '#32cd32';
            for (let i = 0; i < 3; i++) {
                const offsetX = (i - 1) * size / 12;
                ctx.fillRect(centerX + offsetX - 1, centerY - size / 6, 2, size / 4);
            }
            break;
    }
}

// Draw wheat crop patterns for all growth stages
export function drawWheatCrop(centerX: number, centerY: number, size: number, stage: 'seeds' | 'growing' | 'mature'): void {
    const ctx = getContext();
    if (!ctx) return;

    const radius = Math.max(2, size / 16);

    switch (stage) {
        case 'seeds':
            // Draw small golden dots for wheat seeds
            ctx.fillStyle = '#ffd700';
            for (let i = 0; i < 4; i++) {
                const angle = (i / 4) * Math.PI * 2;
                const offsetX = Math.cos(angle) * size / 8;
                const offsetY = Math.sin(angle) * size / 8;
                ctx.beginPath();
                ctx.arc(centerX + offsetX, centerY + offsetY, radius, 0, Math.PI * 2);
                ctx.fill();
            }
            break;

        case 'growing':
            // Draw growing wheat stalks
            ctx.fillStyle = '#9acd32';
            for (let i = 0; i < 6; i++) {
                const offsetX = (i - 2.5) * size / 10;
                ctx.fillRect(centerX + offsetX - 1, centerY - size / 4, 2, size / 2);
            }
            break;

        case 'mature':
            // Draw mature wheat with grain heads
            ctx.fillStyle = '#daa520';
            for (let i = 0; i < 5; i++) {
                const offsetX = (i - 2) * size / 8;
                ctx.fillRect(centerX + offsetX - 1, centerY - size / 3, 2, size / 2);
                // Grain head
                ctx.fillStyle = '#ffd700';
                ctx.fillRect(centerX + offsetX - 2, centerY - size / 3, 4, size / 8);
                ctx.fillStyle = '#daa520';
            }
            break;
    }
}

// Draw tomato crop patterns for all growth stages
export function drawTomatoCrop(centerX: number, centerY: number, size: number, stage: 'seeds' | 'growing' | 'mature'): void {
    const ctx = getContext();
    if (!ctx) return;

    const radius = Math.max(2, size / 16);

    switch (stage) {
        case 'seeds':
            // Draw small red dots for tomato seeds
            ctx.fillStyle = '#dc143c';
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 2; j++) {
                    const offsetX = (i - 0.5) * size / 4;
                    const offsetY = (j - 0.5) * size / 4;
                    ctx.beginPath();
                    ctx.arc(centerX + offsetX, centerY + offsetY, radius * 1.2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            break;

        case 'growing':
            // Draw tomato plant with small green fruits
            ctx.fillStyle = '#228b22';
            // Stem
            ctx.fillRect(centerX - 1, centerY - size / 4, 2, size / 2);
            // Small green tomatoes
            ctx.fillStyle = '#32cd32';
            for (let i = 0; i < 3; i++) {
                const offsetX = (i - 1) * size / 6;
                const offsetY = -size / 8;
                ctx.beginPath();
                ctx.arc(centerX + offsetX, centerY + offsetY, radius * 1.5, 0, Math.PI * 2);
                ctx.fill();
            }
            break;

        case 'mature':
            // Draw tomato plant with ripe red tomatoes
            ctx.fillStyle = '#228b22';
            // Stem
            ctx.fillRect(centerX - 1, centerY - size / 4, 2, size / 2);
            // Ripe red tomatoes
            ctx.fillStyle = '#ff4444';
            for (let i = 0; i < 3; i++) {
                const offsetX = (i - 1) * size / 6;
                const offsetY = -size / 8;
                ctx.beginPath();
                ctx.arc(centerX + offsetX, centerY + offsetY, radius * 2, 0, Math.PI * 2);
                ctx.fill();
            }
            break;
    }
}
