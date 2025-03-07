/*
**  Command & Conquer Generals(tm) TypeScript Conversion
**  Based on original code Copyright 2025 Electronic Arts Inc.
*/

/**
 * Interface for game subsystems
 */
export interface SubsystemInterface {
  /**
   * Initialize the subsystem
   */
  init(): void;
  
  /**
   * Reset the subsystem
   */
  reset(): void;
  
  /**
   * Update the subsystem
   */
  update(): void;
}