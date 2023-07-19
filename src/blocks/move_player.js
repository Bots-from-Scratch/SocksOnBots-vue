import Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";

Blockly.common.defineBlocksWithJsonArray([
  {
    type: "move_player",
    message0: "Laufe %1",
    args0: [
      {
        type: "field_dropdown",
        name: "VALUE",
        options: [
          ["nach links", "moveLeft"],
          ["nach rechts", "moveRight"],
          ["nach oben", "moveUp"],
          ["nach unten", "moveDown"],
          ["zum Item", "moveToObject"],
        ],
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: "#502828",
    tooltip: "",
    helpUrl: "",
  },
]);

javascriptGenerator["move_player"] = function (block) {
  let blockValue = block.getFieldValue("VALUE");
  let code = "yield;\n";
  if (blockValue === "moveToObject") {
    code += "playerController.setState('" + blockValue + "', directionPlayer1.toObject.isClear, objectToScanFor);";
  } else {
    code += "playerController.setState('" + blockValue + "');";
  }
  console.log("=>(move_player.js:50) code", code);
  return code;
};

