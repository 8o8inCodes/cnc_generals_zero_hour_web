/*
**  Command & Conquer Generals(tm) TypeScript Conversion
**  Based on original code Copyright 2025 Electronic Arts Inc.
*/

import { Coord3D } from '../WWMath/Coord3D';
import { Matrix3D } from '../WWMath/Matrix3D';
import { GameObject } from './GameObject';
import { NameKeyType } from '../Common/NameKeyGenerator';
import { SubsystemInterface } from '../interfaces/SubsystemInterface';

/**
 * An ObjectCreationNugget encapsulates the creation of an Object.
 * ObjectCreationNuggets are virtually never used on their own, but rather,
 * as a component of an ObjectCreationList.
 */
export abstract class ObjectCreationNugget {
  /**
   * The main method for executing the nugget's object creation behavior
   * @param primaryObj The primary object (can be null)
   * @param primary Primary position (can be null) 
   * @param secondary Secondary position (can be null)
   * @param lifetimeFrames Optional lifetime in frames
   */
  abstract create(primaryObj: GameObject | null, primary: Coord3D | null, 
                  secondary: Coord3D | null, lifetimeFrames?: number): void;

  /**
   * Object-based version, by default calls the location-based implementation
   */
  create(primary: GameObject | null, secondary: GameObject | null, lifetimeFrames: number = 0): void {
    this.create(
      primary, 
      primary ? primary.getPosition() : null, 
      secondary ? secondary.getPosition() : null, 
      lifetimeFrames
    );
  }

  /**
   * Variation used by DeliverPayload - createOwner specifies whether we are creating 
   * the transport object or using the existing one
   */
  create(primaryObj: GameObject | null, primary: Coord3D | null, 
         secondary: Coord3D | null, createOwner: boolean, lifetimeFrames: number = 0): void {
    this.create(primaryObj, primary, secondary, lifetimeFrames);
  }
}

/**
 * An ObjectCreationList is a way of creating a particular set of Objects.
 * It contains a collection of ObjectCreationNuggets that are executed together.
 */
export class ObjectCreationList {
  // This list doesn't own the nuggets; all nuggets are owned by the Store
  private nuggets: ObjectCreationNugget[] = [];

  /**
   * Clear all nuggets from this list
   */
  clear(): void {
    this.nuggets = [];
  }

  /**
   * Add a nugget to this list
   */
  addObjectCreationNugget(nugget: ObjectCreationNugget): void {
    this.nuggets.push(nugget);
    TheObjectCreationListStore.addObjectCreationNugget(nugget);
  }

  /**
   * Static convenience method to create objects (handles null OCL)
   */
  static create(ocl: ObjectCreationList | null, primaryObj: GameObject | null, 
                primary: Coord3D | null, secondary: Coord3D | null, 
                createOwner: boolean, lifetimeFrames: number = 0): void {
    if (ocl) {
      ocl.create(primaryObj, primary, secondary, createOwner, lifetimeFrames);
    }
  }

  /**
   * Static convenience method to create objects (handles null OCL)
   */
  static create(ocl: ObjectCreationList | null, primaryObj: GameObject | null, 
                primary: Coord3D | null, secondary: Coord3D | null, 
                lifetimeFrames: number = 0): void {
    if (ocl) {
      ocl.create(primaryObj, primary, secondary, lifetimeFrames);
    }
  }

  /**
   * Static convenience method to create objects (handles null OCL)
   */
  static create(ocl: ObjectCreationList | null, primary: GameObject | null, 
                secondary: GameObject | null, lifetimeFrames: number = 0): void {
    if (ocl) {
      ocl.create(primary, secondary, lifetimeFrames);
    }
  }

  /**
   * Create objects using the nuggets in this list (with createOwner flag)
   */
  private create(primaryObj: GameObject | null, primary: Coord3D | null, 
                 secondary: Coord3D | null, createOwner: boolean, 
                 lifetimeFrames: number = 0): void {
    if (!primaryObj) {
      console.warn("You should always call OCLs with a non-null primary Obj, even for positional calls, to get team ownership right");
    }
    
    for (const nugget of this.nuggets) {
      nugget.create(primaryObj, primary, secondary, createOwner, lifetimeFrames);
    }
  }

  /**
   * Create objects using the nuggets in this list (standard version)
   */
  private create(primaryObj: GameObject | null, primary: Coord3D | null, 
                 secondary: Coord3D | null, lifetimeFrames: number = 0): void {
    if (!primaryObj) {
      console.warn("You should always call OCLs with a non-null primary Obj, even for positional calls, to get team ownership right");
    }
    
    for (const nugget of this.nuggets) {
      nugget.create(primaryObj, primary, secondary, lifetimeFrames);
    }
  }

  /**
   * Create objects using the nuggets in this list (object-based version)
   */
  private create(primary: GameObject | null, secondary: GameObject | null, 
                 lifetimeFrames: number = 0): void {
    if (!primary) {
      console.warn("You should always call OCLs with a non-null primary Obj, even for positional calls, to get team ownership right");
    }
    
    for (const nugget of this.nuggets) {
      nugget.create(primary, secondary, lifetimeFrames);
    }
  }
}

/**
 * The "store" used to hold all the ObjectCreationLists in existence.
 */
export class ObjectCreationListStore implements SubsystemInterface {
  private ocls: Map<NameKeyType, ObjectCreationList> = new Map();
  private nuggets: ObjectCreationNugget[] = [];

  constructor() {}

  /**
   * Initialize the subsystem
   */
  init(): void {}

  /**
   * Reset the subsystem
   */
  reset(): void {}

  /**
   * Update the subsystem
   */
  update(): void {}

  /**
   * Find an ObjectCreationList by name
   * @param name The name of the ObjectCreationList to find
   * @returns The ObjectCreationList or null if not found
   */
  findObjectCreationList(name: string): ObjectCreationList | null {
    if (name.toLowerCase() === "none") {
      return null;
    }

    const key = name; // In TS implementation, we use the name string directly as key
    const ocl = this.ocls.get(key);
    return ocl || null;
  }

  /**
   * Add a nugget to the store
   */
  addObjectCreationNugget(nugget: ObjectCreationNugget): void {
    this.nuggets.push(nugget);
  }

  /**
   * Parse an ObjectCreationList definition
   * @param ini The INI object to parse from
   */
  static parseObjectCreationListDefinition(/*ini: INIFile*/): void {
    // This will be implemented when INI parsing is available
    // For now, this is just a placeholder
  }
}

/**
 * The global ObjectCreationListStore instance
 */
export const TheObjectCreationListStore = new ObjectCreationListStore();