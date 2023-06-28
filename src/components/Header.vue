<script setup lang="ts">

</script>

<template>
  <header class="sticky z-[100] top-0 bg-[#BA691D] w-full h-12 flex flex-row justify-around items-center">
    <div></div>
    <div class="flex flex-row w-full justify-around font-pixel text-white">
    <router-link to="/">Home</router-link>
    <router-link to="/game">Game</router-link>
    <router-link to="/about">About</router-link>
    </div>
<!--    <div class="text-white font-pixel">Login</div>-->

  </header>
  <div class="sticky z-[100] top-12 w-full h-2 bg-[#D7873C]"></div>
  <div class="sticky z-[100] top-14 w-full h-2 bg-[#EFA866]"></div>

</template>

<style scoped>
.router-link:hover {
  background-color: gray; /* Hintergrundfarbe beim Hovern über den Link */
  cursor: pointer; /* Zeiger ändern, um anzuzeigen, dass der Link interaktiv ist */
}
</style>
