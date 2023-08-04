import {GameScene} from "@/game/scenes/GameScene";
import CutScene2 from "@/game/scenes/CutScene2";

let selectedGameLevel;
export class SingleplayerScene extends GameScene {
    constructor(selectedLevel, levels, updateSelectedLevel) {
        super({ key: "SingleplayerScene" });
        this.selectedGameLevel = selectedLevel;
        this.levels = levels;
        this.updateLevels = updateSelectedLevel;
    }
    checkForWin(sprite, object) {
        if (this.getActiveLevel().number === 1) {
            this.scene.pause("SingleplayerScene");
            this.scene.run("CutScene2");
            this.scene.bringToTop("CutScene2");
        } else if (this.getActiveLevel().number === 3) {
            this.scene.pause("SingleplayerScene");
            this.scene.run("CutScene3");
            this.scene.bringToTop("CutScene3");
        } else if (this.getActiveLevel().number === 4) {
            this.scene.pause("SingleplayerScene");
            this.scene.run("CutScene4");
            this.scene.bringToTop("CutScene4");
        }
        this.updateLevels(this.getActiveLevel().number + 1);

    }


}
