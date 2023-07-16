import IdleState from "@/game/states/IdleState";
import MoveLeftState from "@/game/states/MoveLeftState";
import MoveRightState from "@/game/states/MoveRightState";
import MoveDownState from "@/game/states/MoveDownState";
import MoveUpState from "@/game/states/MoveUpState";
import MoveToObjectState from "@/game/states/MoveToObjectState";

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
      moveToObject: new MoveToObjectState(player)
    };
  }

  /**
   *
   * @param {string} name
   * @param {boolean} directionIsClear
   * @param {Phaser.Physics.Arcade.Sprite} object
   */
  setState(name,directionIsClear, object) {
    // if (this.currentState === this.states[name]) {
    //   return;
    // }

    this.currentState = this.states[name];
    name === "moveToObject" ? this.currentState.enter(directionIsClear, object) : this.currentState.enter();
  }
}
