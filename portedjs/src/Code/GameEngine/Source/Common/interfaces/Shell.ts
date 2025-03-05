import { SubsystemInterface } from './SubsystemInterface';

export interface Window {
    hide(hidden: boolean): void;
    bringForward(): void;
    winClearStatus(status: number): void;
    destroyWindows(): void;
    deleteInstance(): void;
}

export interface WindowLayout {
    hide(hidden: boolean): void;
    bringForward(): void;
    getFirstWindow(): Window;
    destroyWindows(): void;
    deleteInstance(): void;
}

export interface Shell extends SubsystemInterface {
    push(windowPath: string): WindowLayout;
    pop(): void;
    hideShell(): void;
    showShell(): void;
    createLayout(layoutPath: string): WindowLayout;
    updateLayout(): void;
}