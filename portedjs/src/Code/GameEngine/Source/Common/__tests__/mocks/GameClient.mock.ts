import { vi } from 'vitest';

const GameClientMock = vi.fn(() => ({
    init: vi.fn(),
    reset: vi.fn(),
    update: vi.fn(),
    getActiveCamera: vi.fn().mockReturnValue({ type: 'PerspectiveCamera' }),
    getRenderer: vi.fn(),
    getScene: vi.fn()
}));

export default GameClientMock;