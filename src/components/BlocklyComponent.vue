<script setup>


import { onMounted, ref, shallowRef } from "vue";
import Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import "@/blocks/move_player"
import {initInterpreterGoRight} from "@/blocks/move_player";
// import "@/acorn_interpreter"


const props = defineProps(["options"]);
const blocklyToolbox = ref();
const blocklyDiv = ref();
const workspace = shallowRef();

const acornInterpreterScript = document.createElement('script');
acornInterpreterScript.src = "./acorn_interpreter";
document.head.appendChild(acornInterpreterScript);

const startBlocks = {
  blocks: {
    languageVersion: 0,
    blocks: [
      {
        type: "move_player",
        x: 38,
        y: 62,
        fields: {
          VALUE: "RIGHT",
        },
        next: {
          block: {
            type: "move_player",
            fields: {
              VALUE: "DOWN",
            },
          },
        },
      },
    ],
  },
};

defineExpose({ workspace });

onMounted(() => {

  const options = props.options || {};
  if (!options.toolbox) {
    options.toolbox = blocklyToolbox.value;
  }
  workspace.value = Blockly.inject(blocklyDiv.value, options);
  Blockly.serialization.workspaces.load(startBlocks, workspace.value);
  console.log(workspace.value);
  generateCodeAndLoadIntoInterpreter();
});

// var outputArea = document.getElementById("output");
// var runButton = document.getElementById("runButton");
var myInterpreter = null;
var runner;

function initApi(interpreter, scope) {
  // Add an API function for the alert() block, generated for "text_print" blocks.
  var wrapper = function (text) {
    text = text ? text.toString() : "";
    // outputArea.value = outputArea.value + "\n" + text;
  };
  interpreter.setProperty(
    scope,
    "alert",
    interpreter.createNativeFunction(wrapper)
  );

  // Add an API function for the prompt() block.
  var wrapper = function (text) {
    text = text ? text.toString() : "";
    return interpreter.createPrimitive(1);
  };
  interpreter.setProperty(
    scope,
    "prompt",
    interpreter.createNativeFunction(wrapper)
  );

  // Add an API function for the jump() block.
  var wrapper = function (text) {
    text = text ? text.toString() : "";
    //return interpreter.createPrimitive(prompt(text));
  };

  interpreter.setProperty(
    scope,
    "jump",
    interpreter.createNativeFunction(wrapper)
  );

  // Add all the custom block api calls here
    initInterpreterGoRight(interpreter, scope);

  // Add an API function for highlighting blocks.
  var wrapper = function (id) {
    id = id ? id.toString() : "";
    return interpreter.createPrimitive(highlightBlock(id));
  };
  interpreter.setProperty(
    scope,
    "highlightBlock",
    interpreter.createNativeFunction(wrapper)
  );

  var wrapper = function (id) {
    id = id ? id.toString() : "";
    return goRightX(id);
    //return interpreter.createPrimitive(highlightBlock(id));
  };
  interpreter.setProperty(
    scope,
    "bb",
    interpreter.createNativeFunction(wrapper)
  );
}

var highlightPause = false;
var latestCode = "";

function highlightBlock(id) {
  workspace.value.highlightBlock(id);
  highlightPause = true;
}

function resetStepUi(clearOutput) {
  workspace.value.highlightBlock(null);
  highlightPause = false;
  // runButton.disabled = "";

  if (clearOutput) {
    // outputArea.value = "Program output:\n=================";
  }
}

function generateCodeAndLoadIntoInterpreter() {
  // Generate JavaScript code and parse it.
  // Blockly.JavaScript.STATEMENT_PREFIX = "highlightBlock(%1);\n";
  // Blockly.JavaScript.addReservedWords("highlightBlock");
  latestCode = javascriptGenerator.workspaceToCode(workspace.value);
console.log(latestCode)
  resetStepUi(true);
}

function resetInterpreter() {
  myInterpreter = null;
  if (runner) {
    clearTimeout(runner);
    runner = null;
  }
}

function speak() {
  displayText.setText("Score: ");
}

function runCode() {
  if (!myInterpreter) {
    // First statement of this code.
    // Clear the program output.
    resetStepUi(true);
    // runButton.disabled = "disabled";

    // And then show generated code in an alert.
    // In a timeout to allow the outputArea.value to reset first.

      // Begin execution
      highlightPause = false;
      console.log(latestCode)
      myInterpreter = new Interpreter(latestCode, initApi);
      runner = function () {
        if (myInterpreter) {
          var hasMore = myInterpreter.run();
          if (hasMore) {
            // Execution is currently blocked by some async call.
            // Try again later.
            setTimeout(runner, 10);
          } else {
            // Program is complete.
            // outputArea.value += "\n\n<< Program complete >>";
            resetInterpreter();
            resetStepUi(false);
          }
        }
      };
      runner();

    return;
  }
}

// // Load the interpreter now, and upon future changes.
// workspace.value.addChangeListener(function (event) {
//     if (!(event instanceof Blockly.Events.Ui)) {
//         // Something changed. Parser needs to be reloaded.
//         resetInterpreter();
//         generateCodeAndLoadIntoInterpreter();
//     }
// });
</script>

<template>
  <div class="">
    <div class="blocklyDiv h-full w-full text-left" ref="blocklyDiv"></div>
    <xml ref="blocklyToolbox">
      <slot></slot>
    </xml>
      <div id="code" class="w-12 h-12 bg-amber-600 rounded text-center">
          <button v-on:click="runCode()" class="">Play</button>
      </div>
    <div id="output"></div>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*.blocklyDiv {*/
/*  height: 100%;*/
/*  width: 100%;*/
/*  text-align: left;*/
/*}*/
</style>
