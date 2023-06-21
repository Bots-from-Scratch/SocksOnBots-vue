import Blockly from "blockly";
import {javascriptGenerator} from "blockly/javascript";

Blockly.common.defineBlocksWithJsonArray([
    {
        "type": "object_collected",
        "message0": "Object collected",
        "output": "Boolean",
        "colour": 230,
        "tooltip": "",
        "helpUrl": ""
    }
])

javascriptGenerator['object_collected'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'objectCollected';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, javascriptGenerator.ORDER_NONE];
};
