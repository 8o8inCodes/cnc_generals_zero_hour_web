import { describe, it, expect, beforeEach } from 'vitest';
import { CaveSystem } from '../CaveSystem';
import { GameObject } from '../GameObject';
import { Team } from '../../Common/Team';
import { CaveContain, CaveContainModuleData } from '../modules/CaveContain';
import { Thing } from '../../Common/Thing';
import { ModuleData } from '../modules/ModuleData';
import { ObjectStatus } from '../../Common/ObjectStatus';

describe('Cave System', () => {
    describe('CaveSystem', () => {
        let caveSystem: CaveSystem;

        beforeEach(() => {
            caveSystem = CaveSystem.getInstance();
            caveSystem.reset();
        });

        it('should maintain singleton instance', () => {
            const system2 = CaveSystem.getInstance();
            expect(system2).toBe(caveSystem);
        });

        it('should register new caves', () => {
            caveSystem.registerNewCave(1);
            const tracker = caveSystem.getTunnelTrackerForCaveIndex(1);
            expect(tracker).toBeTruthy();
        });

        it('should allow switching empty networks', () => {
            caveSystem.registerNewCave(1);
            caveSystem.registerNewCave(2);
            expect(caveSystem.canSwitchIndexToIndex(1, 2)).toBe(true);
        });

        it('should not allow switching networks with units', () => {
            caveSystem.registerNewCave(1);
            const tracker = caveSystem.getTunnelTrackerForCaveIndex(1);
            const mockObj = {
                getID: () => 123
            } as GameObject;
            tracker?.addToContainList(mockObj);

            expect(caveSystem.canSwitchIndexToIndex(1, 2)).toBe(false);
        });
    });

    describe('TunnelTracker', () => {
        let caveSystem: CaveSystem;
        let mockObj: GameObject;

        beforeEach(() => {
            caveSystem = CaveSystem.getInstance();
            caveSystem.reset();
            caveSystem.registerNewCave(1);

            mockObj = {
                getID: () => 123
            } as GameObject;
        });

        it('should track contained units', () => {
            const tracker = caveSystem.getTunnelTrackerForCaveIndex(1);
            tracker?.addToContainList(mockObj);
            expect(tracker?.getContainCount()).toBe(1);
        });

        it('should enforce capacity limits', () => {
            const tracker = caveSystem.getTunnelTrackerForCaveIndex(1);
            // Add max capacity of units
            for (let i = 0; i < 5; i++) {
                tracker?.addToContainList({ getID: () => i } as GameObject);
            }
            // Try to add one more
            tracker?.addToContainList({ getID: () => 999 } as GameObject);
            expect(tracker?.getContainCount()).toBe(5);
        });

        it('should remove units', () => {
            const tracker = caveSystem.getTunnelTrackerForCaveIndex(1);
            tracker?.addToContainList(mockObj);
            tracker?.removeFromContainList(mockObj);
            expect(tracker?.getContainCount()).toBe(0);
        });
    });

    describe('CaveContain', () => {
        let moduleData: CaveContainModuleData;
        let thing: Thing;
        let caveContain: CaveContain;
        let mockObj: GameObject;

        beforeEach(() => {
            moduleData = new CaveContainModuleData();
            moduleData.caveIndexData = 1;
            thing = { getObject: () => mockObj } as Thing;
            caveContain = new CaveContain(thing, moduleData as ModuleData);

            mockObj = {
                getID: () => 123,
                getStatusBits: () => ({
                    test: (status: ObjectStatus) => false
                })
            } as GameObject;

            CaveSystem.getInstance().reset();
        });

        it('should initialize with correct cave index', () => {
            caveContain.onCreate();
            expect(caveContain.getContainCount()).toBe(0);
        });

        it('should register with cave system on build complete', () => {
            caveContain.onCreate();
            caveContain.onBuildComplete();
            expect(CaveSystem.getInstance().getTunnelTrackerForCaveIndex(1)).toBeTruthy();
        });

        it('should switch networks when allowed', () => {
            caveContain.onCreate();
            caveContain.onBuildComplete();
            caveContain.tryToSetCaveIndex(2);
            expect(CaveSystem.getInstance().getTunnelTrackerForCaveIndex(2)).toBeTruthy();
        });

        it('should share contained units between connected caves', () => {
            // Create two caves with same index
            const cave1 = new CaveContain(thing, moduleData as ModuleData);
            const cave2 = new CaveContain(thing, moduleData as ModuleData);
            
            cave1.onCreate();
            cave2.onCreate();
            cave1.onBuildComplete();
            cave2.onBuildComplete();

            // Add unit through first cave
            cave1.addToContainList(mockObj);

            // Both caves should see the unit
            expect(cave1.getContainCount()).toBe(1);
            expect(cave2.getContainCount()).toBe(1);
        });
    });
});