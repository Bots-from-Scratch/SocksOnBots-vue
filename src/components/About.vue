<script setup lang="ts">
import { defineComponent } from "vue";
import HeroBanner from "@/components/HeroBanner.vue";
import PixelButton from "@/components/PixelButton.vue";
import PixelCard from "@/components/PixelCard.vue";

const team = [
  {
    name: "Denushan",
    imgPath: "/src/assets/Bild_Denu.png",
    description: "Teamleader",
    alt: "Bild von Denu",
  },
  {
    name: "Stefan",
    imgPath: "/src/assets/Bild_Stefan.png",
    description: "Dev",
    alt: "Bild von Stefan",
  },
  {
    name: "Nathan",
    imgPath: "/src/assets/Bild_Nathan.png",
    description: "Dev",
    alt: "Bild von Nathan",
  },
  {
    name: "Muhammet",
    imgPath: "/src/assets/Bild_Muhammet.png",
    description: "Design",
    alt: "Bild von Muhammet",
  },
  {
    name: "Daniel",
    imgPath: "/src/assets/Bild_Dani.png",
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
    <h2 class="font-pixel text-gray text-4xl sm:text-2xl mt-10 mb-4">
        Team
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


    <div class="bg-[#c06c1c] p-8">
      <h2 class="font-pixel text-gray-800 text-4xl sm:text-2xl mt-10 mb-4">
        Projektbeschreibung
      </h2>
      <p class="font-pixel text-gray-800 mb-8">
        Socks on Bots ist ein webbasiertes Multiplayerspiel, in der in einer
        Wettkampfumgebung Spieler gegeneinander antreten und ihre Spielfiguren
        mit Hilfe von vorgefertigten Codeblöcken steuern können. Die Spieler
        bauen die Bewegungsabläufe mit Blöcken, welche einzelne Befehle
        enthalten, z.B. Bewegungen oder Fähigkeiten wie Scannen, aber auch
        programmatische Beschreibungen wie Schleifen oder Bedingungen. Im
        Multiplayermodus treten maximal 2 Spielern online gegeneinander an und
        versuchen, eine höhere Punktzahl als der Gegner zu erreichen. Dabei
        können die Spieler einem Raum beitreten und gegeneinander antreten. Beim
        Start des Spiels sehen beide Spieler die Map und die Aufgabe, die in
        dieser Map zu erledigen ist. Anhand dessen werden dann die Blöcke
        aneinandergereiht und so die Befehle an den Roboter definiert. Nach
        Ablauf der Zeit oder wenn beide Spieler bereit sind, startet die zweite
        Phase und die Roboter können in einer Map – gekennzeichnet durch
        unterschiedliche Farben – von beiden Spielern gleichzeitig beim
        Ausführen der Befehle beobachtet werden. Die Runde endet, wenn ein
        Roboter als erster die Aufgabe komplett erledigt hat oder wenn alle
        Befehle beider Spielfiguren ausgeführt wurden. Dann werden die Punkte
        der beiden Teams verglichen und das Gewinnerteam ermittelt.
      </p>
    </div>

    <div class="p-8">
      <h2 class="font-pixel text-gray-800 text-4xl sm:text-2xl mt-10 mb-4">
        Frameworks
      </h2>
      <div class="flex items-center gap-8">
        <img
          src="/src/assets/logo/Aseprite_logo.jpg"
          alt="Logo Aseprite"
          class="h-40"
        />
        <img
          src="/src/assets/logo/Blockly_logo.jpg"
          alt="Logo Blockly"
          class="h-40"
        />
        <img
          src="/src/assets/logo/Phaser_logo.jpg"
          alt="Logo Phaser"
          class="h-40"
        />
        <img
          src="/src/assets/logo/Tiled_logo.jpg"
          alt="Logo Tiled"
          class="h-40"
        />
        <img src="/src/assets/logo/Vue_logo.jpg" alt="Logo Vue" class="h-40" />
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
</style>
