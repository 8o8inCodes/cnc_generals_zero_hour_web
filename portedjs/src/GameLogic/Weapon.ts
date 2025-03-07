import { SubsystemInterface } from '../interfaces/SubsystemInterface';
import { ObjectID } from '../interfaces/ObjectID';
import { Coord3D } from '../WWMath/Coord3D';

export enum WeaponSlotType {
  PRIMARY_WEAPON,
  SECONDARY_WEAPON,
  TERTIARY_WEAPON,
  WEAPONSLOT_COUNT
}

export enum WeaponStatus {
  READY_TO_FIRE,
  RELOADING_CLIP,
  OUT_OF_AMMO,
  IN_COOLDOWN
}

export enum WeaponLockType {
  NOT_LOCKED,
  LOCKED_TEMPORARILY, // Locked until clip is empty or current "attack" state exits
  LOCKED_PERMANENTLY  // Locked until explicitly unlocked or lock is changed to another weapon
}

export enum WeaponChoiceCriteria {
  PREFER_MOST_DAMAGE,    // Choose weapon that will do most damage
  PREFER_LONGEST_RANGE   // Choose weapon with longest range (that will do nonzero damage)
}

export interface WeaponBonus {
  damage: number;
  range: number;
  rateOfFire: number;
  radius: number;
  preAttack: number;
}

export class WeaponTemplate {
  private name: string;
  private primaryDamage: number;
  private secondaryDamage: number;
  private attackRange: number;
  private minAttackRange: number;
  private clipSize: number;
  private reloadTime: number;
  private projectileName: string;
  private damageRadius: number;

  constructor(name: string) {
    this.name = name;
    this.primaryDamage = 0;
    this.secondaryDamage = 0;
    this.attackRange = 0;
    this.minAttackRange = 0;
    this.clipSize = 1;
    this.reloadTime = 0;
    this.projectileName = '';
    this.damageRadius = 0;
  }

  public getName(): string {
    return this.name;
  }

  public getPrimaryDamage(bonus: WeaponBonus): number {
    return this.primaryDamage * bonus.damage;
  }

  public getAttackRange(bonus: WeaponBonus): number {
    return this.attackRange * bonus.range;
  }

  public getMinAttackRange(): number {
    return this.minAttackRange;
  }

  public isContactWeapon(): boolean {
    // Fudge this a little to account for pathfinding roundoff & such
    const ATTACK_RANGE_FUDGE = 1.05;
    const PATHFIND_CELL_SIZE = 10; // Example value, adjust based on game constants
    return this.attackRange * ATTACK_RANGE_FUDGE < PATHFIND_CELL_SIZE;
  }
}

export class Weapon {
  private template: WeaponTemplate;
  private slot: WeaponSlotType;
  private status: WeaponStatus;
  private ammoInClip: number;
  private lastShotFrame: number;
  private nextPossibleShotFrame: number;

  constructor(template: WeaponTemplate, slot: WeaponSlotType) {
    this.template = template;
    this.slot = slot;
    this.status = WeaponStatus.OUT_OF_AMMO;
    this.ammoInClip = 0;
    this.lastShotFrame = 0;
    this.nextPossibleShotFrame = 0;
  }

  public getTemplate(): WeaponTemplate {
    return this.template;
  }

  public getStatus(): WeaponStatus {
    return this.status;
  }

  public getLastShotFrame(): number {
    return this.lastShotFrame;
  }

  public getPossibleNextShotFrame(): number {
    return this.nextPossibleShotFrame;
  }

  public fireWeapon(source: any, target: any): boolean {
    // TODO: Implement full weapon firing logic
    return false;
  }

  public loadAmmoNow(source: any): void {
    this.ammoInClip = 1; // For now just load 1 shot
    this.status = WeaponStatus.READY_TO_FIRE;
  }

  public reloadAmmo(source: any): void {
    this.status = WeaponStatus.RELOADING_CLIP;
    // Would normally start reload timer here
  }
}

export class WeaponStore implements SubsystemInterface {
  private weaponTemplates: Map<string, WeaponTemplate>;

  constructor() {
    this.weaponTemplates = new Map();
  }

  public init(): void {
    // Initialize weapon store
  }

  public reset(): void {
    this.weaponTemplates.clear();
  }

  public update(): void {
    // Update weapon states
  }

  public findWeaponTemplate(name: string): WeaponTemplate | null {
    return this.weaponTemplates.get(name) || null;
  }

  public allocateNewWeapon(template: WeaponTemplate, slot: WeaponSlotType): Weapon {
    return new Weapon(template, slot);
  }
}

export interface WeaponSetFlags {
  test(flag: number): boolean;
}

export class WeaponSet {
  private weapons: (Weapon | null)[];
  private curWeapon: WeaponSlotType;
  private curWeaponLockedStatus: WeaponLockType;
  private filledWeaponSlotMask: number;
  private hasDamageWeapon: boolean;

  constructor() {
    this.weapons = new Array(WeaponSlotType.WEAPONSLOT_COUNT).fill(null);
    this.curWeapon = WeaponSlotType.PRIMARY_WEAPON;
    this.curWeaponLockedStatus = WeaponLockType.NOT_LOCKED;
    this.filledWeaponSlotMask = 0;
    this.hasDamageWeapon = false;
  }

  public getCurWeapon(): Weapon | null {
    return this.weapons[this.curWeapon];
  }

  public getWeaponInWeaponSlot(slot: WeaponSlotType): Weapon | null {
    return this.weapons[slot];
  }

  public hasAnyWeapon(): boolean {
    return this.filledWeaponSlotMask !== 0;
  }

  public hasAnyDamageWeapon(): boolean {
    return this.hasDamageWeapon;
  }

  public isCurWeaponLocked(): boolean {
    return this.curWeaponLockedStatus !== WeaponLockType.NOT_LOCKED;
  }

  public setWeaponLock(weaponSlot: WeaponSlotType, lockType: WeaponLockType): boolean {
    if (lockType === WeaponLockType.NOT_LOCKED) {
      console.warn("Calling setWeaponLock with NOT_LOCKED, use releaseWeaponLock instead");
      return false;
    }

    if (this.weapons[weaponSlot] !== null) {
      if (lockType === WeaponLockType.LOCKED_PERMANENTLY) {
        this.curWeapon = weaponSlot;
        this.curWeaponLockedStatus = lockType;
      } else if (lockType === WeaponLockType.LOCKED_TEMPORARILY && 
                 this.curWeaponLockedStatus !== WeaponLockType.LOCKED_PERMANENTLY) {
        this.curWeapon = weaponSlot;
        this.curWeaponLockedStatus = lockType;
      }
      return true;
    }

    console.warn(`setWeaponLock: weapon ${weaponSlot} not found (missing an upgrade?)`);
    return false;
  }

  public releaseWeaponLock(lockType: WeaponLockType): void {
    if (this.curWeaponLockedStatus === WeaponLockType.NOT_LOCKED) {
      return;
    }

    if (lockType === WeaponLockType.LOCKED_PERMANENTLY) {
      this.curWeaponLockedStatus = WeaponLockType.NOT_LOCKED;
    } else if (lockType === WeaponLockType.LOCKED_TEMPORARILY) {
      if (this.curWeaponLockedStatus === WeaponLockType.LOCKED_TEMPORARILY) {
        this.curWeaponLockedStatus = WeaponLockType.NOT_LOCKED;
      }
    }
  }

  public reloadAllAmmo(source: any, now: boolean = false): void {
    for (let i = 0; i < WeaponSlotType.WEAPONSLOT_COUNT; i++) {
      const weapon = this.weapons[i];
      if (weapon !== null) {
        if (now) {
          weapon.loadAmmoNow(source);
        } else {
          weapon.reloadAmmo(source);
        }
      }
    }
  }

  public isOutOfAmmo(): boolean {
    for (let i = 0; i < WeaponSlotType.WEAPONSLOT_COUNT; i++) {
      const weapon = this.weapons[i];
      if (weapon !== null && weapon.getStatus() !== WeaponStatus.OUT_OF_AMMO) {
        return false;
      }
    }
    return true;
  }

  public chooseBestWeaponForTarget(source: any, target: any, criteria: WeaponChoiceCriteria, cmdSource: number): boolean {
    // Skip if currently locked
    if (this.isCurWeaponLocked()) {
      return false;
    }

    // Find best weapon based on criteria
    let bestWeapon = WeaponSlotType.PRIMARY_WEAPON;
    let bestDamage = 0;
    let bestRange = 0;
    let found = false;

    for (let i = WeaponSlotType.WEAPONSLOT_COUNT - 1; i >= WeaponSlotType.PRIMARY_WEAPON; i--) {
      const weapon = this.weapons[i];
      if (weapon === null) continue;

      // TODO: Add checks for weapon validity against target
      const damage = 0; // weapon.estimateWeaponDamage(source, target);
      const range = weapon.getTemplate().getAttackRange({
        damage: 1,
        range: 1,
        rateOfFire: 1,
        radius: 1,
        preAttack: 1
      });

      if (criteria === WeaponChoiceCriteria.PREFER_MOST_DAMAGE && damage > bestDamage) {
        bestWeapon = i;
        bestDamage = damage;
        found = true;
      } else if (criteria === WeaponChoiceCriteria.PREFER_LONGEST_RANGE && range > bestRange) {
        bestWeapon = i;
        bestRange = range;
        found = true;
      }
    }

    if (found) {
      this.curWeapon = bestWeapon;
    }

    return found;
  }
}

// Create singleton instance
export const TheWeaponStore = new WeaponStore();