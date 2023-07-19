import { Scene } from "phaser";
import cutScene4_png from "@/assets/cutscene/scene4.png";
import cutScene4_json from "@/assets/cutscene/scene4.json";
import { SingleplayerScene } from "@/game/scenes/SingleplayerScene";

class CutScene4 extends Scene {
  constructor() {
    super("CutScene4");
  }
  preload() {
    this.load.aseprite("cutscene4", cutScene4_png, cutScene4_json);
  }

  create() {
    this.anims.createFromAseprite("cutscene4");

    this.sprite = this.add.sprite(480, 320, "cutscene4");

    this.cursors = this.input.keyboard.createCursorKeys();

    this.sprite.play({ key: "Socke" }).once("animationcomplete", () => {
      this.scene.run("SingleplayerScene");
      this.scene.stop("CutScene4");
    });
    // this.cameras.main.fadeOut(2000, 0, 0, 0)
  }

  update() {
    if (this.cursors.space.isDown) {
      this.scene.run("SingleplayerScene");
      this.scene.stop("CutScene4");
    }
  }
}

export default CutScene4;
