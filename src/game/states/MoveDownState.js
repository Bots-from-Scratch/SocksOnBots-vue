import {maxSpeed} from "@/game/states/PlayerController";

export default class MoveDownState {
  /** @type {Phaser.Physics.Arcade.Sprite} */
  player;

  /**
   * @param {Phaser.Physics.Arcade.Sprite} player
   */
  constructor(player) {
    this.player = player;
  }

  enter() {
    if (this.player.body.velocity.y <= 0) {
      this.player.play("movedown", true);

      this.player.setVelocity(0, maxSpeed);
      setTimeout(() => {
        this.player.setVelocityY(0);
      }, 400);
    }
  }
}
