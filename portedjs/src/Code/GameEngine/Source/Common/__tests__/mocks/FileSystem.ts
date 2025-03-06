import { FileSystem, File, FileInfo } from '../../interfaces/FileSystem';

export class MockFileSystem implements FileSystem {
    init(): void {}
    reset(): void {}
    update(): void {}
    openFile(path: string, flags: number): File {
        return {
            WRITE: 1,
            CREATE: 2,
            TRUNCATE: 4,
            TEXT: 8,
            write: () => {},
            close: () => {}
        };
    }
    doesFileExist(path: string): boolean {
        return true;
    }
    getFileInfo(path: string, info: FileInfo): void {}
    getFileListInDirectory(directory: string, prefix: string, pattern: string, files: string[], recursive: boolean): void {
        files.push('test.txt');
    }
}