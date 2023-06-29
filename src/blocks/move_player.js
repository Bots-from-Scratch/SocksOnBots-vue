import Blockly from "blockly";
import {javascriptGenerator} from "blockly/javascript";

Blockly.common.defineBlocksWithJsonArray([
    {
        "type": "move_player",
        "message0": "Move %1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "VALUE",
                "options": [
                    [
                        "left",
                        "left"
                    ],
                    [
                        "right",
                        "right"
                    ],
                    [
                        "up",
                        "up"
                    ],
                    [
                        "down",
                        "down"
                    ],
                    [
                        "to object",
                        "toObject"
                    ]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 355,
        "tooltip": "",
        "helpUrl": ""
    }
]);

javascriptGenerator['move_player'] = function (block) {
    let blockValue = block.getFieldValue('VALUE');
    let code = "yield;";
    code += "directionPlayer1." + blockValue + ".isMoving = true;\nconsole.log('isMoving: "+ blockValue+"');";

    return code;
};
