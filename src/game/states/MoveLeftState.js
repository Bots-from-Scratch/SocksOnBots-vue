import {maxSpeed} from "@/game/states/PlayerController";

export default class MoveLeftState {
  /** @type {Phaser.Physics.Arcade.Sprite} */
  player;

  /**
   * @param {Phaser.Physics.Arcade.Sprite} player
   */
  constructor(player) {
    this.player = player;
  }

  enter() {
    if (this.player.body.velocity.x >= 0) {
      this.player.play("moveleft", true);

      this.player.setVelocity(-maxSpeed, 0);
      setTimeout(() => {
        this.player.setVelocityX(0);
        console.log("400left","Bewegung abgeschlossen!");
      }, 400);
    }
  }
}
