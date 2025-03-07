import { SidesList, BuildListInfo, SidesInfo } from '../SidesList';
import { Dict } from '../../Common/Dict';
import { AsciiString } from '../../Common/AsciiString';
import { Coord3D } from '../../WWMath/Coord3D';

describe('BuildListInfo', () => {
  let buildInfo: BuildListInfo;

  beforeEach(() => {
    buildInfo = new BuildListInfo();
  });

  test('default values', () => {
    expect(buildInfo.getNext()).toBeNull();
    expect(buildInfo.getBuildingName().toString()).toBe('');
    expect(buildInfo.getTemplateName().toString()).toBe('');
    expect(buildInfo.getLocation()).toEqual(new Coord3D(0, 0, 0));
    expect(buildInfo.getAngle()).toBe(0);
    expect(buildInfo.isInitiallyBuilt()).toBe(false);
    expect(buildInfo.getNumRebuilds()).toBe(0);
    expect(buildInfo.getScript().toString()).toBe('');
    expect(buildInfo.getHealth()).toBe(100);
    expect(buildInfo.getWhiner()).toBe(true);
    expect(buildInfo.getUnsellable()).toBe(false);
    expect(buildInfo.getRepairable()).toBe(true);
  });

  test('setters and getters', () => {
    const nextBuild = new BuildListInfo();
    const buildingName = new AsciiString('Building1');
    const templateName = new AsciiString('Template1');
    const location = new Coord3D(1, 2, 3);
    const script = new AsciiString('TestScript');

    buildInfo.setNextBuildList(nextBuild);
    buildInfo.setBuildingName(buildingName);
    buildInfo.setTemplateName(templateName);
    buildInfo.setLocation(location);
    buildInfo.setAngle(45);
    buildInfo.setInitiallyBuilt(true);
    buildInfo.setNumRebuilds(2);
    buildInfo.setScript(script);
    buildInfo.setHealth(80);
    buildInfo.setWhiner(false);
    buildInfo.setUnsellable(true);
    buildInfo.setRepairable(false);

    expect(buildInfo.getNext()).toBe(nextBuild);
    expect(buildInfo.getBuildingName()).toBe(buildingName);
    expect(buildInfo.getTemplateName()).toBe(templateName);
    expect(buildInfo.getLocation()).toBe(location);
    expect(buildInfo.getAngle()).toBe(45);
    expect(buildInfo.isInitiallyBuilt()).toBe(true);
    expect(buildInfo.getNumRebuilds()).toBe(2);
    expect(buildInfo.getScript()).toBe(script);
    expect(buildInfo.getHealth()).toBe(80);
    expect(buildInfo.getWhiner()).toBe(false);
    expect(buildInfo.getUnsellable()).toBe(true);
    expect(buildInfo.getRepairable()).toBe(false);
  });

  test('rebuild counter operations', () => {
    expect(buildInfo.isBuildable()).toBe(false);
    
    buildInfo.setNumRebuilds(2);
    expect(buildInfo.isBuildable()).toBe(true);
    
    buildInfo.decrementNumRebuilds();
    expect(buildInfo.getNumRebuilds()).toBe(1);
    
    buildInfo.incrementNumRebuilds();
    expect(buildInfo.getNumRebuilds()).toBe(2);
    
    buildInfo.decrementNumRebuilds();
    buildInfo.decrementNumRebuilds();
    expect(buildInfo.getNumRebuilds()).toBe(0);
    
    // Should not go below 0
    buildInfo.decrementNumRebuilds();
    expect(buildInfo.getNumRebuilds()).toBe(0);
  });
});

describe('SidesInfo', () => {
  let sidesInfo: SidesInfo;
  let buildInfo1: BuildListInfo;
  let buildInfo2: BuildListInfo;
  let buildInfo3: BuildListInfo;

  beforeEach(() => {
    sidesInfo = new SidesInfo();
    buildInfo1 = new BuildListInfo();
    buildInfo2 = new BuildListInfo();
    buildInfo3 = new BuildListInfo();
    
    buildInfo1.setBuildingName(new AsciiString('Building1'));
    buildInfo2.setBuildingName(new AsciiString('Building2'));
    buildInfo3.setBuildingName(new AsciiString('Building3'));
  });

  test('initial state', () => {
    expect(sidesInfo.getBuildList()).toBeNull();
    expect(sidesInfo.getDict()).toBeInstanceOf(Dict);
  });

  test('init and clear', () => {
    const dict = new Dict();
    dict.setString('test', 'value');
    
    sidesInfo.init(dict);
    expect(sidesInfo.getDict()).toStrictEqual(dict);
    
    sidesInfo.clear();
    expect(sidesInfo.getBuildList()).toBeNull();
    expect(sidesInfo.getDict()).not.toBe(dict);
  });

  test('build list operations', () => {
    // Add first item
    sidesInfo.addToBuildList(buildInfo1, 0);
    expect(sidesInfo.getBuildList()).toBe(buildInfo1);
    expect(buildInfo1.getNext()).toBeNull();

    // Add second item at position 1
    sidesInfo.addToBuildList(buildInfo2, 1);
    expect(sidesInfo.getBuildList()).toBe(buildInfo1);
    expect(buildInfo1.getNext()).toBe(buildInfo2);
    expect(buildInfo2.getNext()).toBeNull();

    // Add third item at position 1 (between 1 and 2)
    sidesInfo.addToBuildList(buildInfo3, 1);
    expect(sidesInfo.getBuildList()).toBe(buildInfo1);
    expect(buildInfo1.getNext()).toBe(buildInfo3);
    expect(buildInfo3.getNext()).toBe(buildInfo2);

    // Remove middle item
    const pos = sidesInfo.removeFromBuildList(buildInfo3);
    expect(pos).toBe(1);
    expect(buildInfo1.getNext()).toBe(buildInfo2);
    expect(buildInfo2.getNext()).toBeNull();
    expect(buildInfo3.getNext()).toBeNull();

    // Reorder remaining items
    sidesInfo.reorderInBuildList(buildInfo2, 0);
    expect(sidesInfo.getBuildList()).toBe(buildInfo2);
    expect(buildInfo2.getNext()).toBe(buildInfo1);
    expect(buildInfo1.getNext()).toBeNull();
  });
});

describe('SidesList', () => {
  let sidesList: SidesList;

  beforeEach(() => {
    // Reset singleton
    (SidesList as any).instance = null;
    sidesList = SidesList.getInstance();
  });

  test('singleton pattern', () => {
    const instance1 = SidesList.getInstance();
    const instance2 = SidesList.getInstance();
    expect(instance1).toBe(instance2);
  });

  test('sides management', () => {
    expect(sidesList.getNumSides()).toBe(0);

    const dict1 = new Dict();
    dict1.setString('playerName', 'Player1');
    sidesList.addSide(dict1);
    expect(sidesList.getNumSides()).toBe(1);

    const dict2 = new Dict();
    dict2.setString('playerName', 'Player2');
    sidesList.addSide(dict2);
    expect(sidesList.getNumSides()).toBe(2);

    // Test getSideInfo
    const side1 = sidesList.getSideInfo(0);
    expect(side1).toBeTruthy();
    expect(side1?.getDict().getString('playerName')).toBe('Player1');

    // Test findSideInfo
    const found = sidesList.findSideInfo(new AsciiString('Player2'));
    expect(found).toBeTruthy();
    expect(found?.getDict().getString('playerName')).toBe('Player2');

    // Test findSideInfo with index
    const index = { value: -1 };
    const foundWithIndex = sidesList.findSideInfo(new AsciiString('Player1'), index);
    expect(foundWithIndex).toBeTruthy();
    expect(index.value).toBe(0);

    // Test removeSide
    sidesList.removeSide(0);
    expect(sidesList.getNumSides()).toBe(1);
    expect(sidesList.getSideInfo(0)?.getDict().getString('playerName')).toBe('Player2');

    // Cannot remove last side
    sidesList.removeSide(0);
    expect(sidesList.getNumSides()).toBe(1);

    // Test clear/reset
    sidesList.reset();
    expect(sidesList.getNumSides()).toBe(0);
  });
});