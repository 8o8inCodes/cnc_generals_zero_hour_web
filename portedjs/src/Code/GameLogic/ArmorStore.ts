import { SubsystemInterface } from '../GameEngine/Source/Common/interfaces/SubsystemInterface';
import { ArmorTemplate, Armor } from './Armor';

/**
 * Global store for armor templates that can be loaded from configuration
 */
export class ArmorStore implements SubsystemInterface {
    private static instance: ArmorStore;
    private armorTemplates: Map<string, ArmorTemplate>;

    private constructor() {
        this.armorTemplates = new Map();
    }

    public static getInstance(): ArmorStore {
        if (!ArmorStore.instance) {
            ArmorStore.instance = new ArmorStore();
        }
        return ArmorStore.instance;
    }

    public init(): boolean {
        this.reset();
        return true;
    }

    public reset(): void {
        this.armorTemplates.clear();
    }

    public findArmorTemplate(name: string): ArmorTemplate | null {
        return this.armorTemplates.get(name) || null;
    }

    public addArmorTemplate(name: string, template: ArmorTemplate): void {
        this.armorTemplates.set(name, template);
    }

    public makeArmor(template: ArmorTemplate | null): Armor {
        return new Armor(template);
    }
}