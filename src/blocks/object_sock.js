import Blockly from "blockly";
import {javascriptGenerator} from "blockly/javascript";

Blockly.common.defineBlocksWithJsonArray([
    {
        "type": "object_sock",
        "message0": "%1",
        "args0": [
            {
                "type": "field_label_serializable",
                "name": "NAME",
                "text": "Sock"
            }
        ],
        "output": "String",
        "colour": 230,
        "tooltip": "",
        "helpUrl": ""
    }
]);

javascriptGenerator['object_sock'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'blueStar';
    return [code, javascriptGenerator.ORDER_NONE];
};
