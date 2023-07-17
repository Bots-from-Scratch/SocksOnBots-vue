import Blockly from "blockly";
import {javascriptGenerator} from "blockly/javascript";

Blockly.common.defineBlocksWithJsonArray([
    {
        "type": "object_sock",
        "message0": "%1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "NAME",
                "options": [
                    [
                        "Sock",
                        "itemSock"
                    ],
                    [
                        "Key",
                        "itemKey"
                    ],
                ]
            }
        ],
        "output": "String",
        "colour": "#502828",
        "tooltip": "",
        "helpUrl": ""
    }
]);

javascriptGenerator['object_sock'] = function(block) {
    let code = block.getFieldValue('NAME');

    return [code, javascriptGenerator.ORDER_NONE];
};
