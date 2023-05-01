<template>
  <div ref="game"></div>
  <div>direction: {{ direction }}</div>
</template>

<script>
import * as Phaser from "phaser";
import { Scene } from "phaser";
import { defineComponent } from "vue";
import sky from "@/game/assets/sky.png";

export default defineComponent({
    props: {
        direction: String,
    },
    data() {
        return {
            config: {
                type: Phaser.AUTO,
                parent: "phaser-example",
                width: 800,
                height: 600,
                scene: PlayScene,
            },
            directionValue: "",
        };
    },
    mounted() {
        this.game = new Phaser.Game(this.config);
    },
});

export class PlayScene extends Scene {
    constructor() {
        super({ key: "PlayScene" });
    }

    init(data) {
        console.log(data)
        this.directionValue = data.direction;
    }

    preload() {
        this.load.image("sky", sky);
    }

    create() {
        this.add.image(400, 300, "sky");
    }

    update() {
        console.log(this.directionValue);
    }
}
</script>

<style scoped></style>
