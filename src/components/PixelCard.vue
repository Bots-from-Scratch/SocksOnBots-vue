<script setup lang="ts">
const props = defineProps(["text"])
</script>

<template>
  <div class="relative">
    <div class="z-10">
    <svg class="w-full h-full" width="315" height="361" viewBox="0 0 315 361" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 331.5V336.5H10H24.5V350.5V355.5H29.5H285H290V350.5V336.5H305H310V331.5V30V25H305H290V10V5H285H29.5H24.5V10V25H10H5V30V331.5Z" fill="#E48832" stroke="#BA691D" stroke-width="10"/>
    </svg>
    <p class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-center font-pixel">{{text}}</p>
    </div>
    <svg class="-z-10 absolute top-2 left-2 w-full h-full" width="315" height="361" viewBox="0 0 315 361" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path class="stroke-[#A6A6A6] fill-[#A6A6A6]" d="M5 331.5V336.5H10H24.5V350.5V355.5H29.5H285H290V350.5V336.5H305H310V331.5V30V25H305H290V10V5H285H29.5H24.5V10V25H10H5V30V331.5Z" fill="#E48832" stroke="#BA691D" stroke-width="10"/>
    </svg>
  </div>
</template>

<style scoped>
</style>
