import IdleState from "@/game/states/IdleState";
import MoveLeftState from "@/game/states/MoveLeftState";
import MoveRightState from "@/game/states/MoveRightState";
import MoveDownState from "@/game/states/MoveDownState";
import MoveUpState from "@/game/states/MoveUpState";

export const maxSpeed = 160
export default class PlayerController {
    /** @type {{ [key: string]: { enter: () => void } }} */
   states;

  /** @type {{ enter: () => void }} */
   currentState;

  /**
   * @param {Phaser.Physics.Arcade.Sprite} player
   */
  constructor(player) {
    this.states = {
      idle: new IdleState(player),
      moveLeft: new MoveLeftState(player),
      moveRight: new MoveRightState(player),
      moveDown: new MoveDownState(player),
      moveUp: new MoveUpState(player),
    };
  }

  /**
   *
   * @param {string} name
   */
  setState(name) {
    // if (this.currentState === this.states[name]) {
    //   return;
    // }

    this.currentState = this.states[name];
    this.currentState.enter();
  }
}
