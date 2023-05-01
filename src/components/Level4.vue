<template>
  <div ref="game"></div>
  <div>direction: {{ direction }}</div>
</template>

<script>
import * as Phaser from "phaser";
import { Scene } from "phaser";
import { defineComponent } from "vue";
import sky from "@/game/assets/sky.png";

export default {
    name: "Level4",
    props: {
        direction: String,
    },
    setup(props) {
        class PlayScene extends Scene {
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
                console.log(props.direction);
            }
        }

        const gameConfig = {
            type: Phaser.AUTO,
            parent: "phaser-example",
            width: 800,
            height: 600,
            scene: PlayScene,
        };
        new Phaser.Game(gameConfig);
    },
}

</script>

<style scoped></style>
