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
        <video src="@/assets/video/Gesamt_hochkant.mp4" controls class="w-full"></video>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
