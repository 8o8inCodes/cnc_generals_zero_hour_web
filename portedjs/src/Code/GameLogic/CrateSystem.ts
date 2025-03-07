import { SubsystemInterface } from '../GameEngine/Source/Common/interfaces/SubsystemInterface';

/**
 * Interface for the INI parsing system - mocked for this implementation
 */
interface INI {
  getNextToken(): string;
  getLineNum(): number;
  getFilename(): string;
  getLoadType(): number;
  initFromINI(instance: any, fieldParse: FieldParse[]): void;
}

/**
 * String class replacement used in the original C++ code
 */
class AsciiString {
  private value: string;

  constructor(value: string = '') {
    this.value = value;
  }

  set(value: string): void {
    this.value = value;
  }

  isEmpty(): boolean {
    return this.value.length === 0;
  }

  str(): string {
    return this.value;
  }

  equals(other: AsciiString): boolean {
    return this.value === other.value;
  }
}

/**
 * Enum for veteran levels
 */
enum VeterancyLevel {
  LEVEL_INVALID = -1,
  LEVEL_REGULAR = 0,
  LEVEL_VETERAN = 1,
  LEVEL_ELITE = 2,
  LEVEL_HEROIC = 3
}

/**
 * Enum for science types
 */
enum ScienceType {
  SCIENCE_INVALID = -1
}

/**
 * Bit flags for kind of mask type
 */
class KindOfMaskType {
  private mask: number;

  constructor() {
    this.mask = 0;
  }

  clear(): void {
    this.mask = 0;
  }

  static parseFromINI(ini: INI, instance: any, store: any, userData: any): void {
    // Mock implementation
  }
}

/**
 * Base class for objects that can be overridden
 */
export class Overridable {
  protected isOverride: boolean = false;
  protected nextOverride: Overridable | null = null;

  constructor() {
    this.isOverride = false;
    this.nextOverride = null;
  }

  markAsOverride(): void {
    this.isOverride = true;
  }

  setNextOverride(override: Overridable): void {
    this.nextOverride = override;
  }

  deleteOverrides(): Overridable | null {
    if (this.isOverride) {
      return null;
    } else {
      this.nextOverride = null;
      return this;
    }
  }

  deleteInstance(): void {
    // In TS garbage collection handles this
  }
}

/**
 * Interface for field parsing data
 */
interface FieldParse {
  fieldName: string;
  parseFunc: Function;
  userData: any;
  offset: number;
}

/**
 * Entry for a crate creation configuration
 */
interface CrateCreationEntry {
  crateName: AsciiString;
  crateChance: number;
}

/**
 * A CrateTemplate is an INI defined set of conditions plus a ThingTemplate
 * that is the Object containing the correct CrateCollide module.
 */
export class CrateTemplate extends Overridable {
  private static readonly TheCrateTemplateFieldParseTable: FieldParse[] = [
    { fieldName: 'CreationChance', parseFunc: () => {}, userData: null, offset: 0 },
    { fieldName: 'VeterancyLevel', parseFunc: () => {}, userData: null, offset: 0 },
    { fieldName: 'KilledByType', parseFunc: KindOfMaskType.parseFromINI, userData: null, offset: 0 },
    { fieldName: 'CrateObject', parseFunc: CrateTemplate.parseCrateCreationEntry, userData: null, offset: 0 },
    { fieldName: 'KillerScience', parseFunc: () => {}, userData: null, offset: 0 },
    { fieldName: 'OwnedByMaker', parseFunc: () => {}, userData: null, offset: 0 }
  ];

  m_name: AsciiString;
  m_creationChance: number;
  m_veterancyLevel: VeterancyLevel;
  m_killedByTypeKindof: KindOfMaskType;
  m_killerScience: ScienceType;
  m_possibleCrates: CrateCreationEntry[];
  m_isOwnedByMaker: boolean;

  constructor() {
    super();
    this.m_name = new AsciiString('');
    this.m_creationChance = 0;
    this.m_killedByTypeKindof = new KindOfMaskType();
    this.m_killedByTypeKindof.clear();
    this.m_veterancyLevel = VeterancyLevel.LEVEL_INVALID;
    this.m_killerScience = ScienceType.SCIENCE_INVALID;
    this.m_possibleCrates = [];
    this.m_isOwnedByMaker = false;
  }

  setName(name: AsciiString): void {
    this.m_name = name;
  }

  getName(): AsciiString {
    return this.m_name;
  }

  getFieldParse(): FieldParse[] {
    return CrateTemplate.TheCrateTemplateFieldParseTable;
  }

  static parseCrateCreationEntry(ini: INI, instance: any): void {
    const self = instance as CrateTemplate;
    
    const token = ini.getNextToken();
    const crateName = new AsciiString(token);
    
    const valueToken = ini.getNextToken();
    let crateValue: number;
    try {
      crateValue = parseFloat(valueToken);
      if (isNaN(crateValue)) {
        throw new Error('INI_INVALID_DATA');
      }
    } catch (e) {
      throw new Error('INI_INVALID_DATA');
    }
    
    const newEntry: CrateCreationEntry = {
      crateName: crateName,
      crateChance: crateValue
    };
    
    self.m_possibleCrates.push(newEntry);
  }
}

/**
 * Wrapper class for overrides
 */
class CrateTemplateOverride {
  private template: CrateTemplate;
  
  constructor(template: CrateTemplate) {
    this.template = template;
  }
  
  valueOf(): CrateTemplate {
    return this.template;
  }
}

/**
 * System responsible for Crates as code objects - ini, new/delete etc
 */
export class CrateSystem implements SubsystemInterface {
  private static instance: CrateSystem | null = null;
  private m_crateTemplateVector: CrateTemplate[];

  constructor() {
    this.m_crateTemplateVector = [];
  }

  /**
   * Get the singleton instance of CrateSystem
   */
  public static getInstance(): CrateSystem {
    if (!CrateSystem.instance) {
      CrateSystem.instance = new CrateSystem();
    }
    return CrateSystem.instance;
  }

  /**
   * Initialize the crate system
   */
  public init(): boolean {
    this.reset();
    return true;
  }

  /**
   * Reset the crate system - clean up overrides
   */
  public reset(): void {
    // Clean up overrides
    for (let i = 0; i < this.m_crateTemplateVector.length; i++) {
      const currentTemplate = this.m_crateTemplateVector[i];
      if (currentTemplate) {
        const tempCrateTemplate = currentTemplate.deleteOverrides();
        if (!tempCrateTemplate) {
          // Base template was an override - remove it from the vector
          this.m_crateTemplateVector.splice(i, 1);
          i--; // Adjust index since we removed an element
        }
      } else {
        this.m_crateTemplateVector.splice(i, 1);
        i--; // Adjust index since we removed an element
      }
    }
  }

  /**
   * Update method (empty implementation as required by SubsystemInterface)
   */
  public update(): void {
    // No update needed for CrateSystem
  }

  /**
   * Find a crate template by name (const version)
   */
  public findCrateTemplate(name: AsciiString): CrateTemplate | null {
    // Search crate template list for name
    for (let i = 0; i < this.m_crateTemplateVector.length; i++) {
      if (this.m_crateTemplateVector[i].getName().equals(name)) {
        return this.m_crateTemplateVector[i];
      }
    }
    return null;
  }

  /**
   * Find a crate template by name (friend version for internal use)
   */
  public friend_findCrateTemplate(name: AsciiString): CrateTemplate | null {
    // Search crate template list for name
    for (let i = 0; i < this.m_crateTemplateVector.length; i++) {
      if (this.m_crateTemplateVector[i].getName().equals(name)) {
        return this.m_crateTemplateVector[i];
      }
    }
    return null;
  }

  /**
   * Create a new crate template
   */
  public newCrateTemplate(name: AsciiString): CrateTemplate {
    // Sanity check
    if (name.isEmpty()) {
      throw new Error("Cannot create template with empty name");
    }

    // Create a new template
    const ct = new CrateTemplate();

    // If the default template is present, copy its data to the new template
    const defaultCT = this.findCrateTemplate(new AsciiString('DefaultCrate'));
    if (defaultCT) {
      // In TypeScript we need to copy properties individually
      ct.m_creationChance = defaultCT.m_creationChance;
      ct.m_veterancyLevel = defaultCT.m_veterancyLevel;
      ct.m_killerScience = defaultCT.m_killerScience;
      ct.m_isOwnedByMaker = defaultCT.m_isOwnedByMaker;
      // We would need to clone other complex objects here as well
    }

    ct.setName(name);
    this.m_crateTemplateVector.push(ct);

    return ct;
  }

  /**
   * Create a new crate template override
   */
  public newCrateTemplateOverride(crateToOverride: CrateTemplate): CrateTemplate {
    if (!crateToOverride) {
      throw new Error("Cannot override null template");
    }

    const newOverride = new CrateTemplate();
    
    // Copy properties
    newOverride.m_name = crateToOverride.m_name;
    newOverride.m_creationChance = crateToOverride.m_creationChance;
    newOverride.m_veterancyLevel = crateToOverride.m_veterancyLevel;
    newOverride.m_killerScience = crateToOverride.m_killerScience;
    newOverride.m_isOwnedByMaker = crateToOverride.m_isOwnedByMaker;
    // We would need to clone other complex objects here as well

    newOverride.markAsOverride();
    crateToOverride.setNextOverride(newOverride);
    
    return newOverride;
  }

  /**
   * Parse a crate template definition from INI
   */
  public static parseCrateTemplateDefinition(ini: INI): void {
    const name = new AsciiString(ini.getNextToken());
    
    const crateSystem = CrateSystem.getInstance();
    let crateTemplate = crateSystem.friend_findCrateTemplate(name);
    
    if (!crateTemplate) {
      crateTemplate = crateSystem.newCrateTemplate(name);
      
      if (ini.getLoadType() === 2) { // INI_LOAD_CREATE_OVERRIDES
        crateTemplate.markAsOverride();
      }
    } else if (ini.getLoadType() !== 2) { // INI_LOAD_CREATE_OVERRIDES
      console.error(`[LINE: ${ini.getLineNum()} in '${ini.getFilename()}'] Duplicate crate ${name.str()} found!`);
    } else {
      crateTemplate = crateSystem.newCrateTemplateOverride(crateTemplate);
    }
    
    // Parse the ini definition
    ini.initFromINI(crateTemplate, crateTemplate.getFieldParse());
  }
}

// Export singleton instance
export const TheCrateSystem = CrateSystem.getInstance();