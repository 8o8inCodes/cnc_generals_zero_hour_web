import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { CrateSystem, CrateTemplate, TheCrateSystem } from '../CrateSystem';

// Mock dependencies
vi.mock('../GameEngine/Source/Common/interfaces/SubsystemInterface', () => ({
  SubsystemInterface: vi.fn()
}));

describe('CrateSystem', () => {
  beforeEach(() => {
    // Reset the singleton state before each test
    vi.clearAllMocks();
    (CrateSystem as any).instance = null;
  });

  describe('getInstance', () => {
    it('should return the singleton instance', () => {
      const instance1 = CrateSystem.getInstance();
      const instance2 = CrateSystem.getInstance();
      
      expect(instance1).toBe(instance2);
      expect(instance1).toBeInstanceOf(CrateSystem);
    });
  });

  describe('init', () => {
    it('should call reset and return true', () => {
      const crateSystem = CrateSystem.getInstance();
      const resetSpy = vi.spyOn(crateSystem, 'reset');
      
      const result = crateSystem.init();
      
      expect(resetSpy).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('reset', () => {
    it('should clear templates that are marked as overrides', () => {
      const crateSystem = CrateSystem.getInstance();
      
      // Create a template and add it to the system
      const name = { set: vi.fn(), isEmpty: () => false, str: () => 'TestCrate', equals: () => true };
      const template = crateSystem['newCrateTemplate'](name as any);
      
      // Mark it as an override
      template.markAsOverride();
      
      // Before reset
      expect(crateSystem['m_crateTemplateVector'].length).toBe(1);
      
      // Call reset
      crateSystem.reset();
      
      // After reset
      expect(crateSystem['m_crateTemplateVector'].length).toBe(0);
    });

    it('should keep templates that are not marked as overrides', () => {
      const crateSystem = CrateSystem.getInstance();
      
      // Create a template and add it to the system
      const name = { set: vi.fn(), isEmpty: () => false, str: () => 'TestCrate', equals: () => true };
      const template = crateSystem['newCrateTemplate'](name as any);
      
      // Before reset
      expect(crateSystem['m_crateTemplateVector'].length).toBe(1);
      
      // Call reset
      crateSystem.reset();
      
      // After reset - template should still be there
      expect(crateSystem['m_crateTemplateVector'].length).toBe(1);
    });
  });

  describe('findCrateTemplate', () => {
    it('should find a template by name', () => {
      const crateSystem = CrateSystem.getInstance();
      
      // Create a template with a specific name
      const name = { set: vi.fn(), isEmpty: () => false, str: () => 'TestCrate', equals: (n: any) => n.str() === 'TestCrate' };
      const template = crateSystem.newCrateTemplate(name as any);
      
      // Find it by name
      const foundTemplate = crateSystem.findCrateTemplate(name as any);
      
      expect(foundTemplate).toBe(template);
    });

    it('should return null if template not found', () => {
      const crateSystem = CrateSystem.getInstance();
      
      // Look for a template that doesn't exist
      const name = { set: vi.fn(), isEmpty: () => false, str: () => 'NonExistentCrate', equals: (n: any) => n.str() === 'NonExistentCrate' };
      const foundTemplate = crateSystem.findCrateTemplate(name as any);
      
      expect(foundTemplate).toBeNull();
    });
  });
  
  describe('newCrateTemplate', () => {
    it('should create a new template with the given name', () => {
      const crateSystem = CrateSystem.getInstance();
      
      // Create a template with a specific name
      const name = { set: vi.fn(), isEmpty: () => false, str: () => 'TestCrate', equals: (n: any) => n.str() === 'TestCrate' };
      const template = crateSystem.newCrateTemplate(name as any);
      
      expect(template.getName()).toBe(name);
      expect(crateSystem['m_crateTemplateVector']).toContain(template);
    });
    
    it('should throw error when name is empty', () => {
      const crateSystem = CrateSystem.getInstance();
      
      // Create a template with empty name
      const name = { set: vi.fn(), isEmpty: () => true, str: () => '', equals: () => false };
      
      expect(() => {
        crateSystem.newCrateTemplate(name as any);
      }).toThrow('Cannot create template with empty name');
    });
    
    it('should copy properties from DefaultCrate if it exists', () => {
      const crateSystem = CrateSystem.getInstance();
      
      // First create a DefaultCrate template
      const defaultName = { set: vi.fn(), isEmpty: () => false, str: () => 'DefaultCrate', equals: (n: any) => n.str() === 'DefaultCrate' };
      const defaultTemplate = crateSystem.newCrateTemplate(defaultName as any);
      
      // Set some properties on the default template
      defaultTemplate.m_creationChance = 0.75;
      defaultTemplate.m_isOwnedByMaker = true;
      
      // Create a new template which should inherit from DefaultCrate
      const newName = { set: vi.fn(), isEmpty: () => false, str: () => 'NewCrate', equals: (n: any) => n.str() === 'NewCrate' };
      const newTemplate = crateSystem.newCrateTemplate(newName as any);
      
      // Check if properties were inherited
      expect(newTemplate.m_creationChance).toBe(0.75);
      expect(newTemplate.m_isOwnedByMaker).toBe(true);
    });
  });
  
  describe('newCrateTemplateOverride', () => {
    it('should create an override of the given template', () => {
      const crateSystem = CrateSystem.getInstance();
      
      // Create a template
      const name = { set: vi.fn(), isEmpty: () => false, str: () => 'TestCrate', equals: () => true };
      const template = crateSystem.newCrateTemplate(name as any);
      
      // Set some properties
      template.m_creationChance = 0.5;
      template.m_isOwnedByMaker = false;
      
      // Create an override
      const override = crateSystem.newCrateTemplateOverride(template);
      
      // Check if properties were copied
      expect(override.m_creationChance).toBe(0.5);
      expect(override.m_isOwnedByMaker).toBe(false);
      
      // Check if it's marked as an override
      expect(override['isOverride']).toBeTruthy();
    });
    
    it('should throw error when template is null', () => {
      const crateSystem = CrateSystem.getInstance();
      
      expect(() => {
        crateSystem.newCrateTemplateOverride(null as any);
      }).toThrow('Cannot override null template');
    });
  });
  
  describe('TheCrateSystem', () => {
    it('should be the singleton instance of CrateSystem', () => {
      expect(TheCrateSystem).toStrictEqual(CrateSystem.getInstance());
    });
  });

  describe('parseCrateTemplateDefinition', () => {
    it('should create a new template from INI data', () => {
      // Mock INI object
      const ini = {
        getNextToken: vi.fn().mockReturnValueOnce('NewCrate'),
        getLineNum: vi.fn(),
        getFilename: vi.fn(),
        getLoadType: vi.fn().mockReturnValue(0),
        initFromINI: vi.fn()
      };

      // Start with clean state
      (CrateSystem as any).instance = null;
      const crateSystem = CrateSystem.getInstance();
      
      // Spy on methods
      const findSpy = vi.spyOn(crateSystem, 'friend_findCrateTemplate').mockReturnValue(null);
      const newTemplateSpy = vi.spyOn(crateSystem, 'newCrateTemplate');
      
      // Parse from INI
      CrateSystem.parseCrateTemplateDefinition(ini as any);
      
      // Verify correct methods were called
      expect(findSpy).toHaveBeenCalled();
      expect(newTemplateSpy).toHaveBeenCalled();
      expect(ini.initFromINI).toHaveBeenCalled();
    });
  });
});

describe('CrateTemplate', () => {
  describe('parseCrateCreationEntry', () => {
    it('should parse a crate entry from INI', () => {
      // Create a template
      const template = new CrateTemplate();
      
      // Mock INI
      const ini = {
        getNextToken: vi.fn()
          .mockReturnValueOnce('PowerUpCrate')  // First token - name
          .mockReturnValueOnce('0.75'),         // Second token - chance
        getLineNum: vi.fn(),
        getFilename: vi.fn(),
        getLoadType: vi.fn()
      };
      
      // Call parse method
      CrateTemplate.parseCrateCreationEntry(ini as any, template);
      
      // Check if entry was added correctly
      expect(template.m_possibleCrates.length).toBe(1);
      expect(template.m_possibleCrates[0].crateName.str()).toBe('PowerUpCrate');
      expect(template.m_possibleCrates[0].crateChance).toBe(0.75);
    });
    
    it('should throw error if value is not a number', () => {
      // Create a template
      const template = new CrateTemplate();
      
      // Mock INI with invalid value
      const ini = {
        getNextToken: vi.fn()
          .mockReturnValueOnce('PowerUpCrate')
          .mockReturnValueOnce('not-a-number'),
        getLineNum: vi.fn(),
        getFilename: vi.fn(),
        getLoadType: vi.fn()
      };
      
      // Call parse method and expect exception
      expect(() => {
        CrateTemplate.parseCrateCreationEntry(ini as any, template);
      }).toThrow('INI_INVALID_DATA');
    });
  });
});