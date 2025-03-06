import { vi } from 'vitest';
import { MessageStream, GameMessageType, GameMessage } from '../../interfaces/MessageStream';
import { FileSystem, File, FileInfo } from '../../interfaces/FileSystem';
import { GameClient } from '../../interfaces/GameClient';
import { GameLogic } from '../../interfaces/GameLogic';

export const createMessageStreamMock = () => ({
    init: vi.fn(),
    reset: vi.fn(),
    update: vi.fn(),
    appendMessage: vi.fn().mockReturnValue({
        type: 0, // MSG_NEW_GAME
        args: [],
        appendIntegerArgument: vi.fn(),
        appendStringArgument: vi.fn()
    }),
    propagateMessages: vi.fn()
});

export const createFileSystemMock = () => ({
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
});

export const createGameClientMock = () => ({
    init: vi.fn(),
    reset: vi.fn(),
    update: vi.fn(),
    getActiveCamera: vi.fn().mockReturnValue({ type: 'PerspectiveCamera' }),
    getRenderer: vi.fn(),
    getScene: vi.fn()
});

export const createGameLogicMock = () => ({
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
});