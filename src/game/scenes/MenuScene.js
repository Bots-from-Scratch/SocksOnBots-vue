import { Scene } from "phaser";
// import { state } from "@/socket";
import { textStyle } from "../utils";

import logo from "@/assets/logo-full.png";
import background from "@/assets/BG_menuBG.png";
import horizon from "@/assets/horizon_menuBG.png";
import city from "@/assets/city_menuBG.png";
import buttonAnimJson from "@/assets/ButtonsAnims.json";
import buttonAnimPNG from "@/assets/ButtonsAnims.png";

class MenuScene extends Scene {
  constructor() {
    super("MenuScene");
  }
  preload() {
    this.load.image("background", background);
    this.load.image("horizon", horizon);
    this.load.image("city", city);

    this.load.image("logo", logo);

    this.load.aseprite("button", buttonAnimPNG, buttonAnimJson);
  }

  create() {
    const widthGame = this.scale.width;
    const heightGame = this.scale.height;

    this.add.image(widthGame * 0.5, heightGame * 0.5, "background");

    this.cam = this.cameras.main.setBounds(0, 0, widthGame * 2, heightGame * 2);
    this.input.on("pointermove", (pointer) => {
      this.cam.startFollow(pointer, true, 1);
    });

    this.horizon1 = this.add
      .image(0, heightGame, "horizon")
      .setOrigin(0, 1)
      .setScrollFactor(0.1, 0);
    this.horizon2 = this.add
      .image(this.horizon1.width, heightGame, "horizon")
      .setOrigin(0, 1)
      .setScrollFactor(0.1, 0);

    this.city1 = this.add
      .image(0, heightGame, "city")
      .setOrigin(0, 1)
      .setScrollFactor(0.4, 0);
    this.city2 = this.add
      .image(this.city1.width, heightGame, "city")
      .setOrigin(0, 1)
      .setScrollFactor(0.4, 0);

    this.logoIcon = this.add
      .image(widthGame / 2, 100, "logo")
      .setScrollFactor(0, 0);

    // BUTTONS

    this.anims.createFromAseprite("button");
    this.buttonTutorial = this.add
      .sprite(150, 250, "button")
      .setScrollFactor(0, 0);
    this.buttonTutorial.setInteractive().on("pointerover", () => {
      console.log(this.buttonTutorial);
      this.buttonTutorial.play("hover");
    });
    // this.buttonTutorial = this.add
    //   .text(100, 250, "Tutorial", textStyle)
    //   .setScrollFactor(0, 0)
    //   .setInteractive()
    //   .on("pointerdown", () => console.log("Tutorial"));

    this.buttonMultiplayer = this.add
      .text(100, 300, "Multiplayer", textStyle)
      .setScrollFactor(0, 0)
      .setInteractive()
      .on("pointerdown", () => this.scene.start("LobbyScene"));

    this.buttonCredits = this.add
      .text(100, 350, "Credits", textStyle)
      .setScrollFactor(0, 0)
      .setInteractive()
      .on("pointerdown", () => console.log("Credits"));
  }

  update() {
    // console.log("IMAGE", this.city1);
    // this.city1.x = this.city1.x - 1;
    // console.log(Scene.game.input.x);
    // console.log(Scene.game.input.y);
  }

  // TODO Versuche Button Creation auszulagern
  createButton(x, y, text) {}
}

export default MenuScene;
