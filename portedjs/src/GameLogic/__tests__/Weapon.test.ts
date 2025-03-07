import { describe, it, expect, beforeEach } from 'vitest';
import { 
  WeaponTemplate, 
  Weapon, 
  WeaponSlotType, 
  WeaponStatus, 
  WeaponStore, 
  TheWeaponStore,
  WeaponSet,
  WeaponLockType,
  WeaponChoiceCriteria
} from '../Weapon';

describe('WeaponTemplate', () => {
  let template: WeaponTemplate;

  beforeEach(() => {
    template = new WeaponTemplate('TestWeapon');
  });

  it('should correctly initialize with name', () => {
    expect(template.getName()).toBe('TestWeapon');
  });

  it('should calculate damage with bonus', () => {
    const bonus = {
      damage: 1.5,
      range: 1.0,
      rateOfFire: 1.0,
      radius: 1.0,
      preAttack: 1.0
    };
    // Primary damage starts at 0, so even with bonus it should be 0
    expect(template.getPrimaryDamage(bonus)).toBe(0);
  });

  it('should determine if weapon is contact weapon', () => {
    expect(template.isContactWeapon()).toBe(true); // Since default range is 0
  });
});

describe('Weapon', () => {
  let template: WeaponTemplate;
  let weapon: Weapon;

  beforeEach(() => {
    template = new WeaponTemplate('TestWeapon');
    weapon = new Weapon(template, WeaponSlotType.PRIMARY_WEAPON);
  });

  it('should initialize with correct status', () => {
    expect(weapon.getStatus()).toBe(WeaponStatus.OUT_OF_AMMO);
  });

  it('should load ammo correctly', () => {
    weapon.loadAmmoNow(null);
    expect(weapon.getStatus()).toBe(WeaponStatus.READY_TO_FIRE);
  });

  it('should enter reload state when reloading', () => {
    weapon.reloadAmmo(null);
    expect(weapon.getStatus()).toBe(WeaponStatus.RELOADING_CLIP);
  });
});

describe('WeaponStore', () => {
  beforeEach(() => {
    TheWeaponStore.reset();
  });

  it('should initialize empty', () => {
    expect(TheWeaponStore.findWeaponTemplate('NonexistentWeapon')).toBeNull();
  });

  it('should allocate new weapons', () => {
    const template = new WeaponTemplate('TestWeapon');
    const weapon = TheWeaponStore.allocateNewWeapon(template, WeaponSlotType.PRIMARY_WEAPON);
    expect(weapon).toBeInstanceOf(Weapon);
    expect(weapon.getTemplate()).toBe(template);
  });
});

describe('WeaponSet', () => {
  let weaponSet: WeaponSet;
  let template: WeaponTemplate;
  let weapon: Weapon;

  beforeEach(() => {
    weaponSet = new WeaponSet();
    template = new WeaponTemplate('TestWeapon');
    weapon = new Weapon(template, WeaponSlotType.PRIMARY_WEAPON);
  });

  it('should initialize empty', () => {
    expect(weaponSet.hasAnyWeapon()).toBe(false);
    expect(weaponSet.getCurWeapon()).toBeNull();
  });

  it('should handle weapon locks correctly', () => {
    // Should not be able to lock non-existent weapon
    expect(weaponSet.setWeaponLock(WeaponSlotType.PRIMARY_WEAPON, WeaponLockType.LOCKED_PERMANENTLY))
      .toBe(false);
    
    expect(weaponSet.isCurWeaponLocked()).toBe(false);

    // Release lock when nothing is locked should do nothing
    weaponSet.releaseWeaponLock(WeaponLockType.LOCKED_TEMPORARILY);
    expect(weaponSet.isCurWeaponLocked()).toBe(false);
  });

  it('should manage ammo state correctly', () => {
    expect(weaponSet.isOutOfAmmo()).toBe(true);
    // TODO: Add test for reloadAllAmmo once weapon assignment is implemented
  });

  it('should handle weapon selection', () => {
    const result = weaponSet.chooseBestWeaponForTarget(
      null, // source
      null, // target 
      WeaponChoiceCriteria.PREFER_MOST_DAMAGE,
      0 // command source
    );
    expect(result).toBe(false); // Should fail with no weapons
  });
});