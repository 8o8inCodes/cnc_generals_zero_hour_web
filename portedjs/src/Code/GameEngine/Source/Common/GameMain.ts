import {CreateGameEngine} from "./GameEngine";

export function GameMain(options): void{
  const theGameEngine = CreateGameEngine();
  theGameEngine.init(options);

  theGameEngine.execute();
}