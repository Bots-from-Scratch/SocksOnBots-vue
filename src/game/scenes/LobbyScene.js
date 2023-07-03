import { Scene } from "phaser";
import { state } from "@/socket";
import { connectRoom } from "../../socket";
import { textStyle } from "../utils";

import logo from "@/assets/logo-full.png";

class LobbyScene extends Scene {
  constructor() {
    super("LobbyScene");
  }
  preload() {
    this.load.image("logo", logo);
  }

  create() {
    this.logoIcon = this.add.image(800 / 2, 20, logo);

    const numberOfRooms = 10;
    const localRooms = this.generateRooms(numberOfRooms);

    this.titleLobby = this.add.text(100, 100, "LOBBY AUSWÄHLEN", textStyle);

    this.roomButtons = [];
    localRooms.map((room, i) => {
      let roomButtonEntry = this.add
        .text(100, 170 + i * 30, room, textStyle)
        .setInteractive()
        .on("pointerover", () => {
          roomButtonEntry.setStyle({ fill: "#006db2" });
          // console.log(room);
        })
        .on("pointerout", () => roomButtonEntry.setStyle({ fill: "#fff" }))
        .on("pointerdown", () => {
          state.roomID = room;

          // AUS ConnectionManager - Textzwecke - evtl. auslagern
          connectRoom(room);

          this.scene.start("GameScene");
        });
      this.roomButtons.push(roomButtonEntry);
      // this.playButton_lvl_1.setInteractive()
      // this.playButton_lvl_1.on('pointerover', () => this.playButton_lvl_1.setStyle({ fill: '#006db2' })).on('pointerout', () => this.playButton_lvl_1.setStyle({ fill: '#fff' })).on('pointerdown', () => this.scene.start('GameScene_Level_1'));
    });
    this.roomSizes = [];
    for (let i = 0; i < this.roomButtons.length; i++) {
      this.roomSizes.push(this.add.text(400, 170 + i * 30, "0/2", textStyle));
    }
  }

  update() {
    // console.log(state.rooms);
    this.roomSizes[3].setText("1/2");
  }

  generateRooms(size) {
    let temp = [];
    for (let i = 0; i < size; i++) {
      temp.push("Room" + (i + 1));
    }
    return temp;
  }
}

export default LobbyScene;
