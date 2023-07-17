import { Scene } from "phaser";
import { socket, state } from "@/socket";
import { connectRoom } from "../../socket";
import { textStyle } from "../utils";

import logo from "@/assets/logo-full.png";
import background from "@/assets/BG_menuBG.png";
import horizon from "@/assets/horizon_menuBG.png";
import city from "@/assets/city_menuBG.png";
import buttonAnimJson from "@/assets/buttons.json";
import buttonAnimPNG from "@/assets/buttons.png";

class LobbyMenuScene extends Scene {
  constructor() {
    super("LobbyMenuScene");
  }

  init() {
    state.activeScene = this.scene.key;
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
    const bodyStartPoint = 130;

    this.add.image(widthGame, heightGame, "background").setScrollFactor(0);

    this.input.on("pointermove", (pointer) => {
      console.log(pointer.x);
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

    this.backButton = this.createButton(
      160,
      heightGame - 50,
      "< Zurück",
      "MenuScene"
    );

    // LOBBY

    const numberOfRooms = 8;
    const localRooms = this.generateRooms(numberOfRooms);

    this.titleLobby = this.add
      .text(widthGame / 2 - 130, bodyStartPoint, "LOBBY AUSWÄHLEN", textStyle)
      .setScrollFactor(0, 0);

    this.roomButtons = [];
    localRooms.map((room, i) => {
      // let roomButtonEntry = this.add
      //   .text(100, bodyStartPoint + 30 + i * 30, room, textStyle)
      //   .setInteractive()
      //   .on("pointerover", () => {
      //     roomButtonEntry.setStyle({ fill: "#006db2" });
      //     // console.log(room);
      //   })
      //   .on("pointerout", () => roomButtonEntry.setStyle({ fill: "#fff" }))
      //   .on("pointerdown", () => {
      //     state.roomID = room;

      //     // AUS ConnectionManager - Textzwecke - evtl. auslagern
      //     connectRoom(room);

      //     this.scene.start("GameScene");
      //   });

      let roomButtonEntry = this.createButton(
        widthGame / 2,
        bodyStartPoint + 60 + i * 54,
        i + 1,
        textStyle,
        true
      );

      this.roomButtons.push(roomButtonEntry);
      // this.playButton_lvl_1.setInteractive()
      // this.playButton_lvl_1.on('pointerover', () => this.playButton_lvl_1.setStyle({ fill: '#006db2' })).on('pointerout', () => this.playButton_lvl_1.setStyle({ fill: '#fff' })).on('pointerdown', () => this.scene.start('GameScene_Level_1'));
    });
    this.maxRoomSize = 2;
    this.roomSizes = [];
    for (let i = 0; i < this.roomButtons.length; i++) {
      this.roomSizes.push(
        this.add
          .text(
            widthGame / 2 + 180,
            bodyStartPoint + 60 + i * 54,
            "0/" + this.maxRoomSize,
            textStyle
          )
          .setScrollFactor(0, 0)
      );
    }
  }

  update() {
    // console.log(state.rooms);
    // this.roomSizes[3].setText("1/2");
    console.log(state.rooms);
    this.roomSizes.forEach((roomSize, index) => {
      roomSize.setText(state.rooms.at(index).connects + "/" + this.maxRoomSize);
    });
  }

  generateRooms(size) {
    let temp = [];
    for (let i = 0; i < size; i++) {
      temp.push("Room " + (i + 1));
    }
    return temp;
  }

  // TODO Versuche Button Creation auszulagern
  createButton(x, y, roomId, scene, isGame) {
    let button = this.add
      .sprite(x, y, "button")
      .setScrollFactor(0)
      .setInteractive()
      .on("pointerover", () => button.play({ key: "hover" }))
      .on("pointerout", () => button.play({ key: "idle" }))
      .on("pointerdown", () => button.play({ key: "click" }))
      .on("pointerdown", () => {})
      .on("pointerup", () => {
        button.play({ key: "hover" });
        if (isGame) {
          state.roomID = roomId;
          connectRoom(roomId);
          let room = state.rooms.find((room) => room.id === roomId);
          if (room.connects < 2) {
            this.scene.start("MultiplayerScene");
          }
        } else {
          // this.scene.stop(this.scene);
          this.scene.start(scene);
        }
      });

    const buttonText = this.add
      .text(0, 0, "Raum " + roomId, {
        fontSize: "16px",
        fill: "#000000",
        fontFamily: "Pixel",
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

export default LobbyMenuScene;
