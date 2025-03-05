import { SubsystemInterface } from './SubsystemInterface';
import { Scene } from 'three';

export interface RadarBlip {
    position: { x: number; y: number; z: number };
    type: number;
    team: number;
    isVisible: boolean;
}

export interface Radar extends SubsystemInterface {
    update(): void;
    addBlip(blip: RadarBlip): void;
    removeBlip(blip: RadarBlip): void;
    clear(): void;
    setVisible(visible: boolean): void;
    getScene(): Scene;
}