import { Thing } from '../../Common/Thing';
import { ModuleData } from './ModuleData';
import { OpenContainModuleData } from './OpenContainModuleData';
import { GameObject } from '../GameObject';

/**
 * Base class for modules that can contain other game objects
 */
export class OpenContain {
    protected thing: Thing;
    private moduleData: ModuleData;

    constructor(thing: Thing, moduleData: ModuleData) {
        this.thing = thing;
        this.moduleData = moduleData;
    }

    protected getModuleData(): ModuleData {
        return this.moduleData;
    }

    protected getObject(): GameObject {
        return this.thing.getObject();
    }
}