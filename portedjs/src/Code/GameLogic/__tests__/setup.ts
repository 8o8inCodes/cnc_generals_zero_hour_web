import { vi } from 'vitest';

// Mock other required globals
global.requestAnimationFrame = vi.fn(callback => setTimeout(callback, 0));
global.cancelAnimationFrame = vi.fn(id => clearTimeout(id));