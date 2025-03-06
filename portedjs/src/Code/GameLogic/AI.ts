/**
 * AI - Base class for game artificial intelligence systems
 */

import { SubsystemInterface } from '../GameEngine/Source/Common/interfaces/SubsystemInterface';
import { AIState } from './AIStates';
import { Vec3 } from '../WWMath/Vec3';

export enum AICommandType {
  NONE,
  MOVE,
  ATTACK,
  STOP,
  GUARD,
  PATROL
}

export interface AITarget {
  position: Vec3;
  objectId?: number; // Target object ID if any
}

export interface AICommand {
  type: AICommandType;
  target?: AITarget;
  queueCommand: boolean; // Whether to queue this command after current command
}

/**
 * Base AI class that provides core AI functionality
 */
export class AI implements SubsystemInterface {
  protected currentState: AIState = AIState.IDLE;
  protected commandQueue: AICommand[] = [];
  protected currentCommand: AICommand | null = null;
  protected position: Vec3 = new Vec3();
  protected isActive: boolean = false;

  // SubsystemInterface implementation
  public init(): boolean {
    this.reset();
    return true;
  }

  public shutdown(): void {
    this.reset();
  }

  public reset(): void {
    this.currentState = AIState.IDLE;
    this.commandQueue = [];
    this.currentCommand = null;
    this.position = new Vec3();
    this.isActive = false;
  }

  public frameUpdate(): void {
    if (!this.isActive) {
      return;
    }

    this.updateState();
    this.executeCurrentCommand();
  }

  // AI state management
  public setState(newState: AIState): void {
    if (this.currentState !== newState) {
      this.onStateExit(this.currentState);
      this.currentState = newState;
      this.onStateEnter(newState);
    }
  }

  public getState(): AIState {
    return this.currentState;
  }

  protected onStateEnter(state: AIState): void {
    // Override in derived classes
  }

  protected onStateExit(state: AIState): void {
    // Override in derived classes
  }

  // Command management
  public issueCommand(command: AICommand): void {
    if (command.queueCommand) {
      this.commandQueue.push(command);
      if (!this.currentCommand) {
        this.currentCommand = this.commandQueue[0];
      }
    } else {
      this.commandQueue = [command];
      this.currentCommand = command;
    }
  }

  public clearCommands(): void {
    this.commandQueue = [];
    this.currentCommand = null;
  }

  protected updateState(): void {
    // State machine update logic
    switch (this.currentState) {
      case AIState.IDLE:
        if (this.commandQueue.length > 0) {
          this.setState(AIState.BUSY);
        }
        break;

      case AIState.BUSY:
        if (this.commandQueue.length === 0) {
          this.setState(AIState.IDLE);
        }
        break;
    }
  }

  protected executeCurrentCommand(): void {
    if (!this.currentCommand) {
      if (this.commandQueue.length > 0) {
        this.currentCommand = this.commandQueue[0];
      }
      return;
    }

    let commandCompleted = false;
    
    switch (this.currentCommand.type) {
      case AICommandType.MOVE:
        commandCompleted = this.executeMoveCommand();
        break;

      case AICommandType.ATTACK:
        commandCompleted = this.executeAttackCommand();
        break;

      case AICommandType.STOP:
        commandCompleted = this.executeStopCommand();
        break;

      case AICommandType.GUARD:
        commandCompleted = this.executeGuardCommand();
        break;

      case AICommandType.PATROL:
        commandCompleted = this.executePatrolCommand();
        break;
    }

    if (commandCompleted) {
      this.commandQueue.shift(); // Remove completed command from queue
      this.currentCommand = this.commandQueue.length > 0 ? this.commandQueue[0] : null;
    }
  }

  protected executeMoveCommand(): boolean {
    // Override in derived classes
    return true; // Base implementation just completes immediately
  }

  protected executeAttackCommand(): boolean {
    // Override in derived classes
    return true;
  }

  protected executeStopCommand(): boolean {
    // Override in derived classes
    return true;
  }

  protected executeGuardCommand(): boolean {
    // Override in derived classes
    return true;
  }

  protected executePatrolCommand(): boolean {
    // Override in derived classes
    return true;
  }

  // Activation control
  public activate(): void {
    this.isActive = true;
  }

  public deactivate(): void {
    this.isActive = false;
  }

  public isActiveState(): boolean {
    return this.isActive;
  }
}