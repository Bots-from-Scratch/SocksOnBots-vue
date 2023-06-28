import {Scene} from 'phaser';
import platform from "@/assets/platform.png";
import star from "@/assets/socke.png";
import bomb from "@/assets/bomb.png";
import bot_sock from "@/assets/Spritesheetohnesocke.png"
import mapLevel1 from "@/assets/SocksOnBots_lvl_1.json";
import tileset from "@/assets/CosmicLilac_Tiles_64x64-cd3.png";

// import {code, playGame} from "./index";

class GameScene_Level_1 extends Scene {
    ROTATION_RIGHT = 0;
    ROTATION_LEFT = 180;
    ROTATION_UP = -90;
    ROTATION_DOWN = 90;
    SCAN_DISTANCE = 200;


    constructor() {
        super('GameScene_Level_1');

    }

    init() {

        this.level = 1;

        this.score = 0;

        this.walkedBy = false;

        this.value;
        // let codeFromBlock;
        // let blockList = [];
        //
        //
        // let gameTick = 0;
        // let blockListTmp;
        // let code;
        this.collided = false;

        this.rightIsClear = true;
        this.leftIsClear = true;
        this.upIsClear = true;
        this.downIsClear = true;

        this.scannedObject = false;
        this.objectCollidedWith = {};
        this.blockingObjects = undefined;
        this.objectToScanFor = undefined;
        this.objectSighted = false;
        this.scanAngle = 0;
    }

    preload() {
        // this.load.image('sky', sky);
        this.load.image('tileset', tileset);
        this.load.image('ground', platform);
        this.load.image('star', star);
        this.load.image('bomb', bomb);
        this.load.spritesheet('bot', bot_sock, {frameWidth: 64, frameHeight: 64});
        this.load.tilemapTiledJSON('map', mapLevel1);
    }

    create() {
        // this.add.image(400, 300, 'sky');
        this.map = this.make.tilemap({key: 'map'});


        this.tileset = this.map.addTilesetImage('CosmicLilac_Tiles_64x64-cd3', 'tileset');
        const backgroundLayer = this.map.createLayer('background', this.tileset, 0, 0);
        const groundLayer = this.map.createLayer('floor', this.tileset, 0, 0);
        this.wallLayer = this.map.createLayer('walls', this.tileset, 0, 0);

        this.wallLayer.setCollisionByProperty({collision: true});
        // this.wallLayer.setCollisionFromCollisionGroup(true, true);
        // this.wallLayer.renderDebug(this.add.graphics());

        // for (let i = 0 ; i<105; i++) console.log(tileset.getTileCollisionGroup(i));

        const collisionRect = new Phaser.Geom.Rectangle();

        // let gidMapEntries = this.wallLayer.tileset[0].getTileData(0);

        // for (const el of gidMapEntries) console.log(el[1]);

        this.map.setBaseTileSize(64, 64);


        // const debugGraphics = this.add.graphics().setAlpha(0.5);
        // this.wallLayer.renderDebug(debugGraphics, {
        //     tileColor: null,
        //     collidingTileColor: new Phaser.Display.Color(255, 255, 50, 255)
        // });

        this.createPlatforms();
        this.createPlayer();
        this.createCursor();
        this.createStar();
        this.createButtons();

        this.scoreText = this.add.text(192, 256, 'Level Completed', {fontSize: '64px', fill: '#fff'});
        this.scoreText.setVisible(false);

        this.physics.add.collider(this.player, this.wallLayer);


        this.statusText = this.add.text(16, 50, 'Speed: ' + this.player.velocity + 'Angle: ' + this.player.body.rotation, {
            fontSize: '16px',
            fill: '#fff'
        });
        this.statusText.setVisible(false);

        this.gfx = this.add.graphics();
        // this.bombs = this.physics.add.group();

        // this.physics.add.collider(this.bombs, this.platforms);
        // this.physics.add.collider(this.player, this.bombs);


        // this.physics.add.collider(stars, platforms);


        this.physics.world.on('worldbounds', (body) => {
            this.collided = true;
        });

        this.graphic = this.add.graphics({lineStyle: {color: 0x00ffff}});
        this.graphic.setVisible(false);

        this.scanGfx = this.add.graphics({
            fillStyle: {
                color: 0x00ffff,
                alpha: 0.5
            }
        });
        this.scanGfx.setVisible(false);
        this.scanLine = new Phaser.Geom.Line(this.player.x, this.player.y, this.blueStar.x, this.blueStar.y);

        this.scanLineRot = new Phaser.Geom.Line(this.player.x, this.player.y, 300, 100);

        this.scanLineGfx = this.add.graphics({
            fillStyle: {
                color: 0x00ffff,
                alpha: 0.5
            }
        });
        this.scanLineGfx.setVisible(false);

        // this.testBlockRect = new Phaser.Geom.Rectangle(200, 50, 100, 200);
        this.scanCircle = new Phaser.Geom.Circle(300, 400, this.SCAN_DISTANCE);
        this.blockingObjects = this.platforms;
    }


//------------------------------------------------------------------------------------------------------------
//-------CREATE FUNCTIONS

    createPlatforms() {
        this.platforms = this.physics.add.staticGroup();

        // this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        // this.platforms.create(512, 128, 'ground').setScale(0.66, 8.1).setAlpha(0).refreshBody();
        //
        //
        // this.platforms.create(864, 288, 'ground').setScale(0.5,6).setAlpha(0).refreshBody();
        // this.platforms.create(50, 250, 'ground');
        // this.platforms.create(750, 220, 'ground');

        // platforms.setSize(400, 50, true);

        // this.platforms.setTint(0x000bbb);
    }

    createPlayer() {
        this.player = this.physics.add.sprite(150, 150, 'bot').setScale(1.4);
        if (this.level === 1) {
            this.player.setX(480).setY(600);
        }
        ;
        // this.player.body.bounce.set(1);
        this.player.body.setMaxSpeed(160);
        this.player.setCircle(20, 12, 28);
        this.physics.add.collider(this.player, this.platforms, function (_player, _platform) {
            this.objectCollidedWith = _platform;
            this.collided = true;
            this.walkedBy = false;
            if (!_player.body.blocked.none) {

                if (_player.body.blocked.up) {
                    // player.setY(player.y + 2);
                    this.upIsClear = false;
                } else if (_player.body.blocked.down) {
                    // player.setY(player.y - 2);
                    this.downIsClear = false;
                } else if (_player.body.blocked.right) {
                    // player.setX(player.x - 2);
                    this.rightIsClear = false;
                } else {
                    // player.setX(player.x + 2);
                    this.leftIsClear = false;
                }
                this.player.setVelocityX(0);
                this.player.setVelocityY(0);
            }
        }, this.processCallback, this);

        this.player.setCollideWorldBounds(true);
        this.player.body.onWorldBounds = true;

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('bot', {start: 24, end: 29}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'turnToFront',
            frames: this.anims.generateFrameNumbers('bot', {frames: [0]}),
            frameRate: 5
        });

        this.anims.create({
            key: 'turnToSide',
            frames: this.anims.generateFrameNumbers('bot', {start: 0, end: 2}),
            frameRate: 5,
            repeat: 0
        });

        this.anims.create({
            key: 'leftToRight',
            frames: this.anims.generateFrameNumbers('bot', {frames: [6, 7, 0, 1, 2]}),
            frameRate: 5,
            repeat: 0
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('bot', {start: 24, end: 29}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('bot', {start: 32, end: 37}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('bot', {start: 8, end: 13}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'leftToUp',
            frames: this.anims.generateFrameNumbers('bot', {start: 6, end: 4}),
            frameRate: 5,
            repeat: 0
        });

        this.anims.create({
            key: 'rightToUp',
            frames: this.anims.generateFrameNumbers('bot', {start: 2, end: 4}),
            frameRate: 5,
            repeat: 0
        });

        this.anims.create({
            key: 'downToUp',
            frames: this.anims.generateFrameNumbers('bot', {start: 0, end: 4}),
            frameRate: 5,
            repeat: 0
        });

        this.anims.create({
            key: 'upToDown',
            frames: this.anims.generateFrameNumbers('bot', {start: 4, end: 0}),
            frameRate: 5,
            repeat: 0
        });

        this.anims.create({
            key: 'upToRight',
            frames: this.anims.generateFrameNumbers('bot', {start: 4, end: 2}),
            frameRate: 5,
            repeat: 0
        });

        this.anims.create({
            key: 'leftToDown',
            frames: this.anims.generateFrameNumbers('bot', {frames: [6, 7, 0]}),
            frameRate: 5,
            repeat: 0
        });

        this.anims.create({
            key: 'rightToDown',
            frames: this.anims.generateFrameNumbers('bot', {start: 2, end: 0}),
            frameRate: 5,
            repeat: 0
        });


    }


    createCursor() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    createStar() {
        this.blueStar = this.physics.add.sprite(800, 100, 'star');
        // this.blueStar.setTint(0x006db2);
        this.blueStar.setScale(0.4).setVisible(false);

        this.physics.add.overlap(this.player, this.blueStar, this.collectStar, null, this);
    }

    createButtons() {
        this.button = this.add.text(40, 600, 'Back to Menu');
        this.buttonUp = this.add.text(600, 400, 'To next level');
        this.buttonScan = this.add.text(600, 450, 'Scan For Star');
        this.button.setInteractive();
        this.buttonUp.setInteractive().setVisible(false);
        this.buttonScan.setInteractive().setVisible(false);
        this.button.on('pointerover', () => this.button.setStyle({fill: '#006db2'})).on('pointerout', () => this.button.setStyle({fill: '#fff'})).on('pointerdown', () => this.scene.start('PreloadScene'));
        this.buttonScan.on('pointerdown', () => {
            if (this.scannedObject) {
                console.log(this.blockingObjects);
                if (this.checkIfObjectBlocksViewline(this.blockingObjects)) {
                    console.log('not in view');
                    this.scanLineGfx.setVisible(false);
                } else {
                    this.scanLineGfx.setVisible(true);
                }
            }
        });

        this.buttonUp.on('pointerdown',
            () => this.scene.start('GameScene_Level_2')
        );
    }

    checkIfObjectBlocksViewline(gameObject) {

        if (gameObject.isParent) {
            let intersects = gameObject.getChildren().every(element =>
                Phaser.Geom.Intersects.LineToRectangle(this.scanLine, element.body) === false
            );
            return !intersects;
        }

    }

    processCallback(obj1, obj2) {

        //  This function can perform your own additional checks on the 2 objects that collided.
        //  For example you could test for velocity, health, etc.
        //  This function needs to return either true or false. If it returns true then collision carries on (separating the two objects).
        //  If it returns false the collision is assumed to have failed and aborts, no further checks or separation happen.

        if (obj1.body) {
            return true;
        } else {
            return false;
        }

    }

    collectStar(player, star) {
        star.disableBody(true, true);

        this.score += 10;
        this.physics.pause();
        this.scoreText.setText('Level Completed');
        this.gameOver = true;

        // if (stars.countActive(true) === 0) {
        //     stars.children.iterate(function (child) {
        //         child.enableBody(true, child.x, 200, true, true);
        //     });
        //
        //     var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        // var bomb = bombs.create(x, 16, 'bomb');
        // bomb.setBounce(1);
        // bomb.setCollideWorldBounds(true);
        // bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        // }

    }

    checkForWin() {
        if (this.player.x >= 470 && this.player.x <= 490 && this.player.y === 5.6) {
            this.physics.pause();
            this.scoreText.setVisible(true);

        }
    }

    update() {
        this.checkForWin();
        console.log(this.player.x + '  ' + this.player.y);

        var tile = this.wallLayer.getTileAtWorldXY(this.player.x, this.player.y, true);
        if (tile && tile.properties.slowingDown) {
        console.log("=>(GameScene_Level_1.js:411) //slowdowntheplayer");
            // slow down the player
            this.player.setVelocity(this.player.body.velocity.x * 0.5, this.player.body.velocity.y * 0.5);
        }

        if (!this.scannedObject) {
            this.scanLineGfx.setVisible(false);
        }
        this.scanCircle.setPosition(this.player.x, this.player.y)
        this.scanLine.setTo(this.player.x, this.player.y, this.blueStar.x, this.blueStar.y);
        this.scanAngle -= 0.04;
        Phaser.Geom.Line.SetToAngle(this.scanLineRot, this.player.x, this.player.y, this.scanAngle, 200);
        if (Phaser.Geom.Intersects.LineToRectangle(this.scanLineRot, this.blueStar) && this.scannedObject) {
            this.objectSighted = true;
        }

        this.scanGfx
            .clear()
            .strokeCircleShape(this.scanCircle).strokeLineShape(this.scanLineRot);

        this.scanLineGfx.clear().strokeLineShape(this.scanLine);
        if (this.objectToScanFor) {
            if (Phaser.Geom.Intersects.CircleToRectangle(this.scanCircle, this.objectToScanFor)) {
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
            if (this.objectCollidedWith.active) {

                distCheb = Phaser.Math.RoundTo(Phaser.Math.Distance.Chebyshev(this.player.x, this.player.y, this.objectCollidedWith.x, this.objectCollidedWith.y), 0);
                distClosest = Phaser.Math.RoundTo(Phaser.Math.Distance.BetweenPoints(this.player, this.objectCollidedWith), 0);
                hypot = Math.hypot(this.player.body.halfHeight + this.objectCollidedWith.body.halfHeight, this.player.body.halfWidth + this.objectCollidedWith.body.halfWidth);


                // console.log(distClosest);
                // if (distClosest < Phaser.Math.Distance.Between(closest.x, closest.y, (closest.body.position.x + 1), (closest.body.position.y + 1))) {
                if (distClosest > hypot) {
                    console.log("clear")
                    this.leftIsClear = true;
                    this.rightIsClear = true;
                    this.downIsClear = true;
                    this.upIsClear = true;
                    if (this.player.body.x - this.player.body.prev.x !== 0 && (this.rotation === 0 || this.rotation === 180)) {
                        this.walkedBy = true;
                    } else if (this.player.body.y - this.player.body.prev.y !== 0 && (this.rotation === 90 || this.rotation === -90)) {
                        this.walkedBy = true;
                    }

                    // this.physics.accelerateToObject(player, blueStar, 4000);
                }

                this.graphic
                    .clear()
                    .strokeCircle(this.player.x, this.player.y, distClosest).strokeRect(this.player.x - distCheb, this.player.y - distCheb, 2 * distCheb, 2 * distCheb);


                this.gfx.clear()
                    .lineStyle(2, 0xff3300)
                    .lineBetween(this.objectCollidedWith.x, this.objectCollidedWith.y, this.player.x, this.player.y);


            }
            this.statusText.setText('  right clear: ' + this.rightIsClear + ' Object sighted: ' + this.objectSighted + '\n distClosest: ' + distClosest + ' hypot: ' + hypot + ' body.angle: ' + this.player.body.angle + '\nwalkedBy: ' + this.walkedBy + '\nx: ' + this.player.body.prev.x + ' collided:' + this.collided);

            let playGame = true;
            if (playGame) {
                eval(code);
                this.physics.velocityFromAngle(this.rotation, this.player.body.maxSpeed, this.player.body.acceleration);
                try {


                } catch (error) {
                    console.log(error);
                }
            }

        }

        if (this.cursors.space.isDown) {
            this.physics.pause();
            this.objectCollidedWith = null;
            this.scene.restart();

        }


        if (this.rotation === this.ROTATION_LEFT) {
            this.player.flipX = true;
            this.player.anims.playAfterRepeat('left');
        } else if (this.rotation === this.ROTATION_RIGHT) {
            this.player.flipX = false;
            this.player.anims.playAfterRepeat('right');
        } else if (this.rotation === this.ROTATION_UP) {
            this.player.flipX = false;
            this.player.anims.playAfterRepeat('up');
        } else if (this.rotation === this.ROTATION_DOWN) {
            this.player.flipX = false;
            this.player.anims.playAfterRepeat('down');
        }


        if (this.cursors.left.isDown || this.direction === 'LEFT') {

            if (this.rotation !== this.ROTATION_LEFT) {
                this.player.anims.play('turnToSide', true);
            }
            this.rotation = this.ROTATION_LEFT;
            // this.player.setVelocityX(-160);
            this.player.setVelocityY(0);


        } else if (this.cursors.right.isDown || this.direction === 'RIGHT') {
            if (this.rotation !== this.ROTATION_RIGHT) {
                if (this.rotation === this.ROTATION_LEFT) {
                    this.player.anims.play('leftToRight');
                } else if (this.rotation === this.ROTATION_UP) {
                    this.player.anims.play('upToRight');
                } else if (this.rotation === this.ROTATION_DOWN) {
                    this.player.anims.play('turnToSide');
                }
            }
            this.rotation = this.ROTATION_RIGHT;
            // this.player.setVelocityX(160);
            this.player.setVelocityY(0);
        } else {
            // player.setVelocityX(0);
            // this.player.flipX = false;
            // this.player.anims.play('turnToFront');
        }

        if (this.cursors.up.isDown || this.direction === 'UP') {

            if (this.rotation !== this.ROTATION_UP) {
                if (this.rotation === this.ROTATION_LEFT) {
                    this.player.anims.play('leftToUp');
                } else if (this.rotation === this.ROTATION_RIGHT) {
                    this.player.anims.play('rightToUp');
                } else if (this.rotation === this.ROTATION_DOWN) {
                    this.player.anims.play('downToUp');
                }
            }

            this.rotation = this.ROTATION_UP;
            this.player.setVelocityX(0);
            // this.player.setVelocityY(-160);

        } else if (this.cursors.down.isDown || this.direction === 'DOWN') {

            if (this.rotation !== this.ROTATION_DOWN) {
                if (this.rotation === this.ROTATION_LEFT) {
                    this.player.anims.play('leftToDown');
                } else if (this.rotation === this.ROTATION_RIGHT) {
                    this.player.anims.play('rightToDown');
                } else if (this.rotation === this.ROTATION_UP) {
                    this.player.anims.play('upToDown');
                }
            }

            this.rotation = this.ROTATION_DOWN;
            this.player.setVelocityX(0);
            // this.player.setVelocityY(160);
        } else {
            // player.setVelocityY(0);
        }
// playGame = false;
        if (this.direction == 'TO_OBJECT') {
            this.physics.accelerateToObject(this.player, this.blueStar, 4000);
            // player.setVelocityY(0);
        }
    }
}

export default GameScene_Level_1
