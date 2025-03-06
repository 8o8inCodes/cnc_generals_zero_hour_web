import { GameObject } from './GameObject';
import { ObjectID } from './ObjectID';

export type ContainedItemsList = ObjectID[];

/**
 * Tracks a network of connected tunnels/caves and the units contained within them.
 * Units can move between any connected caves that share the same TunnelTracker.
 */
export class TunnelTracker {
    private containedItems: ContainedItemsList;
    private maxContainSize: number;
    private caves: Set<ObjectID>;

    constructor() {
        this.containedItems = [];
        this.maxContainSize = 5; // Default max capacity
        this.caves = new Set();
    }

    public deleteInstance(): void {
        this.containedItems = [];
        this.caves.clear();
    }

    /**
     * Check if an object can be contained in this tunnel network
     */
    public isValidContainerFor(obj: GameObject, checkCapacity: boolean): boolean {
        if (checkCapacity && this.getContainCount() >= this.maxContainSize) {
            return false;
        }

        // Additional validation could be added here, like checking unit type/size
        return true;
    }

    public getContainCount(): number {
        return this.containedItems.length;
    }

    public getContainMax(): number {
        return this.maxContainSize;
    }

    public getContainedItemsList(): ContainedItemsList {
        return this.containedItems;
    }

    public addToContainList(obj: GameObject): void {
        if (this.isValidContainerFor(obj, true)) {
            this.containedItems.push(obj.getID());
        }
    }

    public removeFromContainList(obj: GameObject): void {
        const index = this.containedItems.indexOf(obj.getID());
        if (index >= 0) {
            this.containedItems.splice(index, 1);
        }
    }

    /**
     * Called when a new cave entrance is added to this network
     */
    public onTunnelCreated(obj: GameObject): void {
        this.caves.add(obj.getID());
    }

    /**
     * Called when a cave entrance is destroyed or removed from this network
     */
    public onTunnelDestroyed(obj: GameObject): void {
        this.caves.delete(obj.getID());
    }
}