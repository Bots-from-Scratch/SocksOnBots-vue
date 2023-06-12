<script setup lang="ts">
import HeroBanner from "@/components/HeroBanner.vue";
import PixelCard from "@/components/PixelCard.vue";

const cards = [
  { text: "Card1" },
  { text: "Card2" },
  { text: "Card3" },
  { text: "Card4" },
];
</script>

<template>
  <div>
    <HeroBanner />
    <div class="container mx-auto flex justify-center gap-20 my-32 flex-wrap">
      <div v-for="card in cards">
        <PixelCard :text="card.text" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
