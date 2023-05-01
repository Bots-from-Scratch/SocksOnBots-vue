import Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";


Blockly.common.defineBlocksWithJsonArray([{
    "type": "direction_blocked",
    "message0": "%1",
    "args0": [
        {
            "type": "field_dropdown",
            "name": "NAME",
            "options": [
                [
                    "right is blocked",
                    "RIGHT_BLOCKED"
                ],
                [
                    "left is blocked",
                    "LEFT_BLOCKED"
                ],
                [
                    "up is blocked",
                    "UP_BLOCKED"
                ],
                [
                    "down is blocked",
                    "DOWN_BLOCKED"
                ]
            ]
        }
    ],
    "output": "Boolean",
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
}])

javascriptGenerator['direction_blocked'] = function(block) {
    var dropdown_name = block.getFieldValue('NAME');
    var code = '';
    // TODO: Assemble JavaScript into code variable.
    if (dropdown_name == 'RIGHT_BLOCKED') {
        code += '!this.rightIsClear'
    } else if (dropdown_name == 'LEFT_BLOCKED') {
        code += '!this.leftIsClear'
    } else if (dropdown_name == 'UP_BLOCKED') {
        code += '!this.upIsClear'
    } else {
        code += '!this.downIsClear'
    }

    // TODO: Change ORDER_NONE to the correct strength.
    return [code, javascriptGenerator.ORDER_NONE];
};

