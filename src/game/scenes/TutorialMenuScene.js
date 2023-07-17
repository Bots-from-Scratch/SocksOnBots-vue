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
              // Maus bewegt sich nach links, den Hintergrund nach rechts verschieben
              this.cameras.main.scrollX -= 1;
          } else if (pointer.x > this.centerX) {
              // Maus bewegt sich nach rechts, den Hintergrund nach links verschieben
              this.cameras.main.scrollX += 1;
          }

          // if (pointer.y < this.centerY) {
          //     // Maus bewegt sich nach oben, den Hintergrund nach unten verschieben
          //     this.cameras.main.scrollY -= 1;
          // } else if (pointer.y > this.centerY) {
          //     // Maus bewegt sich nach unten, den Hintergrund nach oben verschieben
          //     this.cameras.main.scrollY += 1;
          // }
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
