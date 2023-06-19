<script setup>
defineProps(["modelValue", "name"]);
defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="flex gap-4 items-center">
    <input
      class="my-4 appearance-none bg-[#EFA866] rounded-none cursor-pointer w-32 h-2"
      type="range"
      min="0"
      max="100"
      step="1"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <span>{{ name + ": " + modelValue }}</span>
  </div>
</template>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background-color: #1e293b;
  height: 1rem;
  width: 1rem;
}
</style>
