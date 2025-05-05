class Movement extends Phaser.Scene {
    constructor() {
        super("Movement");

       /*  this.my = {sprite: {}, text: {}};
        // Create an object to hold sprite bindings
        
        this.bodyX = 400;
        this.bodyY = 500;

        this.bulletCooldown = 15;        // Number of update() calls to wait before making a new bullet
        this.bulletCooldownCounter = 0;

        this.enemybulletCooldown = 100;        // Number of update() calls to wait before making a new bullet
        this.enemybulletCooldownCounter = 0;

        this.myScore = 0; 

        this.Playerhealth = 5;

        this.canbehit = true; */

    }

    init(){
        this.my = {sprite: {}, text: {}};
        // Create an object to hold sprite bindings
        
        this.bodyX = 400;
        this.bodyY = 500;

        this.bulletCooldown = 15;        // Number of update() calls to wait before making a new bullet
        this.bulletCooldownCounter = 0;

        this.enemybulletCooldown = 100;        // Number of update() calls to wait before making a new bullet
        this.enemybulletCooldownCounter = 0;

        this.myScore = 0; 

        this.Playerhealth = 5;

        this.canbehit = true;
        
        this.playerSpeed = 7;
        this.bulletSpeed = 10;
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        this.load.setPath("./assets/");

        this.load.image("shipBody", "ship_H.png");
        
        this.load.image("shipProjectile", "star_tiny.png");

        this.load.image("enemyshipProjectile", "star_small.png");

        this.load.image("enemyShip", "ship_I.png");

        // For animation
        this.load.image("whitePuff00", "whitePuff00.png");
        this.load.image("whitePuff01", "whitePuff01.png");
        this.load.image("whitePuff02", "whitePuff02.png");
        this.load.image("whitePuff03", "whitePuff03.png");

        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");

        
    }

    create() {
        let my = this.my;

       

        my.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        my.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        my.SpaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


        my.sprite.body = new Player(this, game.config.width/2, game.config.height - 40, "shipBody", null,
            my.AKey, my.DKey, this.playerSpeed);
        my.sprite.body.setScale(0.75);

        my.sprite.enemy = new Enemy(this, game.config.width/2, 20, "enemyShip", null);
        my.sprite.enemy.setScale(0.5);
        my.sprite.enemy.scorePoints = 25;

        this.anims.create({
            key: "puff",
            frames: [
                { key: "whitePuff00" },
                { key: "whitePuff01" },
                { key: "whitePuff02" },
                { key: "whitePuff03" },
            ],
            frameRate: 20,    // Note: case sensitive (thank you Ivy!)
            repeat: 5,
            hideOnComplete: true
        });

// In this approach, we create a single "group" game object which then holds up
        // to 10 bullet sprites
        // See more configuration options here: 
        // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/group/
        my.sprite.bulletGroup = this.add.group({
            active: true,
            defaultKey: "shipProjectile",
            maxSize: 10,
            runChildUpdate: true
            }
        )

        // Create all of the bullets at once, and set them to inactive
        // See more configuration options here:
        // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/group/
        my.sprite.bulletGroup.createMultiple({
            classType: Bullet,
            active: false,
            key: my.sprite.bulletGroup.defaultKey,
            repeat: my.sprite.bulletGroup.maxSize-1
        });
        my.sprite.bulletGroup.propertyValueSet("speed", this.bulletSpeed);

        //enemy bullet group
        my.sprite.enemybulletGroup = this.add.group({
            active: true,
            defaultKey: "enemyshipProjectile",
            maxSize: 20,
            runChildUpdate: true
            }
        )

        my.sprite.enemybulletGroup.createMultiple({
            classType: EnemyBullet,
            active: false,
            key: my.sprite.enemybulletGroup.defaultKey,
            repeat: my.sprite.enemybulletGroup.maxSize-1
        });
        my.sprite.enemybulletGroup.propertyValueSet("speed", 2);

// Put score on screen
my.text.score = this.add.bitmapText(580, 0, "rocketSquare", "Score: " + this.myScore);


my.text.health = this.add.bitmapText(580, 50, "rocketSquare", "Health: " + this.Playerhealth);

// Put title on screen
this.add.text(10, 5, "Exodus", {
    fontFamily: 'Times, serif',
    fontSize: 24,
    wordWrap: {
        width: 60
    }
});

        }

    update() {
        let my = this.my;
        this.bulletCooldownCounter--;
        this.enemybulletCooldownCounter--;

        // Check for bullet being fired
        if (my.SpaceKey.isDown) {
            if (this.bulletCooldownCounter < 0) {
                // Get the first inactive bullet, and make it active
                let bullet = my.sprite.bulletGroup.getFirstDead();
                // bullet will be null if there are no inactive (available) bullets
                if (bullet != null) {
                    console.log("shoot");
                    this.bulletCooldownCounter = this.bulletCooldown;
                    bullet.makeActive();
                    bullet.x = my.sprite.body.x;
                    bullet.y = my.sprite.body.y - (my.sprite.body.displayHeight/2);
                }
            }
        }

        my.sprite.bulletGroup.getChildren().forEach(bullet => {
            if (bullet) {
                if (this.collides(my.sprite.enemy, bullet)) {
                    // start animation
                    this.puff = this.add.sprite(my.sprite.enemy.x, my.sprite.enemy.y, "whitePuff03").setScale(0.25).play("puff");
                    bullet.makeInactive();
                    my.sprite.enemy.Destroy();
                    // Update score
                    this.myScore += my.sprite.enemy.scorePoints;
                    this.updateScore();
                    // Play sound
                    /* this.sound.play("dadada", {
                        volume: 1   // Can adjust volume using this, goes from 0 to 1
                    }); */
                    // Have new hippo appear after end of animation
                    this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                        my.sprite.enemy.Spawn();
                    }, this);
    
                }
            }
 
        });

        my.sprite.enemybulletGroup.getChildren().forEach(Ebullet => {
            if (Ebullet) {
                if (this.collides(my.sprite.body, Ebullet)) {
                    if (this.canbehit){
                        
                        this.canbehit = false;
                        // start animation
                        this.puff = this.add.sprite(my.sprite.body.x, my.sprite.body.y, "whitePuff03").setScale(0.25).play("puff");
                        Ebullet.makeEInactive();
                        
                        this.Playerhealth -= 1;
                        this.updateHealth();
                        if (this.Playerhealth == 0){
                            this.scene.restart()
                        }
                        // Play sound
                        /* this.sound.play("dadada", {
                            volume: 1   // Can adjust volume using this, goes from 0 to 1
                        }); */
                        // Have new hippo appear after end of animation
                        /* this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                            my.sprite.enemy.Spawn();
                        }, this); */
                        this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                            this.canbehit = true;
                        }, this);
                    }
    
                }
            }
 
        });
      


            if (this.enemybulletCooldownCounter < 0) {
                // Get the first inactive bullet, and make it active
                let Enemybullet = my.sprite.enemybulletGroup.getFirstDead();
                // bullet will be null if there are no inactive (available) bullets
                if (Enemybullet != null) {
                    console.log("enemybul");
                    this.enemybulletCooldownCounter = this.enemybulletCooldown;
                    Enemybullet.makeEActive();
                    Enemybullet.x = my.sprite.enemy.x;
                    Enemybullet.y = my.sprite.enemy.y + (my.sprite.enemy.displayHeight/2);
                }
            }
    


        
        my.sprite.body.update();


    }

    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/5 + b.displayWidth/5)) {
            //console.log("whiff");
            return false;
        
            }    
        if (Math.abs(a.y - b.y) > (a.displayHeight/5 + b.displayHeight/5)){
         //console.log("whiff");
            return false;
        }    
        
        return true;
        
    }

    updateScore() {
        let my = this.my;
        my.text.score.setText("Score: " + this.myScore);
    }

    updateHealth() {
        let my = this.my;
        my.text.health.setText("Health:  " + this.Playerhealth);
    }

}