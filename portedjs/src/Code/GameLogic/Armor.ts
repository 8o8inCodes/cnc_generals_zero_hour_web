import { DamageType, DAMAGE_NUM_TYPES, DAMAGE_UNRESISTABLE } from './Damage';

/**
 * An Armor encapsulates a particular type of modifier to damage taken,
 * to simulate different materials and help make game balance easier to adjust.
 */
export class ArmorTemplate {
    private damageCoefficient: number[];

    constructor() {
        this.clear();
    }

    public clear(): void {
        this.damageCoefficient = new Array(DAMAGE_NUM_TYPES).fill(1.0);
    }

    /**
     * Given a damage type and amount, adjust the damage and return the amount that should be dealt.
     */
    public adjustDamage(type: DamageType, damage: number): number {
        if (type === DAMAGE_UNRESISTABLE) {
            return damage;
        }

        damage *= this.damageCoefficient[type];
        
        if (damage < 0.0) {
            damage = 0.0;
        }
        
        return damage;
    }

    public setDamageCoefficient(type: DamageType, value: number): void {
        this.damageCoefficient[type] = value;
    }

    public setDefaultCoefficient(value: number): void {
        this.damageCoefficient.fill(value);
    }
}

/**
 * Simple wrapper class that holds an ArmorTemplate
 */
export class Armor {
    private template: ArmorTemplate | null;

    constructor(template: ArmorTemplate | null = null) {
        this.template = template;
    }

    public adjustDamage(type: DamageType, damage: number): number {
        return this.template ? this.template.adjustDamage(type, damage) : damage;
    }

    public clear(): void {
        this.template = null;
    }
}

export enum ArmorSetType {
    VETERAN = 0,
    ELITE = 1,
    HERO = 2,
    PLAYER_UPGRADE = 3,
    WEAK_VERSUS_BASEDEFENSES = 4,
    SECOND_LIFE = 5,
    CRATE_UPGRADE_ONE = 6,
    CRATE_UPGRADE_TWO = 7,
    COUNT = 8
}