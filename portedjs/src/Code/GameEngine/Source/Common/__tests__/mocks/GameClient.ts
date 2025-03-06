import { GameClient } from '../../interfaces/GameClient';
import { Scene, WebGLRenderer, Camera, PerspectiveCamera } from 'three';

export class MockGameClient implements GameClient {
    private camera: Camera;

    constructor() {
        this.camera = new PerspectiveCamera();
    }

    init(): void {}
    reset(): void {}
    update(): void {}
    getActiveCamera(): Camera {
        return this.camera;
    }
    getRenderer(): WebGLRenderer {
        return new WebGLRenderer();
    }
    getScene(): Scene {
        return new Scene();
    }
}