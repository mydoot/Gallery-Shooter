class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {        
        super(scene, x, y, texture, frame);
        //this.visible = false;
        //this.active = false;

        scene.add.existing(this);

        return this;
    }

    update() {
        
    }

   Destroy(){
    this.visible = false;
    this.x = -100;
   }

   Spawn() {
    this.visible = true;
    this.x = Math.random()*config.width;
   }
}