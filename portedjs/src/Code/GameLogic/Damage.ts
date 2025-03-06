export enum DamageType {
    DAMAGE_NONE,
    DAMAGE_NORMAL,
    DAMAGE_CRUSH,
    DAMAGE_PIERCE,
    DAMAGE_SLASH,
    DAMAGE_FIRE,
    DAMAGE_EXPLOSIVE,
    DAMAGE_RADIATION,
    DAMAGE_POISON,
    DAMAGE_HACK,
    DAMAGE_SNIPER,
    DAMAGE_LASER,
    DAMAGE_SUBDUAL,
    DAMAGE_UNRESISTABLE,
    DAMAGE_SUBDUAL_UNRESISTABLE,
    DAMAGE_KILL_GARRISONED,
    DAMAGE_INSTA_KILL
}

export const DAMAGE_NUM_TYPES = 17;

export const DAMAGE_UNRESISTABLE = DamageType.DAMAGE_UNRESISTABLE;

import { GameObject } from "./GameObject";

export interface DamageInfo {
    amount: number;
    radius: number;
    source: GameObject | null;
}

export class DieMuxData {
    public isDieApplicable(obj: GameObject, damageInfo: DamageInfo): boolean {
        // Logic for determining if death should be handled
        // This is a stub - actual implementation would check damage types, resistances, etc.
        return true;
    }
}