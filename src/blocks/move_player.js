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
          ["left", "Left"],
          ["right", "Right"],
          ["up", "Up"],
          ["down", "Down"],
          ["to object", "ToObject"],
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

javascriptGenerator["move_player"] = function (block) {
  let blockValue = block.getFieldValue("VALUE");
  let code = "yield;\n";
  code += "_this.movePlayer" + blockValue + "();";
  console.log("=>(move_player.js:50) code", code);
  return code;
};
