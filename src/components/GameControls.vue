<script setup>
import { onMounted, ref, watch } from "vue";
import RangeSlider from "@/components/RangeSlider.vue";
import { useLocalStorage } from "@vueuse/core";
import { state } from "@/socket";

const store = useLocalStorage(
  "volume",
  JSON.stringify({
    music: 5,
    sound: 5,
  })
);
const savedVolume = JSON.parse(store.value);
console.log("=>(GameControls.vue:17) savedVolume", savedVolume);
let volume = ref({
  music: parseInt(savedVolume.music),
  sound: parseInt(savedVolume.sound),
});
const playGame = ref(state.playGame);

const emit = defineEmits(["volumeChange"]);

watch(
  volume,
  (newValue) => {
    store.value = JSON.stringify(newValue);
    emit("volumeChange", volume);
  },
  { deep: true }
);
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-col justify-start gap-4">
      <RangeSlider v-model="volume.music" name="Music" />
      <RangeSlider v-model="volume.sound" name="Sound" />
      <!--        <p>{{ "playGame: " + playGame }}</p>-->
    </div>
  </div>
</template>

<style scoped></style>
