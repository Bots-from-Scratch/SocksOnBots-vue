import {maxSpeed} from "@/game/states/PlayerController";

export default class MoveRightState {
  /** @type {Phaser.Physics.Arcade.Sprite} */
  player;

  /**
   * @param {Phaser.Physics.Arcade.Sprite} player
   */
  constructor(player) {
    this.player = player;
  }

  enter() {
    if (this.player.body.velocity.x <= 0) {
      this.player.play("moveright", true);

      this.player.setVelocity(maxSpeed, 0);
      setTimeout(() => {
        // Delay of 400 by a velocity of 160 means a movement of 64 pixels (our tile size)
        this.player.setVelocityX(0);
        console.log("1553Bewegung abgeschlossen!");
      }, 400);
    }
  }
}
