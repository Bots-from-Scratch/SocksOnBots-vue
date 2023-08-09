import Phaser from "phaser";
import BootScene from "./scenes/BootScene";
import PlayScene from "./scenes/PlayScene";
import GameScene_Level_1 from "@/game/scenes/GameScene_Level_1";
import GameScene_Level_2 from "@/game/scenes/GameScene_Level_2";
import GameScene_Level_3 from "@/game/scenes/GameScene_Level_3";
import GameScene_Level_4 from "@/game/scenes/GameScene_Level_4";
import { GameScene } from "@/components/Level4.vue";
import PreloadScene from "@/game/scenes/PreloadScene";
import CutSceneFirstSock from "@/game/scenes/CutSceneFirstSock";
import MenuScene from "./scenes/MenuScene";
import LobbyMenuScene from "./scenes/LobbyMenuScene";

function launch(containerId) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: containerId,
    width: 960,
    height: 640,
    physics: {
      default: "arcade",
      arcade: {
        debug: true,
      },
    },
    pixelArt: true,
    scene: [
      MenuScene,
      LobbyMenuScene,
      GameScene,
      PreloadScene,
      GameScene_Level_1,
      GameScene_Level_3,
      GameScene_Level_2,
      CutSceneFirstSock,
    ],
  });
}

export default launch;
export { launch };
