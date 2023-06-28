<script setup lang="ts">
import { defineComponent } from "vue";
import HeroBanner from "@/components/HeroBanner.vue";
import PixelButton from "@/components/PixelButton.vue";
import PixelCard from "@/components/PixelCard.vue";

const cards = [
  { text: "Denushan"},
  { text: "Card2" },
  { text: "Card3" },
  { text: "Card4" },
];
</script>


<template>

    <div class="container mx-auto flex justify-center gap-20 my-32 flex-wrap">
      <div v-for="card in cards">
        <PixelCard :text="card.text" /><PixelCard>
      </div>
    </div>
  <div class="container mx-auto">
<h2 class="font-pixel text-gray-800 text-4xl sm:leading-snug sm:text-2xl">Die kreativen Schöpfer von 'Socks on Bots' - Einblick in das Team und die Sockenkünstler!</h2>
    <div class="block-container">
      <div class="block">
        <div class="block-content">
          <img src="@/assets/Bild_Denu.png" alt="Bild Denu" class="block-image" />
          <p class="block-description">Kurze Beschreibung hier</p>
        </div>
      </div>
      <div class="block">
        <div class="block-content">
          <img src="@/assets/Bild_Stefan.png" alt="Bild Stefan" class="block-image" />
          <p class="block-description">Kurze Beschreibung hier</p>
        </div>
      </div>
      <div class="block">
        <div class="block-content">
          <img src="@/assets/Bild_Nathan.png" alt="Bild Nathan" class="block-image" />
          <p class="block-description">Kurze Beschreibung hier</p>
        </div>
      </div>
      <div class="block">
        <div class="block-content">
          <img src="@/assets/Bild_Dani.png" alt="Bild Dani" class="block-image" />
          <p class="block-description">Kurze Beschreibung hier</p>
        </div>
      </div>
      <div class="block">
        <div class="block-content">
          <img src="@/assets/Bild_Muhammet.png" alt="Bild Muhammet" class="block-image" />
          <p class="block-description">Kurze Beschreibung hier</p>
        </div>
      </div>
      <!-- Weitere Blöcke hier hinzufügen -->
    </div>

    <div class="container mx-auto">
      <PixelButton class="mx-auto" text="Donate" />
    </div>
  </div>
</template>

<style scoped>
.block-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 12px;
}

.block {
  width: 300px;
  margin-bottom: 40px; /* Erhöhter Abstand zwischen den Blöcken */
  padding: 10px;
  background-color: #c06c1c;
  border-radius: 4px;
}

.block-content {
  display: flex;
  align-items: center;
}

.block-image {
  width: 100px;
  height: auto;
  margin-right: 10px;
}

.block-description {
  margin-top: 0;
}
</style>
