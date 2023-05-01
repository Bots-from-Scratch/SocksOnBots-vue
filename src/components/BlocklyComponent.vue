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
  blocks: {
    blocks: [
      {
        type: "variables_set",
        x: 20,
        y: 20,
        inline: true,
        fields: {
          VAR: { id: "n" },
        },
        inputs: {
          VALUE: {
            block: {
              type: "math_number",
              fields: { NUM: 1 },
            },
          },
        },
        next: {
          block: {
            type: "controls_repeat_ext",
            inline: true,
            inputs: {
              TIMES: {
                block: {
                  type: "math_number",
                  fields: { NUM: 4 },
                },
              },
              DO: {
                block: {
                  type: "variables_set",
                  inline: true,
                  fields: {
                    VAR: { id: "n" },
                  },
                  inputs: {
                    VALUE: {
                      block: {
                        type: "math_arithmetic",
                        fields: { OP: "MULTIPLY" },
                        inputs: {
                          A: {
                            block: {
                              type: "variables_get",
                              fields: {
                                VAR: { id: "n" },
                              },
                            },
                          },
                          B: {
                            block: {
                              type: "math_number",
                              fields: { NUM: 2 },
                            },
                          },
                        },
                      },
                    },
                  },
                  next: {
                    block: {
                      type: "text_print",
                      inputs: {
                        TEXT: {
                          block: {
                            type: "variables_get",
                            fields: {
                              VAR: { id: "n" },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    ],
  },
  variables: [
    {
      name: "n",
      id: "n",
    },
  ],
};

defineExpose({ workspace });

onMounted(() => {
  const options = props.options || {};
  if (!options.toolbox) {
    options.toolbox = blocklyToolbox.value;
  }
  workspace.value = Blockly.inject(blocklyDiv.value, options);
  Blockly.serialization.workspaces.load(startBlocks, workspace);
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
