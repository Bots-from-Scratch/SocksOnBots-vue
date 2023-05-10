import Blockly from "blockly";
import {javascriptGenerator} from "blockly/javascript";

Blockly.common.defineBlocksWithJsonArray([
  {
    "type": "move_player",
    "message0": "Move %1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "VALUE",
        "options": [
          [
            "left",
            "Left"
          ],
          [
            "right",
            "Right"
          ],
          [
            "up",
            "Up"
          ],
          [
            "down",
            "Down"
          ],
          [
            "to object",
            "toObject"
          ]
        ]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 355,
    "tooltip": "",
    "helpUrl": ""
  }
]);


javascriptGenerator['move_player'] = function (block, el) {
  let blockValue = block.getFieldValue('VALUE');
  let code;


  code = "moveDirection(" + blockValue + ") \n ";
console.log(blockValue)

  return code;
};

function initInterpreterMoveDirection(interpreter, scope) {
  // Ensure function name does not conflict with variable names.
  // uses to time outs, terminates the upward motion before termination moving right
  javascriptGenerator.addReservedWords('moveDirection');
  var wrapper = interpreter.createAsyncFunction(
      function (direction, callback) {
        console.log("moveRight function")
        console.log(direction);
        // setTimeout(function () {
        //     direction = "UP";
        //     callback();
        // }, 300);
      });
  interpreter.setProperty(scope, 'moveDirection', wrapper);
}
function initInterpreterGoLeft(interpreter, scope) {
  // Ensure function name does not conflict with variable names.
  // uses to time outs, terminates the upward motion before termination moving right
  javascriptGenerator.addReservedWords('moveLeft');
  var wrapper = interpreter.createAsyncFunction(
      function (callback) {
        console.log("moveLeft function")
        let direction = 'LEFT';
        console.log(direction);
        // setTimeout(function () {
        //     direction = "UP";
        //     callback();
        // }, 300);
      });
  interpreter.setProperty(scope, 'moveLeft', wrapper);
}

export {initInterpreterMoveDirection, initInterpreterGoLeft}
