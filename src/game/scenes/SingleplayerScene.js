import {GameScene} from "@/game/scenes/GameScene";

let selectedGameLevel;
export class SingleplayerScene extends GameScene {
    constructor(selectedLevel, levels, updateSelectedLevel) {
        super({ key: "SingleplayerScene" });
        this.selectedGameLevel = selectedLevel;
        this.levels = levels;
        this.updateLevels = updateSelectedLevel;
    }



}
