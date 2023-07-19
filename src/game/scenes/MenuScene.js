import { Scene } from "phaser";
// import { state } from "@/socket";
import { textStyle } from "../utils";

import logo from "@/assets/logo-full.png";
import background from "@/assets/BG_menuBG.png";
import horizon from "@/assets/horizon_menuBG.png";
import city from "@/assets/city_menuBG.png";
import buttonAnimJson from "@/assets/buttons.json";
import buttonAnimPNG from "@/assets/buttons.png";
import hoverSound from "@/assets/sounds/Click/CLICK2.mp3";
import {state} from "@/socket";

class MenuScene extends Scene {
  constructor() {
    super("MenuScene");
  }
  init() {
    state.activeScene = this.scene.key;}
  preload() {
    this.load.image("background", background);
    this.load.image("horizon", horizon);
    this.load.image("city", city);
    this.load.image("logo", logo);

    this.load.aseprite("button", buttonAnimPNG, buttonAnimJson);

    this.load.audio("hoverSound", hoverSound);
  }

  create() {
    const widthGame = this.scale.width;
    const heightGame = this.scale.height;

    // console.log("=>(MenuScene.js:31) ", heightGame);

    this.add.image(widthGame, heightGame, "background").setScrollFactor(0);

    this.hoverSound = this.sound.add("hoverSound");

    // this.cam = this.cameras.main.setBounds(0, 0, widthGame*4.5 , heightGame*4.5 );
    this.input.on("pointermove", (pointer) => {
      // console.log(pointer.x);
      this.cameras.main.startFollow(pointer, true, 0.1);
    });
    // this.centerX = this.scale.width / 2;
    // this.centerY = this.scale.height / 2;
    // this.input.on("pointermove", (pointer) => {
    //   if (pointer.x < this.centerX) {
    //     // Maus bewegt sich nach links, den Hintergrund nach rechts verschieben
    //     this.cameras.main.scrollX -= 1;
    //   } else if (pointer.x > this.centerX) {
    //     // Maus bewegt sich nach rechts, den Hintergrund nach links verschieben
    //     this.cameras.main.scrollX += 1;
    //   }
    //
    //   if (pointer.y < this.centerY) {
    //     // Maus bewegt sich nach oben, den Hintergrund nach unten verschieben
    //     this.cameras.main.scrollY -= 1;
    //   } else if (pointer.y > this.centerY) {
    //     // Maus bewegt sich nach unten, den Hintergrund nach oben verschieben
    //     this.cameras.main.scrollY += 1;
    //   }
    // });

    this.horizon1 = this.add
      .image(-50, heightGame, "horizon")
      .setOrigin(0, 1)
      .setScale(1.1)
      .setScrollFactor(0.05, 0);
    // this.horizon2 = this.add
    //   .image(this.horizon1.width, heightGame, "horizon")
    //   .setOrigin(0, 1)
    //   .setScrollFactor(0.05, 0);

    this.city1 = this.add
      .image(-50, heightGame, "city")
      .setOrigin(0, 1)
      .setScale(1.1)
      .setScrollFactor(0.1, 0);
    // this.city2 = this.add
    //   .image(this.city1.width, heightGame, "city")
    //   .setOrigin(0, 1)
    //   .setScrollFactor(0.1, 0);

    this.logoIcon = this.add
      .image(widthGame / 2, 70, "logo")
      .setScrollFactor(0, 0)
      .setScale(0.6);

    // BUTTONS

    this.anims.createFromAseprite("button");

    this.buttonTutorial = this.createButton(
      450,
      250,
      "Singleplayer",
      "CutScene1"
    );

    this.buttonMultiplayer = this.createButton(
      450,
      325,
      "Multiplayer",
      "LobbyMenuScene"
    );

    this.buttonCredits = this.createButton(450, 400, "Credits").on(
      "pointerdown",
      () => console.log("Credits")
    );
  }

  update() {
    // console.log("IMAGE", this.city1);
    // this.city1.x = this.city1.x - 1;
    // console.log(Scene.game.input.x);
    // console.log(Scene.game.input.y);
  }

  // TODO Versuche Button Creation auszulagern
  createButton(x, y, text, scene) {
    const button = this.add
      .sprite(x, y, "button")
      .setScrollFactor(0)
      .setInteractive()
      .on("pointerover", () => {
        button.play({ key: "hover" });
        this.hoverSound.play();
      })
      .on("pointerout", () => button.play({ key: "idle" }))
      .on("pointerdown", () => button.play({ key: "click" }))
      .on("pointerup", () => {
        button.play({ key: "hover" });
        // this.scene.stop(this.scene);
        this.scene.start(scene);
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

export default MenuScene;
