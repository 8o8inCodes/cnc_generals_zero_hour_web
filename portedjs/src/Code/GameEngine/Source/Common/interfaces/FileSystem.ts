export interface FileInfo {
    timestampHigh: number;
    timestampLow: number;
    size: number;
    attributes: number;
}

export interface File {
    readonly WRITE: number;
    readonly CREATE: number;
    readonly TRUNCATE: number;
    readonly TEXT: number;
    write(data: string, length: number): void;
    close(): void;
}

export interface FileSystem extends SubsystemInterface {
    openFile(path: string, flags: number): File;
    doesFileExist(path: string): boolean;
    getFileInfo(path: string, info: FileInfo): void;
    getFileListInDirectory(directory: string, prefix: string, pattern: string, files: string[], recursive: boolean): void;
}