import Blockly from "blockly";
import {JavaScript} from "blockly";
import {javascriptGenerator} from "blockly/javascript";
// import { javascriptGenerator } from "blockly/javascript";
//
// Blockly.Blocks["repeat_x_times"] = {
//   init: function () {
//     this.jsonInit({
//       type: "controls_repeat_ext",
//       message0: "%{BKY_CONTROLS_REPEAT_TITLE}",
//       args0: [{ type: "input_value", name: "TIMES", check: "Number" }],
//       message1: "%{BKY_CONTROLS_REPEAT_INPUT_DO} %1",
//       args1: [{ type: "input_statement", name: "DO" }],
//       previousStatement: null,
//       nextStatement: null,
//       style: "loop_blocks",
//       tooltip: "%{BKY_CONTROLS_REPEAT_TOOLTIP}",
//       helpUrl: "%{BKY_CONTROLS_REPEAT_HELPURL}",
//     });
//   },
// };
//
// javascript.javascriptGenerator["repeat_x_times"] = function (block, generator) {
//   let block_value = generator.valueToCode(
//     block,
//     "TIMES",
//     javascript.Order.atomic
//   );
//   console.log("=>(repeat_x_times.js:32) block_value", block_value);
//   let statements_do = javascriptGenerator.statementToCode(block, "DO");
//
//   let code = "yield;\n";
//   code += `for (let i=0; i<${block_value + 1}; i++) {${statements_do}};`;
//   console.log("=>(repeat_x_times.js:38) code", code);
//   return code;
// };
//
// // javascript.javascriptGenerator.forBlock['repeat_x_times'] = function(block, generator) {
// //   var value_times = generator.valueToCode(block, 'TIMES', javascript.Order.ATOMIC);
// //   var statements_do = generator.statementToCode(block, 'DO');
// //   // TODO: Assemble javascript into code variable.
// //   let code = "yield;\n";
// //   code += `for (let i=0; i<${value_times + 1}; i++) {${statements_do}};`;
// //   console.log("=>(repeat_x_times.js:38) code", code);
// //   return code;
// // };

Blockly.Blocks['repeat_x_times'] = {
  init: function() {
    this.jsonInit({
      "message0": "Wiederhole %1 Mal",
      "args0": [
        {
          "type": "input_value",
          "name": "TIMES",
          "check": "Number"
        }
      ],
      "message1": "%{BKY_CONTROLS_REPEAT_INPUT_DO} %1",
      "args1": [
        {
          "type": "input_statement",
          "name": "DO"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "style": "loop_blocks",
      "tooltip": "%{BKY_CONTROLS_REPEAT_TOOLTIP}",
      "helpUrl": "%{BKY_CONTROLS_REPEAT_HELPURL}"
    });
  }
};

javascriptGenerator['repeat_x_times'] = function(block) {
  var times = javascriptGenerator.valueToCode(block, 'TIMES', javascriptGenerator.ORDER_ATOMIC);
  var statements_do = javascriptGenerator.statementToCode(block, 'DO');

  var code = 'yield;\n';
  // var code = '';
  code += 'for (let i = 0; i < ' + times + '; i++) {\n';
  code += statements_do + '\n';
  code += '}\n';

  return code;
};

