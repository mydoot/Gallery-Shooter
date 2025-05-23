class EnemyBullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {        
        super(scene, x, y, texture, frame);
        this.visible = false;
        this.active = false;
        return this;
    }

    update() {
        if (this.active) {
            this.y += this.speed;
            if (this.y > (this.displayHeight * 10)) {
                //console.log("left screen");
                this.makeEInactive();
            }
        }
    }

    makeEActive() {
        this.visible = true;
        this.active = true;
    }

    makeEInactive() {
        this.visible = false;
        this.active = false;
    }

}