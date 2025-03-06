import { describe, it, expect, beforeEach } from 'vitest';
import { AI, AICommand, AICommandType } from '../AI';
import { AIState } from '../AIStates';
import { Vec3 } from '../../WWMath/Vec3';

class TestAI extends AI {
  private lastExecutedCommand: AICommand | null = null;

  public exposedCurrentCommand(): AICommand | null {
    return this.currentCommand;
  }

  public exposedCommandQueue(): AICommand[] {
    return this.commandQueue;
  }

  public getLastExecutedCommand(): AICommand | null {
    return this.lastExecutedCommand;
  }

  protected executeMoveCommand(): boolean {
    this.lastExecutedCommand = this.currentCommand;
    return true; // Always complete move commands immediately
  }
}

describe('AI', () => {
  let ai: TestAI;

  beforeEach(() => {
    ai = new TestAI();
    ai.init();
  });

  describe('State Management', () => {
    it('should initialize in IDLE state', () => {
      expect(ai.getState()).toBe(AIState.IDLE);
    });

    it('should change states', () => {
      ai.setState(AIState.MOVING);
      expect(ai.getState()).toBe(AIState.MOVING);
    });

    it('should reset to initial state', () => {
      ai.setState(AIState.COMBAT);
      ai.reset();
      expect(ai.getState()).toBe(AIState.IDLE);
    });
  });

  describe('Command Management', () => {
    it('should queue commands when specified', () => {
      const command1: AICommand = {
        type: AICommandType.MOVE,
        target: { position: new Vec3(1, 0, 0) },
        queueCommand: true
      };

      const command2: AICommand = {
        type: AICommandType.ATTACK,
        target: { position: new Vec3(2, 0, 0) },
        queueCommand: true
      };

      ai.activate();
      ai.issueCommand(command1);
      ai.issueCommand(command2);

      expect(ai.exposedCommandQueue().length).toBe(2);
    });

    it('should clear previous commands when not queuing', () => {
      const command1: AICommand = {
        type: AICommandType.MOVE,
        target: { position: new Vec3(1, 0, 0) },
        queueCommand: true
      };

      const command2: AICommand = {
        type: AICommandType.ATTACK,
        target: { position: new Vec3(2, 0, 0) },
        queueCommand: false
      };

      ai.activate();
      ai.issueCommand(command1);
      ai.issueCommand(command2);

      expect(ai.exposedCommandQueue().length).toBe(1);
      expect(ai.exposedCurrentCommand()?.type).toBe(AICommandType.ATTACK);
    });

    it('should execute commands in order', () => {
      const command1: AICommand = {
        type: AICommandType.MOVE,
        target: { position: new Vec3(1, 0, 0) },
        queueCommand: true
      };

      const command2: AICommand = {
        type: AICommandType.MOVE,
        target: { position: new Vec3(2, 0, 0) },
        queueCommand: true
      };

      ai.activate();
      ai.issueCommand(command1);
      ai.issueCommand(command2);

      // First update executes command1
      ai.frameUpdate();
      expect(ai.getLastExecutedCommand()?.target?.position.x).toBe(1);

      // Second update executes command2
      ai.frameUpdate();
      expect(ai.getLastExecutedCommand()?.target?.position.x).toBe(2);
    });
  });

  describe('Activation Control', () => {
    it('should not execute commands when inactive', () => {
      const command: AICommand = {
        type: AICommandType.MOVE,
        target: { position: new Vec3(1, 0, 0) },
        queueCommand: false
      };

      ai.deactivate();
      ai.issueCommand(command);
      ai.frameUpdate();

      expect(ai.exposedCurrentCommand()?.type).toBe(AICommandType.MOVE);
      expect(ai.getLastExecutedCommand()).toBeNull();
    });

    it('should execute commands when active', () => {
      const command: AICommand = {
        type: AICommandType.MOVE,
        target: { position: new Vec3(1, 0, 0) },
        queueCommand: false
      };

      ai.activate();
      ai.issueCommand(command);
      ai.frameUpdate();

      expect(ai.getLastExecutedCommand()?.target?.position.x).toBe(1);
    });

    it('should properly toggle activation state', () => {
      expect(ai.isActiveState()).toBe(false);
      ai.activate();
      expect(ai.isActiveState()).toBe(true);
      ai.deactivate();
      expect(ai.isActiveState()).toBe(false);
    });
  });
});