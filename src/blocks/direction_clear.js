import Blockly from "blockly";
import {javascriptGenerator} from "blockly/javascript";


Blockly.common.defineBlocksWithJsonArray([{
  "type": "direction_clear",
  "message0": "%1",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "NAME",
      "options": [
        [
          "right is clear",
          "right"
        ],
        [
          "left is clear",
          "left"
        ],
        [
          "up is clear",
          "up"
        ],
        [
          "down is clear",
          "down"
        ]
      ]
    }
  ],
  "output": "Boolean",
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}])

javascriptGenerator['direction_clear'] = function (block) {
  let blockValue = block.getFieldValue('NAME');
  let code = "direction." + blockValue + ".isClear";

  return [code, javascriptGenerator.ORDER_ATOMIC];
};
