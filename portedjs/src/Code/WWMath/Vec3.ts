/**
 * Vec3 - 3D Vector class for math operations
 */
export class Vec3 {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0
  ) {}

  public static zero(): Vec3 {
    return new Vec3(0, 0, 0);
  }

  public static one(): Vec3 {
    return new Vec3(1, 1, 1);
  }

  public copy(): Vec3 {
    return new Vec3(this.x, this.y, this.z);
  }

  public length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  public lengthSquared(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  public normalize(): Vec3 {
    const len = this.length();
    if (len > 0) {
      this.x /= len;
      this.y /= len;
      this.z /= len;
    }
    return this;
  }

  public add(v: Vec3): Vec3 {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  public sub(v: Vec3): Vec3 {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }

  public mul(scalar: number): Vec3 {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }

  public div(scalar: number): Vec3 {
    if (scalar !== 0) {
      this.x /= scalar;
      this.y /= scalar;
      this.z /= scalar;
    }
    return this;
  }

  public dot(v: Vec3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  public cross(v: Vec3): Vec3 {
    const x = this.y * v.z - this.z * v.y;
    const y = this.z * v.x - this.x * v.z;
    const z = this.x * v.y - this.y * v.x;
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  public distance(v: Vec3): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  public distanceSquared(v: Vec3): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;
    return dx * dx + dy * dy + dz * dz;
  }

  public equals(v: Vec3): boolean {
    return this.x === v.x && this.y === v.y && this.z === v.z;
  }

  public toString(): string {
    return `Vec3(${this.x}, ${this.y}, ${this.z})`;
  }
}