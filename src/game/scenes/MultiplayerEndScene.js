import { Scene } from "phaser";
import TutorialMenuScene from "@/game/scenes/TutorialMenuScene";
import {leaveRoom, resetFinishedLevelObject, socket, state} from "@/socket";
import buttonAnimPNG from "@/assets/buttons.png";
import buttonAnimJson from "@/assets/buttons.json";
import {MultiplayerScene} from "@/game/scenes/MultiplayerScene";

export class MultiplayerEndScene extends Scene {
  constructor() {
    super("MultiplayerEndScene");
  }

  init() {
    state.activeScene = this.scene.key;
  }

  preload(){
      this.load.aseprite("button", buttonAnimPNG, buttonAnimJson);

  }
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

    if (state.levelFinished.winner) {
      this.add
        .text(450, 320, "Winner", {
          fontSize: "16px",
          fill: "#ffffff",
          fontFamily: "Pixel",
        })
        .setScrollFactor(1);
    } else if (state.levelFinished.loser) {
      this.add
        .text(450, 320, "Loser", {
          fontSize: "16px",
          fill: "#ffffff",
          fontFamily: "Pixel",
        })
        .setScrollFactor(1);
    }
      this.anims.createFromAseprite("button");

      this.buttonNewLevel = this.createButton(
          760,
          550,
          "Weiterspielen",
          "Weiter"
      );

      this.buttonBackToMenu = this.createButton(
          200,
          550,
          "Zurück zur Lobby",
          "LobbyMenuScene"
      );


  }

  update() {
      if (state.room.connects < 2) {
          leaveRoom();
          this.scene.start("LobbyMenuScene");
      }

      if (state.room.rndLvl) {
          this.scene.start("MultiplayerScene");
          resetFinishedLevelObject();
      }

  }

    createButton(x, y, text, scene) {
        const button = this.add
            .sprite(x, y, "button")
            .setScrollFactor(0)
            .setInteractive()
            .on("pointerover", () => button.play({ key: "hover" }))
            .on("pointerout", () => button.play({ key: "idle" }))
            .on("pointerdown", () => button.play({ key: "click" }))
            .on("pointerup", () => {
                button.play({ key: "hover" });
                // this.scene.stop(this.scene);
                if (scene === "Weiter") {
                    socket.emit("nextLevel", state.room.id);
                }

                if (scene==="LobbyMenuScene") {
                    leaveRoom();
                this.scene.start(scene);
                }
            });

        const buttonText = this.add
            .text(0, 0, text, {
                fontSize: "16px",
                fontFamily: "Pixel",
                fill: "#000000",
            })
            .setScrollFactor(0);
        Phaser.Display.Align.In.Center(buttonText, button);

        button.on("sizechanged", () => {
            Phaser.Display.Align.In.Center(buttonText, button);
        });

        button.on("destroy", () => {
            buttonText.destroy();
        });

        return button;
    }
}
