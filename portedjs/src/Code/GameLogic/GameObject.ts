/*
**  Command & Conquer Generals(tm) TypeScript Conversion
**  Based on original code Copyright 2025 Electronic Arts Inc.
*/

import { Coord3D } from '../WWMath/Coord3D';
import { Matrix3D } from '../WWMath/Matrix3D';

/**
 * Basic GameObject interface required for ObjectCreationList implementation
 * This is a simplified placeholder that will likely need to be expanded/replaced
 * as more game logic is implemented
 */
export class GameObject {
  private position: Coord3D;
  private id: number;
  private transformMatrix?: Matrix3D;
  private orientation: number;
  
  constructor(id: number = -1) {
    this.position = new Coord3D();
    this.id = id;
    this.orientation = 0;
  }
  
  /**
   * Get the position of this object
   */
  getPosition(): Coord3D {
    return this.position;
  }
  
  /**
   * Set the position of this object
   */
  setPosition(position: Coord3D): void {
    this.position = position;
  }
  
  /**
   * Get the ID of this object
   */
  getID(): number {
    return this.id;
  }
  
  /**
   * Get the transform matrix of this object
   */
  getTransformMatrix(): Matrix3D | undefined {
    return this.transformMatrix;
  }
  
  /**
   * Set the transform matrix of this object
   */
  setTransformMatrix(matrix: Matrix3D): void {
    this.transformMatrix = matrix;
  }
  
  /**
   * Get the orientation of this object
   */
  getOrientation(): number {
    return this.orientation;
  }
  
  /**
   * Set the orientation of this object
   */
  setOrientation(orientation: number): void {
    this.orientation = orientation;
  }
}