<template>
  <div ref="phaserGame" class="game-container" />
  <div class="flex flex-col">
    <div>volume: {{ volume }}</div>
    <div id="play-status">playGame: {{ playGame }}</div>
    <div>Self Direction: {{ state.directionSelf }}</div>
    <!--    <div>Level: {{ playingLevel }}</div>-->
    <div>Level: {{ selectedLevel }}</div>
    <select v-model="selectedLevel" class="bg-yellow-500">
      <option disabled value="">Select level</option>
      <option v-for="level in levels" class="capitalize">
        {{ level.number }}
      </option>
    </select>
  </div>
</template>

<script>
import * as Phaser from "phaser";
import { Scene } from "phaser";
import { computed, defineComponent, ref, toRaw } from "vue";
import bomb from "@/game/assets/bomb.png";
import tileset from "@/assets/CosmicLilac_Tiles_64x64-cd3.png";
import platform from "@/assets/platform.png";
import star from "@/assets/socke.png";
import botSpritesheet from "@/assets/Spritesheetnew.png";
import botAnimationJson from "@/assets/Spritesheetnew.json";
import bot_with_sock from "@/assets/Spritesheet.png";
import world from "@/assets/BotsonsocksBIG.json";
import PreloadScene from "@/game/scenes/PreloadScene";
import CutSceneFirstSock from "@/game/scenes/CutSceneFirstSock";
import collisionSound from "@/assets/sounds/HIT/HIT3.mp3";
import bgSound from "@/assets/sounds/AdhesiveWombat - 8 Bit Adventure.mp3";
import movingSound from "@/assets/sounds/Fahrgeräusche_dumpf.mp3";
import { socket, state } from "@/socket";
import { javascriptGenerator } from "blockly/javascript";

// TODO licht/Strom anschalten
// TODO schieben
// TODO

let activeScene = null;
export default defineComponent({
  name: "Game",
  emits: {
    selectedLevel: null,
  },
  props: {
    // directionPlayer1: String,
    playGame: Boolean,
    volume: Object,
    // workspace: Object,
  },
  setup() {
    let game = ref(null);
    let selectedLevel = ref(2);
    activeScene = computed(() => {
      console.log(
        "=>(Game.vue:49) this.game.scene.getScenes",
        game.value.scene.getScenes(true)[0]
      );
      return game.value.scene.getScenes(true)[0];
    });

    const controlSounds = (volumes) => {
      let scene = activeScene.value;

      if (!scene.backgroundSound.isPlaying) {
        console.log("=>(Game.vue:63) playScene");
        scene.backgroundSound.play();
      }

      scene.backgroundSound.setVolume(parseInt(volumes.value.music) / 200);
      scene.collisionSound.setVolume(parseInt(volumes.value.sound) / 200);
    };

    const run = (workspace, volumes) => {
      runBlocks(workspace);
      controlSounds(volumes);
    };

    const updateSelectedLevel = (newLevel) => {
      selectedLevel.value = newLevel;
    };
    return {
      game,
      run,
      controlSounds,
      activeScene,
      updateSelectedLevel,
      selectedLevel,
    };
  },

  data() {
    return {
      levels: [
        {
          number: 0,
          name: "Level 1",
          x: 3,
          y: 28,
          isActive: false,
          playerStart: { x: 10, y: 36.5 },
        },
        {
          number: 1,
          name: "Level 2",
          x: 3,
          y: 15,
          isActive: false,
          playerStart: { x: 10, y: 23 },
        },
        {
          number: 2,
          name: "Level 3",
          x: 3,
          y: 2,
          isActive: false,
          playerStart: { x: 3, y: 7 },
        },
        {
          number: 3,
          name: "Level 4",
          x: 23,
          y: 2,
          isActive: false,
          playerStart: { x: 25, y: 3 },
        },
        {
          number: 4,
          name: "Level 5",
          x: 24,
          y: 15,
          isActive: false,
          playerStart: { x: 300, y: 600 },
        },
        {
          number: 5,
          name: "Level 6",
          x: 22,
          y: 28,
          isActive: false,
          playerStart: { x: 25, y: 29 },
        },
        {
          number: 6,
          name: "Level 7",
          x: 42,
          y: 2,
          isActive: false,
          playerStart: { x: 400, y: 800 },
        },
        {
          number: 7,
          name: "Level 8",
          x: 42,
          y: 15,
          isActive: false,
          playerStart: { x: 450, y: 900 },
        },
        {
          number: 8,
          name: "Level 9",
          x: 42,
          y: 28,
          isActive: false,
          playerStart: { x: 500, y: 1000 },
        },
      ],
    };
  },

  computed: {
    state() {
      return state;
    },
  },

  watch: {
    /**
     * Beschreibung von selectedLevel
     */
    selectedLevel() {
      socket.emit("selectedLevel", {
        roomId: state.roomID,
        level: this.selectedLevel,
      });
      // this.activeScene.scene.restart();
    },
    "state.selectedLevel": {
      handler(newValue) {
        selectedGameLevel = newValue;
        this.$emit("selectedLevel", selectedGameLevel);
        if (this.game) {
          this.activeScene.prepareLevel();
        }
      },
      immediate: true,
    },
  },

  mounted() {
    gameConfig = {
      type: Phaser.AUTO,
      parent: this.$refs.phaserGame,
      width: 960,
      height: 640,
      scene: [
        new GameScene(
          this.selectedLevel,
          this.levels,
          this.updateSelectedLevel
        ),
        PreloadScene,
        CutSceneFirstSock,
      ],
      physics: {
        default: "arcade",
        arcade: {
          debug: true,
        },
      },
      pixelArt: true,
    };
    this.game = new Phaser.Game(gameConfig);
  },
});

let gameConfig;
let selectedGameLevel;
let playerPosition = { x: 0, y: 0 };
let player2XY;
let blockFunction;
let pushObject = true;

let directionPlayer1 = {
  right: { isClear: true, isMoving: false },
  left: { isClear: true, isMoving: false },
  up: { isClear: true, isMoving: false },
  down: { isClear: true, isMoving: false },
  toObject: { isClear: false, isMoving: false },
};
let directionPlayer2 = {
  right: { isClear: true, isMoving: false },
  left: { isClear: true, isMoving: false },
  up: { isClear: true, isMoving: false },
  down: { isClear: true, isMoving: false },
  toObject: { isClear: false, isMoving: false },
};

let objectToScanFor;
let itemSock;
let itemKey;
let walkedBy;
let objectCollected;
let collectedItems = [];
let intervalId;
let itemConnected;
let score;

function movePlayerRight() {
  activeScene.value.movePlayerRight();
  console.log("movePLayerRight");
}
function movePlayerLeft() {
  activeScene.value.movePlayerLeft();
  console.log("movePlayerLeft");
}

function movePlayerUp() {
  activeScene.value.movePlayerUp();
  console.log("movePlayerUp");
}

function movePlayerDown() {
  activeScene.value.movePlayerDown();
  console.log("movePlayerDown");
}

function movePlayerToObject() {
  console.log("=>(Game.vue:279) movePlayerToObject");
  activeScene.value.movePlayerToObject();
}

function stopPlayer() {
  console.log("=>(Game.vue:279) stopPlayer");
  activeScene.value.stopPlayer();
}

function runBlocks(workspace) {
  console.log("runBlocks wurde aufgerufen.");
  sendDirectionToSocket();
  javascriptGenerator.STATEMENT_PREFIX = "highlightBlock(%1);\n";
  javascriptGenerator.addReservedWords("highlightBlock");

  // function highlightBlock is used by blockly
  function highlightBlock(id) {
    workspace.highlightBlock(id);
  }

  const code = javascriptGenerator.workspaceToCode(workspace);

  createGeneratorFunction();
  function createGeneratorFunction() {
    const blockGenerator = eval(`
    (function* () {console.log("eval.new");
      ${code};console.log("eval.new.finished");
    })`);

    blockFunction = blockGenerator();

    activeScene.value.startDelayedBlockEvaluation();
  }
}

function sendDirectionToSocket() {
  socket.emit("directionSelf", {
    roomId: state.roomID,
    directionSelf: directionPlayer1,
  });
}

class GameScene extends Scene {
  constructor(selectedLevel, levels, updateSelectedLevel) {
    super({ key: "GameScene" });
    selectedGameLevel = selectedLevel;
    this.levels = levels;
    this.updateLevels = updateSelectedLevel;
  }

  ROTATION_RIGHT = 0;
  ROTATION_LEFT = 180;
  ROTATION_UP = -90;
  ROTATION_DOWN = 90;
  SCAN_DISTANCE = 200;

  // levels = [
  //   {
  //     name: "Level 1",
  //     x: 3,
  //     y: 28,
  //     isActive: false,
  //     playerStart: {x: 10, y: 37},
  //   },
  //   {
  //     name: "Level 2",
  //     x: 3,
  //     y: 15,
  //     isActive: false,
  //     playerStart: {x: 10, y: 23},
  //   },
  //   {
  //     name: "Level 3",
  //     x: 3,
  //     y: 2,
  //     isActive: false,
  //     playerStart: {x: 3, y: 7},
  //   },
  //   {
  //     name: "Level 4",
  //     x: 23,
  //     y: 2,
  //     isActive: false,
  //     playerStart: {x: 25, y: 3},
  //   },
  //   {
  //     name: "Level 5",
  //     x: 24,
  //     y: 15,
  //     isActive: false,
  //     playerStart: {x: 300, y: 600},
  //   },
  //   {
  //     name: "Level 6",
  //     x: 22,
  //     y: 28,
  //     isActive: false,
  //     playerStart: {x: 350, y: 700},
  //   },
  //   {
  //     name: "Level 7",
  //     x: 42,
  //     y: 2,
  //     isActive: false,
  //     playerStart: {x: 400, y: 800},
  //   },
  //   {
  //     name: "Level 8",
  //     x: 42,
  //     y: 15,
  //     isActive: false,
  //     playerStart: {x: 450, y: 900},
  //   },
  //   {
  //     name: "Level 9",
  //     x: 42,
  //     y: 28,
  //     isActive: false,
  //     playerStart: {x: 500, y: 1000},
  //   },
  // ];

  init() {
    this.resetDirection();

    // playingLevel = 4;

    score = 0;

    walkedBy = false;
    objectCollected = false;
    this.value;
    this.collided = false;

    this.rightIsClear = true;
    this.leftIsClear = true;
    this.upIsClear = true;
    this.downIsClear = true;

    this.scannedObject = false;
    this.objectCollidedWith = {};
    this.blockingObjects = undefined;
    objectToScanFor = undefined;
    this.objectSighted = false;
    this.scanAngle = 0;
    this.itemCollected = false;
    this.levelWon = false;
    this.isPreparingLevel = false;
  }

  preload() {
    // this.load.image('sky', sky);
    this.load.spritesheet("tileset", tileset, {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.image("ground", platform);
    this.load.image("star", star);
    this.load.image("bomb", bomb);
    this.load.spritesheet("bot", botSpritesheet, {
      frameWidth: 64,
      frameHeight: 64,
    });
    // TODO load player from aseprite
    // this.load.aseprite("bot", botSpritesheet, botAnimationJson);

    this.load.spritesheet("bot_with_sock", bot_with_sock, {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.tilemapTiledJSON("map", world);
    this.load.audio("collision", collisionSound);
    this.load.audio("backgroundSound", bgSound);
    this.load.audio("movingSound", movingSound);
  }

  create() {
    // this.add.image(400, 300, 'sky');

    const map = this.make.tilemap({ key: "map" });

    this.tileWidth = map.tileWidth;
    this.tileHeight = map.tileHeight;

    const tileset = map.addTilesetImage(
      "CosmicLilac_Tiles_64x64-cd3",
      "tileset"
    );

    this.backgroundLayer = map.createLayer("background", tileset, 0, 0);
    const groundLayer = map.createLayer("floor", tileset, 0, 0);
    this.wallLayer = map.createLayer("walls", tileset, 0, 0);
    this.objectLayer = map.createLayer("objects", tileset, 0, 0);
    this.winningPointLayer = map.getObjectLayer("WinningPointLayer")["objects"];

    // this.cutSceneTriggers = map.createFromObjects("TriggerCutScenesLayer", {
    //   classType: Phaser.Physics.Arcade.Sprite,
    // });
    // this.cutSceneTriggerGroup = this.physics.add.staticGroup();
    // this.cutSceneTriggers.forEach((el) => this.cutSceneTriggerGroup.add(el));
    //
    // this.pushableObjects = map.createFromObjects("PushableObjectsLayer", {
    //   classType: Phaser.Physics.Arcade.Sprite,
    // });
    // this.pushableObjectsGroup = this.physics.add.group();
    // this.pushableObjects.forEach((el)=>this.pushableObjectsGroup.add(el));
    //
    // this.keys = map.createFromObjects("KeyLayer", {
    //   classType: Phaser.Physics.Arcade.Sprite,
    // });
    // console.log("=>(Game.vue:436) this.keys", this.keys);
    //
    // this.keyGroup = this.physics.add.group();
    // this.keys.forEach((key) => this.keyGroup.add(key));

    function createObjectsFromMapObjects(layerName, _this) {
      const objects = map.createFromObjects(layerName, {
        classType: Phaser.Physics.Arcade.Sprite,
      });
      const objectGroup = _this.physics.add.group();
      objects.forEach((el) => objectGroup.add(el));
      return objectGroup;
    }

    this.cutSceneTriggerGroup = createObjectsFromMapObjects(
      "TriggerCutScenesLayer",
      this
    );
    this.pushableObjectsGroup = createObjectsFromMapObjects(
      "PushableObjectsLayer",
      this
    );
    this.keyGroup = createObjectsFromMapObjects("KeyLayer", this);
    this.doorGroup = createObjectsFromMapObjects("DoorLayer", this);

    this.backgroundLayer.setCollisionByProperty({ noFloor: true });
    this.wallLayer.setCollisionByProperty({ collision: true });
    this.objectLayer.setCollisionByProperty({ collision: true });
    this.objectLayer.depth = 1;
    // this.wallLayer.setCollisionFromCollisionGroup(true, true);
    // this.wallLayer.renderDebug(this.add.graphics());

    // for (let i = 0 ; i<105; i++) console.log(tileset.getTileCollisionGroup(i));

    const collisionRect = new Phaser.Geom.Rectangle();

    // let gidMapEntries = this.wallLayer.tileset[0].getTileData(0);
    //
    // for (const el of gidMapEntries) console.log(el[1]);

    map.setBaseTileSize(64, 64);

    this.createWinningZones();
    this.createBlockingObjects(map);
    this.createPlayer();
    this.createCursor();
    this.createSock();
    this.createButtons();

    this.physics.add.collider(this.player, this.pushableObjectsGroup);
    this.physics.add.collider(
      this.pushableObjectsGroup,
      this.objectLayer,
      (pushableObject, object) => {
        this.player.setVelocity(0);
        itemConnected = true;
        pushableObject.tint = 0xeddc32;
        pushableObject.setPushable(false);
        console.log("=>(Game.vue:523) object", object);
        object.tint = 0xeddc32;

        this.doorGroup.children.entries.forEach(
          (entry) =>
            entry.data?.list?.removeEvent === this.getActiveLevel().number &&
            entry.disableBody(true, true)
        );
        this.getActiveLevel();
      },
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.keyGroup,
      this.collectKey,
      null,
      this
    );

    this.physics.add.collider(
      this.player,
      this.cutSceneTriggerGroup,
      this.triggerCutscene,
      null,
      this
    );

    this.scoreText = this.add.text(700, 50, "Score: " + this.score, {
      fontSize: "32px",
      fill: "#fff",
    });
    this.scoreText.setVisible(true).setScrollFactor(0);

    // TODO overlap winning points

    console.log(this.winningPointLayer);

    this.physics.add.overlap(
      this.player,
      this.backgroundLayer,
      fallingDown,
      null,
      this
    );
    let tween;

    function fallingDown(sprite, tile) {
      if (tile.properties && tile.properties.noFloor && tween === undefined) {
        console.log("fallingDown");
        const scene = this.scene;
        tween = this.tweens.addCounter({
          from: 100,
          to: 0,
          duration: 800,
          onUpdate: function (from, target) {
            sprite.setScale(target.value / 100);
            sprite.setMaxVelocity(target.value);
          },
          onComplete: () => {
            scene.restart();
          },
        });
      } else {
        return null;
      }
    }

    this.physics.add.collider(this.player, this.wallLayer);

    // this.physics.add.overlap(
    //   this.player,
    //   this.wallLayer,
    //   fallingDown,
    //   null,
    //   this
    // );

    this.physics.add.collider(this.player, this.objectLayer);

    this.statusText = this.add.text(
      16,
      50,
      "Speed: " + this.player.velocity + "Angle: " + this.player.body.rotation,
      {
        fontSize: "16px",
        fill: "#fff",
      }
    );
    this.statusText.setVisible(true).setScrollFactor(0).setDepth(2);

    this.gfx = this.add.graphics();
    // this.bombs = this.physics.add.group();

    // this.physics.add.collider(this.bombs, this.platforms);
    // this.physics.add.collider(this.player, this.bombs);

    // this.physics.add.collider(stars, platforms);

    this.physics.world.on("worldbounds", (body) => {
      this.collided = true;
    });

    this.graphic = this.add.graphics({ lineStyle: { color: 0x00ffff } });
    this.graphic.setVisible(false);

    this.scanGfx = this.add.graphics({
      fillStyle: {
        color: 0x00ffff,
        alpha: 0.5,
      },
    });
    this.scanGfx.setVisible(true);
    this.scanLine = new Phaser.Geom.Line(
      this.player.x,
      this.player.y,
      objectToScanFor?.x,
      objectToScanFor?.y
    );

    this.scanLineRot = new Phaser.Geom.Line(
      this.player.x,
      this.player.y,
      300,
      100
    );

    this.scanLineGfx = this.add.graphics({
      fillStyle: {
        color: 0x00ffff,
        alpha: 0.5,
      },
    });
    this.scanLineGfx.setVisible(false);

    // this.testBlockRect = new Phaser.Geom.Rectangle(200, 50, 100, 200);
    this.scanCircle = new Phaser.Geom.Circle(300, 400, this.SCAN_DISTANCE);

    this.frameGraphics = this.add.graphics();
    this.frameColor = 0x00ff00; // Rahmenfarbe (Grün)
    this.blockingObjects = this.rectangles;

    this.collisionSound = this.sound.add("collision");
    this.backgroundSound = this.sound.add("backgroundSound");
    this.movingSound = this.sound.add("movingSound");
    // this.backgroundSound.setVolume(0.3).play();

    this.prepareLevel();
  }

  startDelayedBlockEvaluation() {
    intervalId = setInterval(
      () => this.executeCodeWithGenerator(this.player, this.isPreparingLevel),
      0
    );
  }

  // executeCodeWithGenerator(from, player, isPreparingLevel) {
  //   console.log("=>(Game.vue:1110643) isPreparingLevel", isPreparingLevel);
  //   let blockResult;
  //   if (blockFunction !== undefined) {
  //     if (blockResult?.done || isPreparingLevel === true) {
  //       console.log("=>(Game.vue:111646) isPreparingLevel", isPreparingLevel);
  //       //...
  //       console.log(
  //         "=>(Game.vue:11164656) clearInterval nIntervId",
  //         intervalId
  //       );
  //       clearInterval(intervalId);
  //       intervalId = null;
  //       setTimeout(() => {
  //         console.log("=>(Game.vue:1114) stop Block evaluation");
  //         player.setVelocityX(0);
  //         console.log("=>(Game.vue:1114) player", player);
  //         player.setVelocityY(0);
  //         blockFunction = undefined;
  //       }, 400);
  //       // release our intervalID from the variable
  //       this.resetDirection();
  //     } else {
  //       console.log("=>(Game.vue:111646) isPreparingLevel", isPreparingLevel);
  //       if (isPreparingLevel === false) {
  //         blockResult = blockFunction.next();
  //         console.log("=>(Game.vue:1107) ");
  //         if (blockResult.value !== undefined) {
  //           console.log(blockResult.value);
  //           blockResult.value;
  //         }
  //       }
  //     }
  //   }
  // }
  executeCodeWithGenerator(player, isPreparingLevel) {
    let blockResult = { done: false, value: undefined };

    if (blockFunction !== undefined) {
      if (!blockResult?.done && !isPreparingLevel) {
        if (player.body.velocity.x === 0 && player.body.velocity.y === 0) {
        console.log("=>(Game.vue:751) next");
          blockResult = blockFunction.next();
        score++;
        }
      }
      if (blockResult?.done || isPreparingLevel) {
        clearInterval(intervalId);
        console.log("=>(Game.vue:755) intervalId", intervalId);

        intervalId = null;
        console.log("=>(Game.vue:755) intervalId", intervalId);

        setTimeout(() => {
          player.setVelocity(0);
          blockFunction = undefined;
        }, 390); //390 um delay auszugleichen
        // this.resetDirection();
      }
    }
  }

  triggerCutscene(player, triggerPoint) {
    directionPlayer1.up.isClear = false;
    // this.scene.isPaused();
    this.scene.start(triggerPoint.data.list.cutSceneName);
  }

  createWinningZones() {
    this.winningPoints = this.physics.add.staticGroup();
    this.winningPointLayer.forEach((object) => {
      let obj = this.add.rectangle(
        object.x,
        object.y,
        object.width,
        object.height
      );
      obj.setOrigin(0);
      this.winningPoints.add(obj);
    });
  }

  //------------------------------------------------------------------------------------------------------------
  //-------CREATE FUNCTIONS

  createBlockingObjects(map) {
    this.rectangles = this.physics.add.staticGroup();
    this.createTileFrames(this.wallLayer);
  }

  createPlayer() {
    // this.player = this.physics.add.sprite(1664, 320, "bot").setScale(1.4);
    this.player = this.physics.add.sprite(
      gameConfig.width / 2,
      gameConfig.height / 2,
      "bot"
    );
    this.player2 = this.physics.add
      .sprite(0, 0, "bot")
      .setScale(1.4)
      .setAlpha(0.1)
      .setTint(0x006db2);

    this.add.particles(0, 0, "bomb", {
      angle: { min: 0, max: 360 },
      speed: 50,
      tint: "#ffffff",
      follow: this.player2,
      scale: 5,
      alpha: 0.02,
      blendMode: "DARKEN",
    });

    // particles.startFollow(this.player2,0,0,false);
    // particles.explode(10, this.player2.x, this.player2.y);
    // TODO set player mid to mid of tiles

    // this.player.body.bounce.set(1);
    this.player.body.setMaxSpeed(160);
    this.player.body.setCircle(20, 12, 28);
    // this.player.body.setSize(32, 30, 100, 20);
    this.player.setOffset(16, 32);

    this.player2.setCircle(20, 12, 28);

    // function detectCollisionDirection(_player, _platform) {
    //   return function (_player, _platform) {
    //     this.objectCollidedWith = _platform;
    //     this.collided = true;
    //     walkedBy = false;
    //     if (!_player.body.blocked.none) {
    //       if (_player.body.blocked.up) {
    //         // console.log("frontBlocked");
    //         // player.setY(player.y + 2);
    //         directionPlayer1.up.isClear = false;
    //         directionPlayer1.up.isMoving = false;
    //       } else if (_player.body.blocked.down) {
    //         // player.setY(player.y - 2);
    //         directionPlayer1.down.isClear = false;
    //         directionPlayer1.down.isMoving = false;
    //       } else if (_player.body.blocked.right) {
    //         // player.setX(player.x - 2);
    //         directionPlayer1.right.isClear = false;
    //         directionPlayer1.right.isMoving = false;
    //       } else {
    //         // player.setX(player.x + 2);
    //         directionPlayer1.left.isClear = false;
    //         directionPlayer1.left.isMoving = false;
    //       }
    //       // this.player.setVelocityX(0);
    //       // this.player.setVelocityY(0);
    //     }
    //   };
    // }

    this.physics.add.collider(this.player2, this.rectangles);

    this.physics.add.collider(
      this.player,
      this.winningPoints,
      (sprite, rect) => {
        this.detectCollisionDirection(sprite, rect);
        this.checkForWin();
      },
      null,
      this
    );

    this.physics.add.collider(
      this.player,
      this.rectangles,
      this.detectCollisionDirection(),
      this.processCallback
    );

    this.player.setCollideWorldBounds(true);
    this.player.body.onWorldBounds = true;

    function createPlayerAnimation() {
      this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("bot", {
          start: 24,
          end: 29,
        }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: "turnToFront",
        frames: this.anims.generateFrameNumbers("bot", { frames: [0] }),
        frameRate: 10,
      });

      this.anims.create({
        key: "turnToSide",
        frames: this.anims.generateFrameNumbers("bot", { start: 0, end: 2 }),
        frameRate: 10,
        repeat: 0,
      });

      this.anims.create({
        key: "leftToRight",
        frames: this.anims.generateFrameNumbers("bot", {
          frames: [6, 7, 0, 1, 2],
        }),
        frameRate: 10,
        repeat: 0,
      });

      this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("bot", {
          start: 24,
          end: 29,
        }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: "up",
        frames: this.anims.generateFrameNumbers("bot", {
          start: 32,
          end: 37,
        }),
        frameRate: 5,
        repeat: -1,
      });

      this.anims.create({
        key: "down",
        frames: this.anims.generateFrameNumbers("bot", { start: 8, end: 13 }),
        frameRate: 2,
        repeat: -1,
      });

      this.anims.create({
        key: "leftToUp",
        frames: this.anims.generateFrameNumbers("bot", { start: 6, end: 4 }),
        frameRate: 10,
        repeat: 0,
      });

      this.anims.create({
        key: "rightToUp",
        frames: this.anims.generateFrameNumbers("bot", { start: 2, end: 4 }),
        frameRate: 10,
        repeat: 0,
      });

      this.anims.create({
        key: "downToUp",
        frames: this.anims.generateFrameNumbers("bot", { start: 0, end: 4 }),
        frameRate: 20,
        repeat: 0,
      });

      this.anims.create({
        key: "upToDown",
        frames: this.anims.generateFrameNumbers("bot", { start: 4, end: 0 }),
        frameRate: 20,
        repeat: 0,
      });

      this.anims.create({
        key: "upToRight",
        frames: this.anims.generateFrameNumbers("bot", { start: 4, end: 2 }),
        frameRate: 10,
        repeat: 0,
      });

      this.anims.create({
        key: "leftToDown",
        frames: this.anims.generateFrameNumbers("bot", { frames: [6, 7, 0] }),
        frameRate: 10,
        repeat: 0,
      });

      this.anims.create({
        key: "rightToDown",
        frames: this.anims.generateFrameNumbers("bot", { start: 2, end: 0 }),
        frameRate: 10,
        repeat: 0,
      });
    }

    createPlayerAnimation.call(this);
  }

  detectCollisionDirection() {
    return (_player, _rectangles) => {
      this.objectCollidedWith = _rectangles;
      console.log(
        "=>(Game.vue:569) this.objectCollidedWith",
        this.objectCollidedWith
      );
      this.collided = true;
      walkedBy = false;
      if (!_player.body.blocked.none) {
        if (!this.collisionSound.isPlaying) {
          console.log("=>(Game.vue:620) movePl");
          this.collisionSound.play();
        }

        if (_player.body.blocked.up) {
          console.log("=>(Game.vue:808) frontBlocked");
          // player.setY(player.y + 2);
          _player.setVelocity(0);
          directionPlayer1.up.isClear = false;
          directionPlayer1.up.isMoving = false;
        } else if (_player.body.blocked.down) {
          // player.setY(player.y - 2);
          directionPlayer1.down.isClear = false;
          directionPlayer1.down.isMoving = false;
        } else if (_player.body.blocked.right) {
          // player.setX(player.x - 2);
          directionPlayer1.right.isClear = false;
          directionPlayer1.right.isMoving = false;
        } else {
          // player.setX(player.x + 2);
          directionPlayer1.left.isClear = false;
          directionPlayer1.left.isMoving = false;
        }
        // this.player.setVelocityX(0);
        // this.player.setVelocityY(0);
      }
    };
  }

  createCursor() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  createSock() {
    itemSock = this.physics.add.sprite(500, 2250, "star");
    // itemSock.setTint(0x006db2);
    itemSock.setScale(0.4);

    this.physics.add.overlap(
      this.player,
      itemSock,
      this.collectStar,
      null,
      this
    );
  }

  createButtons() {
    this.button = this.add.text(40, 600, "Back to Menu");
    this.buttonUp = this.add.text(600, 400, "Increase Score");
    this.buttonScan = this.add.text(600, 450, "Scan For Star");
    this.button.setInteractive();
    this.buttonUp.setInteractive().setVisible(false);
    this.buttonScan.setInteractive().setVisible(true);
    this.button
      .on("pointerover", () => this.button.setStyle({ fill: "#006db2" }))
      .on("pointerout", () => this.button.setStyle({ fill: "#fff" }))
      .on("pointerdown", () => this.scene.start("PreloadScene"));

    // this.buttonScan.on("pointerdown", () => {
    //   objectToScanFor = itemSock;
    //   if (this.scannedObject) {
    //     if (this.checkIfObjectBlocksViewline(this.blockingObjects)) {
    //       // console.log("not in view");
    //       this.scanLineGfx.setVisible(false);
    //     } else {
    //       this.scanLineGfx.setVisible(true);
    //     }
    //   }
    // });

    this.buttonUp.on("pointerdown", () => {
      this.score += 10;
      this.scoreText.setText("Score: " + score);
      console.log(this.player);
    });
  }

  createTileFrames(mapLayer) {
    let map = mapLayer.tilemap;
    let tileWidth = map.tileWidth;
    let tileHeight = map.tileHeight;
    mapLayer.forEachTile(function (tile) {
      let tileWorldPos = mapLayer.tileToWorldXY(tile.x, tile.y);
      if (tile.properties.collision) {
        let rectangle = new Phaser.GameObjects.Rectangle(
          this,
          tileWorldPos.x + tileWidth / 2,
          tileWorldPos.y + tileHeight / 2,
          tileWidth,
          tileHeight
        );
        this.rectangles.add(rectangle);
      }
    }, this);
  }

  checkIfObjectBlocksViewline(gameObject) {
    if (gameObject.isParent) {
      let intersects = gameObject
        .getChildren()
        .every(
          (element) =>
            Phaser.Geom.Intersects.LineToRectangle(
              this.scanLine,
              element.body
            ) === false
        );
      return !intersects;
    }
  }

  processCallback(obj1, obj2) {
    //  This function can perform your own additional checks on the 2 objects that collided.
    //  For example, you could test for velocity, health, etc.
    //  This function needs to return either true or false. If it returns true then collision carries on (separating the two objects).
    //  If it returns false the collision is assumed to have failed and aborts, no further checks or separation happen.

    if (obj1.body) {
      return true;
    } else {
      return false;
    }
  }

  prepareLevel() {
    this.isPreparingLevel = true;
    // this.player.setVelocity(0);

    this.cameras.main.fadeOut(800, 0, 0, 0);
    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      () => {
        this.loadLevelCoordinates();
        this.player.setScale(1);
        this.getItemKeyForActiveLevel();
        this.resetDirection();

        this.cameras.main.fadeIn(800);
      }
    );
    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE,
      () => (this.isPreparingLevel = false)
    );
    console.log("=>(Game.vue:823) prepareLevel");
  }

  getItemKeyForActiveLevel() {
    console.log("=>(Game.vue:1142) this.keyGroup", this.keyGroup);
    itemKey = this.keyGroup.children.entries.find(
      (keyItem) =>
        keyItem.data?.list?.keyForLevel === this.getActiveLevel().number
    );
    console.log("=>(Game.vue:1143) itemKey", itemKey);
  }

  getActiveLevel() {
    return this.levels.find((level) => level.isActive);
  }
  loadLevelCoordinates() {
    console.log("=>(Game.vue:837) loadLevelCoordinates");
    let x;
    let y;
    this.levels.map((level) => {
      // TODO selectedGameLevel is a string not number
      level.number === parseInt(selectedGameLevel)
        ? (level.isActive = true) && (x = level.x) && (y = level.y)
        : (level.isActive = false);
    });
    this.cam = this.cameras.main;
    this.cam.setBounds(
      x * this.tileWidth,
      y * this.tileHeight,
      gameConfig.width,
      gameConfig.height
    );
    this.physics.world.setBounds(
      x * this.tileWidth - this.tileWidth, // bounds are one tile bigger than camera to trigger falling near bounds
      y * this.tileHeight - this.tileHeight,
      gameConfig.width + this.tileWidth * 2,
      gameConfig.height + this.tileHeight * 2
    );
    this.levels.forEach((level) => {
      level.isActive &&
        this.player.setPosition(
          level.playerStart.x * this.tileWidth + this.tileWidth / 2,
          level.playerStart.y * this.tileHeight + this.tileHeight / 2
        );
    });
  }

  pushObject(player, object) {
    console.log("=>(Game.vue:1143) player", player);
    // if (itemConnected) {
    //   object.setVelocity(0);
    // } else {
    // object.body.velocity = player.body.velocity;
    // }
  }

  collectKey(player, key) {
    if (Math.abs(player.x - key.x) < 5 && Math.abs(player.y - key.y) < 5) {
      key.disableBody(true, true);
      objectCollected = true;
      this.player.setVelocity(0);
      collectedItems.push(key);
    }
    // this.resetDirection();
    // this.player.setAcceleration(0);
    // console.log("=>(Game.vue:1025) collectKey objectToScan");
  }

  collectStar(player, star) {
    star.disableBody(true, true);
    this.cameras.main.fadeOut(3000, 0, 0, 0);
    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      (cam, effect) => {
        this.time.delayedCall(2000, () => {
          this.scene.start("CutSceneFirstSock");
        });
      }
    );
    objectCollected = true;
    this.physics.pause();
    this.scoreText.setVisible(true);
  }

  checkForWin(sprite, object) {
    // const activeLevel = this.getActiveLevel();
    this.updateLevels(this.getActiveLevel().number + 1);
    console.log("=>(Game.vue:916) level finished");
  }

  // resetMovement() {
  //   directionPlayer1.right.isMoving = false;
  //   directionPlayer1.left.isMoving = false;
  //   directionPlayer1.up.isMoving = false;
  //   directionPlayer1.down.isMoving = false;
  //   directionPlayer1.toObject.isMoving = false;
  // }

  // TODO reset isClear when turning away
  resetDirection() {
    if (Object.keys(directionPlayer1).length > 0) {
      console.log(directionPlayer1);
      directionPlayer1.right.isClear = true;
      directionPlayer1.right.isMoving = false;
      directionPlayer1.left.isClear = true;
      directionPlayer1.left.isMoving = false;
      directionPlayer1.up.isClear = true;
      directionPlayer1.up.isMoving = false;
      directionPlayer1.down.isClear = true;
      directionPlayer1.down.isMoving = false;
      directionPlayer1.toObject.isClear = false;
      directionPlayer1.toObject.isMoving = false;
      // socket.emit("directionSelf", directionPlayer1)
    }
  }

  playBackgroundSound(volume) {
    if (!this.backgroundSound.isPlaying) {
      this.backgroundSound.setVolume(volume).play();
    }
    this.backgroundSound.setVolume(volume);
  }

  movePlayerRight() {
    console.log("=>(Game.vue:1139) movePlayerRight");

    if (this.player.body.velocity.x <= 0) {
      this.player.setVelocity(0);
      this.player.setVelocityX(160);
      this.rotation = this.ROTATION_RIGHT;

      this.time.delayedCall(
        400,
        function () {
          // Delay of 400 by a velocity of 160 means a movement of 64 pixels (our tile size)
          this.player.setVelocityX(0);
          console.log("Bewegung abgeschlossen!");
        },
        [],
        this
      );
    }
  }
  movePlayerLeft() {
    if (this.player.body.velocity.x >= 0) {
      this.player.setVelocity(0);
      this.player.setVelocityX(-160);
      this.rotation = this.ROTATION_LEFT;

      this.time.delayedCall(
          400,
          function () {
            this.player.setVelocityX(0);
            console.log("Bewegung abgeschlossen!");
          },
          [],
          this
      );
    }
  }

  movePlayerUp() {
    console.log("=>(Game.vue:111473) movePlayerUp");
    if (this.player.body.velocity.y >= 0) {
      this.player.setVelocity(0);
      this.player.setVelocityY(-160);
      this.rotation = this.ROTATION_UP;

      this.time.delayedCall(
          400,
          function () {
            this.player.setVelocityY(0);
            console.log("Bewegung abgeschlossen!");
          },
          [],
          this
      );
    }
  }

  movePlayerDown() {
    if (this.player.body.velocity.y <= 0) {
      this.player.setVelocity(0);
      this.player.setVelocityY(160);
      this.rotation = this.ROTATION_DOWN;

      this.time.delayedCall(
          400,
          function () {
            this.player.setVelocityY(0);
            console.log("Bewegung abgeschlossen!");
          },
          [],
          this
      );
    }
  }

  movePlayerToObject() {
    if (directionPlayer1.toObject.isClear) {
      // TODO calculate angle for velocityX,Y to move to object

      // this.resetDirection();
      console.log("=>(Game.vue:1388) movePlayerToObject");
      // this.physics.accelerateToObject(player, objectToScanFor, 4000, 100, 100);
      // this.physics.accelerateToObject(player, objectToScanFor);
      this.player.setVelocityX(160);
      this.time.delayedCall(
          400,
          function () {
            this.player.setVelocity(0);
            console.log("Bewegung abgeschlossen!");
          },
          [],
          this
      );
    }
  }

  stopPlayer() {
    this.player.setVelocity(0);
  }

  // TODO Levelcheck for socket packages
  update() {
    if (selectedGameLevel === "Level 1") {
      // console.log(this.player.x + '  ' + this.player.y);
    }

    var tile = this.wallLayer.getTileAtWorldXY(
      this.player.x,
      this.player.y,
      true
    );
    if (tile && tile.properties.slowingDown) {
      // slow down the player
      // this.player.setVelocity(this.player.body.velocity.x * 0.5, this.player.body.velocity.y * 0.5);
      this.player.setMaxVelocity(80);
    } else {
      this.player.setMaxVelocity(160);
    }
    if (!this.isPreparingLevel) {
      sendDirectionToSocket();
    }

    if (Object.entries(state.directionOpponent).length > 0) {
      directionPlayer2 = toRaw(state.directionOpponent);
    }
    if (Object.entries(state.directionSelf).length > 0) {
      directionPlayer1 = toRaw(state.directionSelf);
    }

    player2XY = toRaw(state.playerPosition);
    this.player2.setX(player2XY.x);
    this.player2.setY(player2XY.y);
    playerPosition.x = this.player.x;
    playerPosition.y = this.player.y;
    socket.emit("playerXY", {
      roomId: state.roomID,
      playerPosition: playerPosition,
    });
    if (this.scannedObject) {
      if (this.checkIfObjectBlocksViewline(this.blockingObjects)) {
        // console.log("not in view");
        this.scanLineGfx.setVisible(false);
        this.objectSighted = false;
        directionPlayer1.toObject.isClear = false;
      } else {
        this.scanLineGfx.setVisible(true);
        this.objectSighted = true;
        directionPlayer1.toObject.isClear = true;
      }
    } else {
      this.objectSighted = false;
    }

    // let lastBlock;
    // for (const block of gen) {
    //     console.log("Next block: " + block);
    //     lastBlock = block;
    // }
    // directionPlayer1 = lastBlock;
    // console.log(this.directionPlayer1 + playGame);

    // TODO test if the delayed version works
    // if (blockFunction !== undefined) {
    //   var blockResult = blockFunction.next();
    //   console.log("=>(Game.vue:1107) next");
    //   if (blockResult.value !== undefined) {
    //     console.log(blockResult.value);
    //     blockResult.value;
    //   }
    //   if (blockResult.done || this.isPreparingLevel) {
    //     //...
    //     console.log("=>(Game.vue:1114) stop Block evaluation");
    //     blockFunction = undefined;
    //     this.resetDirection();
    //   }
    // }

    // var tile = wallLayer.getTileAtWorldXY(this.player.x, this.player.y, true);
    // // console.log(this.player.x + '  ' + this.player.y);
    // if (tile && tile.properties.slowingDown) {
    //     // slow down the player
    //     this.player.setVelocity(this.player.body.velocity.x * 0.5, this.player.body.velocity.y * 0.5);
    // }

    if (!this.scannedObject) {
      this.scanLineGfx.setVisible(true);
    }
    this.scanCircle.setPosition(this.player.x, this.player.y);
    this.scanLine.setTo(
      this.player.x,
      this.player.y,
      objectToScanFor?.x,
      objectToScanFor?.y
    );
    this.scanAngle -= 0.04;
    Phaser.Geom.Line.SetToAngle(
      this.scanLineRot,
      this.player.x,
      this.player.y,
      this.scanAngle,
      200
    );
    if (
      Phaser.Geom.Intersects.LineToRectangle(this.scanLineRot, itemSock) &&
      this.scannedObject
    ) {
      this.objectSighted = true;
      directionPlayer1.toObject.isClear = true;
    }

    this.scanGfx
      .clear()
      .strokeCircleShape(this.scanCircle)
      .strokeLineShape(this.scanLineRot);

    this.scanLineGfx.clear().strokeLineShape(this.scanLine);

    if (objectToScanFor) {
      if (
        Phaser.Geom.Intersects.CircleToRectangle(
          this.scanCircle,
          objectToScanFor
        )
      ) {
        this.scannedObject = true;
        this.scanGfx.lineStyle(2, 0xff0000);
      } else {
        this.scannedObject = false;
      }
    }

    let distCheb;
    let distClosest;
    let hypot;
    if (this.player.active) {
      if (this.objectCollidedWith?.active) {
        distCheb = Phaser.Math.RoundTo(
          Phaser.Math.Distance.Chebyshev(
            this.player.x,
            this.player.y,
            this.objectCollidedWith.x,
            this.objectCollidedWith.y
          ),
          0
        );
        // console.log(distCheb);

        distClosest = Phaser.Math.RoundTo(
          Phaser.Math.Distance.BetweenPoints(
            this.player,
            this.objectCollidedWith
          ),
          0
        );
        hypot = Math.hypot(
          this.player.body.halfHeight + this.objectCollidedWith.body.halfHeight,
          this.player.body.halfWidth + this.objectCollidedWith.body.halfWidth
        );

        // console.log(distClosest);
        // if (distClosest < Phaser.Math.Distance.Between(closest.x, closest.y, (closest.body.position.x + 1), (closest.body.position.y + 1))) {
        if (distClosest > hypot) {
          console.log("=>(Game.vue:1526) distClosest", distClosest);
          // console.log("clear");
          directionPlayer1.left.isClear = true;
          directionPlayer1.right.isClear = true;
          directionPlayer1.down.isClear = true;
          directionPlayer1.up.isClear = true;
          if (
            this.player.body.x - this.player.body.prev.x !== 0 &&
            (this.rotation === 0 || this.rotation === 180)
          ) {
            walkedBy = true;
            this.player.setVelocity(0);
            this.objectCollidedWith = null;
          } else if (
            this.player.body.y - this.player.body.prev.y !== 0 &&
            (this.rotation === 90 || this.rotation === -90)
          ) {
            walkedBy = true;
            this.player.setVelocity(0);
            this.objectCollidedWith = null;
          }
          // this.physics.accelerateToObject(player, itemSock, 4000);
        }

        this.graphic
          .clear()
          .strokeCircle(this.player.x, this.player.y, distClosest)
          .strokeRect(
            this.player.x - distCheb,
            this.player.y - distCheb,
            2 * distCheb,
            2 * distCheb
          );

        this.gfx
          .clear()
          .lineStyle(2, 0xff3300)
          .lineBetween(
            this.objectCollidedWith?.x,
            this.objectCollidedWith?.y,
            this.player.x,
            this.player.y
          );
      }
      // this.statusText.setText('  right clear: ' + directionPlayer1.right.isClear + ' Object sighted: ' + this.objectSighted + '\n distClosest: ' + distClosest + ' hypot: ' + hypot + ' body.angle: ' + this.player.body.angle + '\nwalkedBy: ' + walkedBy + '\nx: ' + this.player.body.prev.x + ' collided:' + this.collided);

      this.scoreText.setText("Score: " + score);

      if (Object.keys(directionPlayer1).length > 0) {
        this.statusText.setText(
          "right clear: " +
            directionPlayer1.right.isClear +
            "\n moving right: " +
            directionPlayer1.right.isMoving +
            "\nobject collected: " +
            objectCollected +
            " body.angle: " +
            this.player.body.angle +
            "\nwalkedBy: " +
            walkedBy +
            "\nx: " +
            this.player.body.prev.x +
            " collided:" +
            this.collided +
            "\nobjectSighted: " +
            directionPlayer1.toObject.isClear +
            "\nmoveToObject: " +
            directionPlayer1.toObject.isMoving +
            "\nplayerVelocity Y: " +
            this.player.body.velocity.y +
            "\nplayerVelocity x: " +
            this.player.body.velocity.x +
            "\nisPreparingLevel: " +
            this.isPreparingLevel
        );
      }
    }

    if (this.cursors.space.isDown) {
      this.physics.pause();
      this.objectCollidedWith = null;
      this.scene.restart();
    }

    if (Object.keys(directionPlayer1).length > 0) {
      this.movePlayer(this.player, directionPlayer1);
      this.movePlayer(this.player2, directionPlayer2);
    }
  }

  movePlayer(player, dir) {
    if (this.rotation === this.ROTATION_LEFT) {
      player.flipX = true;
      player.anims.playAfterRepeat("left");
    } else if (this.rotation === this.ROTATION_RIGHT) {
      player.flipX = false;
      player.anims.playAfterRepeat("right");
    } else if (this.rotation === this.ROTATION_UP) {
      player.flipX = false;
      player.anims.playAfterRepeat("up");
    } else if (this.rotation === this.ROTATION_DOWN) {
      player.flipX = false;
      player.anims.playAfterRepeat("down");
    }

    if (this.cursors.left.isDown || dir.left.isMoving) {
      if (this.rotation !== this.ROTATION_LEFT) {
        player.anims.play("turnToSide", true);
      }
      this.rotation = this.ROTATION_LEFT;
      this.movePlayerLeft();
      // player.setVelocityX(-160);
      // player.setVelocityY(0);
      // this.resetDirection();
    } else if (this.cursors.right.isDown || dir.right.isMoving) {
      if (this.rotation !== this.ROTATION_RIGHT) {
        if (this.rotation === this.ROTATION_LEFT) {
          player.anims.play("leftToRight");
        } else if (this.rotation === this.ROTATION_UP) {
          player.anims.play("upToRight");
        } else if (this.rotation === this.ROTATION_DOWN) {
          player.anims.play("turnToSide");
        }
      }
      this.rotation = this.ROTATION_RIGHT;
      this.movingSound.setVolume(0).play();
      this.movePlayerRight();
      // player.setVelocityX(160);
      // player.setVelocityY(0);
      // this.resetDirection();
    } else if (this.cursors.up.isDown || dir.up.isMoving) {
      if (this.rotation !== this.ROTATION_UP) {
        if (this.rotation === this.ROTATION_LEFT) {
          player.anims.play("leftToUp");
        } else if (this.rotation === this.ROTATION_RIGHT) {
          player.anims.play("rightToUp");
        } else if (this.rotation === this.ROTATION_DOWN) {
          player.anims.play("downToUp");
        }
      }
      this.rotation = this.ROTATION_UP;
      this.movePlayerUp();
      // this.resetDirection();
    } else if (this.cursors.down.isDown || dir.down.isMoving) {
      if (this.rotation !== this.ROTATION_DOWN) {
        if (this.rotation === this.ROTATION_LEFT) {
          player.anims.play("leftToDown");
        } else if (this.rotation === this.ROTATION_RIGHT) {
          player.anims.play("rightToDown");
        } else if (this.rotation === this.ROTATION_UP) {
          player.anims.play("upToDown");
        }
      }
      this.rotation = this.ROTATION_DOWN;
      this.movePlayerDown();
      // this.resetDirection();
    } else {
      // player.setVelocityY(0);
    }
    // playGame = false;
    if (dir.toObject.isClear && dir.toObject.isMoving) {
      // TODO check if it could bug
      this.resetDirection();
      console.log("=>(Game.vue:1388) objectToScanFor");
      // this.physics.accelerateToObject(player, objectToScanFor, 4000, 100, 100);
      // this.physics.accelerateToObject(player, objectToScanFor);
      player.setVelocityX(160);
    }
  }
}

// export { GameScene };
</script>

<style>
.game-container > canvas {
  width: 100%;
}

.highlighted {
  filter: drop-shadow(0 0 0.5rem crimson);
}
</style>
