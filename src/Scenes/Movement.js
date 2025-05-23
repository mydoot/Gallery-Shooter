class Movement extends Phaser.Scene {
    graphics;
    curve;
    path;
    
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

        this.PathenemybulletCooldown = 50;        // Number of update() calls to wait before making a new bullet
        this.PathenemybulletCooldownCounter = 0;

        this.myScore = 0; 

        this.Playerhealth = 5;

        this.canbehit = true;
        
        this.playerSpeed = 7;
        this.bulletSpeed = 10;
    
        this.runMode = false;
    
        this.Wait = true;
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

        this.load.audio("dadada", "69_Enemy_death_01.wav");
        this.load.audio("fire", "13_Ice_explosion_01.wav");
        this.load.audio("hit", "39_Block_03.wav");
        this.load.audio("music", "8bit-Battle01.mp3");
    }

    create() {
        let my = this.my;

        //for path
        this.points = [
            10, 175,
            788, 175
        ];
        this.curve = new Phaser.Curves.Spline(this.points);
       

        my.RKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        my.ESCKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        my.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        my.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        my.SpaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


        my.sprite.body = new Player(this, game.config.width/2, game.config.height - 40, "shipBody", null,
            my.AKey, my.DKey, this.playerSpeed);
        my.sprite.body.setScale(0.75);

        my.sprite.enemy = new Enemy(this, game.config.width/2, 20, "enemyShip", null);
        my.sprite.enemy.setScale(0.5);
        my.sprite.enemy.scorePoints = 25;

        my.sprite.Pathenemy = this.add.follower(this.curve, 10, 10, "enemyShip");
        my.sprite.Pathenemy.setScale(0.7);
        my.sprite.Pathenemy.scorePoints = 50;

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
        my.sprite.enemybulletGroup.propertyValueSet("speed", 3);

         //pathenemy bullet group
         my.sprite.pathenemybulletGroup = this.add.group({
            active: true,
            defaultKey: "enemyshipProjectile",
            maxSize: 20,
            runChildUpdate: true
            }
        )

        my.sprite.pathenemybulletGroup.createMultiple({
            classType: EnemyBullet,
            active: false,
            key: my.sprite.pathenemybulletGroup.defaultKey,
            repeat: my.sprite.pathenemybulletGroup.maxSize-1
        });
        my.sprite.pathenemybulletGroup.propertyValueSet("speed", 2);

// Put score on screen
my.text.score = this.add.bitmapText(580, 0, "rocketSquare", "Score: " + this.myScore);
my.text.GameText = this.add.bitmapText(10, 570, "rocketSquare", "Destroy the enemies");
my.text.GameText.setScale(0.75);

my.text.health = this.add.bitmapText(580, 50, "rocketSquare", "Health: " + this.Playerhealth);

my.text.GameOver = this.add.bitmapText(190, 200, "rocketSquare", "GAME OVER");
my.text.GameOver2 = this.add.bitmapText(190, 300, "rocketSquare", "press R to restart");
my.text.GameOver.setScale(2);

my.text.GameOver.visible = false;
my.text.GameOver2.visible = false;

// Put title on screen
/* this.add.text(10, 5, "Exodus", {
    fontFamily: 'Times, serif',
    fontSize: 24,
    wordWrap: {
        width: 60
    }
}); */

this.Music = this.sound.add("music", {
    volume: 0.05   // Can adjust volume using this, goes from 0 to 1
});

this.Music.play();


        }

    update() {
        let my = this.my;
        this.bulletCooldownCounter--;
        this.enemybulletCooldownCounter--;
        this.PathenemybulletCooldownCounter--;

        // Check for bullet being fired
        if (my.SpaceKey.isDown) {
            if (this.bulletCooldownCounter < 0) {
                // Get the first inactive bullet, and make it active
                let bullet = my.sprite.bulletGroup.getFirstDead();
                // bullet will be null if there are no inactive (available) bullets
                if (bullet != null) {
                    this.sound.play("fire", {
                        volume: 0.10   // Can adjust volume using this, goes from 0 to 1
                    });
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
                    this.sound.play("dadada", {
                        volume: 0.5   // Can adjust volume using this, goes from 0 to 1
                    });
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
                            my.text.GameOver.visible = true;
                            my.text.GameOver2.visible = true;
                            my.sprite.body.visible = false;
                            my.sprite.body.x = -100;
                            
                        }
                        this.sound.play("hit", {
                            volume: 0.5   // Can adjust volume using this, goes from 0 to 1
                        });
                        this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                            this.canbehit = true;
                        }, this);
                    }
    
                }
            }
 
        });

        my.sprite.pathenemybulletGroup.getChildren().forEach(Ebullet => {
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
                            my.text.GameOver.visible = true;
                            my.text.GameOver2.visible = true;
                            my.sprite.body.visible = false;
                            my.sprite.body.x = -100;
                        }
                        this.sound.play("hit", {
                            volume: 0.5   // Can adjust volume using this, goes from 0 to 1
                        });
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
                    //console.log("enemybul");
                    this.enemybulletCooldownCounter = this.enemybulletCooldown;
                    Enemybullet.makeEActive();
                    Enemybullet.x = my.sprite.enemy.x;
                    Enemybullet.y = my.sprite.enemy.y + (my.sprite.enemy.displayHeight/2);
                }
            }

            if (this.PathenemybulletCooldownCounter < 0) {
                // Get the first inactive bullet, and make it active
                let PEnemybullet = my.sprite.pathenemybulletGroup.getFirstDead();
                // bullet will be null if there are no inactive (available) bullets
                if (PEnemybullet != null) {
                    //console.log("enemybul");
                    this.PathenemybulletCooldownCounter = this.PathenemybulletCooldown;
                    PEnemybullet.makeEActive();
                    PEnemybullet.x = my.sprite.Pathenemy.x;
                    PEnemybullet.y = my.sprite.Pathenemy.y + (my.sprite.Pathenemy  .displayHeight/2);
                }
            }
    


        my.sprite.enemy.update();
        my.sprite.body.update();

        //enemy path movement
        if (my.sprite.Pathenemy){
            if (this.Wait){
                    
                console.log("Run mode");
                //
                if (!this.runMode){
                    this.runMode = true;
                        //console.log(this.curve.points.length);
                            my.sprite.Pathenemy.x = this.curve.points[0].x 
                            my.sprite.Pathenemy.y = this.curve.points[0].y 
                    //startFollow
                    my.sprite.Pathenemy.startFollow(
                        {
                            from: 0,
                            to: 1,
                            delay: 20,
                            duration: 2000,
                            ease: 'Sine.easeInOut',
                            repeat: -1,
                            yoyo: true,
                            rotateToPath: true,
                            rotationOffset: 90
                        }
                    )
                } /* else if (this.runMode){
                    console.log("Run mode disabled");
                    this.runMode = false;
                    my.sprite.Pathenemy.stopFollow();
                    
                } */
               
            }
        }


        if (Phaser.Input.Keyboard.JustDown(my.ESCKey)) {
            this.Music.stop();
                this.scene.restart();
        }


        if (my.RKey.isDown){
            if (this.Playerhealth <= 0){
                this.Music.stop();
                this.scene.restart();
            }
        }

        if (this.myScore >= 150){
            //this.upgrade();
            this.bulletCooldown = 5;   
        }
        
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

    upgrade(){
        let my = this.my;
        this.bulletCooldown = 5;   
        this.enemybulletCooldown = 50;  
        this.PathenemybulletCooldown = 5;  
        //my.text.GameText.setText("FIREPOWER INCREASED");
    }

}