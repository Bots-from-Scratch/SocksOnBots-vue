<script setup lang="ts"></script>

<template>
  <header class="sticky top-0 z-[100]">
    <div
      class="bg-[#BA691D] w-full flex flex-row justify-around items-center py-2"
    >
      <router-link to="/" class="basis-1/4 flex justify-center">

        <img src="@/assets/pixel-logo.svg" width="64" alt="Socks On Bots Logo" />
      </router-link>
      <div
        class="flex flex-row w-full justify-around font-pixel text-black text-2xl"
      >
        <router-link to="/" class="hover:text-gray-500">Home</router-link>
        <router-link to="/game" class="hover:text-gray-500">Game</router-link>
        <router-link to="/about" class="hover:text-gray-500">About</router-link>
      </div>
      <div class="text-white font-pixel basis-1/4"></div>
    </div>
      <div class="w-full h-2 bg-[#D7873C]"></div>
      <div class="w-full h-2 bg-[#EFA866]"></div>
  </header>
</template>

<style scoped>

</style>
<style scoped></style>
