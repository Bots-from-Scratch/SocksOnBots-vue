import Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";

Blockly.common.defineBlocksWithJsonArray([
  {
    type: "whileUntil",
    message0: "%1 %2",
    args0: [
      {
        type: "field_dropdown",
        name: "MODE",
        options: [
          ["%{BKY_CONTROLS_WHILEUNTIL_OPERATOR_WHILE}", "WHILE"],
          ["%{BKY_CONTROLS_WHILEUNTIL_OPERATOR_UNTIL}", "UNTIL"],
        ],
      },
      { type: "input_value", name: "BOOL", check: "Boolean" },
    ],
    message1: "%{BKY_CONTROLS_REPEAT_INPUT_DO} %1",
    args1: [{ type: "input_statement", name: "DO" }],
    previousStatement: null,
    nextStatement: null,
    style: "loop_blocks",
    helpUrl: "%{BKY_CONTROLS_WHILEUNTIL_HELPURL}",
    extensions: ["controls_whileUntil_tooltip"],
  },
]);

javascriptGenerator["whileUntil"] = function (block) {
  let dropdown_mode = block.getFieldValue("MODE");
  let value_bool = javascriptGenerator.valueToCode(
    block,
    "BOOL",
    javascriptGenerator.ORDER_NONE
  );

  let statements_do = javascriptGenerator.statementToCode(block, "DO");
  if (value_bool === "walkedBy" || value_bool === "objectCollected") {
    statements_do = `yield;\nif (${value_bool}) {break};\n${statements_do}\n`;
  }

  // var code = "yield;\n";
  var code = ""; //don't use this yield!
  if (dropdown_mode === "WHILE") {
    code +=
      "console.log('while Block')\n;while (" +
      value_bool +
      ") {\n" +
      statements_do +
      "}\n";
  } else if (dropdown_mode === "UNTIL") {
    code +=
      "console.log('until Block')\n;\nwhile (!(" +
      value_bool +
      ")) {\n" +
      statements_do +
      "}\n";
  }
  console.log("=>(whileUntil.js:70) code", code);
  return code;
};
