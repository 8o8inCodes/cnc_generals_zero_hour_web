import { describe, it, expect } from 'vitest';
import { Vec3 } from '../Vec3';

describe('Vec3', () => {
  describe('Construction', () => {
    it('should create a zero vector by default', () => {
      const v = new Vec3();
      expect(v.x).toBe(0);
      expect(v.y).toBe(0);
      expect(v.z).toBe(0);
    });

    it('should create a vector with specified components', () => {
      const v = new Vec3(1, 2, 3);
      expect(v.x).toBe(1);
      expect(v.y).toBe(2);
      expect(v.z).toBe(3);
    });
  });

  describe('Static Methods', () => {
    it('should create a zero vector', () => {
      const v = Vec3.zero();
      expect(v.x).toBe(0);
      expect(v.y).toBe(0);
      expect(v.z).toBe(0);
    });

    it('should create a one vector', () => {
      const v = Vec3.one();
      expect(v.x).toBe(1);
      expect(v.y).toBe(1);
      expect(v.z).toBe(1);
    });
  });

  describe('Vector Operations', () => {
    it('should copy vector', () => {
      const v1 = new Vec3(1, 2, 3);
      const v2 = v1.copy();
      expect(v2).not.toBe(v1); // Different object
      expect(v2.x).toBe(1);
      expect(v2.y).toBe(2);
      expect(v2.z).toBe(3);
    });

    it('should calculate length', () => {
      const v = new Vec3(1, 2, 2);
      expect(v.length()).toBeCloseTo(3);
    });

    it('should calculate length squared', () => {
      const v = new Vec3(1, 2, 2);
      expect(v.lengthSquared()).toBe(9);
    });

    it('should normalize vector', () => {
      const v = new Vec3(3, 0, 0);
      v.normalize();
      expect(v.x).toBe(1);
      expect(v.length()).toBe(1);
    });

    it('should add vectors', () => {
      const v1 = new Vec3(1, 2, 3);
      const v2 = new Vec3(2, 3, 4);
      v1.add(v2);
      expect(v1.x).toBe(3);
      expect(v1.y).toBe(5);
      expect(v1.z).toBe(7);
    });

    it('should subtract vectors', () => {
      const v1 = new Vec3(3, 5, 7);
      const v2 = new Vec3(1, 2, 3);
      v1.sub(v2);
      expect(v1.x).toBe(2);
      expect(v1.y).toBe(3);
      expect(v1.z).toBe(4);
    });

    it('should multiply by scalar', () => {
      const v = new Vec3(1, 2, 3);
      v.mul(2);
      expect(v.x).toBe(2);
      expect(v.y).toBe(4);
      expect(v.z).toBe(6);
    });

    it('should divide by scalar', () => {
      const v = new Vec3(2, 4, 6);
      v.div(2);
      expect(v.x).toBe(1);
      expect(v.y).toBe(2);
      expect(v.z).toBe(3);
    });

    it('should calculate dot product', () => {
      const v1 = new Vec3(1, 2, 3);
      const v2 = new Vec3(4, 5, 6);
      expect(v1.dot(v2)).toBe(32); // 1*4 + 2*5 + 3*6
    });

    it('should calculate cross product', () => {
      const v1 = new Vec3(1, 0, 0);
      const v2 = new Vec3(0, 1, 0);
      v1.cross(v2);
      expect(v1.x).toBe(0);
      expect(v1.y).toBe(0);
      expect(v1.z).toBe(1);
    });
  });

  describe('Distance Calculations', () => {
    it('should calculate distance between vectors', () => {
      const v1 = new Vec3(1, 1, 1);
      const v2 = new Vec3(4, 1, 1);
      expect(v1.distance(v2)).toBe(3);
    });

    it('should calculate squared distance between vectors', () => {
      const v1 = new Vec3(1, 1, 1);
      const v2 = new Vec3(4, 1, 1);
      expect(v1.distanceSquared(v2)).toBe(9);
    });
  });

  describe('Comparison', () => {
    it('should compare vectors for equality', () => {
      const v1 = new Vec3(1, 2, 3);
      const v2 = new Vec3(1, 2, 3);
      const v3 = new Vec3(1, 2, 4);
      
      expect(v1.equals(v2)).toBe(true);
      expect(v1.equals(v3)).toBe(false);
    });
  });

  describe('String Representation', () => {
    it('should convert vector to string', () => {
      const v = new Vec3(1, 2, 3);
      expect(v.toString()).toBe('Vec3(1, 2, 3)');
    });
  });
});