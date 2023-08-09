import Blockly from "blockly";
import {javascriptGenerator} from "blockly/javascript";

Blockly.common.defineBlocksWithJsonArray([
    {
        "type": "break",
        "message0": "break",
        "previousStatement": null,
        "colour": "#502828",
        "tooltip": "",
        "helpUrl": ""
    }
])

javascriptGenerator['break'] = function(block) {
    return "break;"
};
