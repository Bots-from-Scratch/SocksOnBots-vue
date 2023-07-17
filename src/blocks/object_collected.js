import Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";

Blockly.common.defineBlocksWithJsonArray([
  {
    type: "object_collected",
    message0: "Object collected",
    output: "Boolean",
    colour: "#502828",
    tooltip: "",
    helpUrl: "",
  },
]);

javascriptGenerator["object_collected"] = function (block) {
  var code = "objectCollected";
  return [code, javascriptGenerator.ORDER_NONE];
};
