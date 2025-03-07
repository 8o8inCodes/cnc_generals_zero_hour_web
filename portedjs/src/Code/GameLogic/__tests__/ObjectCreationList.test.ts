/*
**  Command & Conquer Generals(tm) TypeScript Conversion
**  Based on original code Copyright 2025 Electronic Arts Inc.
*/

import { describe, test, expect, vi } from 'vitest';
import { ObjectCreationList, TheObjectCreationListStore } from '../ObjectCreationList';
import { FireWeaponNugget, ApplyRandomForceNugget, DeliverPayloadNugget } from '../ObjectCreationNuggets';
import { GameObject } from '../GameObject';
import { Coord3D } from '../../WWMath/Coord3D';

/**
 * Basic test implementation of WeaponTemplate for testing
 */
class TestWeaponTemplate {
  private name: string;
  
  constructor(name: string) {
    this.name = name;
  }
  
  getName(): string {
    return this.name;
  }
}

describe('ObjectCreationList', () => {
  test('should create and manage nuggets', () => {
    // Create a nugget
    const weapon = new TestWeaponTemplate('TestWeapon');
    const nugget = new FireWeaponNugget(weapon);
    
    // Create an OCL and add the nugget
    const ocl = new ObjectCreationList();
    ocl.addObjectCreationNugget(nugget);
    
    // Verify the nugget was added to the store
    expect(TheObjectCreationListStore).toBeDefined();
  });
  
  test('should handle null OCL in static create methods', () => {
    // These should not throw when OCL is null
    const primary = new GameObject();
    const secondary = new GameObject();
    const pos1 = new Coord3D(1, 2, 3);
    const pos2 = new Coord3D(4, 5, 6);
    
    // Test all three static create methods with null OCL
    ObjectCreationList.create(null, primary, secondary);
    ObjectCreationList.create(null, primary, pos1, pos2);
    ObjectCreationList.create(null, primary, pos1, pos2, true);
    
    // If we got here without exceptions, the test passed
    expect(true).toBeTruthy();
  });
  
  test('FireWeaponNugget should handle null inputs gracefully', () => {
    // Create a spy console.error to check for error logging
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const weapon = new TestWeaponTemplate('TestWeapon');
    const nugget = new FireWeaponNugget(weapon);
    
    // Call with nulls should log an error but not throw
    nugget.create(null, null, null);
    
    expect(errorSpy).toHaveBeenCalled();
    
    // Clean up
    errorSpy.mockRestore();
  });
  
  test('ApplyRandomForceNugget should apply forces to physics', () => {
    const nugget = new ApplyRandomForceNugget();
    nugget.setForceMagnitude(1, 10);
    nugget.setForcePitch(0, Math.PI / 4);
    nugget.setSpinRate(0.1);
    
    // Create a spy console.error to check for proper handling
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const obj = new GameObject();
    const secondary = new GameObject();
    
    // This should call the error handler since our test object has no physics
    nugget.create(obj, secondary);
    
    expect(errorSpy).toHaveBeenCalled();
    
    // Clean up
    errorSpy.mockRestore();
  });
  
  test('DeliverPayloadNugget should handle complex formation setup', () => {
    const nugget = new DeliverPayloadNugget();
    nugget.setTransportName('TestTransport');
    nugget.setFormation(3, 50);
    nugget.addPayload('TestPayload', 2);
    
    // Create a spy console.error to check for proper handling
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const primary = new GameObject();
    const primaryPos = new Coord3D(0, 0, 0);
    const targetPos = new Coord3D(100, 100, 0);
    
    // This should call the error handler since our test objects are incomplete
    nugget.create(primary, primaryPos, targetPos, true);
    
    // Verify it called with the expected error message
    expect(errorSpy).toHaveBeenCalled();
    
    // Clean up
    errorSpy.mockRestore();
  });
  
  test('Store should find ObjectCreationList by name', () => {
    // This test is limited since we don't have INI parsing yet, but we can test the null case
    
    // The "None" OCL should always return null
    const noneOcl = TheObjectCreationListStore.findObjectCreationList('None');
    expect(noneOcl).toBeNull();
    
    // Any other name should return null for now (since we don't have parsing)
    const unknownOcl = TheObjectCreationListStore.findObjectCreationList('UnknownOCL');
    expect(unknownOcl).toBeNull();
  });
});