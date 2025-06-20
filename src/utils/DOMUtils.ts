// DOM utility functions

/**
 * Create a DOM element with specified attributes and styles
 */
export function createElement(
    tag: string,
    options: {
        id?: string;
        className?: string;
        innerHTML?: string;
        textContent?: string;
        styles?: Partial<CSSStyleDeclaration>;
        attributes?: Record<string, string>;
    } = {}
): HTMLElement {
    const element = document.createElement(tag);

    if (options.id) element.id = options.id;
    if (options.className) element.className = options.className;
    if (options.innerHTML) element.innerHTML = options.innerHTML;
    if (options.textContent) element.textContent = options.textContent;

    if (options.styles) {
        Object.assign(element.style, options.styles);
    }

    if (options.attributes) {
        Object.entries(options.attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    }

    return element;
}

/**
 * Add event listener with automatic cleanup
 */
export function addEventListenerWithCleanup(
    element: Element | Window | Document,
    event: string,
    handler: EventListener,
    options?: boolean | AddEventListenerOptions
): () => void {
    element.addEventListener(event, handler, options);
    return () => element.removeEventListener(event, handler, options);
}

/**
 * Get element by ID with type safety
 */
export function getElementById<T extends HTMLElement = HTMLElement>(id: string): T | null {
    return document.getElementById(id) as T | null;
}

/**
 * Query selector with type safety
 */
export function querySelector<T extends Element = Element>(selector: string): T | null {
    return document.querySelector(selector) as T | null;
}

/**
 * Query all elements with type safety
 */
export function querySelectorAll<T extends Element = Element>(selector: string): NodeListOf<T> {
    return document.querySelectorAll(selector) as NodeListOf<T>;
}
