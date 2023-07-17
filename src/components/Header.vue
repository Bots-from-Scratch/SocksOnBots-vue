<script setup lang="ts">

</script>

<template>
  <header class="sticky z-[100] top-0 bg-[#BA691D] w-full h-12 flex flex-row justify-around items-center">
    <div></div>
    <div class="flex flex-row w-full justify-around font-pixel text-white">
      <router-link to="/" class="hover:text-gray-500">Home</router-link>
      <router-link to="/game" class="hover:text-gray-500">Game</router-link>
      <router-link to="/about" class="hover:text-gray-500">About</router-link>
    </div>
  </header>
  <div class="sticky z-[100] top-12 w-full h-2 bg-[#D7873C]"></div>
  <div class="sticky z-[100] top-14 w-full h-2 bg-[#EFA866]"></div>
</template>

<style scoped>

</style>
