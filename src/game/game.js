import Phaser from 'phaser'
import BootScene from './scenes/BootScene'
import PlayScene from './scenes/PlayScene'
import GameScene_Level_1 from "@/game/scenes/GameScene_Level_1";
import GameScene_Level_2 from "@/game/scenes/GameScene_Level_2";
import GameScene_Level_3 from "@/game/scenes/GameScene_Level_3";
import GameScene_Level_4 from "@/game/scenes/GameScene_Level_4";
import {GameScene} from "@/components/Level4.vue"
import PreloadScene from "@/game/scenes/PreloadScene";
import CutSceneFirstSock from "@/game/scenes/CutSceneFirstSock";
import LobbyScene from './scenes/LobbyScene';

function launch(containerId) {
    return new Phaser.Game({
        type: Phaser.AUTO,
        parent: containerId,
        width: 960,
        height: 640,
        physics: {
            default: 'arcade',
            arcade: {
                // gravity: { y: 300 },
                debug: true
            }
        },
        pixelArt: true,
        // scene: [GameScene_Level_1, PreloadScene, GameScene_Level_4, GameScene_Level_3, GameScene_Level_2, CutSceneFirstSock ],
        // scene: [GameScene_Level_2, PreloadScene, GameScene_Level_4, GameScene_Level_3, GameScene_Level_1, CutSceneFirstSock ],
        scene: [LobbyScene, GameScene, PreloadScene, GameScene_Level_1, GameScene_Level_3, GameScene_Level_2, CutSceneFirstSock ],
        // scene: [CutSceneFirstSock, GameScene_Level_4, PreloadScene, GameScene_Level_1, GameScene_Level_3, GameScene_Level_2  ],
    })
}

export default launch
export { launch }
