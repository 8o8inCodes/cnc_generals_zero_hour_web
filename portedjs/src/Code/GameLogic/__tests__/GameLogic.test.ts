import { describe, it, expect } from 'vitest';
import { GameLogic } from '../GameLogic';
import { SubsystemInterface } from '../../GameEngine/Source/Common/interfaces/SubsystemInterface';

class MockSubsystem implements SubsystemInterface {
  public initCalled = false;
  public shutdownCalled = false;
  public resetCalled = false;
  public frameUpdateCalled = false;

  init(): boolean {
    this.initCalled = true;
    return true;
  }

  shutdown(): void {
    this.shutdownCalled = true;
  }

  reset(): void {
    this.resetCalled = true;
  }

  frameUpdate(): void {
    this.frameUpdateCalled = true;
  }
}

describe('GameLogic', () => {
  let gameLogic: GameLogic;

  beforeEach(() => {
    gameLogic = GameLogic.getInstance();
    gameLogic.reset(); // Reset state between tests
  });

  it('should be a singleton', () => {
    const instance1 = GameLogic.getInstance();
    const instance2 = GameLogic.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('should initialize subsystems', () => {
    const mockSubsystem = new MockSubsystem();
    gameLogic.registerSubsystem(mockSubsystem);
    
    gameLogic.init();
    expect(mockSubsystem.initCalled).toBe(true);
  });

  it('should shutdown subsystems in reverse order', () => {
    const mockSubsystem1 = new MockSubsystem();
    const mockSubsystem2 = new MockSubsystem();
    
    gameLogic.registerSubsystem(mockSubsystem1);
    gameLogic.registerSubsystem(mockSubsystem2);
    gameLogic.init();
    gameLogic.shutdown();

    expect(mockSubsystem1.shutdownCalled).toBe(true);
    expect(mockSubsystem2.shutdownCalled).toBe(true);
  });

  it('should manage pause state', () => {
    const mockSubsystem = new MockSubsystem();
    gameLogic.registerSubsystem(mockSubsystem);

    gameLogic.pause();
    gameLogic.frameUpdate();
    expect(mockSubsystem.frameUpdateCalled).toBe(false);

    gameLogic.unpause();
    gameLogic.frameUpdate();
    expect(mockSubsystem.frameUpdateCalled).toBe(true);
  });

  it('should manage game time', () => {
    const initialTime = gameLogic.getGameTime();
    gameLogic.frameUpdate();
    expect(gameLogic.getGameTime()).toBe(initialTime + 1);
    expect(gameLogic.getGameTimeReal()).toBeCloseTo((initialTime + 1) / 30.0);
  });

  it('should register and unregister subsystems', () => {
    const mockSubsystem = new MockSubsystem();
    gameLogic.registerSubsystem(mockSubsystem);
    gameLogic.frameUpdate();
    expect(mockSubsystem.frameUpdateCalled).toBe(true);

    mockSubsystem.frameUpdateCalled = false;
    gameLogic.unregisterSubsystem(mockSubsystem);
    gameLogic.frameUpdate();
    expect(mockSubsystem.frameUpdateCalled).toBe(false);
  });
});