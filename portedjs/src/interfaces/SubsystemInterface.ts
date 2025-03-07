/**
 * Interface for game subsystems
 */
export interface SubsystemInterface {
  init(): void;
  update(): void;
  reset(): void;
}