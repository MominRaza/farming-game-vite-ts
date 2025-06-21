import { getContext } from '../Canvas';
import { getSeedColor } from '../../config/SeedConfig';
import { CropType } from '../../tiles/systems/TileTypes';

// Generic function to draw crop patterns using centralized colors
function drawCropWithColors(centerX: number, centerY: number, size: number, stage: 'seeds' | 'growing' | 'mature', cropType: string, drawFunction: (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, size: number, color: string) => void): void {
    const ctx = getContext();
    if (!ctx) return;

    const stageKey = stage === 'seeds' ? 'seed' : stage;
    const color = getSeedColor(cropType as any, stageKey as any);
    drawFunction(ctx, centerX, centerY, size, color);
}

// Draw carrot crop patterns for all growth stages
export function drawCarrotCrop(centerX: number, centerY: number, size: number, stage: 'seeds' | 'growing' | 'mature'): void {
    drawCropWithColors(centerX, centerY, size, stage, CropType.CARROT, (ctx, centerX, centerY, size, color) => {
        const radius = Math.max(2, size / 16);

        switch (stage) {
            case 'seeds':
                // Draw small orange dots for carrot seeds
                ctx.fillStyle = color;
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
                ctx.fillStyle = color;
                for (let i = 0; i < 4; i++) {
                    const offsetX = (i - 1.5) * size / 8;
                    const offsetY = -size / 6;
                    ctx.fillRect(centerX + offsetX - 1, centerY + offsetY, 2, size / 4);
                }
                break;

            case 'mature':
                // Draw full carrot with green top
                ctx.fillStyle = color;
                ctx.fillRect(centerX - size / 8, centerY, size / 4, size / 6);
                ctx.fillStyle = getSeedColor(CropType.CARROT, 'growing'); // Use growing color for leaves
                for (let i = 0; i < 3; i++) {
                    const offsetX = (i - 1) * size / 12;
                    ctx.fillRect(centerX + offsetX - 1, centerY - size / 6, 2, size / 4);
                }
                break;
        }
    });
}

// Draw wheat crop patterns for all growth stages
export function drawWheatCrop(centerX: number, centerY: number, size: number, stage: 'seeds' | 'growing' | 'mature'): void {
    drawCropWithColors(centerX, centerY, size, stage, CropType.WHEAT, (ctx, centerX, centerY, size, color) => {
        const radius = Math.max(2, size / 16);

        switch (stage) {
            case 'seeds':
                // Draw small golden dots for wheat seeds
                ctx.fillStyle = color;
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
                ctx.fillStyle = color;
                for (let i = 0; i < 6; i++) {
                    const offsetX = (i - 2.5) * size / 10;
                    ctx.fillRect(centerX + offsetX - 1, centerY - size / 4, 2, size / 2);
                }
                break;

            case 'mature':
                // Draw mature wheat with grain heads
                ctx.fillStyle = color;
                for (let i = 0; i < 5; i++) {
                    const offsetX = (i - 2) * size / 8;
                    ctx.fillRect(centerX + offsetX - 1, centerY - size / 3, 2, size / 2);
                    // Grain head
                    ctx.fillStyle = getSeedColor(CropType.WHEAT, 'seed'); // Use seed color for grain
                    ctx.fillRect(centerX + offsetX - 2, centerY - size / 3, 4, size / 8);
                    ctx.fillStyle = color;
                }
                break;
        }
    });
}

// Draw tomato crop patterns for all growth stages
export function drawTomatoCrop(centerX: number, centerY: number, size: number, stage: 'seeds' | 'growing' | 'mature'): void {
    drawCropWithColors(centerX, centerY, size, stage, CropType.TOMATO, (ctx, centerX, centerY, size, color) => {
        const radius = Math.max(2, size / 16);

        switch (stage) {
            case 'seeds':
                // Draw small red dots for tomato seeds
                ctx.fillStyle = color;
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
                ctx.fillStyle = color;
                // Stem
                ctx.fillRect(centerX - 1, centerY - size / 4, 2, size / 2);
                // Small green tomatoes (use growing color)
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
                ctx.fillStyle = getSeedColor(CropType.TOMATO, 'growing'); // Use growing color for stem
                // Stem
                ctx.fillRect(centerX - 1, centerY - size / 4, 2, size / 2);
                // Ripe red tomatoes
                ctx.fillStyle = color;
                for (let i = 0; i < 3; i++) {
                    const offsetX = (i - 1) * size / 6;
                    const offsetY = -size / 8;
                    ctx.beginPath();
                    ctx.arc(centerX + offsetX, centerY + offsetY, radius * 2, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
        }
    });
}

// Draw corn crop patterns for all growth stages
export function drawCornCrop(centerX: number, centerY: number, size: number, stage: 'seeds' | 'growing' | 'mature'): void {
    drawCropWithColors(centerX, centerY, size, stage, CropType.CORN, (ctx, centerX, centerY, size, color) => {
        const radius = Math.max(2, size / 16);

        switch (stage) {
            case 'seeds':
                // Draw small golden kernels for corn seeds
                ctx.fillStyle = color;
                for (let i = 0; i < 5; i++) {
                    const angle = (i / 5) * Math.PI * 2;
                    const offsetX = Math.cos(angle) * size / 10;
                    const offsetY = Math.sin(angle) * size / 10;
                    ctx.beginPath();
                    ctx.arc(centerX + offsetX, centerY + offsetY, radius * 1.2, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;

            case 'growing':
                // Draw tall green corn stalks
                ctx.fillStyle = color;
                for (let i = 0; i < 3; i++) {
                    const offsetX = (i - 1) * size / 6;
                    ctx.fillRect(centerX + offsetX - 2, centerY - size / 3, 4, size / 1.5);
                }
                break;

            case 'mature':
                // Draw mature corn with golden cobs
                ctx.fillStyle = getSeedColor(CropType.CORN, 'growing'); // Green stalks
                for (let i = 0; i < 2; i++) {
                    const offsetX = (i - 0.5) * size / 4;
                    ctx.fillRect(centerX + offsetX - 2, centerY - size / 3, 4, size / 1.5);
                }

                // Golden corn cobs
                ctx.fillStyle = color;
                for (let i = 0; i < 2; i++) {
                    const offsetX = (i - 0.5) * size / 4;
                    const offsetY = -size / 8;
                    ctx.fillRect(centerX + offsetX - 3, centerY + offsetY, 6, size / 4);
                }
                break;
        }
    });
}
