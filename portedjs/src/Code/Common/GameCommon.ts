/**
 * Command & Conquer Generals(tm) 
 * Core game types and utilities
 */

// Constants for game timing
export const LOGICFRAMES_PER_SECOND = 30;
export const MSEC_PER_SECOND = 1000;
export const LOGICFRAMES_PER_MSEC_REAL = LOGICFRAMES_PER_SECOND / MSEC_PER_SECOND;
export const MSEC_PER_LOGICFRAME_REAL = MSEC_PER_SECOND / LOGICFRAMES_PER_SECOND;
export const LOGICFRAMES_PER_SECONDS_REAL = LOGICFRAMES_PER_SECOND;
export const SECONDS_PER_LOGICFRAME_REAL = 1.0 / LOGICFRAMES_PER_SECONDS_REAL;

// Time conversion utilities
export function convertDurationFromMsecsToFrames(msec: number): number {
  return msec * LOGICFRAMES_PER_MSEC_REAL;
}

export function convertVelocityInSecsToFrames(distPerMsec: number): number {
  return distPerMsec * SECONDS_PER_LOGICFRAME_REAL;
}

export function convertAccelerationInSecsToFrames(distPerSec2: number): number {
  const SEC_PER_LOGICFRAME_SQR = SECONDS_PER_LOGICFRAME_REAL * SECONDS_PER_LOGICFRAME_REAL;
  return distPerSec2 * SEC_PER_LOGICFRAME_SQR;
}

export function convertAngularVelocityInDegreesPerSecToRadsPerFrame(degPerSec: number): number {
  const RADS_PER_DEGREE = Math.PI / 180.0;
  return degPerSec * (SECONDS_PER_LOGICFRAME_REAL * RADS_PER_DEGREE);
}

// Constants
export const MAX_PLAYER_COUNT = 16;
export const NEVER = 0;
export const FOREVER = 0x3fffffff;

// Player mask type (16-bit for up to 16 players)
export type PlayerMaskType = number; // Using number instead of UnsignedShort
export const PLAYERMASK_ALL = 0xffff;
export const PLAYERMASK_NONE = 0x0;

// Enums
export enum GameDifficulty {
  EASY,
  NORMAL,
  HARD,
}

export enum PlayerType {
  HUMAN,
  COMPUTER,
}

export enum CellShroudStatus {
  CLEAR,
  FOGGED,
  SHROUDED,
}

export enum ObjectShroudStatus {
  INVALID,
  CLEAR,
  PARTIAL_CLEAR,
  FOGGED,
  SHROUDED,
  INVALID_BUT_PREVIOUS_VALID,
}

export enum GuardMode {
  NORMAL,
  GUARD_WITHOUT_PURSUIT,
  GUARD_FLYING_UNITS_ONLY,
}

export enum VeterancyLevel {
  REGULAR = 0,
  VETERAN,
  ELITE, 
  HEROIC,
  COUNT,
  INVALID,
  FIRST = REGULAR,
  LAST = HEROIC
}

export enum CommandSourceType {
  FROM_PLAYER = 0,
  FROM_SCRIPT,
  FROM_AI,
  FROM_DOZER,
}

export enum Relationship {
  ENEMIES = 0,
  NEUTRAL,
  ALLIES
}

export enum WhichTurretType {
  INVALID = -1,
  MAIN = 0,
  ALT,
  MAX_TURRETS
}

// Attack types flags
export const enum AbleToAttackFlags {
  ATTACK_FORCED = 0x01,
  ATTACK_CONTINUED = 0x02,
  ATTACK_TUNNELNETWORK_GUARD = 0x04
}

export type AbleToAttackType = number;

export const ATTACK_NEW_TARGET = 0;
export const ATTACK_NEW_TARGET_FORCED = AbleToAttackFlags.ATTACK_FORCED;
export const ATTACK_CONTINUED_TARGET = AbleToAttackFlags.ATTACK_CONTINUED;
export const ATTACK_CONTINUED_TARGET_FORCED = AbleToAttackFlags.ATTACK_FORCED | AbleToAttackFlags.ATTACK_CONTINUED;
export const ATTACK_TUNNEL_NETWORK_GUARD = AbleToAttackFlags.ATTACK_TUNNELNETWORK_GUARD;

export function isForcedAttack(t: AbleToAttackType): boolean {
  return (t & AbleToAttackFlags.ATTACK_FORCED) !== 0;
}

export function isContinuedAttack(t: AbleToAttackType): boolean {
  return (t & AbleToAttackFlags.ATTACK_CONTINUED) !== 0;
}

// Veterancy level flags utilities
export type VeterancyLevelFlags = number;
export const VETERANCY_LEVEL_FLAGS_ALL = 0xffffffff;
export const VETERANCY_LEVEL_FLAGS_NONE = 0x00000000;

export function getVeterancyLevelFlag(flags: VeterancyLevelFlags, dt: VeterancyLevel): boolean {
  return (flags & (1 << (dt - 1))) !== 0;
}

export function setVeterancyLevelFlag(flags: VeterancyLevelFlags, dt: VeterancyLevel): VeterancyLevelFlags {
  return flags | (1 << (dt - 1));
}

export function clearVeterancyLevelFlag(flags: VeterancyLevelFlags, dt: VeterancyLevel): VeterancyLevelFlags {
  return flags & ~(1 << (dt - 1));
}

// Angle utilities
export function normalizeAngle(angle: number): number {
  angle = angle % (2 * Math.PI);
  if (angle > Math.PI || angle === Math.PI) angle -= 2 * Math.PI;
  if (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
}

export function stdAngleDiff(a1: number, a2: number): number {
  let diff = a1 - a2;
  diff = diff % (2 * Math.PI); 
  if (diff <= -Math.PI) diff += 2 * Math.PI;
  if (diff > Math.PI) diff -= 2 * Math.PI;
  return diff;
}

// Linked list iterators
export interface ILinkable<T> {
  getNext(): T | null;
  getPrev(): T | null;
  setNext(next: T | null): void;
  setPrev(prev: T | null): void;
}

export class LinkedListIterator<T extends ILinkable<T>> {
  constructor(private current: T | null) {}

  advance(): void {
    if (this.current) {
      this.current = this.current.getNext();
    }
  }

  isDone(): boolean {
    return this.current === null;
  }

  getCurrent(): T | null {
    return this.current;
  }
}