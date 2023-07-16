import {GameScene} from "@/game/scenes/GameScene";

let selectedGameLevel;
export class SingleplayerScene extends GameScene {
    constructor(selectedLevel, levels, updateSelectedLevel) {
        super({ key: "SingleplayerScene" });
        this.selectedGameLevel = selectedLevel;
        console.log("=>(SingleplayerScene.js:8) this.selectedGameLevel", this.selectedGameLevel);
        this.levels = levels;
        console.log("=>(SingleplayerScene.js:9) this.levels", this.levels);
        this.updateLevels = updateSelectedLevel;
    }
    checkForWin(sprite, object) {
        this.updateLevels(this.getActiveLevel().number + 1);
        console.log("=>(Game.vue:916) level finished");
    }


}
