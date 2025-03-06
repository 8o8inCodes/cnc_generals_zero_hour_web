# C&C Generals Zero Hour TypeScript Conversion Tasks
## For AI Agent:
Pick up the next incomplete task from conversion-tasks.md. Convert it to typescript and make sure to add a unittest and run it in order to make sure that the logic is written correctly. Mock any external dependencies.
Once conversion is complete and tests are passing, mark the task as complete and end the iteration.

## For humans (copy paste to copilot agent):
Get context from conversion-tasks.md "For AI Agent" and do what it says.

## Core Engine
- [x] Code/GameEngine/Source/Common/GameEngine.cpp -> GameEngine.ts
- [x] Code/GameEngine/Source/Common/GameMain.cpp -> GameMain.ts 
- [x] Code/GameEngine/Include/Common/SubsystemInterface.h -> interfaces/SubsystemInterface.ts
- [x] Code/GameEngine/Include/Common/GameCommon.h -> Common/GameCommon.ts

## Game Logic
- [x] Code/GameEngine/Source/GameLogic/GameLogic.cpp -> GameLogic/GameLogic.ts
- [x] Code/GameEngine/Source/GameLogic/AI.cpp -> GameLogic/AI.ts
- [x] Code/GameEngine/Source/GameLogic/Armor.cpp -> GameLogic/Armor.ts
- [ ] Code/GameEngine/Source/GameLogic/CaveSystem.cpp -> GameLogic/CaveSystem.ts
- [ ] Code/GameEngine/Source/GameLogic/CrateSystem.cpp -> GameLogic/CrateSystem.ts
- [ ] Code/GameEngine/Source/GameLogic/Locomotor.cpp -> GameLogic/Locomotor.ts
- [ ] Code/GameEngine/Source/GameLogic/ObjectCreationList.cpp -> GameLogic/ObjectCreationList.ts
- [ ] Code/GameEngine/Source/GameLogic/RankInfo.cpp -> GameLogic/RankInfo.ts
- [ ] Code/GameEngine/Source/GameLogic/ScriptEngine.cpp -> GameLogic/ScriptEngine.ts
- [ ] Code/GameEngine/Source/GameLogic/SidesList.cpp -> GameLogic/SidesList.ts
- [ ] Code/GameEngine/Source/GameLogic/VictoryConditions.cpp -> GameLogic/VictoryConditions.ts
- [ ] Code/GameEngine/Source/GameLogic/Weapon.cpp -> GameLogic/Weapon.ts

## Game Client
- [ ] Code/GameEngine/Source/GameClient/Display.cpp -> GameClient/Display.ts
- [ ] Code/GameEngine/Source/GameClient/Drawable.cpp -> GameClient/Drawable.ts
- [ ] Code/GameEngine/Source/GameClient/FXList.cpp -> GameClient/FXList.ts
- [ ] Code/GameEngine/Source/GameClient/GameClient.cpp -> GameClient/GameClient.ts
- [ ] Code/GameEngine/Source/GameClient/GameText.cpp -> GameClient/GameText.ts
- [ ] Code/GameEngine/Source/GameClient/GameWindowManager.cpp -> GameClient/GameWindowManager.ts
- [ ] Code/GameEngine/Source/GameClient/GlobalLanguage.cpp -> GameClient/GlobalLanguage.ts
- [ ] Code/GameEngine/Source/GameClient/GUICallbacks.cpp -> GameClient/GUICallbacks.ts
- [ ] Code/GameEngine/Source/GameClient/Keyboard.cpp -> GameClient/Keyboard.ts
- [ ] Code/GameEngine/Source/GameClient/MapUtil.cpp -> GameClient/MapUtil.ts
- [ ] Code/GameEngine/Source/GameClient/MetaEvent.cpp -> GameClient/MetaEvent.ts
- [ ] Code/GameEngine/Source/GameClient/ParticleSys.cpp -> GameClient/ParticleSys.ts
- [ ] Code/GameEngine/Source/GameClient/Shell.cpp -> GameClient/Shell.ts
- [ ] Code/GameEngine/Source/GameClient/TerrainRoads.cpp -> GameClient/TerrainRoads.ts
- [ ] Code/GameEngine/Source/GameClient/Water.cpp -> GameClient/Water.ts

## Common Systems
- [ ] Code/GameEngine/Source/Common/ActionManager.cpp -> Common/ActionManager.ts
- [ ] Code/GameEngine/Source/Common/AudioAffect.cpp -> Common/AudioAffect.ts
- [ ] Code/GameEngine/Source/Common/BuildAssistant.cpp -> Common/BuildAssistant.ts
- [ ] Code/GameEngine/Source/Common/CDManager.cpp -> Common/CDManager.ts
- [ ] Code/GameEngine/Source/Common/CommandLine.cpp -> Common/CommandLine.ts
- [ ] Code/GameEngine/Source/Common/DamageFX.cpp -> Common/DamageFX.ts
- [ ] Code/GameEngine/Source/Common/FileSystem.cpp -> Common/FileSystem.ts
- [ ] Code/GameEngine/Source/Common/FunctionLexicon.cpp -> Common/FunctionLexicon.ts
- [ ] Code/GameEngine/Source/Common/GameLOD.cpp -> Common/GameLOD.ts
- [ ] Code/GameEngine/Source/Common/GameState.cpp -> Common/GameState.ts
- [ ] Code/GameEngine/Source/Common/GlobalData.cpp -> Common/GlobalData.ts
- [ ] Code/GameEngine/Source/Common/INI.cpp -> Common/INI.ts
- [ ] Code/GameEngine/Source/Common/MessageStream.cpp -> Common/MessageStream.ts
- [ ] Code/GameEngine/Source/Common/MultiplayerSettings.cpp -> Common/MultiplayerSettings.ts
- [ ] Code/GameEngine/Source/Common/NameKeyGenerator.cpp -> Common/NameKeyGenerator.ts
- [ ] Code/GameEngine/Source/Common/Player.cpp -> Common/Player.ts
- [ ] Code/GameEngine/Source/Common/PlayerList.cpp -> Common/PlayerList.ts
- [ ] Code/GameEngine/Source/Common/PlayerTemplate.cpp -> Common/PlayerTemplate.ts
- [ ] Code/GameEngine/Source/Common/Radar.cpp -> Common/Radar.ts
- [ ] Code/GameEngine/Source/Common/RandomValue.cpp -> Common/RandomValue.ts
- [ ] Code/GameEngine/Source/Common/Recorder.cpp -> Common/Recorder.ts
- [ ] Code/GameEngine/Source/Common/Registry.cpp -> Common/Registry.ts
- [ ] Code/GameEngine/Source/Common/Science.cpp -> Common/Science.ts
- [ ] Code/GameEngine/Source/Common/SpecialPower.cpp -> Common/SpecialPower.ts
- [ ] Code/GameEngine/Source/Common/Team.cpp -> Common/Team.ts
- [ ] Code/GameEngine/Source/Common/TerrainTypes.cpp -> Common/TerrainTypes.ts
- [ ] Code/GameEngine/Source/Common/ThingFactory.cpp -> Common/ThingFactory.ts
- [ ] Code/GameEngine/Source/Common/Upgrade.cpp -> Common/Upgrade.ts
- [ ] Code/GameEngine/Source/Common/UserPreferences.cpp -> Common/UserPreferences.ts
- [ ] Code/GameEngine/Source/Common/Version.cpp -> Common/Version.ts
- [ ] Code/GameEngine/Source/Common/Xfer.cpp -> Common/Xfer.ts

## Network Systems
- [ ] Code/GameEngine/Source/GameNetwork/LANAPI.cpp -> GameNetwork/LANAPI.ts
- [ ] Code/GameEngine/Source/GameNetwork/NetworkInterface.cpp -> GameNetwork/NetworkInterface.ts
- [ ] Code/GameEngine/Source/GameNetwork/GameSpy/GameResultsThread.cpp -> GameNetwork/GameSpy/GameResultsThread.ts
- [ ] Code/GameEngine/Source/GameNetwork/GameSpy/PeerDefs.cpp -> GameNetwork/GameSpy/PeerDefs.ts
- [ ] Code/GameEngine/Source/GameNetwork/GameSpy/PersistentStorageThread.cpp -> GameNetwork/GameSpy/PersistentStorageThread.ts
- [ ] Code/GameEngine/Source/GameNetwork/WOLBrowser/WebBrowser.cpp -> GameNetwork/WOLBrowser/WebBrowser.ts

## Progress Tracking
- Total Files to Convert: ~2500
- Currently Converted: 2
- Completion: 0.08%

Note: This list shows the major systems and core files. Many additional files like utilities, helpers, and supporting classes will need to be converted as we progress through each system. The task list will be updated as we discover additional dependencies.

### Priority Order:
1. Core Engine & Common Interfaces
2. Game Logic Systems
3. Game Client & Rendering
4. Network Systems
5. Supporting Utilities & Tools