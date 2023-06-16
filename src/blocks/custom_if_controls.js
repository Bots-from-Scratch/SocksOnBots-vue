import Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";

Blockly.common.defineBlocksWithJsonArray([
  {
    type: "custom_if_controls",
    message0: "if %1 then %2",
    args0: [
      { type: "input_value", name: "IF0", check: "Boolean" },
      { type: "input_statement", name: "DO0" },
    ],
    previousStatement: null,
    nextStatement: null,
    style: "logic_blocks",
    helpUrl: "%{BKY_CONTROLS_IF_HELPURL}",
    mutator: "controls_if_mutator",
    extensions: ["controls_if_tooltip"],
  },
  {
    type: "controls_if_elseif",
    message0: "else if %1 then %2",
    args0: [
      { type: "input_value", name: "IF1", check: "Boolean" },
      { type: "input_statement", name: "DO1" },
    ],
    previousStatement: null,
    nextStatement: null,
    style: "logic_blocks",
    tooltip: "%{BKY_CONTROLS_IF_ELSEIF_TOOLTIP}",
    helpUrl: "%{BKY_CONTROLS_IF_HELPURL}",
  },
  {
    type: "controls_if_else",
    message0: "else %1",
    args0: [{ type: "input_statement", name: "ELSE" }],
    previousStatement: null,
    style: "logic_blocks",
    tooltip: "%{BKY_CONTROLS_IF_ELSE_TOOLTIP}",
    helpUrl: "%{BKY_CONTROLS_IF_HELPURL}",
  },
]);

javascriptGenerator["custom_if_controls"] = function (block) {
  var code = "yield;\n";
  // Hole die Bedingungen aus dem Block
  var conditionIfCode = javascriptGenerator.valueToCode(
    block,
    "IF0",
    javascriptGenerator.ORDER_NONE
  );
  var conditionElseIfCode = javascriptGenerator.valueToCode(
    block,
    "IF1",
    javascriptGenerator.ORDER_NONE
  );
  // Hole die Anweisungen aus den Blockarmen
  var ifThenCode = javascriptGenerator.statementToCode(block, "DO0");
  var elseIfThenCode = javascriptGenerator.statementToCode(block, "DO1");
  var elseCode = javascriptGenerator.statementToCode(block, "ELSE");

  // Generiere den JavaScript-Code für den 'controls_if'-Block
  code += "if (" + conditionIfCode + ") {\n";
  code += ifThenCode + "}\n";
  if (conditionElseIfCode) {
    code += "else if (" + conditionElseIfCode + ") {\n";
    code += elseIfThenCode + "}\n";
  }
  if (elseCode) {
    code += "else {\n" + elseCode + "}\n";
  }

  return code;
};
