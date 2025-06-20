let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

// Initialize canvas
export function initCanvas(): void {
    canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }

    ctx = canvas.getContext('2d')!;
    if (!ctx) {
        console.error('Could not get canvas context!');
        return;
    }

    // Set canvas size to viewport size
    resizeCanvas();

    // Listen for window resize
    window.addEventListener('resize', resizeCanvas);

    // Enable image smoothing for better scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Start the render loop will be called from RenderLoop
}

function resizeCanvas(): void {
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Trigger redraw after resize
    triggerRedraw();
}

export function getCanvas(): HTMLCanvasElement {
    return canvas;
}

export function getContext(): CanvasRenderingContext2D {
    return ctx;
}

let needsRedraw = true;

export function triggerRedraw(): void {
    needsRedraw = true;
}

export function shouldRedraw(): boolean {
    return needsRedraw;
}

export function setRedrawComplete(): void {
    needsRedraw = false;
}
