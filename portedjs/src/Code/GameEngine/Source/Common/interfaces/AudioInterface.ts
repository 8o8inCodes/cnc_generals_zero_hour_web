import { SubsystemInterface } from './SubsystemInterface';

export enum AudioAffect {
    Music,
    Sound,
    Sound3D,
    Speech
}

export interface AudioInterface extends SubsystemInterface {
    update(): void;
    setOn(enabled: boolean, affect: AudioAffect): void;
    playSound(soundId: string, options?: {
        loop?: boolean;
        position?: { x: number; y: number; z: number };
        volume?: number;
    }): void;
    stopSound(soundId: string): void;
    isMusicAlreadyLoaded(): boolean;
    setVolume(volume: number, affect: AudioAffect): void;
}