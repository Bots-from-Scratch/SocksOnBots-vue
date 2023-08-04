import { leaveRoom, state } from "@/socket";
import tileset from "@/assets/CosmicLilac_Tiles_64x64-cd3.png";
import platform from "@/assets/platform.png";
import star from "@/assets/socke.png";
import bomb from "@/game/assets/bomb.png";
import botSpritesheet from "@/assets/animation.png";
import botAnimationJson from "@/assets/animation.json";
import bot_with_sock from "@/assets/Spritesheet.png";
import world from "@/assets/BotsonsocksBIG.json";
import Phaser, { Scene } from "phaser";
import PlayerController, { maxSpeed } from "@/game/states/PlayerController";
import { toRaw } from "vue";
import collisionSound from "@/assets/sounds/HIT/HIT3.mp3";
import collectStarSound from "@/assets/sounds/PUNKTE/POINT2.mp3";
import collectKeySound from "@/assets/sounds/PUNKTE/POINT3.mp3";
import bgSound from "@/assets/sounds/AdhesiveWombat - 8 Bit Adventure.mp3";
import movingSound from "@/assets/sounds/Fahrgeräusche_dumpf.mp3";
import doorSound from "@/assets/sounds/Door/doorsound.mp3";
import movingObjectSound from "@/assets/sounds/movingobject.mp3";

let directionPlayer1 = {
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
let blockFunction;
let pushObject = true;
let slowDownTimer;
/** @type {PlayerController} */
let playerController;

export class GameScene extends Scene {
  SCAN_DISTANCE = 200;

  init() {
    state.activeScene = this.scene.key;
    blockFunction = null;
    itemConnected = false;
    objectToScanFor = null;
    collectedItems = [];
    this.resetDirection();

    score = 0;

    walkedBy = false;
    objectCollected = false;
    this.value;
    this.collided = false;

    this.rightIsClear = true;
    this.leftIsClear = true;
    this.upIsClear = true;
    this.downIsClear = true;

    this.objectIsScanned = false;
    this.objectCollidedWith = {};
    objectToScanFor = undefined;
    this.objectIsInSight = false;
    this.scanAngle = 0;
    this.itemCollected = false;
    this.levelWon = false;
    this.isPausingCodeExecution = false;
  }

  preload() {
    this.load.spritesheet("tileset", tileset, {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.image("ground", platform);
    this.load.image("star", star);
    this.load.image("bomb", bomb);
    this.load.aseprite("bot", botSpritesheet, botAnimationJson);

    this.load.spritesheet("bot_with_sock", bot_with_sock, {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.tilemapTiledJSON("map", world);
    this.load.audio("collision", collisionSound);
    this.load.audio("backgroundSound", bgSound);
    this.load.audio("movingSound", movingSound);
    this.load.audio("collectStarSound", collectStarSound);
    this.load.audio("collectKeySound", collectKeySound);
    this.load.audio("doorSound", doorSound);
    this.load.audio("movingObjectSound", movingObjectSound);
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

    function createObjectsFromMapObjects(layerName, _this, isStaticGroup) {
      const objects = map.createFromObjects(layerName, {
        classType: Phaser.Physics.Arcade.Sprite,
      });

      if (isStaticGroup) {
        const objectGroup = _this.physics.add.staticGroup();
        objects.forEach((el) => objectGroup.add(el));
        return objectGroup;
      } else {
        const objectGroup = _this.physics.add.group();
        objects.forEach((el) => objectGroup.add(el));
        return objectGroup;
      }
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
    this.doorGroup = createObjectsFromMapObjects("DoorLayer", this, true);

    this.backgroundLayer.setCollisionByProperty({ noFloor: true });
    this.wallLayer.setCollisionByProperty({ collision: true });
    this.objectLayer.setCollisionByProperty({ collision: true });
    this.objectLayer.depth = 1;

    this.cameras.main.setAlpha(0);

    map.setBaseTileSize(64, 64);

    this.createWinningZones();
    this.createBlockingObjects(map);
    this.createPlayer();
    this.createCursor();
    this.createSock();
    this.createButtons();

    playerController = new PlayerController(this.player);

    playerController.setState("idle");

    this.physics.add.overlap(
      this.player,
      this.keyGroup,
      this.collectKey,
      null,
      this
    );

    this.scoreText = this.add.text(700, 50, "Score: " + this.score, {
      fontSize: "32px",
      fill: "#fff",
      fontFamily: "Pixel",
    });
    this.scoreText.setVisible(false).setScrollFactor(0);

    // TODO overlap winning points


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

    this.statusText = this.add.text(
      16,
      50,
      "Speed: " + this.player.velocity + "Angle: " + this.player.body.rotation,
      {
        fontSize: "16px",
        fill: "#fff",
      }
    );
    this.statusText.setVisible(false).setScrollFactor(0).setDepth(2);

    this.gfx = this.add.graphics();

    // this.physics.world.on("worldbounds", (body) => {
    //   this.collided = true;
    // });

    this.graphic = this.add.graphics({ lineStyle: { color: 0x00ffff } });
    this.graphic.setVisible(false);

    this.scanGfx = this.add.graphics({
      fillStyle: {
        color: 0x00ffff,
        alpha: 0.5,
      },
    });
    this.scanGfx.setVisible(false);
    this.scanLine = new Phaser.Geom.Line(
      this.player.x,
      this.player.y,
      objectToScanFor?.x,
      objectToScanFor?.y
    );

    this.rotatingScanLine = new Phaser.Geom.Line(
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

    this.scanCircle = new Phaser.Geom.Circle(300, 400, this.SCAN_DISTANCE);

    this.createViewBlockingObjectGroup();

    this.collisionSound = this.sound.add("collision");
    this.backgroundSound = this.sound.add("backgroundSound");
    this.movingSound = this.sound.add("movingSound");
    this.collectStarSound = this.sound.add("collectStarSound");
    this.collectKeySound = this.sound.add("collectKeySound");
    this.doorSound = this.sound.add("doorSound");
    this.movingObjectSound = this.sound.add("movingObjectSound");

    this.prepareLevel(this.selectedGameLevel);
  }

  createViewBlockingObjectGroup() {
    this.viewBlockingObjects = this.rectangles;
  }

  createGeneratorFunction(code, highlightBlock, _this) {
    const blockGenerator = eval(`
            (function* () {
                ${code};
            })`);

    blockFunction = blockGenerator();

    this.startDelayedBlockEvaluation();
  }

  startDelayedBlockEvaluation() {
    intervalId = setInterval(
      () =>
        this.executeCodeWithGenerator(this.player, this.isPausingCodeExecution),
      0
    );
  }

  executeCodeWithGenerator(player, isPreparingLevel) {
    let blockResult;

    if (blockFunction !== undefined) {
      if (!blockResult?.done && !isPreparingLevel) {
        if (player.body.velocity.x === 0 && player.body.velocity.y === 0) {
          blockResult = blockFunction.next();
          score++;
        }
      }
      if (blockResult?.done || isPreparingLevel) {
        this.endBlockExecution(player);
      }
    }
  }

  endBlockExecution(player) {
    clearInterval(intervalId);
    intervalId = null;
    setTimeout(() => {
      player.setVelocity(0);
      blockFunction = undefined;
    }, 390); //390 um delay auszugleichen
  }

  triggerCutscene(player, triggerPoint) {
    directionPlayer1.up.isClear = false;
    // this.scene.isPaused();
    if (
      itemKey &&
      collectedItems.some(
        (item) => item?.data?.list.keyForLevel || item?.data?.list.sockForLevel
      )
    ) {
      this.scene.start(triggerPoint.data.list.cutSceneName);
    } else if (itemKey === undefined) {
      this.scene.start(triggerPoint.data.list.cutSceneName);
    }
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
    this.player = this.physics.add.sprite(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "bot"
    );
    this.anims.createFromAseprite("bot");

    this.player.body.setMaxSpeed(maxSpeed);
    this.player.body.setCircle(20, 12, 28);
    // this.player.body.setSize(32, 30, 100, 20);
    // this.player.setOffset(16, 32);

    this.player.setCollideWorldBounds(true);
    this.player.body.onWorldBounds = true;

    this.createCollider();
  }

  createCollider() {
    this.physics.add.collider(this.player, this.pushableObjectsGroup, () => {
      if (!itemConnected && !this.movingObjectSound.isPlaying) {
        this.movingObjectSound.play();
      }
    });

    this.physics.add.collider(
      this.pushableObjectsGroup,
      this.objectLayer,
      (pushableObject, object) => {
        this.player.setVelocity(0);
        this.movingObjectSound.stop();
        itemConnected = true;
        pushableObject.tint = 0xeddc32;
        pushableObject.setPushable(false);
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

    this.physics.add.collider(
      this.player,
      this.cutSceneTriggerGroup,
      this.triggerCutscene,
      null,
      this
    );

    this.physics.add.collider(
      this.player,
      this.doorGroup,
      (player, door) => door.setPushable(false),
      null,
      this
    );

    this.physics.add.collider(this.player, this.wallLayer);

    this.physics.add.collider(this.player, this.objectLayer);

    this.physics.add.collider(
      this.player,
      this.winningPoints,
      (sprite, rect) => {
        this.detectCollisionDirection(sprite, rect);
        sprite.x -= 1;
        sprite.y++;
        if (
          itemKey &&
          collectedItems.some(
            (item) =>
              item?.data?.list.keyForLevel || item?.data?.list.sockForLevel
          )
        ) {
          this.checkForWin();
        } else if (itemKey === undefined) {
          this.checkForWin();
        }
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
  }

  detectCollisionDirection() {
    return (_player, _rectangles) => {
      this.objectCollidedWith = _rectangles;
      this.collided = true;
      walkedBy = false;
      if (!_player.body.blocked.none) {
        if (!this.collisionSound.isPlaying) {
          this.collisionSound.play();
        }

        if (_player.body.blocked.up) {
          // _player.setY(_player.y + 2);
          // _player.setVelocity(0);
          directionPlayer1.up.isClear = false;
          directionPlayer1.up.isMoving = false;
        } else if (_player.body.blocked.down) {
          // TODO check setCoordinates for other directions
          // _player.setY(_player.y - 2);
          // _player.setVelocity(0);
          directionPlayer1.down.isClear = false;
          directionPlayer1.down.isMoving = false;
        } else if (_player.body.blocked.right) {
          // _player.setX(_player.x - 2);
          // _player.setVelocity(0);
          directionPlayer1.right.isClear = false;
          directionPlayer1.right.isMoving = false;
        } else {
          // _player.setX(_player.x + 2);
          // _player.setVelocity(0);
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
    itemSock = this.physics.add.sprite(420, 2180, "star");
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
    if (state.activeScene === "SingleplayerScene") {
      this.button = this.add
        .text(40, 600, "Zurück zum Menü")
        .setScrollFactor(0);
    } else if (state.activeScene === "MultiplayerScene") {
      this.button = this.add
        .text(40, 600, "Zurück zur Lobby")
        .setScrollFactor(0);
    }
    this.buttonUp = this.add.text(600, 400, "Increase Score");
    this.buttonScan = this.add.text(600, 450, "Scan For Star");
    this.button.setInteractive();
    this.buttonUp.setInteractive().setVisible(false);
    this.buttonScan.setInteractive().setVisible(false);
    this.button
      .on("pointerover", () => this.button.setStyle({ fill: "#006db2" }))
      .on("pointerout", () => this.button.setStyle({ fill: "#fff" }))
      .on("pointerup", () => {
        this.scene.start(
          state.activeScene === "SingleplayerScene"
            ? "MenuScene"
            : "LobbyMenuScene"
        );
        leaveRoom();
      });

    // this.buttonScan.on("pointerdown", () => {
    //   objectToScanFor = itemSock;
    //   if (this.objectIsScanned) {
    //     if (this.checkIfObjectBlocksViewline(this.viewBlockingObjects)) {
    //       // console.log("not in view");
    //       this.scanLineGfx.setVisible(false);
    //     } else {
    //       this.scanLineGfx.setVisible(true);
    //     }
    //   }
    // });

    this.buttonUp.on("pointerdown", () => {
      this.score += 10;
      this.scoreText.setText("Score: " + score).setVisible(false);
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

  prepareLevel(selectedLevel) {
    this.isPausingCodeExecution = true;
    this.cameras.main.fadeOut(800, 0, 0, 0);
    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      () => {
        this.setActiveLevel(selectedLevel);
        this.loadLevelCoordinates();
        this.player.setScale(1);
        playerController.setState("idle");
        this.getItemKeyForActiveLevel();
        this.resetDirection();
        this.init();
        this.cameras.main.setAlpha(1);
        this.cameras.main.fadeIn(800);
      }
    );
    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE,
      () => {
        this.isPausingCodeExecution = false;
      }
    );
  }

  getItemKeyForActiveLevel() {
    itemKey = this.keyGroup.children.entries.find(
      (keyItem) =>
        keyItem.data?.list?.keyForLevel === this.getActiveLevel().number ||
        keyItem.data?.list?.sockForLevel === this.getActiveLevel().number
    );
  }

  getActiveLevel() {
    return this.levels.find((level) => level.isActive);
  }

  setActiveLevel(selectedLevel) {
    this.getActiveLevel() && (this.getActiveLevel().isActive = false);
    this.selectedGameLevel = selectedLevel;
    let lvl = this.levels.find((level) => level.number === selectedLevel);
    lvl.isActive = true;
  }

  loadLevelCoordinates() {
    /**
     * @type { {
     *     number: number,
     *     name: string,
     *     x: number,
     *     y: number,
     *     isActive: boolean,
     *     playerStart: { "x": number, "y": number },
     *     text: string
     *   } } lvl
     */
    let lvl = this.getActiveLevel();
    this.cam = this.cameras.main;
    this.cam.setBounds(
      lvl.x * this.tileWidth,
      lvl.y * this.tileHeight,
      this.game.config.width,
      this.game.config.height
    );
    this.physics.world.setBounds(
      lvl.x * this.tileWidth - this.tileWidth, // bounds are one tile bigger than camera to trigger falling near bounds
      lvl.y * this.tileHeight - this.tileHeight,
      this.game.config.width + this.tileWidth * 2,
      this.game.config.height + this.tileHeight * 2
    );

    this.player.setPosition(
      lvl.playerStart.x * this.tileWidth + this.tileWidth / 2,
      lvl.playerStart.y * this.tileHeight + this.tileHeight / 2
    );
  }

  pushObject(player, object) {
    // if (itemConnected) {
    //   object.setVelocity(0);
    // } else {
    // object.body.velocity = player.body.velocity;
    // }
  }

  collectKey(player, key) {
    if (Math.abs(player.x - key.x) < 10 && Math.abs(player.y - key.y) < 10) {
      this.collectKeySound.play();
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
    this.collectStarSound.play();
    this.cameras.main.fadeOut(3000, 0, 0, 0);
    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      (cam, effect) => {
        this.time.delayedCall(2000, () => {
          this.scene.start("CutSceneFirstSock");
        });
      }
    );
    objectCollected = true;
    this.physics.pause();
    this.scoreText.setVisible(false);
  }

  checkForWin(sprite, object) {
    // this.updateLevels(this.getActiveLevel().number + 1);
    this.doorSound.play();
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

  checkIfTileIsSlowingDown() {
    var tile = this.wallLayer.getTileAtWorldXY(
      this.player.x,
      this.player.y,
      true
    );
    if (tile && tile.properties.slowingDown) {
      // slow down the player
      this.player.setMaxVelocity(maxSpeed / 2);
    } else {
      this.player.setMaxVelocity(maxSpeed);
    }
  }

  // TODO Levelcheck for socket packages
  update() {
    this.checkIfTileIsSlowingDown();

    // if (!this.isPausingCodeExecution) {
    //     sendDirectionToSocket();
    // }

    if (Object.entries(state.directionSelf).length > 0) {
      directionPlayer1 = toRaw(state.directionSelf);
    }

    this.checkForScannedObject();

    this.updateScanGraphics();

    this.checkIfObjectIsInScanDistance();

    let distClosest;
    let hypot;
    if (this.player.active) {
      if (this.objectCollidedWith?.active) {
        distClosest = this.calculateClosestDistanceToBlockingObject();

        hypot = this.calculateHypotenuseBetweenObjects(
          this.player,
          this.objectCollidedWith
        );

        this.checkIfPlayerWalkedAroundBlockingObjects(distClosest, hypot);

        this.drawLineBetweenPlayerAndBlockingObject();
      }

      this.updateTexts(distClosest);
    }

    if (this.cursors.space.isDown) {
      this.physics.pause();
      this.objectCollidedWith = null;
      this.backgroundSound.stop();
      this.scene.restart();
    }

    if (Object.keys(directionPlayer1).length > 0) {
      this.movePlayer(this.player, directionPlayer1);
    }
  }

  drawLineBetweenPlayerAndBlockingObject() {
    this.gfx
      .clear()
      .lineStyle(2, 0xff3300)
      .lineBetween(
        this.objectCollidedWith?.x,
        this.objectCollidedWith?.y,
        this.player.body.center.x,
        this.player.body.center.y
      );
  }

  checkIfPlayerWalkedAroundBlockingObjects(distClosest, hypot) {
    if (distClosest > hypot) {
      directionPlayer1.left.isClear = true;
      directionPlayer1.right.isClear = true;
      directionPlayer1.down.isClear = true;
      directionPlayer1.up.isClear = true;

      walkedBy = true;
      this.player.setVelocity(0);
      this.objectCollidedWith = null;
    }
  }

  calculateHypotenuseBetweenObjects(player, object) {
    return Math.hypot(
      player.body.halfHeight + object.body.halfHeight,
      player.body.halfWidth + object.body.halfWidth
    );
  }

  calculateClosestDistanceToBlockingObject() {
    return Phaser.Math.RoundTo(
      Phaser.Math.Distance.BetweenPoints(
        this.objectCollidedWith,
        this.player.body.center
      ),
      0
    );
  }

  checkIfObjectIsInScanDistance() {
    if (objectToScanFor) {
      if (
        Phaser.Geom.Intersects.CircleToRectangle(
          this.scanCircle,
          objectToScanFor
        )
      ) {
        this.objectIsScanned = true;
        this.scanGfx.lineStyle(2, 0xff0000);
      } else {
        this.objectIsScanned = false;
      }
    }
  }

  updateScanGraphics() {
    this.scanCircle.setPosition(
      this.player.body.center.x,
      this.player.body.center.y
    );
    this.scanLine.setTo(
      this.player.body.center.x,
      this.player.body.center.y,
      objectToScanFor?.x,
      objectToScanFor?.y
    );
    this.scanAngle -= 0.04;
    Phaser.Geom.Line.SetToAngle(
      this.rotatingScanLine,
      this.player.body.center.x,
      this.player.body.center.y,
      this.scanAngle,
      200
    );

    this.scanGfx
      .clear()
      .strokeCircleShape(this.scanCircle)
      .strokeLineShape(this.rotatingScanLine);

    this.scanLineGfx.clear().strokeLineShape(this.scanLine);
  }

  checkForScannedObject() {
    if (this.objectIsScanned) {
      if (this.checkIfObjectBlocksViewline(this.viewBlockingObjects)) {
        this.scanLineGfx.setVisible(false);
        this.objectIsInSight = false;
        directionPlayer1.toObject.isClear = false;
      } else {
        this.scanLineGfx.setVisible(false);
        this.objectIsInSight = true;
        directionPlayer1.toObject.isClear = true;
      }
    } else {
      this.objectIsInSight = false;
      this.scanLineGfx.setVisible(false);
    }
  }

  updateTexts(distClosest) {
    this.scoreText.setText("Score: " + score);

    if (Object.keys(directionPlayer1).length > 0) {
      this.statusText.setText(
        "down clear: " +
          directionPlayer1.down.isClear +
          "\n moving right: " +
          directionPlayer1.right.isMoving +
          "\nobject collected: " +
          objectCollected +
          "\nwalkedBy: " +
          walkedBy +
          "\nx: " +
          this.player.body.prev.x +
          " collided:" +
          this.collided +
          "\nobjectIsInSight: " +
          directionPlayer1.toObject.isClear +
          "\nmoveToObject: " +
          directionPlayer1.toObject.isMoving +
          "\nplayer.body.maxSpeed: " +
          this.player.body.maxSpeed +
          "\nplayerVelocity x: " +
          this.player.body.velocity.x +
          "\nplayerVelocity y: " +
          this.player.body.velocity.y +
          "\nisPreparingLevel: " +
          this.isPausingCodeExecution +
          "\ndistClosest: " +
          distClosest
      );
    }
  }

  movePlayer(player, dir) {
    if (this.cursors.left.isDown || dir.left.isMoving) {
      playerController.setState("moveLeft");
    } else if (this.cursors.right.isDown || dir.right.isMoving) {
      playerController.setState("moveRight");
    } else if (this.cursors.up.isDown || dir.up.isMoving) {
      playerController.setState("moveUp");
    } else if (this.cursors.down.isDown || dir.down.isMoving) {
      playerController.setState("moveDown");
    }
  }
}
