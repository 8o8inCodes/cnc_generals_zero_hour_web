import { SubsystemInterface } from '../GameEngine/Source/Common/interfaces/SubsystemInterface';
import { TunnelTracker } from './TunnelTracker';

/**
 * System responsible for keeping track of the connectedness of all cave systems on the map.
 * Players can use tunnels/caves to move units underground between connected cave entrances.
 */
export class CaveSystem implements SubsystemInterface {
    private static instance: CaveSystem;
    private tunnelTrackerVector: (TunnelTracker | null)[];

    private constructor() {
        this.tunnelTrackerVector = [];
    }

    public static getInstance(): CaveSystem {
        if (!CaveSystem.instance) {
            CaveSystem.instance = new CaveSystem();
        }
        return CaveSystem.instance;
    }

    public init(): boolean {
        this.reset();
        return true;
    }

    public reset(): void {
        // Delete all tunnel trackers
        for (const tracker of this.tunnelTrackerVector) {
            if (tracker) {
                tracker.deleteInstance();
            }
        }
        this.tunnelTrackerVector = [];
    }

    public update(): void {
        // No update needed in base implementation
    }

    /**
     * Check if a cave entrance can switch from one tunnel network to another.
     * This is only allowed if both networks are empty (no units inside).
     */
    public canSwitchIndexToIndex(oldIndex: number, newIndex: number): boolean {
        // When I grant permission, you need to do it.
        // i.e., call unregister and then re-register with the new number
        let oldTracker: TunnelTracker | null = null;
        let newTracker: TunnelTracker | null = null;

        if (this.tunnelTrackerVector.length > oldIndex) {
            oldTracker = this.tunnelTrackerVector[oldIndex];
            if (oldTracker && oldTracker.getContainCount() > 0) {
                return false; // Can't switch if old network has units
            }
        }

        if (this.tunnelTrackerVector.length > newIndex) {
            newTracker = this.tunnelTrackerVector[newIndex];
            if (newTracker && newTracker.getContainCount() > 0) {
                return false; // Can't switch if new network has units
            }
        }

        // Both are either empty or non-existent, so switching is allowed
        return true;
    }

    /**
     * Register a new cave entrance with the given network index
     */
    public registerNewCave(index: number): void {
        // Expand vector if needed
        while (this.tunnelTrackerVector.length <= index) {
            this.tunnelTrackerVector.push(null);
        }

        // Create new tracker if none exists
        if (!this.tunnelTrackerVector[index]) {
            this.tunnelTrackerVector[index] = new TunnelTracker();
        }
    }

    /**
     * Unregister a cave entrance from its network
     */
    public unregisterCave(index: number): void {
        if (index < this.tunnelTrackerVector.length) {
            // We don't remove the tracker, just let the cave unregister from it
            // This keeps indices stable for other connected caves
        }
    }

    /**
     * Get the tunnel network tracker for a given index
     */
    public getTunnelTrackerForCaveIndex(index: number): TunnelTracker | null {
        if (index < this.tunnelTrackerVector.length) {
            return this.tunnelTrackerVector[index];
        }
        return null;
    }
}