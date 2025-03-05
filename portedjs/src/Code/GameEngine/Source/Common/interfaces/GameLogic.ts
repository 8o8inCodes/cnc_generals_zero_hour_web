import { SubsystemInterface } from './SubsystemInterface';

export interface GameLogic extends SubsystemInterface {
    update(deltaTime: number): void;
    isPaused(): boolean;
    isInGame(): boolean;
    isInShellGame(): boolean;
    isInMultiplayerGame(): boolean;
    isInInternetGame(): boolean;
    isGamePaused(): boolean;
    getFrame(): number;
    clearGameData(): void;
    getCRC(type: number, filename: string): number;
}