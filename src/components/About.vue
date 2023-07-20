<script setup lang="ts">
import { defineComponent } from "vue";
import HeroBanner from "@/components/HeroBanner.vue";
import PixelButton from "@/components/PixelButton.vue";
import PixelCard from "@/components/PixelCard.vue";

const team = [
  {
    name: "Denushan",
    imgPath: "https://socksonbots.de/assets/Bild_Denu.png",
    description: "Teamleader",
    alt: "Bild von Denu",
  },
  {
    name: "Stefan",
    imgPath: "https://socksonbots.de/assets/Bild_Stefan.png",
    description: "Dev",
    alt: "Bild von Stefan",
  },
  {
    name: "Nathan",
    imgPath: "https://socksonbots.de/assets/Bild_Nathan.png",
    description: "Dev",
    alt: "Bild von Nathan",
  },
  {
    name: "Muhammet",
    imgPath: "https://socksonbots.de/assets/Bild_Muhammet.png",
    description: "Design",
    alt: "Bild von Muhammet",
  },
  {
    name: "Daniel",
    imgPath: "https://socksonbots.de/assets/Bild_Dani.png",
    description: "Design",
    alt: "Bild von Daniel",
  },
];

const getAnimationClass = (index) => {
  return `animate-fadeIn delay-${index + 1}`;
};
</script>

<template>
  <div>
    <div class="p-8">
      <h2
        class="font-pixel text-gray text-4xl sm:text-2xl mt-10 mb-4 text-center"
      >
        Die kreativen Schöpfer von 'Socks on Bots' - Einblick in das Team und
        die Sockenkünstler!
      </h2>
      <div class="container mx-auto flex justify-center gap-20 my-32">
        <div
          v-for="(member, index) in team"
          :key="member.name"
          :class="getAnimationClass(index)"
        >
          <PixelCard :member="member" />
        </div>
      </div>
    </div>

    <div class="p-8">
      <h2
        class="font-pixel text-gray text-4xl sm:text-2xl mt-10 mb-4 text-center"
      >
        Projektbeschreibung
      </h2>
    </div>

    <div class="bg-[#c06c1c] p-8 flex items-center my-24 py-24">
      <div class="w-1/2">
        <h2 class="font-pixel text-gray-800 text-4xl sm:text-2xl mt-10 mb-4">
          Webbasiertes Multiplayerspiel mit Code-Steuerung
        </h2>
        <p class="font-pixel text-gray-800 mb-8">
          Socks on Bots soll ein webbasiertes Multiplayerspiel werden, in der in
          einer Wettkampfumgebung Spieler gegeneinander antreten und ihre
          Spielfiguren mit Hilfe von vorgefertigten Codeblöcken steuern können.
        </p>
      </div>
      <div class="w-1/2 flex justify-end">
        <img
          src="/src/assets/Pre-Phase.png"
          alt="Spielansicht mit Blöcken"
          class="w-3/4 pixel-border-16"
        />
      </div>
    </div>

    <div class="p-8 flex items-center my-24 py-24">
      <div class="w-1/2 flex justify-start">
        <img
          src="/src/assets/Lobby.png"
          alt="Bild von Lobby wahl"
          class="w-full pixel-border-16"
        />
      </div>
      <div class="w-1/2">
        <h2
          class="font-pixel text-gray-800 text-4xl sm:text-2xl mt-10 mb-4 text-right"
        >
          Die Lobby Auswahl
        </h2>
        <p class="font-pixel text-gray-800 mb-8 text-right">
          Im Multiplayermodus treten maximal 2 Spielern online gegeneinander an
          und versuchen, eine höhere Punktzahl als der Gegner zu erreichen.
          Dabei treten sie in beliebigen Räumen bei und warten bis der Raum 2
          Spieler erreicht hat. Dann wird die Map geladen.
        </p>
      </div>
    </div>

    <div class="bg-[#c06c1c] p-8 flex items-center my-24 py-24">
      <div class="w-1/2">
        <h2 class="font-pixel text-gray-800 text-4xl sm:text-2xl mt-10 mb-4">
          Der Spielverlauf
        </h2>
        <p class="font-pixel text-gray-800 mb-8">
          In der zweiten Phase starten die Roboter in einer farblich markierten
          Karte und werden von beiden Spielern gleichzeitig beobachtet. Die
          Runde endet, wenn ein Roboter die Aufgabe erledigt oder alle Befehle
          ausgeführt wurden.
        </p>
<!--        <router-link to="/game">-->
<!--          <PixelButton class="hover:text-gray-500" text="Lets play!" />-->
<!--        </router-link>-->
      </div>
      <div class="w-1/2 flex justify-end">
        <img
          src="/src/assets/Gameplay.png"
          alt="Bild vom Spielverlauf"
          class="w-full pixel-border-16"
        />
      </div>
    </div>

    <div class="p-8">
      <h2 class="font-pixel text-gray-800 text-4xl sm:text-2xl mt-10 mb-4">
        Frameworks
      </h2>
      <div class="flex items-center gap-8 justify-between">
        <a href="https://www.aseprite.org/" target="_blank">
          <img
            src="/src/assets/logo/Aseprite_logo.jpg"
            alt="Logo Aseprite"
            class="h-40"
          />
        </a>
        <a href="https://developers.google.com/blockly" target="_blank">
          <img
            src="/src/assets/logo/Blockly_logo.jpg"
            alt="Logo Blockly"
            class="h-40"
          />
        </a>
        <a href="https://phaser.io/" target="_blank">
          <img
            src="/src/assets/logo/Phaser_logo.jpg"
            alt="Logo Phaser"
            class="h-40"
            />
        </a>
        <a href="https://www.mapeditor.org/" target="_blank">
          <img
            src="/src/assets/logo/Tiled_logo.jpg"
            alt="Logo Tiled"
            class="h-40"
          />
        </a>
        <a href="https://vuejs.org/" target="_blank">
          <img src="/src/assets/logo/Vue_logo.jpg" alt="Logo Vue" class="h-40" />
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translate(0, -10px);
  }
  100% {
    opacity: 1;
    transform: translate(0, 0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

.delay-1 {
  animation-delay: 0.1s;
}

.delay-2 {
  animation-delay: 0.2s;
}

.delay-3 {
  animation-delay: 0.3s;
}

.delay-4 {
  animation-delay: 0.4s;
}

.delay-5 {
  animation-delay: 0.5s;
}

.pixel-border-16 {
  box-shadow: -16px 0 0 0 black, 16px 0 0 0 black, 0 -16px 0 0 black,
    0 16px 0 0 black;
}
</style>
