import { Scene } from "phaser";
import cutScene1_png from "@/assets/cutscene/cutscene1.png";
import cutScene1_json from "@/assets/cutscene/cutscene1.json";
import { SingleplayerScene } from "@/game/scenes/SingleplayerScene";

class CutScene1 extends Scene {
  constructor() {
    super("CutScene1");
  }
  preload() {
    this.load.aseprite("cutScene1", cutScene1_png, cutScene1_json);
  }

  create() {
    this.anims.createFromAseprite("cutScene1");

    this.sprite = this.add.sprite(450, 320, "cutScene1");

    this.cursors = this.input.keyboard.createCursorKeys();

    this.sprite
      .play({ key: "story" })
      .once("animationcomplete", () => this.scene.start("SingleplayerScene"));
  }

  update() {
    if (this.cursors.space.isDown) {
      this.scene.start("SingleplayerScene");
    }
  }
}

export default CutScene1;
