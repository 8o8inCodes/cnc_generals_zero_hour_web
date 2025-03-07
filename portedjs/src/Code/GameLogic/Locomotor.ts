// Locomotor.ts - Handles movement and navigation for game objects

import { Vec3 } from "../WWMath/Vec3";
import { GameObject } from "./GameObject";

/**
 * Enum for different locomotor surface types
 */
export enum LocomotorSurfaceType {
  GROUND = 1 << 0,
  WATER = 1 << 1,
  CLIFF = 1 << 2,
  AIR = 1 << 3,
  RUBBLE = 1 << 4
}

/**
 * Type for locomotor surface type masks (bitfield)
 */
export type LocomotorSurfaceTypeMask = number;

/**
 * Enum for locomotor Z adjustment types
 */
export enum LocomotorZAdjustType {
  ABSOLUTE = 0,
  TERRAIN_RELATIVE,
  TERRAIN_INFLUENCE
}

/**
 * Enum for locomotor appearance types
 */
export enum LocomotorAppearanceType {
  NORMAL = 0,
  FLOATS,
  FLIES
}

/**
 * The ALL_SURFACES constant represents all possible surface types
 */
export const ALL_SURFACES: LocomotorSurfaceTypeMask = 0xffff;

/**
 * Constants for locomotor physics
 */
const DONUT_TIME_DELAY_SECONDS = 2.5;
const DONUT_DISTANCE = 4.0 * 256.0; // Assuming PATHFIND_CELL_SIZE_F is 256
const MAX_BRAKING_FACTOR = 5.0;

/**
 * Class representing a Locomotor Template - a reusable configuration for locomotors
 */
export class LocomotorTemplate {
  private name: string;
  private legalSurfaces: LocomotorSurfaceTypeMask;
  private speed: number;
  private turnRadius: number;
  private acceleration: number;
  private deceleration: number;
  private isDownhillOnly: boolean;
  private maxSlope: number;
  private zAdjustment: LocomotorZAdjustType;
  private appearance: LocomotorAppearanceType;
  
  constructor(name: string) {
    this.name = name;
    this.legalSurfaces = LocomotorSurfaceType.GROUND;
    this.speed = 1.0;
    this.turnRadius = 1.0;
    this.acceleration = 0.1;
    this.deceleration = 0.1;
    this.isDownhillOnly = false;
    this.maxSlope = 1.0;
    this.zAdjustment = LocomotorZAdjustType.TERRAIN_RELATIVE;
    this.appearance = LocomotorAppearanceType.NORMAL;
  }

  public getName(): string {
    return this.name;
  }

  public setLegalSurfaces(surfaces: LocomotorSurfaceTypeMask): void {
    this.legalSurfaces = surfaces;
  }

  public getLegalSurfaces(): LocomotorSurfaceTypeMask {
    return this.legalSurfaces;
  }

  public setSpeed(speed: number): void {
    this.speed = speed;
  }

  public getSpeed(): number {
    return this.speed;
  }

  public setTurnRadius(radius: number): void {
    this.turnRadius = radius;
  }

  public getTurnRadius(): number {
    return this.turnRadius;
  }

  public setAcceleration(accel: number): void {
    this.acceleration = accel;
  }

  public getAcceleration(): number {
    return this.acceleration;
  }

  public setDeceleration(decel: number): void {
    this.deceleration = decel;
  }

  public getDeceleration(): number {
    return this.deceleration;
  }

  public setIsDownhillOnly(downhillOnly: boolean): void {
    this.isDownhillOnly = downhillOnly;
  }

  public getIsDownhillOnly(): boolean {
    return this.isDownhillOnly;
  }

  public setMaxSlope(slope: number): void {
    this.maxSlope = slope;
  }

  public getMaxSlope(): number {
    return this.maxSlope;
  }

  public setZAdjustment(zAdjust: LocomotorZAdjustType): void {
    this.zAdjustment = zAdjust;
  }

  public getZAdjustment(): LocomotorZAdjustType {
    return this.zAdjustment;
  }

  public setAppearance(appearance: LocomotorAppearanceType): void {
    this.appearance = appearance;
  }

  public getAppearance(): LocomotorAppearanceType {
    return this.appearance;
  }
}

/**
 * The main Locomotor class - handles movement for a game object
 */
export class Locomotor {
  private template: LocomotorTemplate;
  private currentObject: GameObject | null;
  
  // Movement state
  private position: Vec3;
  private direction: Vec3;
  private velocity: Vec3;
  private speed: number;
  private turnRate: number;
  
  // Goal state
  private goalPosition: Vec3 | null;
  private goalDirection: Vec3 | null;
  private hasGoalPosition: boolean;
  private hasGoalDirection: boolean;
  
  // Path state
  private path: Vec3[];
  private currentPathIndex: number;
  
  constructor(template: LocomotorTemplate) {
    this.template = template;
    this.currentObject = null;
    
    this.position = Vec3.zero();
    this.direction = new Vec3(1, 0, 0);
    this.velocity = Vec3.zero();
    this.speed = 0;
    this.turnRate = 0;
    
    this.goalPosition = null;
    this.goalDirection = null;
    this.hasGoalPosition = false;
    this.hasGoalDirection = false;
    
    this.path = [];
    this.currentPathIndex = -1;
  }

  /**
   * Gets the legal surfaces this locomotor can traverse
   */
  public getLegalSurfaces(): LocomotorSurfaceTypeMask {
    return this.template.getLegalSurfaces();
  }

  /**
   * Gets whether this locomotor is downhill only
   */
  public getIsDownhillOnly(): boolean {
    return this.template.getIsDownhillOnly();
  }

  /**
   * Attaches this locomotor to a game object
   */
  public attachToObject(obj: GameObject): void {
    this.currentObject = obj;
  }

  /**
   * Detaches this locomotor from its game object
   */
  public detachFromObject(): void {
    this.currentObject = null;
  }

  /**
   * Gets the attached game object
   */
  public getObject(): GameObject | null {
    return this.currentObject;
  }

  /**
   * Sets a goal position for the locomotor
   */
  public setGoalPosition(pos: Vec3): void {
    this.goalPosition = pos.copy();
    this.hasGoalPosition = true;
  }

  /**
   * Clears the goal position
   */
  public clearGoalPosition(): void {
    this.goalPosition = null;
    this.hasGoalPosition = false;
  }

  /**
   * Sets a goal direction for the locomotor
   */
  public setGoalDirection(dir: Vec3): void {
    this.goalDirection = dir.copy().normalize();
    this.hasGoalDirection = true;
  }

  /**
   * Clears the goal direction
   */
  public clearGoalDirection(): void {
    this.goalDirection = null;
    this.hasGoalDirection = false;
  }

  /**
   * Sets the position of this locomotor
   */
  public setPosition(pos: Vec3): void {
    this.position = pos.copy();
  }

  /**
   * Gets the current position
   */
  public getPosition(): Vec3 {
    return this.position.copy();
  }

  /**
   * Sets the direction of this locomotor
   */
  public setDirection(dir: Vec3): void {
    this.direction = dir.copy().normalize();
  }

  /**
   * Gets the current direction
   */
  public getDirection(): Vec3 {
    return this.direction.copy();
  }

  /**
   * Sets the current speed
   */
  public setSpeed(speed: number): void {
    this.speed = Math.max(0, Math.min(speed, this.template.getSpeed()));
  }

  /**
   * Gets the current speed
   */
  public getSpeed(): number {
    return this.speed;
  }

  /**
   * Gets the maximum speed from the template
   */
  public getMaxSpeed(): number {
    return this.template.getSpeed();
  }

  /**
   * Sets the path to follow
   */
  public setPath(path: Vec3[]): void {
    this.path = path.map(p => p.copy());
    this.currentPathIndex = 0;
  }

  /**
   * Checks if we have a path
   */
  public hasPath(): boolean {
    return this.path.length > 0 && this.currentPathIndex < this.path.length;
  }

  /**
   * Gets the distance to the goal position
   */
  public getDistanceToGoal(): number {
    if (!this.goalPosition) {
      return Infinity;
    }
    return this.position.distance(this.goalPosition);
  }

  /**
   * Updates the locomotor state for a frame
   * @param deltaTime The time elapsed since the last update (in seconds)
   */
  public update(deltaTime: number): void {
    if (!this.hasGoalPosition && !this.hasGoalDirection) {
      // Nothing to do if we don't have a goal
      this.decelerate(deltaTime);
      return;
    }

    // Follow the path if we have one
    if (this.hasPath()) {
      this.followPath(deltaTime);
    } else if (this.hasGoalPosition) {
      this.moveToGoal(deltaTime);
    }

    // Update orientation
    if (this.hasGoalDirection) {
      this.turnTowards(this.goalDirection!, deltaTime);
    } else if (this.speed > 0.01) {
      // If we're moving, face the direction we're moving
      const moveDir = new Vec3(this.velocity.x, this.velocity.y, 0).normalize();
      this.turnTowards(moveDir, deltaTime);
    }

    // Update position based on velocity
    if (this.speed > 0) {
      this.position.add(new Vec3(
        this.velocity.x * deltaTime,
        this.velocity.y * deltaTime,
        this.velocity.z * deltaTime
      ));
    }
  }

  /**
   * Follow the current path
   */
  private followPath(deltaTime: number): void {
    if (this.currentPathIndex >= this.path.length) {
      this.decelerate(deltaTime);
      return;
    }

    const nextPoint = this.path[this.currentPathIndex];
    const distToNext = this.position.distance(nextPoint);

    // If we've reached this waypoint, move to the next one
    if (distToNext < 0.5) { // Using a small threshold
      this.currentPathIndex++;
      if (this.currentPathIndex >= this.path.length) {
        this.decelerate(deltaTime);
        return;
      }
    }

    // Move toward the current waypoint
    this.moveTowards(nextPoint, deltaTime);
  }

  /**
   * Move toward the specified position
   */
  private moveTowards(target: Vec3, deltaTime: number): void {
    const diff = new Vec3(
      target.x - this.position.x,
      target.y - this.position.y,
      0
    );
    
    const distance = diff.length();
    if (distance < 0.01) {
      this.decelerate(deltaTime);
      return;
    }

    // Normalize the direction
    diff.normalize();

    // Calculate desired velocity based on remaining distance to target
    let targetSpeed = this.template.getSpeed();

    // Apply deceleration as we approach the target
    const stopDistance = this.calcStoppingDistance();
    if (distance < stopDistance) {
      targetSpeed *= distance / stopDistance;
    }

    // Accelerate or decelerate toward target speed
    this.adjustSpeed(targetSpeed, deltaTime);

    // Set velocity based on direction and speed
    this.velocity = new Vec3(
      diff.x * this.speed,
      diff.y * this.speed,
      0
    );
  }

  /**
   * Move toward the goal position
   */
  private moveToGoal(deltaTime: number): void {
    if (this.goalPosition) {
      this.moveTowards(this.goalPosition, deltaTime);
    }
  }

  /**
   * Turn toward a target direction
   */
  private turnTowards(targetDir: Vec3, deltaTime: number): void {
    // Simplified for 2D - just interpolate the direction
    const maxTurnRate = Math.PI / this.template.getTurnRadius();
    const turnRate = maxTurnRate * deltaTime;

    // Calculate current and target angles
    const currentAngle = Math.atan2(this.direction.y, this.direction.x);
    const targetAngle = Math.atan2(targetDir.y, targetDir.x);

    // Find the shortest angle to turn
    let angleDiff = targetAngle - currentAngle;
    while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

    // Limit by turn rate
    const clampedDiff = Math.max(-turnRate, Math.min(turnRate, angleDiff));
    const newAngle = currentAngle + clampedDiff;

    // Update direction
    this.direction.x = Math.cos(newAngle);
    this.direction.y = Math.sin(newAngle);
    this.direction.z = 0;
  }

  /**
   * Adjust speed toward the target speed
   */
  private adjustSpeed(targetSpeed: number, deltaTime: number): void {
    if (targetSpeed > this.speed) {
      // Accelerate
      this.speed += this.template.getAcceleration() * deltaTime;
      if (this.speed > targetSpeed) {
        this.speed = targetSpeed;
      }
    } else if (targetSpeed < this.speed) {
      // Decelerate
      this.speed -= this.template.getDeceleration() * deltaTime;
      if (this.speed < targetSpeed) {
        this.speed = targetSpeed;
      }
    }
  }

  /**
   * Decelerate to a stop
   */
  private decelerate(deltaTime: number): void {
    this.adjustSpeed(0, deltaTime);
    if (this.speed < 0.01) {
      this.speed = 0;
      this.velocity = Vec3.zero();
    }
  }

  /**
   * Calculate the distance needed to stop from current speed
   */
  private calcStoppingDistance(): number {
    // Simple physics: stopping distance = v² / (2 * deceleration)
    return (this.speed * this.speed) / (2 * this.template.getDeceleration());
  }
}

/**
 * The LocomotorSet class - manages a collection of locomotors for different surfaces
 */
export class LocomotorSet {
  private locomotors: Locomotor[];
  private validLocomotorSurfaces: LocomotorSurfaceTypeMask;
  private downhillOnly: boolean;
  
  constructor() {
    this.locomotors = [];
    this.validLocomotorSurfaces = 0;
    this.downhillOnly = false;
  }
  
  /**
   * Clears all locomotors from this set
   */
  public clear(): void {
    this.locomotors = [];
    this.validLocomotorSurfaces = 0;
    this.downhillOnly = false;
  }
  
  /**
   * Adds a locomotor to this set
   */
  public addLocomotor(template: LocomotorTemplate): void {
    const loco = new Locomotor(template);
    this.locomotors.push(loco);
    this.validLocomotorSurfaces |= loco.getLegalSurfaces();
    
    if (loco.getIsDownhillOnly()) {
      if (this.locomotors.length > 1 && !this.downhillOnly) {
        console.error("LocomotorSet: Cannot mix downhill-only locomotors with non-downhill-only ones!");
      }
      this.downhillOnly = true;
    } else {
      // Previous locos were gravity only, but this one isn't!
      if (this.downhillOnly && this.locomotors.length > 1) {
        console.error("LocomotorSet: Cannot mix downhill-only locomotors with non-downhill-only ones!");
      }
    }
  }
  
  /**
   * Finds a locomotor for the given surface type
   */
  public findLocomotor(surfaceType: LocomotorSurfaceTypeMask): Locomotor | null {
    for (const loco of this.locomotors) {
      if (loco.getLegalSurfaces() & surfaceType) {
        return loco;
      }
    }
    return null;
  }
  
  /**
   * Gets the valid surface types for this locomotor set
   */
  public getValidSurfaces(): LocomotorSurfaceTypeMask {
    return this.validLocomotorSurfaces;
  }
  
  /**
   * Gets whether all locomotors in this set are downhill-only
   */
  public isDownhillOnly(): boolean {
    return this.downhillOnly;
  }
  
  /**
   * Gets the number of locomotors in this set
   */
  public getCount(): number {
    return this.locomotors.length;
  }
  
  /**
   * Gets a locomotor by index
   */
  public getLocomotor(index: number): Locomotor | null {
    if (index >= 0 && index < this.locomotors.length) {
      return this.locomotors[index];
    }
    return null;
  }
}

/**
 * LocomotorStore - A singleton class that manages locomotor templates
 */
export class LocomotorStore {
  private static instance: LocomotorStore | null = null;
  private locomotorTemplates: Map<string, LocomotorTemplate>;
  
  private constructor() {
    this.locomotorTemplates = new Map<string, LocomotorTemplate>();
  }
  
  /**
   * Gets the singleton instance of LocomotorStore
   */
  public static getInstance(): LocomotorStore {
    if (!LocomotorStore.instance) {
      LocomotorStore.instance = new LocomotorStore();
    }
    return LocomotorStore.instance;
  }
  
  /**
   * Finds a locomotor template by name
   */
  public findLocomotorTemplate(name: string): LocomotorTemplate | null {
    return this.locomotorTemplates.get(name) || null;
  }
  
  /**
   * Creates a new locomotor from a template
   */
  public newLocomotor(template: LocomotorTemplate): Locomotor {
    return new Locomotor(template);
  }
  
  /**
   * Creates a new locomotor template override
   */
  public newOverride(locoTemplate: LocomotorTemplate): LocomotorTemplate {
    const newTemplate = new LocomotorTemplate(locoTemplate.getName() + "_Override");
    // Copy the properties from the original template
    newTemplate.setLegalSurfaces(locoTemplate.getLegalSurfaces());
    newTemplate.setSpeed(locoTemplate.getSpeed());
    newTemplate.setTurnRadius(locoTemplate.getTurnRadius());
    newTemplate.setAcceleration(locoTemplate.getAcceleration());
    newTemplate.setDeceleration(locoTemplate.getDeceleration());
    newTemplate.setIsDownhillOnly(locoTemplate.getIsDownhillOnly());
    newTemplate.setMaxSlope(locoTemplate.getMaxSlope());
    newTemplate.setZAdjustment(locoTemplate.getZAdjustment());
    newTemplate.setAppearance(locoTemplate.getAppearance());
    return newTemplate;
  }
  
  /**
   * Registers a new locomotor template
   */
  public registerTemplate(template: LocomotorTemplate): void {
    this.locomotorTemplates.set(template.getName(), template);
  }
  
  /**
   * Parses locomotor templates from INI data
   */
  public parseLocomotorTemplateDefinition(iniData: any): void {
    // This would parse INI data and create templates
    // For now, just a stub as we don't have the INI system implemented
    console.log("Parsing locomotor templates from INI data");
  }
}

// Export a global instance of LocomotorStore for convenience
export const TheLocomotorStore = LocomotorStore.getInstance();