import { maxSpeed } from "@/game/states/PlayerController";

export default class MoveToObjectState {
  /** @type {Phaser.Physics.Arcade.Sprite} */
  player;

  /**
   * @param {Phaser.Physics.Arcade.Sprite} player
   */
  constructor(player) {
    this.player = player;
  }

  enter(directionIsClear, objectToScanFor) {
    if (directionIsClear) {
      let velocity = this.getVelocityValuesForPlayerToObject(
        this.player,
        objectToScanFor
      );
      this.player.setVelocity(velocity.velocityX, velocity.velocityY);
      console.log("=>(MoveToObjectState.js:21) velocity.velocityX, velocity.velocityY", velocity.velocityX, velocity.velocityY);


      setTimeout(() => {
        this.player.setVelocityY(0);
        console.log("Bewegung abgeschlossen!");
      }, 400);
    }
  }
  getVelocityValuesForPlayerToObject(player, object) {
    let directionX = object.x - player.x;
    let directionY = object.y - player.y;
    let length = Math.sqrt(directionX * directionX + directionY * directionY);
    return {
      velocityX: Math.round((directionX / length) * maxSpeed),
      velocityY: Math.round((directionY / length) * maxSpeed)
    };
  }
}
