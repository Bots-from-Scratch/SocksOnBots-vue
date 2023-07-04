<script setup lang="ts"></script>

<template>
  <header class="sticky top-0 z-[100]">
    <div
      class="bg-[#BA691D] w-full flex flex-row justify-around items-center py-2"
    >
      <div class="basis-1/4 flex justify-center">
        <img src="@/assets/pixel-logo.svg" width="64" />
      </div>
      <div
        class="flex flex-row w-full justify-around font-pixel text-black text-2xl"
      >
        <router-link to="/">Home</router-link>
        <router-link to="/game">Game</router-link>
        <router-link to="/about">About</router-link>
      </div>
      <div class="text-white font-pixel basis-1/4"></div>
    </div>
      <div class="w-full h-2 bg-[#D7873C]"></div>
      <div class="w-full h-2 bg-[#EFA866]"></div>
  </header>
</template>

<style scoped></style>
