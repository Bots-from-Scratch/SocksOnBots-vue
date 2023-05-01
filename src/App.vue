<script setup>


import { ref } from "vue";
import BlocklyComponent from "./components/BlocklyComponent.vue";
import "./blocks/stocks";
import Blockly from "blockly";

import { javascriptGenerator } from "blockly/javascript";
import { toolboxJson } from "@/toolbox_phaser";
import Game from "@/components/Game.vue";
import Level4 from "@/components/Level4.vue";

const foo = ref();
const code = ref();
const lvl4 = ref();
let value = ref('');
const options = {
  media: "media/",
  grid: {
    spacing: 25,
    length: 3,
    colour: "#ccc",
    snap: true,
  },
  toolbox: toolboxJson,
};

function getIsClearRef()  {
    console.log("get func: " + lvl4.value?.rightIsClearRef);
    return lvl4.value?.rightIsClearRef
}
function showCode () {
    code.value = javascriptGenerator.workspaceToCode(foo.value.workspace);
    console.log(Blockly.serialization.workspaces.save(foo.value.workspace));

    console.log(value.value);
    eval(code.value);
    console.log(lvl4.value.rightIsClearRef)
    console.log(this.rightIsClear)
    console.log(value.value);
};
</script>

<template>
  <div id="app" class="flex flex-row justify-center shrink-0 flex-wrap m-8 w-screen">
    <div><img alt="Vue logo" src="./assets/logo.png" class="w-12 h-12" />
      <div id="code" class="w-12 h-12 bg-amber-600 rounded text-center">
          <button v-on:click="showCode()" class="">Play</button>
      </div>
    </div>
    <BlocklyComponent class="w-96 h-96 "
      id="blockly"
      :options="options"
      ref="foo"
    ></BlocklyComponent>
      <pre v-html="code"></pre>


<!--    <Game />-->
      <p>{{value}}</p>
      <p>{{ getIsClearRef() }}</p>

      <Level4 :direction="value"
      ref="lvl4"/>
  </div>

</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

</style>
