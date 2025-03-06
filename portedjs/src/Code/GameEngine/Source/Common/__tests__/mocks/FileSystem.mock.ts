import { vi } from 'vitest';

const FileSystemMock = vi.fn(() => ({
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
}));

export default FileSystemMock;