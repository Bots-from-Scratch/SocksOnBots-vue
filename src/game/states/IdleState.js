export default class IdleState {
  /** @type {Phaser.Physics.Arcade.Sprite} */
  player;

  /**
   * @param {Phaser.Physics.Arcade.Sprite} player
   */
  constructor(player) {
    this.player = player;
  }

  enter() {
    this.player.playAfterRepeat({ key: "playerIdle", repeat: -1, repeatDelay: 2000 });

    // const speed = 160
    this.player.setVelocity(0, 0);
  }
}
