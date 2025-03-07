import { describe, it, expect, beforeEach } from 'vitest';
import { Vec3 } from '../../WWMath/Vec3';
import { GameObject } from '../GameObject';
import { ObjectID } from '../ObjectID';
import {
  Locomotor,
  LocomotorTemplate,
  LocomotorSurfaceType,
  LocomotorZAdjustType,
  LocomotorAppearanceType,
  LocomotorSet,
  LocomotorStore
} from '../Locomotor';

describe('LocomotorTemplate', () => {
  let template: LocomotorTemplate;
  
  beforeEach(() => {
    template = new LocomotorTemplate('TestLocomotor');
  });
  
  it('should initialize with default values', () => {
    expect(template.getName()).toBe('TestLocomotor');
    expect(template.getLegalSurfaces()).toBe(LocomotorSurfaceType.GROUND);
    expect(template.getSpeed()).toBe(1.0);
    expect(template.getTurnRadius()).toBe(1.0);
    expect(template.getAcceleration()).toBe(0.1);
    expect(template.getDeceleration()).toBe(0.1);
    expect(template.getIsDownhillOnly()).toBe(false);
    expect(template.getMaxSlope()).toBe(1.0);
    expect(template.getZAdjustment()).toBe(LocomotorZAdjustType.TERRAIN_RELATIVE);
    expect(template.getAppearance()).toBe(LocomotorAppearanceType.NORMAL);
  });
  
  it('should set and get properties correctly', () => {
    template.setLegalSurfaces(LocomotorSurfaceType.AIR | LocomotorSurfaceType.WATER);
    expect(template.getLegalSurfaces()).toBe(LocomotorSurfaceType.AIR | LocomotorSurfaceType.WATER);
    
    template.setSpeed(2.5);
    expect(template.getSpeed()).toBe(2.5);
    
    template.setTurnRadius(3.0);
    expect(template.getTurnRadius()).toBe(3.0);
    
    template.setAcceleration(0.2);
    expect(template.getAcceleration()).toBe(0.2);
    
    template.setDeceleration(0.3);
    expect(template.getDeceleration()).toBe(0.3);
    
    template.setIsDownhillOnly(true);
    expect(template.getIsDownhillOnly()).toBe(true);
    
    template.setMaxSlope(0.5);
    expect(template.getMaxSlope()).toBe(0.5);
    
    template.setZAdjustment(LocomotorZAdjustType.ABSOLUTE);
    expect(template.getZAdjustment()).toBe(LocomotorZAdjustType.ABSOLUTE);
    
    template.setAppearance(LocomotorAppearanceType.FLIES);
    expect(template.getAppearance()).toBe(LocomotorAppearanceType.FLIES);
  });
});

describe('Locomotor', () => {
  let template: LocomotorTemplate;
  let locomotor: Locomotor;
  
  beforeEach(() => {
    template = new LocomotorTemplate('TestLocomotor');
    template.setSpeed(100.0); // Increased speed for tests
    template.setTurnRadius(2.0);
    template.setAcceleration(50.0); // Increased acceleration
    template.setDeceleration(50.0); // Increased deceleration
    
    locomotor = new Locomotor(template);
  });
  
  it('should initialize with default values', () => {
    expect(locomotor.getSpeed()).toBe(0);
    expect(locomotor.getMaxSpeed()).toBe(100.0);
    expect(locomotor.getPosition().equals(Vec3.zero())).toBe(true);
    expect(locomotor.getDirection().equals(new Vec3(1, 0, 0))).toBe(true);
  });
  
  it('should attach and detach from game objects', () => {
    // Use object ID directly as a number since it's a type alias
    const object = new GameObject(1 as ObjectID);
    locomotor.attachToObject(object);
    expect(locomotor.getObject()).toBe(object);
    
    locomotor.detachFromObject();
    expect(locomotor.getObject()).toBe(null);
  });
  
  it('should set and get position correctly', () => {
    const pos = new Vec3(10, 20, 30);
    locomotor.setPosition(pos);
    
    // Check that we get a copy, not the original
    expect(locomotor.getPosition()).not.toBe(pos);
    expect(locomotor.getPosition().equals(pos)).toBe(true);
    
    // Modify the original position, should not affect the locomotor
    pos.x = 50;
    expect(locomotor.getPosition().x).toBe(10);
  });
  
  it('should set and get direction correctly', () => {
    // Direction should be normalized automatically
    const dir = new Vec3(2, 0, 0);
    locomotor.setDirection(dir);
    
    expect(locomotor.getDirection().equals(new Vec3(1, 0, 0))).toBe(true);
  });
  
  it('should set and clear goal position', () => {
    const goal = new Vec3(100, 100, 0);
    locomotor.setGoalPosition(goal);
    expect(locomotor.getDistanceToGoal()).toBeCloseTo(141.42, 1);
    
    locomotor.clearGoalPosition();
    expect(locomotor.getDistanceToGoal()).toBe(Infinity);
  });
  
  it('should move toward goal position over time', () => {
    const goal = new Vec3(100, 0, 0);
    locomotor.setGoalPosition(goal);
    
    // Update for 1 second - should accelerate toward goal
    locomotor.update(1.0);
    expect(locomotor.getSpeed()).toBeGreaterThan(0);
    expect(locomotor.getPosition().x).toBeGreaterThan(0);
    
    // With our increased speed and acceleration, this should be enough to reach the goal
    for (let i = 0; i < 5; i++) {
      locomotor.update(0.2);
    }
    
    // Should be close to goal
    expect(locomotor.getPosition().x).toBeGreaterThan(90);
  });
  
  it('should support waypoint paths', () => {
    // Test that the path can be set
    const waypoints = [
      new Vec3(10, 0, 0),
      new Vec3(20, 10, 0),
      new Vec3(30, 0, 0)
    ];
    
    // Test that the setPath method exists
    expect(() => {
      locomotor.setPath(waypoints);
    }).not.toThrow();
    
    // Just make sure the update method doesn't throw when called with a path
    for (let i = 0; i < 5; i++) {
      locomotor.update(0.1);
    }
    
    // Clear the goal by setting a null goal position
    locomotor.clearGoalPosition();
    expect(locomotor.getDistanceToGoal()).toBe(Infinity);
  });
});

describe('LocomotorSet', () => {
  let groundTemplate: LocomotorTemplate;
  let waterTemplate: LocomotorTemplate;
  let airTemplate: LocomotorTemplate;
  let locomotorSet: LocomotorSet;
  
  beforeEach(() => {
    groundTemplate = new LocomotorTemplate('GroundLocomotor');
    groundTemplate.setLegalSurfaces(LocomotorSurfaceType.GROUND);
    
    waterTemplate = new LocomotorTemplate('WaterLocomotor');
    waterTemplate.setLegalSurfaces(LocomotorSurfaceType.WATER);
    
    airTemplate = new LocomotorTemplate('AirLocomotor');
    airTemplate.setLegalSurfaces(LocomotorSurfaceType.AIR);
    
    locomotorSet = new LocomotorSet();
  });
  
  it('should initialize empty', () => {
    expect(locomotorSet.getCount()).toBe(0);
    expect(locomotorSet.getValidSurfaces()).toBe(0);
    expect(locomotorSet.isDownhillOnly()).toBe(false);
  });
  
  it('should add locomotors and update valid surfaces', () => {
    locomotorSet.addLocomotor(groundTemplate);
    expect(locomotorSet.getCount()).toBe(1);
    expect(locomotorSet.getValidSurfaces()).toBe(LocomotorSurfaceType.GROUND);
    
    locomotorSet.addLocomotor(waterTemplate);
    expect(locomotorSet.getCount()).toBe(2);
    expect(locomotorSet.getValidSurfaces()).toBe(LocomotorSurfaceType.GROUND | LocomotorSurfaceType.WATER);
  });
  
  it('should find locomotors for specific surface types', () => {
    locomotorSet.addLocomotor(groundTemplate);
    locomotorSet.addLocomotor(waterTemplate);
    locomotorSet.addLocomotor(airTemplate);
    
    const groundLoco = locomotorSet.findLocomotor(LocomotorSurfaceType.GROUND);
    expect(groundLoco).not.toBeNull();
    expect(groundLoco!.getLegalSurfaces()).toBe(LocomotorSurfaceType.GROUND);
    
    const waterLoco = locomotorSet.findLocomotor(LocomotorSurfaceType.WATER);
    expect(waterLoco).not.toBeNull();
    expect(waterLoco!.getLegalSurfaces()).toBe(LocomotorSurfaceType.WATER);
    
    const unknownLoco = locomotorSet.findLocomotor(LocomotorSurfaceType.CLIFF);
    expect(unknownLoco).toBeNull();
  });
  
  it('should get locomotors by index', () => {
    locomotorSet.addLocomotor(groundTemplate);
    locomotorSet.addLocomotor(waterTemplate);
    
    const loco0 = locomotorSet.getLocomotor(0);
    expect(loco0).not.toBeNull();
    expect(loco0!.getLegalSurfaces()).toBe(LocomotorSurfaceType.GROUND);
    
    const loco1 = locomotorSet.getLocomotor(1);
    expect(loco1).not.toBeNull();
    expect(loco1!.getLegalSurfaces()).toBe(LocomotorSurfaceType.WATER);
    
    const loco2 = locomotorSet.getLocomotor(2);
    expect(loco2).toBeNull();
  });
  
  it('should clear all locomotors', () => {
    locomotorSet.addLocomotor(groundTemplate);
    locomotorSet.addLocomotor(waterTemplate);
    expect(locomotorSet.getCount()).toBe(2);
    
    locomotorSet.clear();
    expect(locomotorSet.getCount()).toBe(0);
    expect(locomotorSet.getValidSurfaces()).toBe(0);
  });
});

describe('LocomotorStore', () => {
  let store: LocomotorStore;
  
  beforeEach(() => {
    // Get a fresh instance for each test
    store = LocomotorStore.getInstance();
    // Clear any existing templates for clean test
    (store as any).locomotorTemplates = new Map();
  });
  
  it('should register and find locomotor templates', () => {
    const template = new LocomotorTemplate('TankLocomotor');
    store.registerTemplate(template);
    
    const found = store.findLocomotorTemplate('TankLocomotor');
    expect(found).toBe(template);
    
    const notFound = store.findLocomotorTemplate('NonExistentLocomotor');
    expect(notFound).toBeNull();
  });
  
  it('should create new locomotors from templates', () => {
    const template = new LocomotorTemplate('TankLocomotor');
    const locomotor = store.newLocomotor(template);
    
    expect(locomotor).toBeInstanceOf(Locomotor);
  });
  
  it('should create template overrides', () => {
    const template = new LocomotorTemplate('BaseLocomotor');
    template.setSpeed(5.0);
    template.setLegalSurfaces(LocomotorSurfaceType.GROUND);
    
    const override = store.newOverride(template);
    expect(override.getName()).toBe('BaseLocomotor_Override');
    expect(override.getSpeed()).toBe(5.0);
    expect(override.getLegalSurfaces()).toBe(LocomotorSurfaceType.GROUND);
    
    // Modify the override
    override.setSpeed(10.0);
    expect(override.getSpeed()).toBe(10.0);
    // Original should be unchanged
    expect(template.getSpeed()).toBe(5.0);
  });
});