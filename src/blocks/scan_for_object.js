import Blockly from "blockly";
import {javascriptGenerator} from "blockly/javascript";

Blockly.common.defineBlocksWithJsonArray([
    {
        "type": "scan_for_object",
        "message0": "look for %1",
        "args0": [

            {
                "type": "input_value",
                "name": "look for",
                "check": "String",
                "align": "RIGHT"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 355,
        "tooltip": "",
        "helpUrl": ""
    }
]);

javascriptGenerator['scan_for_object'] = function (block) {
    // console.log(block);
    var value_look_for = javascriptGenerator.valueToCode(block, 'look for', javascriptGenerator.ORDER_ATOMIC);
    var code = "yield;\n"
    code +=
        'objectToScanFor = ' + value_look_for + ';\n    ';
    return code;
};
