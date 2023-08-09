import Blockly from "blockly";
import {javascriptGenerator} from "blockly/javascript";

Blockly.common.defineBlocksWithJsonArray([
    {
        "type": "bool_connected",
        "message0": "Item verbunden",
        "output": "Boolean",
        "colour": "#502828",
        "tooltip": "",
        "helpUrl": ""
    }
])

javascriptGenerator['bool_connected'] = function(block) {
    var code = 'itemConnected';
    return [code, javascriptGenerator.ORDER_NONE];
};
