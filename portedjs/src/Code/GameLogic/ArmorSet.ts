import { BitFlags } from '../Common/BitFlags';
import { ArmorSetType } from './Armor';
import { ArmorTemplate } from './Armor';
import { DamageFX } from '../Common/DamageFX';

export type ArmorSetFlags = BitFlags<ArmorSetType>;

/**
 * Groups armor templates with conditions for when they apply
 */
export class ArmorTemplateSet {
    private types: ArmorSetFlags;
    private template: ArmorTemplate | null;
    private fx: DamageFX | null;

    constructor() {
        this.clear();
    }

    public clear(): void {
        this.types = new BitFlags<ArmorSetType>();
        this.template = null;
        this.fx = null;
    }

    public getArmorTemplate(): ArmorTemplate | null {
        return this.template;
    }

    public getDamageFX(): DamageFX | null {
        return this.fx;
    }

    public setArmorTemplate(template: ArmorTemplate | null): void {
        this.template = template;
    }

    public setDamageFX(fx: DamageFX | null): void {
        this.fx = fx;
    }

    public getConditionsFlags(): ArmorSetFlags {
        return this.types;
    }

    public setConditionFlag(type: ArmorSetType, value: boolean): void {
        this.types.set(type, value ? 1 : 0);
    }
}

/**
 * Finds the best matching ArmorTemplateSet based on armor flags
 */
export class ArmorTemplateSetFinder {
    private templateSets: ArmorTemplateSet[];

    constructor() {
        this.templateSets = [];
    }

    public addTemplateSet(set: ArmorTemplateSet): void {
        this.templateSets.push(set);
    }

    public clear(): void {
        this.templateSets = [];
    }

    public findBestMatch(flags: ArmorSetFlags): ArmorTemplateSet | null {
        // Start with the most specific template (most matching flags)
        let bestMatch: ArmorTemplateSet | null = null;
        let bestMatchCount = -1;

        for (const set of this.templateSets) {
            const setFlags = set.getConditionsFlags();
            let matchCount = 0;

            // Count how many flags match between the input flags and template flags 
            for (let i = 0; i < ArmorSetType.COUNT; i++) {
                if (flags.test(i) === setFlags.test(i)) {
                    matchCount++;
                }
            }

            if (matchCount > bestMatchCount) {
                bestMatch = set;
                bestMatchCount = matchCount;
            }
        }

        return bestMatch;
    }
}