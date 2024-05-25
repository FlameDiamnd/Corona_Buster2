import Phaser from "phaser";
export default class Laser extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.setScale(2);
}
  fire(x, y) {
    this.setPosition(x, y - 50);
  }
  die() {
    this.destroy();
  }
  update(time) {
    this.setVelocityY(-200);
    if (this.y<-10){
        this.die();
    }
  }
}
