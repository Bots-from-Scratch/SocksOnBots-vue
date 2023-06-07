import Blockly from "blockly";
import {javascriptGenerator} from "blockly/javascript";

Blockly.common.defineBlocksWithJsonArray([
    {
        "type": "bool_sighted",
        "message0": "Object sighted",
        "output": "Boolean",
        "colour": 230,
        "tooltip": "",
        "helpUrl": ""
    }
])

javascriptGenerator['bool_sighted'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'direction.toObject.isClear';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, javascriptGenerator.ORDER_NONE];
};
