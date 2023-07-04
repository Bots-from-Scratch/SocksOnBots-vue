import Blockly from "blockly";
import {javascriptGenerator} from "blockly/javascript";

Blockly.common.defineBlocksWithJsonArray([
    {
        "type": "break",
        "message0": "break",
        "previousStatement": null,
        "colour": 355,
        "tooltip": "",
        "helpUrl": ""
    }
])

javascriptGenerator['break'] = function(block) {
    // let code = "yield;";
    // code += "stopPlayer();"
    // return code;
    return "break;"
};
