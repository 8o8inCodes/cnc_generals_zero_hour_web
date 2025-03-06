import { ModuleData } from './ModuleData';
import { DieMuxData } from '../Damage';

/**
 * Base module data class for container modules
 */
export class OpenContainModuleData extends ModuleData {
    public dieMuxData: DieMuxData;

    constructor() {
        super();
        this.dieMuxData = new DieMuxData();
    }
}