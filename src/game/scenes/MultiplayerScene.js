import { GameScene } from "@/game/scenes/GameScene";
import { toRaw } from "vue";
import { socket, state } from "@/socket";
import Phaser from "phaser";

let selectedGameLevel;
let player2XY;
let playerPosition = { x: 0, y: 0 };

export class MultiplayerScene extends GameScene {
  constructor(selectedLevel, levels, updateSelectedLevel) {
    super({ key: "MultiplayerScene" });
    this.selectedGameLevel = selectedLevel;
    this.levels = levels;
    console.log("=>(MultiplayerScene.js:15) this.levels", this.levels);

    this.updateLevels = updateSelectedLevel;
  }

  create() {
    super.create();

    this.prepareLevel(state.room.rndLvl?.number);
    state.playGame = false;


    this.player2 = this.physics.add
      .sprite(0, 0, "bot")
      .setScale(1.4)
      .setAlpha(0.1)
      .setTint(0x006db2);

    this.add.particles(0, 0, "bomb", {
      angle: { min: 0, max: 360 },
      speed: 50,
      tint: "#ffffff",
      follow: this.player2,
      scale: 5,
      alpha: 0.02,
      blendMode: "DARKEN",
    });

    this.player2.setCircle(20, 12, 28);
    this.physics.add.collider(this.player2, this.rectangles);
  }

  update() {
    super.update();
    console.log(
      "=>(MultiplayerScene.js:45) state.levelFinished",
      state.levelFinished
    );
    if (
      (state.levelFinished.winner ||
        state.levelFinished.loser ||
        state.levelFinished.playerDisconnected) &&
      !this.isPausingCodeExecution
    ) {
      state.room.rndLvl = null;

      this.isPausingCodeExecution = true;
      this.cameras.main.fadeOut(800, 0, 0, 0);
      this.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        () => {
          if (state.levelFinished.playerDisconnected) {
            this.scene.start("LobbyMenuScene");
            state.levelFinished.playerDisconnected = false;
          } else {
            this.scene.start("MultiplayerEndScene");
          }
        }
      );
    }

    player2XY = toRaw(state.playerPosition);
    this.player2.setX(player2XY.x);
    this.player2.setY(player2XY.y);
    console.log("=>(MultiplayerScene.js:45) this.player", this.player);
    this.sendPlayerPositionToSocketServer(this.player);
  }

  checkForWin(sprite, object) {
    socket.emit("levelFinished", { roomId: state.roomID });
    console.log("=>(Game.vue:916) level finished");
  }
  sendPlayerPositionToSocketServer(player) {
    playerPosition.x = player.x;
    playerPosition.y = player.y;
    socket.emit("playerXY", {
      roomId: state.roomID,
      playerPosition: playerPosition,
    });
  }
}
