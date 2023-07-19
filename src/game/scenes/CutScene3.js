import { Scene } from "phaser";
import cutScene3_png from "@/assets/cutscene/scene3.png";
import cutScene3_json from "@/assets/cutscene/scene3.json";

class CutScene3 extends Scene {
  constructor() {
    super("CutScene3");
  }
  preload() {
    this.load.aseprite("cutscene3", cutScene3_png, cutScene3_json);
  }

  create() {
    this.anims.createFromAseprite("cutscene3");

    this.sprite = this.add.sprite(560, 320, "cutscene3");

    this.cursors = this.input.keyboard.createCursorKeys();

    this.sprite.play({ key: "wear_sock" }).once("animationcomplete", () => {
      this.scene.run("SingleplayerScene");
      this.scene.stop("CutScene3");
    });
    // this.cameras.main.fadeOut(2000, 0, 0, 0)
  }

  update() {
    if (this.cursors.space.isDown) {
      this.scene.run("SingleplayerScene");
      this.scene.stop("CutScene3");
    }
  }
}

export default CutScene3;
