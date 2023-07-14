export default class IdleState
{
    /** @type {Phaser.Physics.Arcade.Sprite} */
    player

    /**
     * @param {Phaser.Physics.Arcade.Sprite} player
     */
    constructor(player)
    {
        this.player = player
    }

    enter()
    {
        this.player.play('idle')

        // const speed = 160
        this.player.setVelocity(0, 0)
    }
}
