import { Scene, WebGLRenderer } from 'three';
import { SubsystemInterface } from './interfaces/SubsystemInterface';
import { MessageStream } from './interfaces/MessageStream';
import { FileSystem } from './interfaces/FileSystem';
import { GameClient } from './interfaces/GameClient';
import { GameLogic } from './interfaces/GameLogic';

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
    private nextFrameTime: number = 0;
    private gameLogic: GameLogic;
    private gameClient: GameClient;
    private messageStream: MessageStream;
    private fileSystem: FileSystem;
    private renderer!: WebGLRenderer;
    private scene!: Scene;
    private animationFrameId: number | null = null;

    private constructor() {
        // Initialize subsystems first
        this.messageStream = new MessageStream();
        this.fileSystem = new FileSystem();
        this.gameLogic = new GameLogic();
    }

    static getInstance(): GameEngine {
        if (!GameEngine.instance) {
            GameEngine.instance = new GameEngine();
        }
        return GameEngine.instance;
    }

    init(options: GameEngineOptions = {}): void {
        try {
            // Initialize Three.js components
            this.scene = new Scene();
            this.renderer = new WebGLRenderer({ antialias: true });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            
            // Initialize game client after Three.js setup
            this.gameClient = new GameClient(this.scene, this.renderer);

            // Add canvas to document body
            if (document.body && !document.body.contains(this.renderer.domElement)) {
                document.body.appendChild(this.renderer.domElement);
            }

            // Set up options
            this.maxFPS = options.maxFPS || 60;
            this.isQuitting = false;
            this.isActive = true;
            
            // Initialize timing
            const now = performance.now();
            this.lastFrameTime = now;
            this.nextFrameTime = now + (1000 / this.maxFPS);

            // Initialize subsystems
            this.messageStream.init();
            this.fileSystem.init();
            this.gameClient.init();
            this.gameLogic.init();

            // Handle window events
            window.addEventListener('resize', () => {
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            });
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
        
        // More precise FPS limiting
        if (currentTime < this.nextFrameTime) {
            return;
        }

        const deltaTime = currentTime - this.lastFrameTime;

        // Update subsystems
        this.messageStream.update();
        this.gameClient.update(deltaTime);
        
        if (!this.gameLogic.isPaused()) {
            this.gameLogic.update(deltaTime);
        }

        // Render the scene
        this.renderer.render(this.scene, this.gameClient.getActiveCamera());

        // Update timing
        this.lastFrameTime = currentTime;
        this.nextFrameTime = currentTime + (1000 / this.maxFPS);
    }

    execute(): void {
        const gameLoop = () => {
            if (!this.isQuitting) {
                this.update();
                this.animationFrameId = requestAnimationFrame(gameLoop);
            }
        };

        // Reset timing before starting loop
        const now = performance.now();
        this.lastFrameTime = now;
        this.nextFrameTime = now + (1000 / this.maxFPS);
        
        this.animationFrameId = requestAnimationFrame(gameLoop);
    }

    cleanup(): void {
        // Cancel animation frame if running
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        // Remove canvas from document body if it exists
        if (this.renderer?.domElement?.parentNode) {
            this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
        }
        
        // Dispose of Three.js resources
        if (this.renderer) {
            this.renderer.dispose();
        }
    }

    setFramesPerSecondLimit(fps: number): void {
        this.maxFPS = fps;
        // Reset timing when FPS changes
        const now = performance.now();
        this.lastFrameTime = now;
        this.nextFrameTime = now + (1000 / this.maxFPS);
    }

    getFramesPerSecondLimit(): number {
        return this.maxFPS;
    }

    setQuitting(quitting: boolean): void {
        this.isQuitting = quitting;
        if (quitting) {
            this.cleanup();
        }
    }

    isMultiplayerSession(): boolean {
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