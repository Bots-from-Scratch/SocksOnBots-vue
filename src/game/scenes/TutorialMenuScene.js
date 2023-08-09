import { Scene } from "phaser";

class TutorialMenuScene extends Scene {
  constructor() {
    super("TutorialMenuScene");
  }

  preload() {}

  create() {

      this.centerX = this.scale.width / 2;
      this.centerY = this.scale.height / 2;
      this.input.on("pointermove", (pointer) => {
          if (pointer.x < this.centerX) {
              this.cameras.main.scrollX -= 1;
          } else if (pointer.x > this.centerX) {
              this.cameras.main.scrollX += 1;
          }
      });


      this.add
        .text(450, 320, "text", {
          fontSize: "16px",
          fill: "#ffffff",
          fontFamily: "Pixel"
        })
        .setScrollFactor(1);
  }
}

export default TutorialMenuScene;
