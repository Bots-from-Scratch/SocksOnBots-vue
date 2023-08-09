import { Scene } from "phaser";

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


    this.add.image(widthGame, heightGame, "background").setScrollFactor(0);

    this.hoverSound = this.sound.add("hoverSound");

    this.input.on("pointermove", (pointer) => {
      this.cameras.main.startFollow(pointer, true, 0.1);
    });

    this.horizon1 = this.add
      .image(-50, heightGame, "horizon")
      .setOrigin(0, 1)
      .setScale(1.1)
      .setScrollFactor(0.05, 0);

    this.city1 = this.add
      .image(-50, heightGame, "city")
      .setOrigin(0, 1)
      .setScale(1.1)
      .setScrollFactor(0.1, 0);

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
    this.buttonCredits.setVisible(false);
  }

  update() {
  }

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
