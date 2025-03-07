/*
**  Command & Conquer Generals(tm) TypeScript Conversion
**  Based on original code Copyright 2025 Electronic Arts Inc.
*/

import { Coord3D } from './Coord3D';

/**
 * A 3D matrix class for transformations
 */
export class Matrix3D {
  private elements: number[][];
  
  constructor(scale: number = 1) {
    // Initialize as identity matrix scaled by the provided value
    this.elements = [
      [scale, 0, 0, 0],
      [0, scale, 0, 0],
      [0, 0, scale, 0],
      [0, 0, 0, 1]
    ];
  }
  
  /**
   * Rotate a vector by this matrix
   * @param v The vector to rotate
   * @returns The rotated vector
   */
  Rotate_Vector(v: { X: number, Y: number, Z: number }): { X: number, Y: number, Z: number } {
    // Simple implementation for placeholder purposes
    return {
      X: v.X * this.elements[0][0] + v.Y * this.elements[0][1] + v.Z * this.elements[0][2],
      Y: v.X * this.elements[1][0] + v.Y * this.elements[1][1] + v.Z * this.elements[1][2],
      Z: v.X * this.elements[2][0] + v.Y * this.elements[2][1] + v.Z * this.elements[2][2]
    };
  }
  
  /**
   * Scale the matrix
   * @param scale The scale factor
   */
  Scale(scale: number): void {
    this.elements[0][0] *= scale;
    this.elements[1][1] *= scale;
    this.elements[2][2] *= scale;
  }
  
  /**
   * Rotate around the Z axis
   * @param angle The angle in radians
   */
  Rotate_Z(angle: number): void {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    
    // Create a rotation matrix
    const rotation = [
      [cos, -sin, 0, 0],
      [sin, cos, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ];
    
    // Apply rotation
    this.multiply(rotation);
  }
  
  /**
   * Rotate around the Y axis
   * @param angle The angle in radians
   */
  Rotate_Y(angle: number): void {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    
    // Create a rotation matrix
    const rotation = [
      [cos, 0, sin, 0],
      [0, 1, 0, 0],
      [-sin, 0, cos, 0],
      [0, 0, 0, 1]
    ];
    
    // Apply rotation
    this.multiply(rotation);
  }
  
  /**
   * Get the X vector (first column of the matrix)
   */
  Get_X_Vector(): { X: number, Y: number, Z: number } {
    return {
      X: this.elements[0][0],
      Y: this.elements[1][0],
      Z: this.elements[2][0]
    };
  }
  
  /**
   * Multiply this matrix by another matrix
   */
  private multiply(other: number[][]): void {
    const result: number[][] = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        for (let k = 0; k < 4; k++) {
          result[i][j] += this.elements[i][k] * other[k][j];
        }
      }
    }
    
    this.elements = result;
  }
}