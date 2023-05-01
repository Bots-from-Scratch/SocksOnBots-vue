<script setup>
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Blockly Vue Component.
 * @author dcoodien@gmail.com (Dylan Coodien)
 */

import { onMounted, ref, shallowRef } from "vue";
import Blockly from "blockly";

const props = defineProps(["options"]);
const blocklyToolbox = ref();
const blocklyDiv = ref();
const workspace = shallowRef();




const startBlocks = {

    "blocks": {
    "languageVersion": 0,
        "blocks": [
        {
            "type": "controls_whileUntil",
            "x": 0,
            "y": 0,
            "fields": {
                "MODE": "UNTIL"
            },
            "inputs": {
                "BOOL": {
                    "block": {
                        "type": "direction_blocked",
                        "fields": {
                            "NAME": "RIGHT_BLOCKED"
                        }
                    }
                },
                "DO": {
                    "block": {
                        "type": "move_player",
                        "fields": {
                            "VALUE": "DOWN"
                        }
                    }
                }
            }
        }
    ]
}

};

defineExpose({ workspace });

onMounted(() => {
  const options = props.options || {};
  if (!options.toolbox) {
    options.toolbox = blocklyToolbox.value;
  }
  workspace.value = Blockly.inject(blocklyDiv.value, options);
  Blockly.serialization.workspaces.load(startBlocks, workspace.value);
});
</script>

<template>
  <div class="">
    <div class="blocklyDiv h-full w-full text-left" ref="blocklyDiv"></div>
    <xml ref="blocklyToolbox">
      <slot></slot>
    </xml>
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
