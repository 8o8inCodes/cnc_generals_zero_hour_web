import { vi } from 'vitest';

const GameLogicMock = vi.fn(() => ({
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
}));

export default GameLogicMock;