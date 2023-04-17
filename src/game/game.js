import Phaser from 'phaser'
import BootScene from './scenes/BootScene'
import PlayScene from './scenes/PlayScene'
import GameScene_Level_1 from "@/game/scenes/GameScene_Level_1";
import GameScene_Level_2 from "@/game/scenes/GameScene_Level_2";
import GameScene_Level_3 from "@/game/scenes/GameScene_Level_3";
import GameScene_Level_4 from "@/game/scenes/GameScene_Level_4";
import PreloadScene from "@/game/scenes/PreloadScene";
import CutSceneFirstSock from "@/game/scenes/CutSceneFirstSock";

function launch(containerId) {
    return new Phaser.Game({
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: containerId,
        physics: {
            default: 'arcade',
            arcade: {
                // gravity: { y: 300 },
                debug: false
            }
        },
        // scene: [BootScene, PlayScene],
        scene: [GameScene_Level_4, PreloadScene, GameScene_Level_1, GameScene_Level_3, GameScene_Level_2, CutSceneFirstSock ],

    })
}

export default launch
export { launch }
