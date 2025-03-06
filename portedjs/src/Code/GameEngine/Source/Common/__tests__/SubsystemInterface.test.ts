import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SubsystemInterface, SubsystemInterfaceList, TheSubsystemList } from '../interfaces/SubsystemInterface';

// Mock implementation of SubsystemInterface for testing
class MockSubsystem implements SubsystemInterface {
    private name = '';
    initCalled = false;
    resetCalled = false;
    updateCalled = false;
    drawCalled = false;
    postProcessLoadCalled = false;

    init(): void {
        this.initCalled = true;
    }

    reset(): void {
        this.resetCalled = true;
    }

    update(): void {
        this.updateCalled = true;
    }

    draw(): void {
        this.drawCalled = true;
    }

    postProcessLoad(): void {
        this.postProcessLoadCalled = true;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }
}

describe('SubsystemInterface', () => {
    let mockSubsystem: MockSubsystem;

    beforeEach(() => {
        mockSubsystem = new MockSubsystem();
    });

    it('should track method calls', () => {
        mockSubsystem.init();
        expect(mockSubsystem.initCalled).toBe(true);

        mockSubsystem.reset();
        expect(mockSubsystem.resetCalled).toBe(true);

        mockSubsystem.update();
        expect(mockSubsystem.updateCalled).toBe(true);

        mockSubsystem.draw();
        expect(mockSubsystem.drawCalled).toBe(true);

        mockSubsystem.postProcessLoad();
        expect(mockSubsystem.postProcessLoadCalled).toBe(true);
    });

    it('should manage subsystem name', () => {
        mockSubsystem.setName('TestSystem');
        expect(mockSubsystem.getName()).toBe('TestSystem');
    });
});

describe('SubsystemInterfaceList', () => {
    let subsystemList: SubsystemInterfaceList;
    let mockSubsystem1: MockSubsystem;
    let mockSubsystem2: MockSubsystem;

    beforeEach(() => {
        subsystemList = new SubsystemInterfaceList();
        mockSubsystem1 = new MockSubsystem();
        mockSubsystem2 = new MockSubsystem();
        TheSubsystemList.set(subsystemList);
    });

    afterEach(() => {
        TheSubsystemList.set(null);
    });

    it('should initialize subsystems with name', () => {
        subsystemList.initSubsystem(mockSubsystem1, undefined, undefined, undefined, 'System1');
        expect(mockSubsystem1.getName()).toBe('System1');
        expect(mockSubsystem1.initCalled).toBe(true);
    });

    it('should manage multiple subsystems', () => {
        subsystemList.addSubsystem(mockSubsystem1);
        subsystemList.addSubsystem(mockSubsystem2);
        
        subsystemList.resetAll();
        expect(mockSubsystem1.resetCalled).toBe(true);
        expect(mockSubsystem2.resetCalled).toBe(true);
    });

    it('should remove subsystems', () => {
        subsystemList.addSubsystem(mockSubsystem1);
        subsystemList.addSubsystem(mockSubsystem2);
        subsystemList.removeSubsystem(mockSubsystem1);
        
        subsystemList.resetAll();
        expect(mockSubsystem1.resetCalled).toBe(false);
        expect(mockSubsystem2.resetCalled).toBe(true);
    });

    it('should call postProcessLoad on all subsystems', () => {
        subsystemList.addSubsystem(mockSubsystem1);
        subsystemList.addSubsystem(mockSubsystem2);
        
        subsystemList.postProcessLoadAll();
        expect(mockSubsystem1.postProcessLoadCalled).toBe(true);
        expect(mockSubsystem2.postProcessLoadCalled).toBe(true);
    });

    it('should clean up on shutdown', () => {
        subsystemList.addSubsystem(mockSubsystem1);
        subsystemList.addSubsystem(mockSubsystem2);
        
        subsystemList.shutdownAll();
        subsystemList.resetAll(); // Should do nothing as systems are removed
        expect(mockSubsystem1.resetCalled).toBe(false);
        expect(mockSubsystem2.resetCalled).toBe(false);
    });

    it('should manage global instance through TheSubsystemList', () => {
        expect(TheSubsystemList.get()).toBe(subsystemList);
        TheSubsystemList.set(null);
        expect(TheSubsystemList.get()).toBeNull();
    });
});