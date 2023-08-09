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
    var code = 'directionPlayer1.toObject.isClear';
    return [code, javascriptGenerator.ORDER_NONE];
};
