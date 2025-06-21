// Game configuration constants

// World/Grid settings
export const WORLD_CONFIG = {
    SECTIONS_PER_ROW: 3,
    SECTIONS_PER_COL: 3,
    TILES_PER_SECTION_ROW: 5,
    TILES_PER_SECTION_COL: 5,
    TOTAL_SECTIONS: 9,
    TILES_PER_SECTION: 25,
    WORLD_TILES_WIDTH: 15,
    WORLD_TILES_HEIGHT: 15
} as const;

// Rendering settings
export const RENDER_CONFIG = {
    DEFAULT_TILE_SIZE: 40,
    MIN_SCALE: 0.1,
    MAX_SCALE: 3.0,
    ZOOM_SENSITIVITY: 0.001,
    SECTION_BORDER_WIDTH: 3,
    SECTION_BORDER_COLOR: '#333333'
} as const;

// Input settings
export const INPUT_CONFIG = {
    DOUBLE_CLICK_THRESHOLD: 300, // milliseconds
    TOUCH_SENSITIVITY: 1.0,
    MOUSE_SENSITIVITY: 1.0
} as const;

// Performance settings
export const PERFORMANCE_CONFIG = {
    MAX_FPS: 60,
    RENDER_THROTTLE_MS: 16 // ~60fps
} as const;
