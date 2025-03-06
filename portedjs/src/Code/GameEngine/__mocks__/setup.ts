import { vi } from 'vitest';

const mockCanvas = document.createElement('canvas');

// Create spies for all mock functions
const sceneSpy = vi.fn();
const rendererSpy = vi.fn();
const cameraSpy = vi.fn();

export const mockScene = {
    add: vi.fn(),
    remove: vi.fn()
};

export const mockRenderer = {
    setSize: vi.fn(),
    render: vi.fn(),
    dispose: vi.fn(),
    domElement: mockCanvas
};

export const mockCamera = {
    position: { x: 0, y: 0, z: 0 },
    lookAt: vi.fn()
};

export const createSpies = () => ({
    sceneSpy,
    rendererSpy,
    cameraSpy
});

// Mock implementations
export const mockMessageStream = {
    init: vi.fn(),
    reset: vi.fn(),
    update: vi.fn(),
    appendMessage: vi.fn().mockReturnValue({
        type: 0,
        args: [],
        appendIntegerArgument: vi.fn(),
        appendStringArgument: vi.fn()
    }),
    propagateMessages: vi.fn()
};

export const mockFileSystem = {
    init: vi.fn(),
    reset: vi.fn(),
    update: vi.fn(),
    openFile: vi.fn().mockReturnValue({
        WRITE: 1,
        CREATE: 2,
        TRUNCATE: 4,
        TEXT: 8,
        write: vi.fn(),
        close: vi.fn()
    }),
    doesFileExist: vi.fn().mockReturnValue(true),
    getFileInfo: vi.fn(),
    getFileListInDirectory: vi.fn()
};

export const mockGameClient = {
    init: vi.fn(),
    reset: vi.fn(),
    update: vi.fn(),
    getActiveCamera: vi.fn().mockReturnValue(mockCamera),
    getRenderer: vi.fn().mockReturnValue(mockRenderer),
    getScene: vi.fn().mockReturnValue(mockScene)
};

export const mockGameLogic = {
    init: vi.fn(),
    reset: vi.fn(),
    update: vi.fn(),
    isPaused: vi.fn().mockReturnValue(false),
    isInGame: vi.fn().mockReturnValue(true),
    isInShellGame: vi.fn().mockReturnValue(false),
    isInMultiplayerGame: vi.fn().mockReturnValue(false),
    isInInternetGame: vi.fn().mockReturnValue(false),
    isGamePaused: vi.fn().mockReturnValue(false),
    getFrame: vi.fn().mockReturnValue(0),
    clearGameData: vi.fn(),
    getCRC: vi.fn().mockReturnValue(0)
};