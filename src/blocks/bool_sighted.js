import Blockly from "blockly";
import {javascriptGenerator} from "blockly/javascript";

Blockly.common.defineBlocksWithJsonArray([
    {
        "type": "bool_sighted",
        "message0": "Item in Sicht",
        "output": "Boolean",
        "colour": "#502828",
        "tooltip": "",
        "helpUrl": ""
    }
])

javascriptGenerator['bool_sighted'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'directionPlayer1.toObject.isClear';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, javascriptGenerator.ORDER_NONE];
};
