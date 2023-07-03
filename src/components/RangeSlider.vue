<script setup>
defineProps(["modelValue", "name"]);
defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="flex flex-row gap-4 items-center">
    <span class="text-black font-pixel">{{ name }}</span>
    <input
      class="my-2 appearance-none bg-[#EFA866] rounded-none cursor-pointer w-32 h-2"
      type="range"
      min="0"
      max="100"
      step="1"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background-color: #1e293b;
  height: 1rem;
  width: 0.5rem;

  box-shadow: -5px 0 0 0 black, 5px 0 0 0 black, 0 -5px 0 0 black,
    0 5px 0 0 black;
}
</style>
