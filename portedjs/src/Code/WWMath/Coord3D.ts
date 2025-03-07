/*
**  Command & Conquer Generals(tm) TypeScript Conversion
**  Based on original code Copyright 2025 Electronic Arts Inc.
*/

/**
 * A 3D coordinate/vector class
 */
export class Coord3D {
  x: number;
  y: number;
  z: number;

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * Reset all components to zero
   */
  zero(): void {
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }

  /**
   * Add another Coord3D to this one
   * @param other The Coord3D to add
   */
  add(other: Coord3D): void {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
  }

  /**
   * Clone this Coord3D
   * @returns A new Coord3D with the same values
   */
  clone(): Coord3D {
    return new Coord3D(this.x, this.y, this.z);
  }
}