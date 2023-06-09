<script setup lang="ts"></script>

<template>
  <div
    class="w-full h-[50vh] bg-hero-image bg-cover bg-center flex items-center justify-between"
  >
    <img
      src="src/assets/robot.png"
      alt="Roboter in Pixelart"
      class="-scale-x-100 mx-36"
    />
    <div class="mx-36 flex flex-col gap-8 items-start">
      <h2 class="font-pixel text-gray-800 text-6xl">Lost your sock lately?</h2>
      <router-link to="/game" class="relative">
        <img src="src/assets/button.svg" alt="Pixelart Button" />
        <p
          class="absolute w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-pixel"
        >
          Get it back!
        </p>
      </router-link>
    </div>
  </div>
</template>

<style scoped></style>
