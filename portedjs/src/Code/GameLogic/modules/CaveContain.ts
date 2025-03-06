import { OpenContain } from './OpenContain';
import { OpenContainModuleData } from './OpenContainModuleData';
import { CreateModuleInterface } from './interfaces/CreateModuleInterface';
import { CaveInterface } from './interfaces/CaveInterface';
import { Thing } from '../../Common/Thing';
import { ModuleData } from './ModuleData';
import { Team } from '../../Common/Team';
import { GameObject } from '../GameObject';
import { CaveSystem } from '../CaveSystem';
import { DamageInfo } from '../Damage';
import { ObjectStatus } from '../../Common/ObjectStatus';

/**
 * Module data for cave entrance objects
 */
export class CaveContainModuleData extends OpenContainModuleData {
    public caveIndexData: number;

    constructor() {
        super();
        this.caveIndexData = 0;
    }
}

/**
 * A version of OpenContain that redirects storage to CaveSystem's tunnel networks.
 * Cave entrances with the same index are connected and share contained units.
 */
export class CaveContain extends OpenContain implements CreateModuleInterface, CaveInterface {
    private needToRunOnBuildComplete: boolean;
    private caveIndex: number;
    private originalTeam: Team | null;

    constructor(thing: Thing, moduleData: ModuleData) {
        super(thing, moduleData);
        this.needToRunOnBuildComplete = true;
        this.caveIndex = 0;
        this.originalTeam = null;
    }

    public getCreate(): CreateModuleInterface {
        return this;
    }

    public getCaveInterface(): CaveInterface {
        return this;
    }

    protected getCaveContainModuleData(): CaveContainModuleData {
        return this.getModuleData() as CaveContainModuleData;
    }

    public isGarrisonable(): boolean {
        return false;
    }

    public isHealContain(): boolean {
        return false;
    }

    public isKickOutOnCapture(): boolean {
        return false;
    }

    public shouldDoOnBuildComplete(): boolean {
        return this.needToRunOnBuildComplete;
    }

    public onCreate(): void {
        this.caveIndex = this.getCaveContainModuleData().caveIndexData;
    }

    public onBuildComplete(): void {
        if (!this.shouldDoOnBuildComplete()) {
            return;
        }

        this.needToRunOnBuildComplete = false;

        const caveSystem = CaveSystem.getInstance();
        caveSystem.registerNewCave(this.caveIndex);

        const myTracker = caveSystem.getTunnelTrackerForCaveIndex(this.caveIndex);
        if (myTracker) {
            myTracker.onTunnelCreated(this.getObject());
        }
    }

    public onDie(damageInfo: DamageInfo): void {
        // Override the onDie we inherit from OpenContain
        const moduleData = this.getCaveContainModuleData();
        const obj = this.getObject();
        if (!moduleData.dieMuxData.isDieApplicable(obj, damageInfo)) {
            return;
        }

        // Skip if still under construction
        if (obj.getStatusBits().test(ObjectStatus.UNDER_CONSTRUCTION)) {
            return;
        }

        const caveSystem = CaveSystem.getInstance();
        const myTracker = caveSystem.getTunnelTrackerForCaveIndex(this.caveIndex);

        caveSystem.unregisterCave(this.caveIndex);

        if (myTracker) {
            myTracker.onTunnelDestroyed(this.getObject());
        }
    }

    public addToContainList(obj: GameObject): void {
        const myTracker = CaveSystem.getInstance().getTunnelTrackerForCaveIndex(this.caveIndex);
        if (myTracker) {
            myTracker.addToContainList(obj);
        }
    }

    public removeFromContain(obj: GameObject): void {
        const myTracker = CaveSystem.getInstance().getTunnelTrackerForCaveIndex(this.caveIndex);
        if (myTracker) {
            myTracker.removeFromContainList(obj);
        }
    }

    public getContainCount(): number {
        const myTracker = CaveSystem.getInstance().getTunnelTrackerForCaveIndex(this.caveIndex);
        return myTracker ? myTracker.getContainCount() : 0;
    }

    public getContainMax(): number {
        const myTracker = CaveSystem.getInstance().getTunnelTrackerForCaveIndex(this.caveIndex);
        return myTracker ? myTracker.getContainMax() : 0;
    }

    public tryToSetCaveIndex(newIndex: number): void {
        const caveSystem = CaveSystem.getInstance();
        if (caveSystem.canSwitchIndexToIndex(this.caveIndex, newIndex)) {
            const myOldTracker = caveSystem.getTunnelTrackerForCaveIndex(this.caveIndex);
            if (myOldTracker) {
                caveSystem.unregisterCave(this.caveIndex);
                myOldTracker.onTunnelDestroyed(this.getObject());
            }

            this.caveIndex = newIndex;

            caveSystem.registerNewCave(this.caveIndex);
            const myNewTracker = caveSystem.getTunnelTrackerForCaveIndex(this.caveIndex);
            if (myNewTracker) {
                myNewTracker.onTunnelCreated(this.getObject());
            }
        }
    }
}