import Blockly from "blockly";
import {javascriptGenerator} from "blockly/javascript";

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
                    "right"
                ],
                [
                    "left is blocked",
                    "left"
                ],
                [
                    "up is blocked",
                    "up"
                ],
                [
                    "down is blocked",
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

javascriptGenerator['direction_blocked'] = function (block) {
    let blockValue = block.getFieldValue('NAME');
    let code = "!direction." + blockValue + ".isClear";

    return [code, javascriptGenerator.ORDER_ATOMIC];
};
