import { Scene } from "phaser";
import { state } from "@/socket"
import { GameScene } from "@/components/Game.vue";


class LobbyScene extends Scene {
    constructor() {
        super('LobbyScene');
    }
    preload() {

    }

    create() {
        const numberOfRooms = 10;
        const localRooms = this.generateRooms(numberOfRooms);

        this.titleLobby = this.add.text(100, 20, 'LOBBY AUSWÄHLEN');

        localRooms.map((room, i) => {
            let roomButtonEntry = this.add.text(100, 100 + (i * 30), room).setInteractive().on('pointerover', () => roomButtonEntry.setStyle({ fill: '#006db2' })).on('pointerout', () => roomButtonEntry.setStyle({ fill: '#fff' })).on('pointerdown', () => {
                this.scene.start('GameScene')
            });
            // this.playButton_lvl_1.setInteractive()
            // this.playButton_lvl_1.on('pointerover', () => this.playButton_lvl_1.setStyle({ fill: '#006db2' })).on('pointerout', () => this.playButton_lvl_1.setStyle({ fill: '#fff' })).on('pointerdown', () => this.scene.start('GameScene_Level_1'));

        });
    }

    // update() {
    //     console.log(state.rooms);
    // }

    generateRooms(size) {
        let temp = [];
        for (let i = 0; i < size; i++) {
            temp.push("Room" + (i + 1));
        }
        return temp;
    }
}


export default LobbyScene
