class PathEnemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {        
        super(scene, x, y, texture, frame);
        //this.visible = false;
        //this.active = false;
        this.canShoot = false;
        //scene.add.existing(this);

        return this;
    }

    update() {
        
    }

   Destroy(){
    this.canShoot = false;
    this.visible = false;
    this.x = -100;
   }

   Spawn() {
    this.canShoot = true;
    this.visible = true;
    this.angle = 180;
    this.x = Math.random()*config.width;
    this.y = Math.random()*config.height - 50;
   }

}