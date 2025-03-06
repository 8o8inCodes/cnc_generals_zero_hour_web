import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = vi.fn().mockImplementation((cb) => setTimeout(cb, 0));
global.cancelAnimationFrame = vi.fn().mockImplementation((id) => clearTimeout(id));

// Mock performance.now()
global.performance.now = vi.fn(() => Date.now());

// Set up basic browser environment
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});