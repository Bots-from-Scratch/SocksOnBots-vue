import Blockly from "blockly";
import {javascriptGenerator} from "blockly/javascript";

Blockly.common.defineBlocksWithJsonArray([
    {
        type: "whileUntil",
        message0: "%1 %2",
        args0: [{
            type: "field_dropdown",
            name: "MODE",
            options: [["%{BKY_CONTROLS_WHILEUNTIL_OPERATOR_WHILE}", "WHILE"], ["%{BKY_CONTROLS_WHILEUNTIL_OPERATOR_UNTIL}",
                "UNTIL"]]
        }, {type: "input_value", name: "BOOL", check: "Boolean"}],
        message1: "%{BKY_CONTROLS_REPEAT_INPUT_DO} %1",
        args1: [{type: "input_statement", name: "DO"}],
        previousStatement: null,
        nextStatement: null,
        style: "loop_blocks",
        helpUrl: "%{BKY_CONTROLS_WHILEUNTIL_HELPURL}",
        extensions: ["controls_whileUntil_tooltip"]
    }
])


javascriptGenerator['whileUntil'] = function (block) {
    var dropdown_mode = block.getFieldValue('MODE');
    var value_bool = javascriptGenerator.valueToCode(block, 'BOOL', javascriptGenerator.ORDER_NONE);
    var statements_do = javascriptGenerator.statementToCode(block, 'DO');

    var code = '';
    if (dropdown_mode === 'WHILE') {
        code = 'yield;\nwhile (' + value_bool + ') {\n' + statements_do + '}\n';
    } else if (dropdown_mode === 'UNTIL') {
        code = 'yield;\nwhile (!(' + value_bool + ')) {\n' + statements_do + '}\n';
    }

    return code;
};
