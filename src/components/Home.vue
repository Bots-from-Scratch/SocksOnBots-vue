<script setup lang="ts">
import HeroBanner from "@/components/HeroBanner.vue";
import PixelCard from "@/components/PixelCard.vue";

const cards = [
  { text: "Neuigkeit1" },
  { text: "Neuigkeit2" },
  { text: "Neuigkeit3" },
  { text: "Neuigkeit4" },
];
</script>

<template>
  <div>
    <HeroBanner />
    <div class="container mx-auto flex justify-center gap-20 my-32 flex-wrap">
      <div class="w-full md:w-2/3 lg:w-1/2">
        <video src="@/assets/video/Socks_on_Bots_Pitchvideo.mp4" controls class="w-full pixel-border-16"></video>
      </div>
    </div>
    <div class="flex items-center justify-end space-x-2 p-4">
      <a href="https://www.instagram.com/socks_on_bots/" target="_blank" rel="noopener noreferrer">
        <img src="/src/assets/icon/instagram-icon.png" alt="Instagram" class="h-8" />
      </a>
      <a href="https://github.com/Bots-from-Scratch" target="_blank" rel="noopener noreferrer">
        <img src="/src/assets/icon/github-icon.png" alt="GitHub" class="h-8" />
      </a>
    </div>
  </div>
</template>

<style scoped>
.pixel-border-16 {
  box-shadow: -16px 0 0 0 black, 16px 0 0 0 black, 0 -16px 0 0 black, 0 16px 0 0 black;
}
</style>
