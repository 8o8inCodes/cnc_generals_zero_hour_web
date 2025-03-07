/*
**  Command & Conquer Generals(tm) TypeScript Conversion
**  Based on original code Copyright 2025 Electronic Arts Inc.
*/

import { Coord3D } from '../WWMath/Coord3D';
import { Matrix3D } from '../WWMath/Matrix3D';
import { GameObject } from './GameObject';
import { ObjectCreationNugget } from './ObjectCreationList';

/**
 * WeaponTemplate placeholder - would be replaced with actual implementation
 */
export interface WeaponTemplate {
  getName(): string;
}

/**
 * WeaponStore placeholder - would be replaced with actual implementation
 */
export class WeaponStore {
  createAndFireTempWeapon(weapon: WeaponTemplate, source: GameObject | null, target: Coord3D | null): void {
    console.log(`Firing weapon ${weapon.getName()} from object ${source?.getID()} at position ${target?.x},${target?.y},${target?.z}`);
  }
}

/**
 * The global WeaponStore instance
 */
export const TheWeaponStore = new WeaponStore();

/**
 * FireWeaponNugget implementation
 * Creates and fires a weapon from the primary object to the secondary location
 */
export class FireWeaponNugget extends ObjectCreationNugget {
  private weapon: WeaponTemplate | null = null;
  
  constructor(weapon: WeaponTemplate | null = null) {
    super();
    this.weapon = weapon;
  }
  
  setWeapon(weapon: WeaponTemplate): void {
    this.weapon = weapon;
  }
  
  create(primaryObj: GameObject | null, primary: Coord3D | null, secondary: Coord3D | null, lifetimeFrames: number = 0): void {
    if (!primaryObj || !primary || !secondary) {
      console.error("FireWeaponNugget: You must have a primary and secondary source for this effect");
      return;
    }
    
    if (this.weapon) {
      TheWeaponStore.createAndFireTempWeapon(this.weapon, primaryObj, secondary);
    }
  }
}

/**
 * Factory function to create a FireWeaponNugget from parsed INI data
 * @param weapon The weapon template to use
 * @returns A new FireWeaponNugget
 */
export function createFireWeaponNugget(weapon: WeaponTemplate): FireWeaponNugget {
  return new FireWeaponNugget(weapon);
}

/**
 * PhysicsBehavior placeholder - would be replaced with actual implementation
 */
export interface PhysicsBehavior {
  applyForce(force: Coord3D): void;
  setYawRate(rate: number): void;
  setRollRate(rate: number): void;
  setPitchRate(rate: number): void;
}

/**
 * Math utility functions
 */
export class MathUtil {
  /**
   * Generate a random value between min and max
   */
  static randomValue(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }

  /**
   * Generate a random real value between min and max
   */
  static randomValueReal(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }
}

/**
 * Helper function to calculate a random force vector
 */
function calcRandomForce(minMag: number, maxMag: number, minPitch: number, maxPitch: number): Coord3D {
  const angle = MathUtil.randomValueReal(0, 2 * Math.PI);
  const pitch = MathUtil.randomValueReal(minPitch, maxPitch);
  const mag = MathUtil.randomValueReal(minMag, maxMag);

  const matrix = new Matrix3D(1);
  matrix.Scale(mag);
  matrix.Rotate_Z(angle);
  matrix.Rotate_Y(-pitch);

  const v = matrix.Get_X_Vector();
  
  return new Coord3D(v.X, v.Y, v.Z);
}

/**
 * ApplyRandomForceNugget implementation
 * Applies a random force and spin to the primary object
 */
export class ApplyRandomForceNugget extends ObjectCreationNugget {
  private spinRate: number = 0;
  private minMag: number = 0;
  private maxMag: number = 0;
  private minPitch: number = 0;
  private maxPitch: number = 0;
  
  constructor() {
    super();
  }
  
  setSpinRate(rate: number): void {
    this.spinRate = rate;
  }
  
  setForceMagnitude(min: number, max: number): void {
    this.minMag = min;
    this.maxMag = max;
  }
  
  setForcePitch(min: number, max: number): void {
    this.minPitch = min;
    this.maxPitch = max;
  }
  
  create(primaryObj: GameObject | null, primary: Coord3D | null, secondary: Coord3D | null, lifetimeFrames: number = 0): void {
    // For this nugget, we expect to work with the object version
    console.error("ApplyRandomForceNugget: You must call this effect with an object, not a location");
  }
  
  create(primary: GameObject | null, secondary: GameObject | null, lifetimeFrames: number = 0): void {
    if (!primary) {
      console.error("ApplyRandomForceNugget: You must have a primary source for this effect");
      return;
    }
    
    // Note: In TypeScript we'd need a way to get the physics from GameObject
    // This is a placeholder implementation using a hypothetical getPhysics method
    const physics = this.getPhysics(primary);
    if (physics) {
      const force = calcRandomForce(this.minMag, this.maxMag, this.minPitch, this.maxPitch);
      physics.applyForce(force);
      
      const yaw = MathUtil.randomValueReal(-this.spinRate, this.spinRate);
      const roll = MathUtil.randomValueReal(-this.spinRate, this.spinRate);
      const pitch = MathUtil.randomValueReal(-this.spinRate, this.spinRate);
      
      physics.setYawRate(yaw);
      physics.setRollRate(roll);
      physics.setPitchRate(pitch);
    } else {
      console.error("ApplyRandomForceNugget: You must have a Physics module source for this effect");
    }
  }
  
  // Placeholder for getting physics from an object
  private getPhysics(obj: GameObject): PhysicsBehavior | null {
    // In a real implementation, GameObject would have a getPhysics method
    return null;
  }
}

/**
 * Factory function to create an ApplyRandomForceNugget
 */
export function createApplyRandomForceNugget(
  spinRate: number, 
  minMag: number, 
  maxMag: number, 
  minPitch: number, 
  maxPitch: number
): ApplyRandomForceNugget {
  const nugget = new ApplyRandomForceNugget();
  nugget.setSpinRate(spinRate);
  nugget.setForceMagnitude(minMag, maxMag);
  nugget.setForcePitch(minPitch, maxPitch);
  return nugget;
}

/**
 * WeaponSlotType enum - types of weapon slots
 */
export enum WeaponSlotType {
  PRIMARY_WEAPON = 0,
  SECONDARY_WEAPON = 1
}

/**
 * AIUpdateInterface placeholder - would be replaced with actual implementation
 */
export interface AIUpdateInterface {
  aiAttackPosition(position: Coord3D | null, numShots: number, fromAI: boolean): void;
}

/**
 * RadiusDecalTemplate placeholder - would be replaced with actual implementation
 */
export interface RadiusDecalTemplate {
  getName(): string;
}

/**
 * RadiusDecalUpdate placeholder - would be replaced with actual implementation
 */
export interface RadiusDecalUpdate {
  createRadiusDecal(template: RadiusDecalTemplate, radius: number, position: Coord3D): void;
  killWhenNoLongerAttacking(kill: boolean): void;
}

/**
 * AttackNugget implementation
 * Makes the primary object attack the secondary position
 */
export class AttackNugget extends ObjectCreationNugget {
  private numberOfShots: number = 1;
  private weaponSlot: WeaponSlotType = WeaponSlotType.PRIMARY_WEAPON;
  private deliveryDecalTemplate: RadiusDecalTemplate | null = null;
  private deliveryDecalRadius: number = 0;
  
  constructor() {
    super();
  }
  
  setNumberOfShots(shots: number): void {
    this.numberOfShots = shots;
  }
  
  setWeaponSlot(slot: WeaponSlotType): void {
    this.weaponSlot = slot;
  }
  
  setDeliveryDecal(template: RadiusDecalTemplate | null, radius: number): void {
    this.deliveryDecalTemplate = template;
    this.deliveryDecalRadius = radius;
  }
  
  create(primaryObj: GameObject | null, primary: Coord3D | null, secondary: Coord3D | null, lifetimeFrames: number = 0): void {
    if (!primaryObj || !primary || !secondary) {
      console.error("AttackNugget: You must have a primary and secondary source for this effect");
      return;
    }
    
    // Get AI interface (placeholder implementation)
    const ai = this.getAIUpdateInterface(primaryObj);
    if (ai) {
      // Set weapon lock (placeholder implementation)
      this.setWeaponLock(primaryObj, this.weaponSlot, true);
      
      // Command AI to attack the position
      ai.aiAttackPosition(secondary, this.numberOfShots, true);
    }
    
    // Apply radius decal if configured
    const rd = this.getRadiusDecalUpdate(primaryObj);
    if (rd && this.deliveryDecalTemplate) {
      rd.createRadiusDecal(this.deliveryDecalTemplate, this.deliveryDecalRadius, secondary);
      rd.killWhenNoLongerAttacking(true);
    }
  }
  
  // Placeholder for getting AI interface from an object
  private getAIUpdateInterface(obj: GameObject): AIUpdateInterface | null {
    // In a real implementation, GameObject would have a getAIUpdateInterface method
    return null;
  }
  
  // Placeholder for getting radius decal update from an object
  private getRadiusDecalUpdate(obj: GameObject): RadiusDecalUpdate | null {
    // In a real implementation, GameObject would have a findUpdateModule method
    return null;
  }
  
  // Placeholder for setting weapon lock
  private setWeaponLock(obj: GameObject, slot: WeaponSlotType, locked: boolean): void {
    // In a real implementation, GameObject would have a setWeaponLock method
  }
}

/**
 * Factory function to create an AttackNugget
 */
export function createAttackNugget(
  numberOfShots: number = 1,
  weaponSlot: WeaponSlotType = WeaponSlotType.PRIMARY_WEAPON,
  deliveryDecalTemplate: RadiusDecalTemplate | null = null,
  deliveryDecalRadius: number = 0
): AttackNugget {
  const nugget = new AttackNugget();
  nugget.setNumberOfShots(numberOfShots);
  nugget.setWeaponSlot(weaponSlot);
  nugget.setDeliveryDecal(deliveryDecalTemplate, deliveryDecalRadius);
  return nugget;
}

/**
 * DeliverPayloadData - encapsulates configuration for payload delivery
 */
export class DeliverPayloadData {
  // Distance to target (how far the transport should go beyond the target)
  distToTarget: number = 0;
  
  // Delivery decal configuration
  deliveryDecalTemplate: RadiusDecalTemplate | null = null;
  deliveryDecalRadius: number = 0;
  
  // Additional configuration that would be needed in a full implementation
  // (simplified for this conversion)
}

/**
 * Payload struct - represents a single payload item
 */
interface Payload {
  // The name of the payload object
  payloadName: string;
  
  // How many of this payload to create
  payloadCount: number;
}

/**
 * ThingFactory placeholder - would be replaced with actual implementation
 */
export class ThingFactory {
  /**
   * Find a template by name
   */
  findTemplate(name: string): any {
    // In a real implementation, this would return the actual template
    return { name };
  }
  
  /**
   * Create a new object from a template
   */
  newObject(template: any, owner: any): GameObject | null {
    // In a real implementation, this would create the actual object
    return new GameObject();
  }
}

/**
 * The global ThingFactory instance
 */
export const TheThingFactory = new ThingFactory();

/**
 * Container interface - placeholder for container functionality
 */
export interface Container {
  isValidContainerFor(obj: GameObject, checkOnly: boolean): boolean;
  addToContain(obj: GameObject): void;
}

/**
 * DeliverPayloadAIUpdate interface - placeholder for AI update functionality
 */
export interface DeliverPayloadAIUpdate {
  deliverPayload(moveToPos: Coord3D, targetPos: Coord3D, data: DeliverPayloadData): void;
  getCurLocomotor(): Locomotor;
}

/**
 * Locomotor interface - placeholder for locomotor functionality
 */
export interface Locomotor {
  getPreferredHeight(): number;
  getMaxSpeedForCondition(condition: number): number;
}

/**
 * TerrainLogic placeholder - would be replaced with actual implementation
 */
export class TerrainLogic {
  getGroundHeight(x: number, y: number): number {
    // In a real implementation, this would return the actual ground height
    return 0;
  }
}

/**
 * The global TerrainLogic instance
 */
export const TheTerrainLogic = new TerrainLogic();

/**
 * DeliverPayloadNugget implementation
 * Creates and delivers payload objects to a target location
 */
export class DeliverPayloadNugget extends ObjectCreationNugget {
  // Transport configuration
  private transportName: string = "";
  private startAtPreferredHeight: boolean = true;
  private startAtMaxSpeed: boolean = false;
  
  // Formation configuration
  private formationSize: number = 1;
  private formationSpacing: number = 25.0;
  private errorRadius: number = 0.0;
  private delayDeliveryFramesMax: number = 0;
  private convergenceFactor: number = 0.0;
  
  // Payload configuration
  private payload: Payload[] = [];
  private putInContainerName: string = "";
  
  // Delivery data
  private data: DeliverPayloadData = new DeliverPayloadData();
  
  constructor() {
    super();
  }
  
  setTransportName(name: string): void {
    this.transportName = name;
  }
  
  setStartAtPreferredHeight(value: boolean): void {
    this.startAtPreferredHeight = value;
  }
  
  setStartAtMaxSpeed(value: boolean): void {
    this.startAtMaxSpeed = value;
  }
  
  setFormation(size: number, spacing: number): void {
    this.formationSize = size;
    this.formationSpacing = spacing;
  }
  
  setErrorRadius(radius: number): void {
    this.errorRadius = radius;
  }
  
  setDelayDeliveryFramesMax(frames: number): void {
    this.delayDeliveryFramesMax = frames;
  }
  
  setConvergenceFactor(factor: number): void {
    this.convergenceFactor = factor;
  }
  
  addPayload(name: string, count: number): void {
    this.payload.push({ payloadName: name, payloadCount: count });
  }
  
  setPutInContainer(name: string): void {
    this.putInContainerName = name;
  }
  
  setDeliveryData(data: DeliverPayloadData): void {
    this.data = data;
  }
  
  // Default implementation for standard object version
  create(primaryObj: GameObject | null, primary: Coord3D | null, secondary: Coord3D | null, lifetimeFrames: number = 0): void {
    this.create(primaryObj, primary, secondary, true, lifetimeFrames);
  }
  
  // Main implementation that accepts createOwner flag
  create(primaryObj: GameObject | null, primary: Coord3D | null, secondary: Coord3D | null, createOwner: boolean, lifetimeFrames: number = 0): void {
    if (!primaryObj || !primary || !secondary) {
      console.error("DeliverPayloadNugget: You must have a primary and secondary source for this effect");
      return;
    }
    
    // Get the owner (team) from the primary object
    const owner = this.getOwner(primaryObj);
    
    // Calculate formation vectors for multiple transports
    let CCWx = 0, CCWy = 0, CWx = 0, CWy = 0;
    
    if (this.formationSize > 1) {
      // Get the delta x and y values from the target to the origin
      const dx = primary.x - secondary.x;
      const dy = primary.y - secondary.y;
      
      // Calculate length
      const length = Math.sqrt(dx*dx + dy*dy);
      
      // Normalize length
      const ndx = dx / length;
      const ndy = dy / length;
      
      // Rotate 90 degrees CCW
      const radians = 90.0 * Math.PI / 180.0;
      const s = Math.sin(radians);
      const c = Math.cos(radians);
      CCWx = ndx * c + ndy * -s + ndx;
      CCWy = ndx * s + ndy * c + ndy;
      
      // Rotate 90 degrees CW
      const s2 = Math.sin(-radians);
      const c2 = Math.cos(-radians);
      CWx = ndx * c2 + ndy * -s2 + ndx;
      CWy = ndx * s2 + ndy * c2 + ndy;
    }
    
    // Create formations and deliver payloads
    for (let formationIndex = 0; formationIndex < this.formationSize; formationIndex++) {
      const offset = new Coord3D();
      
      const offsetMultiplier = Math.floor((formationIndex + 1) / 2) * this.formationSpacing;
      
      // Apply appropriate offset based on formation position
      if (formationIndex % 2) {
        // Formation index is odd -- use the CCW deltas
        offset.x = CCWx * offsetMultiplier;
        offset.y = CCWy * offsetMultiplier;
      } else {
        // Formation index is even -- use the CW deltas
        offset.x = CWx * offsetMultiplier;
        offset.y = CWy * offsetMultiplier;
      }
      
      // Calculate positions
      const startPos = primary.clone();
      const moveToPos = secondary.clone();
      startPos.add(offset);
      moveToPos.add(offset);
      
      const targetPos = secondary.clone();
      
      // Apply convergence factor to target position
      targetPos.x += offset.x * (1.0 - this.convergenceFactor);
      targetPos.y += offset.y * (1.0 - this.convergenceFactor);
      
      // Apply random error to target position (except for first formation)
      if (this.errorRadius > 1.0 && formationIndex > 0) {
        const randomRadius = MathUtil.randomValueReal(0, this.errorRadius);
        const randomAngle = MathUtil.randomValueReal(0, Math.PI * 2);
        targetPos.x += randomRadius * Math.cos(randomAngle);
        targetPos.y += randomRadius * Math.sin(randomAngle);
      }
      
      // Calculate orientation
      const orient = Math.atan2(moveToPos.y - startPos.y, moveToPos.x - startPos.x);
      
      // Adjust start position based on distance to target
      if (this.data.distToTarget > 0) {
        const SLOP = 1.5;
        startPos.x -= Math.cos(orient) * this.data.distToTarget * SLOP;
        startPos.y -= Math.sin(orient) * this.data.distToTarget * SLOP;
      }
      
      // Create or use the transport
      let transport: GameObject | null = null;
      
      if (createOwner) {
        const ttn = TheThingFactory.findTemplate(this.transportName);
        transport = TheThingFactory.newObject(ttn, owner);
        
        if (!transport) {
          return;
        }
        
        transport.setPosition(startPos);
        transport.setOrientation(orient);
        // In a full implementation, we'd set producer and script status as well
        
        // Apply delay if configured
        if (this.delayDeliveryFramesMax > 0) {
          this.setDisabledUntil(transport, MathUtil.randomValue(0, this.delayDeliveryFramesMax));
        }
      } else {
        transport = primaryObj;
      }
      
      // Notify special power tracking (placeholder)
      this.notifySpecialPowerTracking(transport, primaryObj, formationIndex === 0);
      
      // Setup delivery AI
      const ai = this.getDeliverPayloadAIUpdate(transport);
      if (ai) {
        // Apply starting speed if configured
        if (this.startAtMaxSpeed && createOwner) {
          const physics = this.getPhysics(transport);
          if (physics) {
            const dirVector = this.getUnitDirectionVector2D(transport);
            if (dirVector) {
              const locomotor = ai.getCurLocomotor();
              const maxSpeed = locomotor.getMaxSpeedForCondition(0); // 0 = no damage
              const mass = this.getMass(physics);
              const factor = maxSpeed * mass;
              
              const startingForce = new Coord3D(
                dirVector.x * factor,
                dirVector.y * factor,
                dirVector.z * factor
              );
              
              physics.applyForce(startingForce);
            }
          }
        }
        
        // Configure the delivery data for this formation
        const data = { ...this.data };
        if (formationIndex !== 0) {
          data.deliveryDecalRadius = 0; // Only first formation gets a decal
        }
        
        // Deliver the payload
        ai.deliverPayload(moveToPos, targetPos, data);
        
        // Set height if configured
        if (this.startAtPreferredHeight && createOwner) {
          startPos.z = TheTerrainLogic.getGroundHeight(startPos.x, startPos.y) + 
                      ai.getCurLocomotor().getPreferredHeight();
          transport.setPosition(startPos);
        }
        
        // Create the payload objects and add them to the transport
        // (greatly simplified from the original implementation)
        const putInContainerTmpl = this.putInContainerName ? 
                                  TheThingFactory.findTemplate(this.putInContainerName) : null;
        
        for (const item of this.payload) {
          const payloadTmpl = TheThingFactory.findTemplate(item.payloadName);
          
          for (let i = 0; i < item.payloadCount; i++) {
            // Create the payload object
            const payload = TheThingFactory.newObject(payloadTmpl, owner);
            if (!payload) continue;
            
            payload.setPosition(startPos);
            // In a full implementation, we'd set producer as well
            
            // Notify special power tracking (placeholder)
            this.notifySpecialPowerTracking(payload, primaryObj, formationIndex === 0 && i === 0);
            
            let finalPayload = payload;
            
            // Create container if needed
            if (putInContainerTmpl) {
              const container = TheThingFactory.newObject(putInContainerTmpl, owner);
              if (!container) continue;
              
              container.setPosition(startPos);
              // In a full implementation, we'd set producer as well
              
              // Notify special power tracking (placeholder)
              this.notifySpecialPowerTracking(container, primaryObj, formationIndex === 0 && i === 0);
              
              // Add payload to container
              const containerModule = this.getContainModule(container);
              if (containerModule && containerModule.isValidContainerFor(payload, true)) {
                containerModule.addToContain(payload);
                finalPayload = container;
              } else {
                console.error(`DeliverPayload: PutInContainer ${this.putInContainerName} is full, or not valid for the payload ${item.payloadName}!`);
              }
            }
            
            // Add final payload to transport
            const transportContainer = this.getContainModule(transport);
            if (transportContainer && transportContainer.isValidContainerFor(finalPayload, true)) {
              transportContainer.addToContain(finalPayload);
            } else {
              console.error(`DeliverPayload: transport ${this.transportName} is full, or not valid for the payload ${item.payloadName}!`);
            }
          }
        }
      } else {
        console.error("DeliverPayload: You should really have a DeliverPayloadAIUpdate here");
      }
    }
  }
  
  // Placeholder helper methods (would be implemented in a full conversion)
  
  private getOwner(obj: GameObject): any {
    // In a real implementation, this would return the team/owner
    return null;
  }
  
  private setDisabledUntil(obj: GameObject, frames: number): void {
    // In a real implementation, this would disable the object
  }
  
  private notifySpecialPowerTracking(obj: GameObject, creator: GameObject | null, isLeader: boolean): void {
    // In a real implementation, this would notify special power tracking
  }
  
  private getDeliverPayloadAIUpdate(obj: GameObject): DeliverPayloadAIUpdate | null {
    // In a real implementation, this would return the AI update module
    return null;
  }
  
  private getContainModule(obj: GameObject): Container | null {
    // In a real implementation, this would return the contain module
    return null;
  }
  
  private getPhysics(obj: GameObject): PhysicsBehavior | null {
    // In a real implementation, this would return the physics behavior
    return null;
  }
  
  private getMass(physics: PhysicsBehavior): number {
    // In a real implementation, this would get the mass from physics
    return 1.0;
  }
  
  private getUnitDirectionVector2D(obj: GameObject): Coord3D | null {
    // In a real implementation, this would return the direction vector
    return new Coord3D(1, 0, 0);
  }
}

/**
 * Factory function to create a DeliverPayloadNugget
 */
export function createDeliverPayloadNugget(
  transportName: string,
  formationSize: number = 1,
  formationSpacing: number = 25.0
): DeliverPayloadNugget {
  const nugget = new DeliverPayloadNugget();
  nugget.setTransportName(transportName);
  nugget.setFormation(formationSize, formationSpacing);
  return nugget;
}