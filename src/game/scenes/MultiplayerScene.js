import { GameScene } from "@/game/scenes/GameScene";
import { toRaw } from "vue";
import { socket, state } from "@/socket";

let selectedGameLevel;
let player2XY;
let playerPosition = { x: 0, y: 0 };


export class MultiplayerScene extends GameScene {
  constructor(selectedLevel, levels, updateSelectedLevel) {
    super({ key: "MultiplayerScene" });
    this.selectedGameLevel = selectedLevel;
    this.levels = levels;
    this.updateLevels = updateSelectedLevel;
  }

  create() {
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
    player2XY = toRaw(state.playerPosition);
    this.player2.setX(player2XY.x);
    this.player2.setY(player2XY.y);
    this.sendPlayerPositionToSocketServer(GameScene.player);
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
