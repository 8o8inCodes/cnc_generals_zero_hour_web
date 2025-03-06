/**
 * Framework for subsystems singletons of the game engine.
 * This is the abstract base interface from which all game engine subsystems should derive from.
 * Nothing about the subsystems is automatic, this interface does not wrap up automated functions,
 * it is only here to provide a basic interface and rules for behavior for all subsystems.
 */
export interface SubsystemInterface {
  /**
   * Initialize the subsystem
   */
  init(): void;

  /**
   * Reset all necessary parts of the subsystem
   */
  reset(): void;

  /**
   * Update the subsystem state
   */
  update(): void;

  /**
   * Render the subsystem if it has visual components
   */
  draw?(): void;

  /**
   * Called for all subsystems after all other Subsystems are initialized.
   * Allows for initializing inter-system dependencies.
   */
  postProcessLoad?(): void;

  /**
   * Get the name of this subsystem
   */
  getName(): string;

  /**
   * Set the name of this subsystem
   */
  setName(name: string): void;
}

/**
 * Helper class to manage and coordinate multiple subsystems
 */
export class SubsystemInterfaceList {
  private subsystems: SubsystemInterface[] = [];
  private allSubsystems: SubsystemInterface[] = [];

  /**
   * Initialize a subsystem with optional config paths
   */
  initSubsystem(
    sys: SubsystemInterface,
    path1?: string,
    path2?: string,
    dirpath?: string,
    name: string = ""
  ): void {
    if (name) {
      sys.setName(name);
    }
    this.addSubsystem(sys);
    sys.init();
  }

  /**
   * Add a subsystem to be managed
   */
  addSubsystem(sys: SubsystemInterface): void {
    this.subsystems.push(sys);
    this.allSubsystems.push(sys); // Keep track of all systems ever added
  }

  /**
   * Remove a subsystem from management
   */
  removeSubsystem(sys: SubsystemInterface): void {
    this.subsystems = this.subsystems.filter(s => s !== sys);
    this.allSubsystems = this.allSubsystems.filter(s => s !== sys);
  }

  /**
   * Call postProcessLoad on all subsystems after all are initialized
   */
  postProcessLoadAll(): void {
    for (const sys of this.subsystems) {
      if (sys.postProcessLoad) {
        sys.postProcessLoad();
      }
    }
  }

  /**
   * Reset all subsystems
   */
  resetAll(): void {
    for (const sys of this.subsystems) {
      sys.reset();
    }
  }

  /**
   * Shutdown and cleanup all subsystems
   */
  shutdownAll(): void {
    // Clear arrays after cleanup
    this.subsystems = [];
    this.allSubsystems = [];
  }
}

// Global subsystem list instance management
let globalSubsystemList: SubsystemInterfaceList | null = null;

export function getTheSubsystemList(): SubsystemInterfaceList | null {
  return globalSubsystemList;
}

export function setTheSubsystemList(list: SubsystemInterfaceList | null): void {
  globalSubsystemList = list;
}

// Compatibility alias for the original C++ global variable
export const TheSubsystemList = {
  get(): SubsystemInterfaceList | null {
    return getTheSubsystemList();
  },
  set(list: SubsystemInterfaceList | null): void {
    setTheSubsystemList(list);
  }
};