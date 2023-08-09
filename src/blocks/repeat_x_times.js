import Blockly from "blockly";
import {javascriptGenerator} from "blockly/javascript";

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

  var code = '';
  code += 'for (let i = 0; i < ' + times + '; i++) {\n';
  code += statements_do + '\n';
  code += '}\n';

  return code;
};

