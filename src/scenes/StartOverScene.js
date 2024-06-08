import Phaser from "phaser";

export default class StartOverScene extends Phaser.Scene {
  constructor() {
    super("start-scene");
  }

  init(data) {
    this.replayButton = undefined;
  }

  preload() {
    this.load.image("background", "images/bg_layer1.png");
    this.load.image("replay-button", "images/replay.png");
  }

  create() {
    this.add.image(200, 320, "background");
    this.add.image(200, 200, "gameover");
    this.replayButton = this.add
      .image(200, 400, "replay-button")
      .setInteractive()
      .setScale(0.5);
    this.replayButton.once(
      "pointerup",
      () => {
        this.scene.start("corona-buster-scene");
      },
      this
    );
  }
}
