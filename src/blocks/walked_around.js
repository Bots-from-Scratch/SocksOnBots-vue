import Blockly from "blockly";
import {javascriptGenerator} from "blockly/javascript";

Blockly.common.defineBlocksWithJsonArray([
    {
        "type": "walked_around",
        "message0": "Walked Around",
        "output": "Boolean",
        "colour": "#502828",
        "tooltip": "If player walked around obstacle, this returns true",
        "helpUrl": ""
    }
]);


javascriptGenerator['walked_around'] = function(block) {
    var code = 'walkedBy';
    return [code, javascriptGenerator.ORDER_NONE];
};
