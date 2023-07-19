import { Scene } from "phaser";
import cutScene2_png from "@/assets/cutscene/scene2.png";
import cutScene2_json from "@/assets/cutscene/scene2.json";

class CutScene2 extends Scene {
  constructor() {
    super("CutScene2");
  }
  preload() {
    this.load.aseprite("cutscene2", cutScene2_png, cutScene2_json);
  }

  create() {
    this.anims.createFromAseprite("cutscene2");

    this.sprite = this.add.sprite(480, 320, "cutscene2");

    this.cursors = this.input.keyboard.createCursorKeys();

    this.sprite.play({ key: "tv" }).once("animationcomplete", () => {
      this.scene.run("SingleplayerScene");
      this.scene.stop("CutScene2");
    });
    // this.cameras.main.fadeOut(2000, 0, 0, 0)
  }

  update() {
    if (this.cursors.space.isDown) {
      this.scene.run("SingleplayerScene");
      this.scene.stop("CutScene2");
    }
  }
}

export default CutScene2;
