import { SubsystemInterface } from "../interfaces/SubsystemInterface";
import { Player } from "../Common/Player";

/**
 * Victory condition types that can be applied in multiplayer games
 */
export enum VictoryType {
    NOBUILDINGS = 1,
    NOUNITS = 2,
}

/**
 * Interface for managing victory conditions and game state
 */
export interface VictoryConditionsInterface extends SubsystemInterface {
    init(): void;
    reset(): void;
    update(): void;
    
    setVictoryConditions(victoryConditions: number): void;
    getVictoryConditions(): number;
    
    hasAchievedVictory(player: Player): boolean;  // Has a specific player and their allies won?
    hasBeenDefeated(player: Player): boolean;     // Has a specific player and their allies lost?
    hasSinglePlayerBeenDefeated(player: Player): boolean;  // Has a specific player lost?
    
    cachePlayerPtrs(): void;  // Cache pointers to relevant players after creation
    
    isLocalAlliedVictory(): boolean;
    isLocalAlliedDefeat(): boolean;
    isLocalDefeat(): boolean;
    amIObserver(): boolean;
    getEndFrame(): number;  // Frame when game effectively ended
}

const MAX_PLAYER_COUNT = 8; // Maximum number of players in a game

/**
 * Manages victory conditions and game state in multiplayer games
 */
export class VictoryConditions implements VictoryConditionsInterface {
    private players: (Player | null)[] = new Array(MAX_PLAYER_COUNT);
    private localSlotNum: number = -1;
    private endFrame: number = 0;
    private isDefeated: boolean[] = new Array(MAX_PLAYER_COUNT);
    private localPlayerDefeated: boolean = false;
    private singleAllianceRemaining: boolean = false;
    private isObserver: boolean = false;
    protected victoryConditions: number = 0;

    constructor() {
        this.reset();
    }

    init(): void {
        this.reset();
    }

    reset(): void {
        for (let i = 0; i < MAX_PLAYER_COUNT; i++) {
            this.players[i] = null;
            this.isDefeated[i] = false;
        }
        this.localSlotNum = -1;
        this.localPlayerDefeated = false;
        this.singleAllianceRemaining = false;
        this.isObserver = false;
        this.endFrame = 0;
        this.victoryConditions = VictoryType.NOBUILDINGS | VictoryType.NOUNITS;
    }

    update(): void {
        if (!this.isMultiplayer() || (this.localSlotNum === -1 && !this.isObserver)) {
            return;
        }

        // Check for a single winning alliance
        if (!this.singleAllianceRemaining) {
            let multipleAlliances = false;
            let alive: Player | null = null;

            for (let i = 0; i < MAX_PLAYER_COUNT; i++) {
                const player = this.players[i];
                if (player && !this.hasSinglePlayerBeenDefeated(player)) {
                    if (alive) {
                        // Check if they are on the same team
                        if (!this.areAllies(alive, player)) {
                            multipleAlliances = true;
                            break;
                        }
                    } else {
                        alive = player; // Save this pointer to check against
                    }
                }
            }

            if (!multipleAlliances) {
                this.singleAllianceRemaining = true; // Don't check again
            }
        }

        // Check if local player has been defeated
        if (!this.localPlayerDefeated && this.localSlotNum >= 0) {
            const localPlayer = this.players[this.localSlotNum];
            if (localPlayer && this.hasSinglePlayerBeenDefeated(localPlayer)) {
                this.localPlayerDefeated = true;
                // Force radar on and set chat to everyone mode after defeat
                this.handlePlayerDefeat();
            }
        }
    }

    private isMultiplayer(): boolean {
        // TODO: Implement actual multiplayer check
        return true; 
    }

    private areAllies(p1: Player, p2: Player): boolean {
        if (p1 !== p2 && 
            p1.getRelationship(p2.getDefaultTeam()) === "ALLIES" &&
            p2.getRelationship(p1.getDefaultTeam()) === "ALLIES") {
            return true;
        }
        return false;
    }

    hasAchievedVictory(player: Player): boolean {
        if (!player) {
            return false;
        }

        if (this.singleAllianceRemaining) {
            for (let i = 0; i < MAX_PLAYER_COUNT; i++) {
                const currentPlayer = this.players[i];
                if (currentPlayer && 
                    !this.hasSinglePlayerBeenDefeated(currentPlayer) &&
                    (player === currentPlayer || this.areAllies(currentPlayer, player))) {
                    return true;
                }
            }
        }
        return false;
    }

    hasBeenDefeated(player: Player): boolean {
        if (!player) {
            return false;
        }
        return this.singleAllianceRemaining && !this.hasAchievedVictory(player);
    }

    hasSinglePlayerBeenDefeated(player: Player): boolean {
        if (!player) {
            return false;
        }

        const hasNoUnits = !player.hasAnyUnits();
        const hasNoBuildings = !player.hasAnyBuildings();
        const victoryNoUnits = (this.victoryConditions & VictoryType.NOUNITS) !== 0;
        const victoryNoBuildings = (this.victoryConditions & VictoryType.NOBUILDINGS) !== 0;

        if (victoryNoUnits && victoryNoBuildings) {
            return !player.hasAnyObjects();
        } else if (victoryNoUnits) {
            return hasNoUnits;
        } else if (victoryNoBuildings) {
            return hasNoBuildings;
        }

        return false;
    }

    cachePlayerPtrs(): void {
        if (!this.isMultiplayer()) {
            return;
        }

        let playerCount = 0;
        for (let i = 0; i < MAX_PLAYER_COUNT; i++) {
            const player = this.getPlayerFromList(i);
            if (player && 
                !this.isNeutralPlayer(player) && 
                player.getPlayerTemplate() && 
                !this.isCivilianPlayer(player) && 
                !player.isPlayerObserver()) {
                
                this.players[playerCount] = player;
                if (player.isLocalPlayer()) {
                    this.localSlotNum = playerCount;
                }
                playerCount++;
            }
        }

        // Fill remaining slots with null
        while (playerCount < MAX_PLAYER_COUNT) {
            this.players[playerCount++] = null;
        }

        if (this.localSlotNum < 0) {
            this.localPlayerDefeated = true;
            this.forceRadarOn();
            this.isObserver = true;
        }
    }

    private getPlayerFromList(index: number): Player | null {
        // TODO: Implement actual player list lookup
        return null;
    }

    private isNeutralPlayer(player: Player): boolean {
        // TODO: Implement neutral player check
        return false;
    }

    private isCivilianPlayer(player: Player): boolean {
        // TODO: Implement civilian check based on template
        return false;
    }

    private handlePlayerDefeat(): void {
        this.forceRadarOn();
        // TODO: Implement chat type change
    }

    private forceRadarOn(): void {
        // TODO: Implement radar force on
    }

    isLocalAlliedVictory(): boolean {
        if (this.isObserver) {
            return false;
        }
        return this.hasAchievedVictory(this.players[this.localSlotNum]!);
    }

    isLocalAlliedDefeat(): boolean {
        if (this.isObserver) {
            return this.singleAllianceRemaining;
        }
        return this.hasBeenDefeated(this.players[this.localSlotNum]!);
    }

    isLocalDefeat(): boolean {
        if (this.isObserver) {
            return false;
        }
        return this.localPlayerDefeated;
    }

    amIObserver(): boolean {
        return this.isObserver;
    }

    getEndFrame(): number {
        return this.endFrame;
    }

    setVictoryConditions(victoryConditions: number): void {
        this.victoryConditions = victoryConditions;
    }

    getVictoryConditions(): number {
        return this.victoryConditions;
    }
}