// Common type definitions used throughout the application

// Position/Coordinate types
export interface Point {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

export interface Rectangle extends Point, Size { }

// Event types
export interface MousePosition extends Point { }

export interface TouchPosition extends Point { }

// UI-related types
export interface UIState {
    isVisible: boolean;
    isEnabled: boolean;
}

export interface ButtonState extends UIState {
    isPressed: boolean;
    isHovered: boolean;
}

// Generic callback types
export type VoidCallback = () => void;
export type ParameterCallback<T> = (param: T) => void;
export type EventCallback<T extends Event = Event> = (event: T) => void;

// Utility types
export type Optional<T> = T | undefined;
export type Nullable<T> = T | null;
export type Maybe<T> = T | null | undefined;
