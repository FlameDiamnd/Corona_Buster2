import Phaser from "phaser";
import FallingObject from "../ui/FallingObject"; //----> Import kelas bernama FallingObject dari folder ui
import Laser from "../ui/Laser";
export default class CoronaBusterScene extends Phaser.Scene {
  constructor() {
    //menginisialisasi apa yang harus dilakukan pada code selanjutnya
    super("corona-buster-scene");
  }

  init() {
    this.clouds = undefined;
    this.nav_left = false;
    this.nav_right = false;
    this.shoot = false;
    this.player = undefined;
    this.speed = 100;
    this.cursors = undefined;
    this.enemies = undefined;
    this.enemySpeed = 50;
    this.lsers = undefined;
    this.lastFired = 10;
  }

  preload() {
    //methode untuk mengupload assets
    this.load.image("background", "images/bg_layer1.png");
    this.load.image("cloud", "images/cloud.png");
    this.load.image("left-btn", "images/left-btn.png");
    this.load.image("right-btn", "images/right-btn.png");
    this.load.image("shoot-btn", "images/shoot-btn.png");

    this.load.spritesheet("player", "images/ship.png", {
      frameWidth: 66,
      frameHeight: 66,
    });

    this.load.image("enemy", "images/enemy.png");
    this.load.spritesheet("laser", "images/laser-bolts.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
  }

  create() {
    //Background
    const gameWidht = this.scale.width * 0.5;
    const gameHeight = this.scale.height * 0.5;
    this.add.image(gameWidht, gameHeight, "background");

    //Cloud
    this.clouds = this.physics.add.group({
      key: "cloud",
      repeat: 10, //----------------------> coba ganti angkanya menjadi lebih besar atau kecil
    });

    Phaser.Actions.RandomRectangle(
      this.clouds.getChildren(),
      this.physics.world.bounds
    );

    // Create buttons
    this.createButton();

    //Create Player
    this.player = this.createPlayer();

    //Cursors Arrows
    this.cursors = this.input.keyboard.createCursorKeys();

    this.enemies = this.physics.add.group({
      classType: FallingObject,
      maxSize: 10, //-----> banyaknya enemy dalam satu grup
      runChildUpdate: true,
    });

    this.time.addEvent({
      delay: Phaser.Math.Between(1000, 5000), //--------> Delay random  rentang 1-5 detik
      callback: this.spawnEnemy,
      callbackScope: this, //--------------------> Memanggil method bernama spawnEnemy
      loop: true,
    });
    this.lasers = this.physics.add.group({
      classType: Laser,
      maxSize: 10,
      runChildUpdate: true,
    });
    this.physics.add.overlap(
      this.lasers,
      this.enemies,
      this.hitEnemy,
      null,
      this
    );
  }

  update(time) {
    this.clouds.getChildren().forEach((child) => {
      if (child instanceof Phaser.Physics.Arcade.Sprite) {
        child.setVelocityY(20);
        if (child.y > this.scale.height) {
          child.x = Phaser.Math.Between(10, 400);
          child.y = 0;
        }
      }
    });

    //MovePlayer
    this.movePlayer(this.player, time);
  }

  //methode button
  createButton() {
    this.input.addPointer(3);

    let shoot = this.add
      .image(320, 550, "shoot-btn")
      .setInteractive()
      .setDepth(0.5)
      .setAlpha(0.8);

    let nav_left = this.add
      .image(50, 550, "left-btn")
      .setInteractive()
      .setDepth(0.5)
      .setAlpha(0.8);

    let nav_right = this.add
      .image(nav_left.x + nav_left.displayWidth + 20, 550, "right-btn")
      .setInteractive()
      .setDepth(0.5)
      .setAlpha(0.8);

    nav_left.on(
      "pointerdown",
      () => {
        //---------> Ketika pointerup (diklik) maka properti nav left akan bernilai true
        this.nav_left = true;
      },
      this
    );
    nav_left.on(
      "pointerout",
      () => {
        //----------> Ketika pointerout (tidak diklik) maka properti nav left akan bernilai false
        this.nav_left = false;
      },
      this
    );
    nav_right.on(
      "pointerdown",
      () => {
        this.nav_right = true;
      },
      this
    );
    nav_right.on(
      "pointerout",
      () => {
        this.nav_right = false;
      },
      this
    );
    shoot.on(
      "pointerdown",
      () => {
        this.shoot = true;
      },
      this
    );
    shoot.on(
      "pointerup",
      () => {
        this.shoot = false;
      },
      this
    );
  }

  movePlayer(player, time) {
    if (this.nav_left || this.cursors.left.isDown) {
      // || agar bisa menggunakan arrows
      player.setVelocityX(this.speed * -1);
      player.anims.play("left", true);
      player.setFlipX(false);
    } else if (this.nav_right || this.cursors.right.isDown) {
      player.setVelocityX(this.speed);
      player.anims.play("right", true);
      player.setFlipX(true);
    } else if (this.cursors.up.isDown) {
      //Fungsi turn up and down
      player.setVelocityY(this.speed * -1);
      player.anims.play("turn", true);
    } else if (this.cursors.down.isDown) {
      player.setVelocityY(this.speed);
      player.anims.play("turn", true);
    } else {
      player.setVelocityX(0);
      player.setVelocityY(0);
      player.anims.play("turn");
    }
    if (this.shoot && time > this.lastFired) {
      const laser = this.lasers.get(0, 0, "laser");
      if (laser) {
        laser.fire(this.player.x, this.player.y);
        this.lastFired = time + 200;
      }
    }
  }

  createPlayer() {
    const player = this.physics.add.sprite(200, 450, "player");
    player.setCollideWorldBounds(true);

    //Animasi Player
    this.anims.create({
      key: "turn",
      frames: [
        {
          key: "player",
          frame: 0,
        },
      ],
    });
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", {
        start: 1,
        end: 2,
      }),
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", {
        start: 1,
        end: 2,
      }),
    });
    return player;
  }

  spawnEnemy() {
    const config = {
      speed: 30, //-----------> Mengatur kecepatan dan besar rotasi dari enemy
      rotation: -10,
    };
    // @ts-ignore
    const enemy = this.enemies.get(0, 0, "enemy", config);
    const positionX = Phaser.Math.Between(50, 350); //-----> Mengambil angka acak dari 50-350
    if (enemy) {
      enemy.spawn(positionX); //--------------> Memanggil method spawn dengan parameter nilai posisi sumbux
    }
  }
  hitEnemy(laser, enemy) {
    laser.die();
    enemy.die();
  }
}
