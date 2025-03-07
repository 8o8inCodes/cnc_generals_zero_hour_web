import { Dict } from '../Common/Dict';
import { AsciiString } from '../Common/AsciiString';
import { SubsystemInterface } from '../interfaces/SubsystemInterface';
import { Coord3D } from '../WWMath/Coord3D';

/**
 * Information about a build list entry for a side
 */
export class BuildListInfo {
  private nextBuildList: BuildListInfo | null = null;
  private buildingName: AsciiString = new AsciiString('');
  private templateName: AsciiString = new AsciiString('');
  private location: Coord3D = new Coord3D(0, 0, 0);
  private angle: number = 0;
  private initiallyBuilt: boolean = false;
  private numRebuilds: number = 0;
  private script: AsciiString = new AsciiString('');
  private health: number = 100;
  private whiner: boolean = true;
  private unsellable: boolean = false;
  private repairable: boolean = true;

  getNext(): BuildListInfo | null {
    return this.nextBuildList;
  }

  setNextBuildList(next: BuildListInfo | null): void {
    this.nextBuildList = next;
  }

  getBuildingName(): AsciiString {
    return this.buildingName;
  }

  setBuildingName(name: AsciiString): void {
    this.buildingName = name;
  }

  getTemplateName(): AsciiString {
    return this.templateName;
  }

  setTemplateName(name: AsciiString): void {
    this.templateName = name;
  }

  getLocation(): Coord3D {
    return this.location;
  }

  setLocation(loc: Coord3D): void {
    this.location = loc;
  }

  getAngle(): number {
    return this.angle;
  }

  setAngle(ang: number): void {
    this.angle = ang;
  }

  isInitiallyBuilt(): boolean {
    return this.initiallyBuilt;
  }

  setInitiallyBuilt(built: boolean): void {
    this.initiallyBuilt = built;
  }

  getNumRebuilds(): number {
    return this.numRebuilds;
  }

  setNumRebuilds(num: number): void {
    this.numRebuilds = num;
  }

  incrementNumRebuilds(): void {
    this.numRebuilds++;
  }

  decrementNumRebuilds(): void {
    if (this.numRebuilds > 0) {
      this.numRebuilds--;
    }
  }

  getScript(): AsciiString {
    return this.script;
  }

  setScript(script: AsciiString): void {
    this.script = script;
  }

  getHealth(): number {
    return this.health;
  }

  setHealth(health: number): void {
    this.health = health;
  }

  getWhiner(): boolean {
    return this.whiner;
  }

  setWhiner(whiner: boolean): void {
    this.whiner = whiner;
  }

  getUnsellable(): boolean {
    return this.unsellable;
  }

  setUnsellable(unsellable: boolean): void {
    this.unsellable = unsellable;
  }

  getRepairable(): boolean {
    return this.repairable;
  }

  setRepairable(repairable: boolean): void {
    this.repairable = repairable;
  }

  isBuildable(): boolean {
    return this.numRebuilds > 0;
  }
}

/**
 * Information about a side in the game (player, AI, neutral etc.)
 */
export class SidesInfo {
  private buildList: BuildListInfo | null = null;
  private dict: Dict = new Dict();

  constructor() {}

  getBuildList(): BuildListInfo | null {
    return this.buildList;
  }

  getDict(): Dict {
    return this.dict;
  }

  init(d: Dict | null): void {
    this.buildList = null;
    this.dict = new Dict();
    if (d) {
      this.dict = d.clone();
    }
  }

  clear(): void {
    this.buildList = null;
    this.dict = new Dict();
  }

  addToBuildList(buildInfo: BuildListInfo, position: number): void {
    if (!this.buildList || position === 0) {
      buildInfo.setNextBuildList(this.buildList);
      this.buildList = buildInfo;
      return;
    }

    let current = this.buildList;
    let prev = null;
    let currentPos = 0;

    while (current && currentPos < position) {
      prev = current;
      current = current.getNext();
      currentPos++;
    }

    if (prev) {
      buildInfo.setNextBuildList(current);
      prev.setNextBuildList(buildInfo);
    }
  }

  removeFromBuildList(buildInfo: BuildListInfo): number {
    let position = 0;

    if (buildInfo === this.buildList) {
      this.buildList = buildInfo.getNext();
    } else {
      position = 1;
      let prev = this.buildList;
      while (prev && prev.getNext() !== buildInfo) {
        prev = prev.getNext();
        position++;
      }
      if (prev) {
        prev.setNextBuildList(buildInfo.getNext());
      }
    }
    buildInfo.setNextBuildList(null);
    return position;
  }

  reorderInBuildList(buildInfo: BuildListInfo, newPosition: number): void {
    const currentPosition = this.removeFromBuildList(buildInfo);
    if (newPosition > currentPosition) {
      newPosition--;
    }
    this.addToBuildList(buildInfo, newPosition);
  }
}

/**
 * Singleton class that maintains information about sides in the game
 */
export class SidesList implements SubsystemInterface {
  private static readonly MAX_PLAYER_COUNT = 16;
  private static readonly MAX_TEAM_DEPTH = 3;

  private static instance: SidesList | null = null;
  private sides: SidesInfo[] = new Array(SidesList.MAX_PLAYER_COUNT).fill(null).map(() => new SidesInfo());
  private numSides: number = 0;

  private constructor() {}

  static getInstance(): SidesList {
    if (!SidesList.instance) {
      SidesList.instance = new SidesList();
    }
    return SidesList.instance;
  }

  init(): void {}

  update(): void {}

  reset(): void {
    this.clear();
  }

  clear(): void {
    this.emptySides();
  }

  getNumSides(): number {
    return this.numSides;
  }

  getSideInfo(side: number): SidesInfo | null {
    if (side >= 0 && side < this.numSides) {
      return this.sides[side];
    }
    return null;
  }

  findSideInfo(name: AsciiString, index?: { value: number }): SidesInfo | null {
    for (let i = 0; i < this.numSides; i++) {
      if (this.sides[i].getDict().getAsciiString('playerName').equals(name)) {
        if (index) {
          index.value = i;
        }
        return this.sides[i];
      }
    }
    return null;
  }

  emptySides(): void {
    this.numSides = 0;
    for (const side of this.sides) {
      side.clear();
    }
  }

  addSide(d: Dict): void {
    if (this.numSides < SidesList.MAX_PLAYER_COUNT) {
      this.sides[this.numSides].init(d);
      this.numSides++;
    }
  }

  removeSide(i: number): void {
    if (i < 0 || i >= this.numSides || this.numSides <= 1) {
      return;
    }

    // Shift remaining sides down with proper copying
    for (let j = i; j < this.numSides - 1; j++) {
      this.sides[j].init(this.sides[j + 1].getDict());
    }
    
    this.sides[this.numSides - 1].clear();
    this.numSides--;
  }

  validateSides(): boolean {
    // Placeholder for now - in the original this validates various relationships
    // between sides, allies, enemies etc.
    return false;
  }
}