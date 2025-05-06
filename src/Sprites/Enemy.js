class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {        
        super(scene, x, y, texture, frame);
        //this.visible = false;
        //this.active = false;
        this.canShoot = false;
        scene.add.existing(this);

        return this;
    }

    update() {
        this.y += 0.75;
        if (this.y > (this.displayHeight * 10)) {
            this.Destroy();
            this.Spawn();
        }
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
    this.y = 0;
   }

}