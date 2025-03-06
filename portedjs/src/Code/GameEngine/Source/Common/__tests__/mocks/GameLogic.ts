import { GameLogic } from '../../interfaces/GameLogic';

export class MockGameLogic implements GameLogic {
    private paused: boolean = false;

    init(): void {}
    reset(): void {}
    update(deltaTime: number): void {}
    isPaused(): boolean {
        return this.paused;
    }
    isInGame(): boolean {
        return true;
    }
    isInShellGame(): boolean {
        return false;
    }
    isInMultiplayerGame(): boolean {
        return false;
    }
    isInInternetGame(): boolean {
        return false;
    }
    isGamePaused(): boolean {
        return this.paused;
    }
    getFrame(): number {
        return 0;
    }
    clearGameData(): void {}
    getCRC(type: number, filename: string): number {
        return 0;
    }
}