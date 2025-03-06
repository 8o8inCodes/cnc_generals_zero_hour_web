import { describe, it, expect, beforeEach } from 'vitest';
import { ArmorTemplate, Armor, ArmorSetType } from '../Armor';
import { ArmorStore } from '../ArmorStore';
import { ArmorTemplateSet, ArmorTemplateSetFinder } from '../ArmorSet';
import { DamageType } from '../Damage';

describe('Armor System', () => {
    describe('ArmorTemplate', () => {
        let template: ArmorTemplate;

        beforeEach(() => {
            template = new ArmorTemplate();
        });

        it('should initialize with default coefficients', () => {
            expect(template.adjustDamage(DamageType.DAMAGE_NORMAL, 100)).toBe(100);
        });

        it('should apply damage coefficients correctly', () => {
            template.setDamageCoefficient(DamageType.DAMAGE_NORMAL, 0.5);
            expect(template.adjustDamage(DamageType.DAMAGE_NORMAL, 100)).toBe(50);
        });

        it('should not modify unresistable damage', () => {
            template.setDamageCoefficient(DamageType.DAMAGE_UNRESISTABLE, 0.5);
            expect(template.adjustDamage(DamageType.DAMAGE_UNRESISTABLE, 100)).toBe(100);
        });

        it('should not allow negative damage', () => {
            template.setDamageCoefficient(DamageType.DAMAGE_NORMAL, -0.5);
            expect(template.adjustDamage(DamageType.DAMAGE_NORMAL, 100)).toBe(0);
        });
    });

    describe('Armor', () => {
        let template: ArmorTemplate;
        let armor: Armor;

        beforeEach(() => {
            template = new ArmorTemplate();
            template.setDamageCoefficient(DamageType.DAMAGE_NORMAL, 0.5);
            armor = new Armor(template);
        });

        it('should use template damage coefficients', () => {
            expect(armor.adjustDamage(DamageType.DAMAGE_NORMAL, 100)).toBe(50);
        });

        it('should pass through damage when no template', () => {
            armor.clear();
            expect(armor.adjustDamage(DamageType.DAMAGE_NORMAL, 100)).toBe(100);
        });
    });

    describe('ArmorTemplateSet', () => {
        let set: ArmorTemplateSet;
        let template: ArmorTemplate;

        beforeEach(() => {
            set = new ArmorTemplateSet();
            template = new ArmorTemplate();
        });

        it('should store and retrieve armor template', () => {
            set.setArmorTemplate(template);
            expect(set.getArmorTemplate()).toBe(template);
        });

        it('should manage condition flags', () => {
            set.setConditionFlag(ArmorSetType.VETERAN, true);
            expect(set.getConditionsFlags().test(ArmorSetType.VETERAN)).toBe(true);
            expect(set.getConditionsFlags().test(ArmorSetType.ELITE)).toBe(false);
        });
    });

    describe('ArmorTemplateSetFinder', () => {
        let finder: ArmorTemplateSetFinder;
        let set1: ArmorTemplateSet;
        let set2: ArmorTemplateSet;

        beforeEach(() => {
            finder = new ArmorTemplateSetFinder();
            set1 = new ArmorTemplateSet();
            set2 = new ArmorTemplateSet();

            // Set1 has VETERAN flag
            set1.setConditionFlag(ArmorSetType.VETERAN, true);

            // Set2 has VETERAN and ELITE flags
            set2.setConditionFlag(ArmorSetType.VETERAN, true);
            set2.setConditionFlag(ArmorSetType.ELITE, true);

            finder.addTemplateSet(set1);
            finder.addTemplateSet(set2);
        });

        it('should find exact match', () => {
            const flags = set1.getConditionsFlags();
            expect(finder.findBestMatch(flags)).toBe(set1);
        });

        it('should find best partial match', () => {
            const flags = set2.getConditionsFlags();
            flags.set(ArmorSetType.HERO, 1);
            expect(finder.findBestMatch(flags)).toBe(set2);
        });

        it('should clear template sets', () => {
            finder.clear();
            const flags = set1.getConditionsFlags();
            expect(finder.findBestMatch(flags)).toBeNull();
        });
    });

    describe('ArmorStore', () => {
        let store: ArmorStore;
        let template: ArmorTemplate;

        beforeEach(() => {
            store = ArmorStore.getInstance();
            store.reset();
            template = new ArmorTemplate();
        });

        it('should store and retrieve templates by name', () => {
            store.addArmorTemplate('test', template);
            expect(store.findArmorTemplate('test')).toBe(template);
        });

        it('should return null for non-existent templates', () => {
            expect(store.findArmorTemplate('nonexistent')).toBeNull();
        });

        it('should make armor instances', () => {
            const armor = store.makeArmor(template);
            expect(armor.adjustDamage(DamageType.DAMAGE_NORMAL, 100)).toBe(100);
        });

        it('should maintain singleton instance', () => {
            const store2 = ArmorStore.getInstance();
            expect(store2).toBe(store);
        });
    });
});