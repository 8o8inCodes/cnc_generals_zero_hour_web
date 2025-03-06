/**
 * AIStates - Enumeration of possible AI states
 */

export enum AIState {
  IDLE,       // AI is waiting for commands
  BUSY,       // AI is executing commands
  COMBAT,     // AI is engaging in combat
  MOVING,     // AI is moving to a target location
  GUARDING,   // AI is guarding a location or object
  PATROLLING, // AI is patrolling between points
  FLEEING,    // AI is retreating from danger
  DEAD        // AI controlled entity is dead/destroyed
}