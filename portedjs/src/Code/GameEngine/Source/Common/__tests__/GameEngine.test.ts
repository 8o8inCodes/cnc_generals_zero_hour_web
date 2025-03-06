/**
 * @vitest-environment jsdom
 */
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
    mockScene,
    mockRenderer,
    mockCamera,
    mockMessageStream,
    mockFileSystem,
    mockGameClient,
    mockGameLogic,
    createSpies
} from '../../../__mocks__/setup';

// Initialize spies
const { sceneSpy, rendererSpy } = createSpies();

// Setup mocks before any imports
vi.mock('three', () => ({
    Scene: vi.fn(() => {
        sceneSpy();
        return mockScene;
    }),
    WebGLRenderer: vi.fn(() => {
        rendererSpy();
        return mockRenderer;
    }),
    PerspectiveCamera: vi.fn(() => mockCamera)
}));

vi.mock('../interfaces/MessageStream', () => ({
    MessageStream: vi.fn(() => mockMessageStream)
}));

vi.mock('../interfaces/FileSystem', () => ({
    FileSystem: vi.fn(() => mockFileSystem)
}));

vi.mock('../interfaces/GameClient', () => ({
    GameClient: vi.fn(() => mockGameClient)
}));

vi.mock('../interfaces/GameLogic', () => ({
    GameLogic: vi.fn(() => mockGameLogic)
}));

// Import tested module after mocks
import { GameEngine, CreateGameEngine } from '../GameEngine';

describe('GameEngine', () => {
    let gameEngine: GameEngine;
    let mockCanvas: HTMLCanvasElement;
    let rafCallbacks: Array<(time: number) => void>;

    beforeEach(() => {
        vi.resetModules();
        vi.clearAllMocks();
        document.body.innerHTML = '';
        vi.useFakeTimers();
        vi.setSystemTime(0);
        mockCanvas = document.createElement('canvas');
        mockRenderer.domElement = mockCanvas;
        rafCallbacks = [];

        // Mock requestAnimationFrame to store callbacks
        vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
            rafCallbacks.push(cb);
            return rafCallbacks.length;
        });

        gameEngine = CreateGameEngine();
    });

    afterEach(() => {
        vi.useRealTimers();
        if (gameEngine) {
            gameEngine.setQuitting(true);
            gameEngine.cleanup();
        }
        vi.clearAllMocks();
        document.body.innerHTML = '';
        rafCallbacks = [];
    });

    describe('Singleton Pattern', () => {
        it('should create only one instance of GameEngine', () => {
            const instance1 = CreateGameEngine();
            const instance2 = CreateGameEngine();
            expect(instance1).toBe(instance2);
        });
    });

    describe('Initialization', () => {
        it('should initialize with default values', () => {
            expect(gameEngine.getFramesPerSecondLimit()).toBe(60);
        });

        it('should initialize Three.js components', () => {
            gameEngine.init();
            expect(sceneSpy).toHaveBeenCalled();
            expect(rendererSpy).toHaveBeenCalled();
            expect(mockRenderer.setSize).toHaveBeenCalledWith(window.innerWidth, window.innerHeight);
        });

        it('should add canvas to document body', () => {
            gameEngine.init();
            expect(document.body.contains(mockRenderer.domElement)).toBeTruthy();
        });

        it('should initialize with custom FPS limit', () => {
            gameEngine.init({ maxFPS: 30 });
            expect(gameEngine.getFramesPerSecondLimit()).toBe(30);
        });
    });

    describe('Game Loop', () => {
        beforeEach(() => {
            gameEngine.init();
            vi.setSystemTime(0);
        });

        it('should handle frame updates', () => {
            const messageSpy = vi.spyOn(mockMessageStream, 'update');
            const clientSpy = vi.spyOn(mockGameClient, 'update');
            const logicSpy = vi.spyOn(mockGameLogic, 'update');
            
            gameEngine.execute();
            
            // Advance time by one frame (60fps = ~16.67ms)
            vi.setSystemTime(17);
            
            // Trigger first frame
            expect(rafCallbacks.length).toBe(1);
            rafCallbacks[0](performance.now());
            
            // Verify frame executed
            expect(messageSpy).toHaveBeenCalled();
            expect(clientSpy).toHaveBeenCalled();
            expect(logicSpy).toHaveBeenCalled();
        });

        it('should respect FPS limit', () => {
            gameEngine.setFramesPerSecondLimit(30);
            const messageSpy = vi.spyOn(mockMessageStream, 'update');
            const clientSpy = vi.spyOn(mockGameClient, 'update');
            const logicSpy = vi.spyOn(mockGameLogic, 'update');
            
            // Initial state
            vi.setSystemTime(0);
            gameEngine.update();
            vi.clearAllMocks();
            
            // Advance less than frame time (16ms < 33.33ms for 30fps)
            vi.setSystemTime(16);
            gameEngine.update();
            expect(messageSpy).not.toHaveBeenCalled();
            expect(clientSpy).not.toHaveBeenCalled();
            expect(logicSpy).not.toHaveBeenCalled();
            
            // Advance to complete frame time (34ms > 33.33ms)
            vi.setSystemTime(34);
            gameEngine.update();
            expect(messageSpy).toHaveBeenCalled();
            expect(clientSpy).toHaveBeenCalled();
            expect(logicSpy).toHaveBeenCalled();
        });

        it('should stop game loop when quitting', () => {
            const messageSpy = vi.spyOn(mockMessageStream, 'update');
            
            gameEngine.execute();
            expect(rafCallbacks.length).toBe(1);
            
            gameEngine.setQuitting(true);
            rafCallbacks[0](performance.now());
            
            // Should not schedule another frame
            expect(rafCallbacks.length).toBe(1);
            expect(messageSpy).not.toHaveBeenCalled();
        });
    });

    describe('Subsystems', () => {
        beforeEach(() => {
            gameEngine.init();
            vi.setSystemTime(1000); // Set initial time to ensure delta time
        });

        it('should create message stream', () => {
            const messageStream = gameEngine.createMessageStream();
            expect(messageStream).toBeDefined();
            expect(messageStream.update).toBeDefined();
            expect(messageStream.reset).toBeDefined();
        });

        it('should create file system', () => {
            const fileSystem = gameEngine.createFileSystem();
            expect(fileSystem).toBeDefined();
            expect(fileSystem.openFile).toBeDefined();
            expect(fileSystem.doesFileExist).toBeDefined();
        });

        it('should reset all subsystems', () => {
            gameEngine.reset();
            expect(mockMessageStream.reset).toHaveBeenCalled();
            expect(mockGameClient.reset).toHaveBeenCalled();
            expect(mockGameLogic.reset).toHaveBeenCalled();
        });

        it('should update all subsystems', () => {
            vi.advanceTimersByTime(1000/30); // Advance enough time to trigger update
            gameEngine.update();
            expect(mockMessageStream.update).toHaveBeenCalled();
            expect(mockGameClient.update).toHaveBeenCalled();
            expect(mockGameLogic.update).toHaveBeenCalled();
        });
    });

    describe('Cleanup', () => {
        it('should properly clean up resources', () => {
            gameEngine.init();
            const canvas = mockRenderer.domElement;
            gameEngine.cleanup();
            expect(mockRenderer.dispose).toHaveBeenCalled();
            expect(document.body.contains(canvas)).toBeFalsy();
        });
    });
});