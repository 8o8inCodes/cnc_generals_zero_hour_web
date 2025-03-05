import { Scene, WebGLRenderer, Camera } from 'three';
import { SubsystemInterface } from './SubsystemInterface';

export interface GameClient extends SubsystemInterface {
    update(deltaTime: number): void;
    reset(): void;
    getActiveCamera(): Camera;
    getRenderer(): WebGLRenderer;
    getScene(): Scene;
}