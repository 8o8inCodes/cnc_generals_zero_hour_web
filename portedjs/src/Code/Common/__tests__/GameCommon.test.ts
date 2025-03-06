import { describe, it, expect } from 'vitest';
import {
  convertDurationFromMsecsToFrames,
  convertVelocityInSecsToFrames,
  convertAccelerationInSecsToFrames,
  convertAngularVelocityInDegreesPerSecToRadsPerFrame,
  normalizeAngle,
  stdAngleDiff,
  VeterancyLevel,
  getVeterancyLevelFlag,
  setVeterancyLevelFlag,
  clearVeterancyLevelFlag,
  isForcedAttack,
  isContinuedAttack,
  ATTACK_NEW_TARGET,
  ATTACK_NEW_TARGET_FORCED,
  ATTACK_CONTINUED_TARGET,
  LinkedListIterator,
  ILinkable
} from '../GameCommon';

describe('GameCommon', () => {
  describe('time conversion utilities', () => {
    it('should convert milliseconds to frames', () => {
      expect(convertDurationFromMsecsToFrames(1000)).toEqual(30); // 1 second = 30 frames
      expect(convertDurationFromMsecsToFrames(500)).toEqual(15); // 0.5 seconds = 15 frames
    });

    it('should convert velocity from per second to per frame', () => {
      const velPerSec = 300; // 300 units per second
      const velPerFrame = convertVelocityInSecsToFrames(velPerSec);
      expect(velPerFrame).toBeCloseTo(10); // 300/30 = 10 units per frame
    });

    it('should convert acceleration from per second² to per frame²', () => {
      const accelPerSec2 = 900; // 900 units/sec²
      const accelPerFrame2 = convertAccelerationInSecsToFrames(accelPerSec2);
      expect(accelPerFrame2).toBeCloseTo(1); // 900/(30*30) = 1 unit/frame²
    });

    it('should convert angular velocity from degrees/sec to radians/frame', () => {
      const degPerSec = 180; // 180 degrees per second
      const radPerFrame = convertAngularVelocityInDegreesPerSecToRadsPerFrame(degPerSec);
      expect(radPerFrame).toBeCloseTo(Math.PI / 30); // π rad/sec = π/30 rad/frame
    });
  });

  describe('angle utilities', () => {
    it('should normalize angles to -PI to PI range', () => {
      expect(normalizeAngle(3 * Math.PI)).toBeCloseTo(-Math.PI);
      expect(normalizeAngle(-3 * Math.PI)).toBeCloseTo(-Math.PI);
      expect(normalizeAngle(Math.PI / 2)).toBeCloseTo(Math.PI / 2);
    });

    it('should calculate angle differences', () => {
      expect(stdAngleDiff(Math.PI, -Math.PI)).toBeCloseTo(0);
      expect(stdAngleDiff(Math.PI/2, -Math.PI/2)).toBeCloseTo(Math.PI);
      expect(stdAngleDiff(0, Math.PI/2)).toBeCloseTo(-Math.PI/2);
    });
  });

  describe('veterancy flags', () => {
    it('should handle veterancy level flags', () => {
      let flags = 0;
      flags = setVeterancyLevelFlag(flags, VeterancyLevel.VETERAN);
      expect(getVeterancyLevelFlag(flags, VeterancyLevel.VETERAN)).toBe(true);
      expect(getVeterancyLevelFlag(flags, VeterancyLevel.ELITE)).toBe(false);
      
      flags = setVeterancyLevelFlag(flags, VeterancyLevel.ELITE);
      expect(getVeterancyLevelFlag(flags, VeterancyLevel.ELITE)).toBe(true);
      
      flags = clearVeterancyLevelFlag(flags, VeterancyLevel.VETERAN);
      expect(getVeterancyLevelFlag(flags, VeterancyLevel.VETERAN)).toBe(false);
      expect(getVeterancyLevelFlag(flags, VeterancyLevel.ELITE)).toBe(true);
    });
  });

  describe('attack type flags', () => {
    it('should identify forced attacks', () => {
      expect(isForcedAttack(ATTACK_NEW_TARGET)).toBe(false);
      expect(isForcedAttack(ATTACK_NEW_TARGET_FORCED)).toBe(true);
    });

    it('should identify continued attacks', () => {
      expect(isContinuedAttack(ATTACK_NEW_TARGET)).toBe(false);
      expect(isContinuedAttack(ATTACK_CONTINUED_TARGET)).toBe(true);
    });
  });

  describe('LinkedListIterator', () => {
    class TestNode implements ILinkable<TestNode> {
      private next: TestNode | null = null;
      private prev: TestNode | null = null;
      
      constructor(public value: number) {}
      
      getNext(): TestNode | null { return this.next; }
      getPrev(): TestNode | null { return this.prev; }
      setNext(next: TestNode | null): void { this.next = next; }
      setPrev(prev: TestNode | null): void { this.prev = prev; }
    }

    it('should iterate through linked nodes', () => {
      const node1 = new TestNode(1);
      const node2 = new TestNode(2);
      const node3 = new TestNode(3);

      node1.setNext(node2);
      node2.setPrev(node1);
      node2.setNext(node3);
      node3.setPrev(node2);

      const iterator = new LinkedListIterator(node1);
      const values: number[] = [];

      while (!iterator.isDone()) {
        const current = iterator.getCurrent();
        if (current) {
          values.push(current.value);
        }
        iterator.advance();
      }

      expect(values).toEqual([1, 2, 3]);
    });
  });
});