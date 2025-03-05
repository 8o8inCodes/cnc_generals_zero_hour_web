export interface Timer {
    start(): void;
    stop(): void;
    reset(): void;
    getElapsedTime(): number;
    getAverageTime(): number;
    getFPS(): number;
}