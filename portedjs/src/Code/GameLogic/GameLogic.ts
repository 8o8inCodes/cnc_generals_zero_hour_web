/**
 * GameLogic - Core game system that manages game state, objects, and subsystems
 */

import { SubsystemInterface } from '../GameEngine/Source/Common/interfaces/SubsystemInterface';

// Game state constants and flags
const NEVER = 0;
const FOREVER = 0x3fffffff;

export class GameLogic implements SubsystemInterface {
  private static instance: GameLogic | null = null;
  private subsystems: SubsystemInterface[] = [];
  private isInitialized = false;
  private isPaused = false;
  private gameTime = 0;
  
  // Singleton pattern
  public static getInstance(): GameLogic {
    if (!GameLogic.instance) {
      GameLogic.instance = new GameLogic();
    }
    return GameLogic.instance;
  }

  private constructor() {
    // Private constructor for singleton
  }

  // SubsystemInterface implementation
  public init(): boolean {
    if (this.isInitialized) {
      return true;
    }

    // Initialize all registered subsystems
    for (const subsystem of this.subsystems) {
      if (!subsystem.init()) {
        return false;
      }
    }

    this.isInitialized = true;
    return true;
  }

  public shutdown(): void {
    // Shutdown in reverse order
    for (let i = this.subsystems.length - 1; i >= 0; i--) {
      this.subsystems[i].shutdown();
    }
    this.isInitialized = false;
  }

  public reset(): void {
    this.subsystems.forEach(subsystem => subsystem.reset());
    this.gameTime = 0;
  }

  public frameUpdate(): void {
    if (!this.isPaused) {
      // Update all subsystems
      this.subsystems.forEach(subsystem => subsystem.frameUpdate());
      this.gameTime++;
    }
  }

  // Subsystem management
  public registerSubsystem(subsystem: SubsystemInterface): void {
    this.subsystems.push(subsystem);
  }

  public unregisterSubsystem(subsystem: SubsystemInterface): void {
    const index = this.subsystems.indexOf(subsystem);
    if (index !== -1) {
      this.subsystems.splice(index, 1);
    }
  }

  // Game flow control
  public pause(): void {
    this.isPaused = true;
  }

  public unpause(): void {
    this.isPaused = false;
  }

  public isPausedState(): boolean {
    return this.isPaused;
  }

  // Time management
  public getGameTime(): number {
    return this.gameTime;
  }

  public getGameTimeReal(): number {
    return this.gameTime / 30.0; // Convert frames to seconds (30 FPS)
  }
}