import { Scene, WebGLRenderer } from 'three';
import { SubsystemInterface } from './SubsystemInterface';
import { MessageStream } from './MessageStream';
import { FileSystem } from './FileSystem';
import { GameClient } from '../../GameClient/GameClient';
import { GameLogic } from '../../GameLogic/GameLogic';

interface GameEngineOptions {
    maxFPS?: number;
    audioEnabled?: boolean;
    musicEnabled?: boolean;
    soundEnabled?: boolean;
    sound3DEnabled?: boolean;
    speechEnabled?: boolean;
}

export class GameEngine implements SubsystemInterface {
    private static instance: GameEngine | null = null;
    private maxFPS: number = 60;
    private isQuitting: boolean = false;
    private isActive: boolean = false;
    private lastFrameTime: number = 0;
    private gameLogic: GameLogic;
    private gameClient: GameClient;
    private messageStream: MessageStream;
    private fileSystem: FileSystem;
    private renderer: WebGLRenderer;
    private scene: Scene;
    private animationFrameId: number | null = null;

    private constructor() {
        this.scene = new Scene();
        this.renderer = new WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // Handle window resizing
        window.addEventListener('resize', () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    static getInstance(): GameEngine {
        if (!GameEngine.instance) {
            GameEngine.instance = new GameEngine();
        }
        return GameEngine.instance;
    }

    init(options: GameEngineOptions = {}): void {
        try {
            this.maxFPS = options.maxFPS || 60;
            
            // Initialize core systems
            this.messageStream = new MessageStream();
            this.fileSystem = new FileSystem();
            this.gameClient = new GameClient(this.scene, this.renderer);
            this.gameLogic = new GameLogic();

            // Set initial state
            this.isQuitting = false;
            this.isActive = true;

            // Handle window focus events
            window.addEventListener('focus', () => this.isActive = true);
            window.addEventListener('blur', () => this.isActive = false);

        } catch (error) {
            console.error('Failed to initialize game engine:', error);
            this.isQuitting = true;
        }
    }

    reset(): void {
        this.messageStream.reset();
        this.gameClient.reset();
        this.gameLogic.reset();
    }

    update(): void {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFrameTime;

        // Respect FPS limit
        if (deltaTime < (1000 / this.maxFPS)) {
            return;
        }

        this.messageStream.update();
        this.gameClient.update(deltaTime);
        
        if (!this.gameLogic.isPaused()) {
            this.gameLogic.update(deltaTime);
        }

        // Render the scene
        this.renderer.render(this.scene, this.gameClient.getActiveCamera());

        this.lastFrameTime = currentTime;
    }

    execute(): void {
        const gameLoop = () => {
            if (!this.isQuitting) {
                this.update();
                this.animationFrameId = requestAnimationFrame(gameLoop);
            } else {
                this.cleanup();
            }
        };

        this.lastFrameTime = performance.now();
        this.animationFrameId = requestAnimationFrame(gameLoop);
    }

    private cleanup(): void {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.renderer.dispose();
        document.body.removeChild(this.renderer.domElement);
    }

    setFramesPerSecondLimit(fps: number): void {
        this.maxFPS = fps;
    }

    getFramesPerSecondLimit(): number {
        return this.maxFPS;
    }

    setQuitting(quitting: boolean): void {
        this.isQuitting = quitting;
    }

    isMultiplayerSession(): boolean {
        // To be implemented with network system
        return false;
    }

    createMessageStream(): MessageStream {
        return new MessageStream();
    }

    createFileSystem(): FileSystem {
        return new FileSystem();
    }
}

// Export factory function for compatibility with original code
export function CreateGameEngine(): GameEngine {
    return GameEngine.getInstance();
}