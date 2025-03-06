import { SubsystemInterface } from './SubsystemInterface';

export enum GameMessageType {
    MSG_NEW_GAME,
    MSG_END_GAME,
    MSG_PAUSE_GAME,
    MSG_RESUME_GAME,
    MSG_UPDATE,
    MSG_NETWORK_UPDATE
}

export interface GameMessage {
    type: GameMessageType;
    args: any[];
    appendIntegerArgument(value: number): void;
    appendStringArgument(value: string): void;
}

export interface MessageStream extends SubsystemInterface {
    appendMessage(type: GameMessageType): GameMessage;
    propagateMessages(): void;
    reset(): void;
    update(): void;
}