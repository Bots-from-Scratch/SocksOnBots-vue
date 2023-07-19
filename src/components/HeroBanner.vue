<script setup lang="ts">
import PixelButton from "@/components/PixelButton.vue";
</script>

<template>
  <div
    class="w-full h-max md:h-max bg-hero-image bg-cover bg-center flex flex-col-reverse items-center justify-evenly gap-16 md:flex-row"
  >
    <img
      src="@/assets/robot.png"
      alt="Roboter in Pixelart"
    />
    <div class="flex flex-col gap-16 items-start px-16 md:p-0 my-12">
      <h2 class="font-pixel text-gray-800 text-[10vw] sm:leading-snug sm:text-6xl">
        Lost your sock lately?
      </h2>
      <router-link to="/game">
        <PixelButton class="hover:text-gray-500 animate-shake" text="Get it back!"/>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
@keyframes fly-in {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes shake {
  0% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-4px);
  }
  75% {
    transform: translateY(4px);
  }
  100% {
    transform: translateY(0);
  }
}

.animate-fly-in {
  animation: fly-in 1s forwards;
}

.animate-shake {
  animation: shake 0.5s 4;
}
</style>
