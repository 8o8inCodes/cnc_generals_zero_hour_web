import { describe, expect, test, beforeEach } from 'vitest';
import { VictoryConditions, VictoryType } from '../VictoryConditions';
import { Player } from '../../Common/Player';

// Mock Player class
class MockPlayer implements Partial<Player> {
    private units: boolean;
    private buildings: boolean;
    private objects: boolean;
    private isLocal: boolean;
    private template: any;
    private relationships: { [key: string]: string } = {};

    constructor(options: {
        hasUnits?: boolean,
        hasBuildings?: boolean,
        hasObjects?: boolean,
        isLocal?: boolean,
        hasTemplate?: boolean
    } = {}) {
        this.units = options.hasUnits ?? true;
        this.buildings = options.hasBuildings ?? true;
        this.objects = options.hasObjects ?? true;
        this.isLocal = options.isLocal ?? false;
        this.template = options.hasTemplate ?? true ? {} : null;
    }

    hasAnyUnits(): boolean {
        return this.units;
    }

    hasAnyBuildings(): boolean {
        return this.buildings;
    }

    hasAnyObjects(): boolean {
        return this.objects;
    }

    isLocalPlayer(): boolean {
        return this.isLocal;
    }

    getPlayerTemplate(): any {
        return this.template;
    }

    isPlayerObserver(): boolean {
        return false;
    }

    getDefaultTeam(): string {
        return "team1";
    }

    getRelationship(team: string): string {
        return this.relationships[team] || "ENEMIES";
    }

    setRelationship(team: string, relationship: string): void {
        this.relationships[team] = relationship;
    }
}

describe('VictoryConditions', () => {
    let victoryConditions: VictoryConditions;

    beforeEach(() => {
        victoryConditions = new VictoryConditions();
        victoryConditions.init();
    });

    test('should initialize with default victory conditions', () => {
        expect(victoryConditions.getVictoryConditions()).toBe(VictoryType.NOBUILDINGS | VictoryType.NOUNITS);
    });

    test('should detect single player defeat when no units (NOUNITS condition)', () => {
        const player = new MockPlayer({ hasUnits: false });
        victoryConditions.setVictoryConditions(VictoryType.NOUNITS);
        
        expect(victoryConditions.hasSinglePlayerBeenDefeated(player as Player)).toBe(true);
    });

    test('should detect single player defeat when no buildings (NOBUILDINGS condition)', () => {
        const player = new MockPlayer({ hasBuildings: false });
        victoryConditions.setVictoryConditions(VictoryType.NOBUILDINGS);
        
        expect(victoryConditions.hasSinglePlayerBeenDefeated(player as Player)).toBe(true);
    });

    test('should detect single player defeat when no units and buildings (both conditions)', () => {
        const player = new MockPlayer({ 
            hasUnits: false, 
            hasBuildings: false,
            hasObjects: false
        });
        victoryConditions.setVictoryConditions(VictoryType.NOBUILDINGS | VictoryType.NOUNITS);
        
        expect(victoryConditions.hasSinglePlayerBeenDefeated(player as Player)).toBe(true);
    });

    test('should detect allied victory when last surviving alliance', () => {
        const player1 = new MockPlayer();
        const player2 = new MockPlayer();
        
        // Set up alliance
        player1.setRelationship("team1", "ALLIES");
        player2.setRelationship("team1", "ALLIES");

        // Setup victory conditions
        victoryConditions.setVictoryConditions(VictoryType.NOBUILDINGS | VictoryType.NOUNITS);
        
        // Manually inject players (simulating cachePlayerPtrs)
        (victoryConditions as any).players = [player1, player2, null, null, null, null, null, null];
        (victoryConditions as any).singleAllianceRemaining = true;

        expect(victoryConditions.hasAchievedVictory(player1 as Player)).toBe(true);
    });

    test('should handle observer state correctly', () => {
        (victoryConditions as any).isObserver = true;
        
        expect(victoryConditions.amIObserver()).toBe(true);
        expect(victoryConditions.isLocalAlliedVictory()).toBe(false);
        expect(victoryConditions.isLocalDefeat()).toBe(false);
    });

    test('should handle local player defeat', () => {
        const localPlayer = new MockPlayer({ 
            isLocal: true,
            hasUnits: false,
            hasBuildings: false,
            hasObjects: false
        });

        // Setup victory conditions and inject local player
        victoryConditions.setVictoryConditions(VictoryType.NOBUILDINGS | VictoryType.NOUNITS);
        (victoryConditions as any).players = [localPlayer, null, null, null, null, null, null, null];
        (victoryConditions as any).localSlotNum = 0;

        // Update should detect defeat
        victoryConditions.update();
        
        expect(victoryConditions.isLocalDefeat()).toBe(true);
    });
});