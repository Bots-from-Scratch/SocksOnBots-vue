import Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";

Blockly.common.defineBlocksWithJsonArray([
  {
    type: "move_player",
    message0: "Move %1",
    args0: [
      {
        type: "field_dropdown",
        name: "VALUE",
        options: [
          ["left", "LEFT"],
          ["right", "RIGHT"],
          ["up", "UP"],
          ["down", "DOWN"],
          ["to object", "TO_OBJECT"],
        ],
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 355,
    tooltip: "",
    helpUrl: "",
  },
]);

javascriptGenerator["move_player"] = function (block, el) {
  let blockValue = block.getFieldValue("VALUE");
  let code;

  if (blockValue == "TOSTAR") {
    code = " this.physics.accelerateToObject(player,blueStar, 4000 ); ";
  } else {
    code =
      'if("' +
      blockValue +
      '" != value.value) { value.value = "' +
      blockValue +
      '"; }\nif(value.value == \'STOP\') {console.log("Stop")};';
  }
  // code = "console.log('move_player');";
  return code;
};
