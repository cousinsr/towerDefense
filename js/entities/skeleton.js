/********************************************************************
 * Class for a Skeleton Entity
 *
 * Parameters: x is the x position where the object will be created,
 * and y is the y position; skeletonImage is the name of a 64x64 sprite
 * sheet for this in /data/img/sprites; speed is the number of pixels
 * the entity will move in one second; health is an integer indicating
 * the number of life points the entity begins the game with.
 *
 * This entity is used as a superclass for other skeleton entities,
 * which are the main enemies in the game.
 *
 * IMPORTANT NOTE: There must be another sprite sheet for the skeleton
 * death, and it must be named "hurt_" + the string passed in the
 * skeletonImage parameter.
 ********************************************************************/
game.Skeleton = me.Entity.extend(
{
    init: function (x, y, skeletonImage, speed, speedRange, health, reward) { 
        // Set the image to the appropriate skeleton
        settings = {};
        settings.image = skeletonImage;

		// Set the name for skeleton units since they serve as targets of towers.
		settings.name = "enemy";

        // Set the size to match the sprite sheet
        settings.framewidth = settings.width = 64;
        settings.frameheight = settings.height = 64;

        // Call the parent constructor
        this._super(me.Entity, 'init', [x, y, settings]);

        // Set animations
        this.renderable.addAnimation("walkRight", [27, 28, 29, 30, 31, 32, 33, 34, 35], 75);
        this.renderable.addAnimation("walkDown", [18, 19, 20, 21, 22, 23, 24, 25, 26], 75);
        this.renderable.addAnimation("walkLeft", [9, 10, 11, 12, 13, 14, 15, 16, 17], 75);
        this.renderable.addAnimation("walkUp", [0, 1, 2, 3, 4, 5, 6, 7, 8], 75);

        // Set initial animation, as all our levels begin on the left side of the screen
        this.renderable.setCurrentAnimation("walkRight");

        // Set up initial attributes of this enemy
		var speedModifier = Math.floor(Math.random() * speedRange);
        this.speed = speed + speedModifier;
        this.normalSpeed = this.speed;
        this.stunnedSpeed = this.speed / 2;
        this.health = health;
        this.reward = reward;
        this.orientation = "RIGHT";
        this.dyingImage = "hurt_" + skeletonImage;
        this.alive = true;
        this.stunned = false;
        this.stunTimer = 0;
   },

    update : function (dt) {
		if (game.data.isPaused) {
			return true;
		}
        // Update the animation appropriately
        this._super(me.Entity, "update", [dt]);

		//Update stunned status and speed
        if (this.stunned) {
            this.stunTimer -= dt;
            if (this.stunTimer <= 0) {
                this.stunned = false;
                this.speed = this.normalSpeed;
            }
            else {
                this.setOpacity(0.1);
                this.speed = this.stunnedSpeed;
            }
        }
        else {
            this.speed = this.normalSpeed;
        }
		
        // Move entity in the appropriate direction
        if (this.orientation == "RIGHT") {
            this.pos.x += this.speed * dt/1000;
        }
        else if (this.orientation == "DOWN") {
            this.pos.y += this.speed * dt/1000;
        }
        else if (this.orientation == "LEFT") {
            this.pos.x -= this.speed * dt/1000;
        }
        else if (this.orientation == "UP") {
            this.pos.y -= this.speed * dt/1000;
        }

        // Check for collisions
        me.collision.check(this);

        // Check for entity death
        if (this.health <= 0 & this.alive) {
            this.alive = false;
            game.data.gold += this.reward;
            var deadSkeleton = me.pool.pull("dyingSkeleton", this.pos.x, this.pos.y, this.dyingImage);
            me.game.world.addChild(deadSkeleton);
			if (!game.data.dyingEnemies.includes(deadSkeleton)) {
				game.data.dyingEnemies.push(deadSkeleton);
			}
			if (game.data.enemies.includes(this)) {
				game.data.enemies.splice(game.data.enemies.indexOf(this), 1);
			}
            me.game.world.removeChild(this);
        }

        return true;
    },

    onCollision : function (response) {
        // If appropriate, turn to walk down the map and change orientation
        if (response.b.pos.y == this.pos.y && response.b.name == "DownTurn" && this.orientation != "DOWN") {
            var modifier = 8;
            if (this.orientation == "RIGHT") {
                modifier = -64;
            }
            this.orientation = "DOWN";
            this.renderable.setCurrentAnimation("walkDown");
            this.pos.x = response.b.pos.x + modifier;
            return false;
        }
        // If appropriate, turn to walk up the map and change orientation
        if (response.b.pos.y == this.pos.y && response.b.name == "UpTurn" && this.orientation != "UP") {
            var modifier = 8;
            if (this.orientation == "RIGHT") {
                modifier = -64;
            }
            this.orientation = "UP";
            this.renderable.setCurrentAnimation("walkUp");
            this.pos.x = response.b.pos.x + modifier;
            return false;
        }
        // If appropriate, turn to walk left on the map and change orientation
        if (response.b.pos.x == this.pos.x && response.b.name == "LeftTurn" && this.orientation != "LEFT") {
            var modifier = 8;
            if (this.orientation == "DOWN") {
                modifier = -64;
            }
            this.orientation = "LEFT";
            this.renderable.setCurrentAnimation("walkLeft");
            this.pos.y = response.b.pos.y + modifier;
            return false;
        }
        // If appropriate, turn to walk right on the map and change orientation
        if (response.b.pos.x == this.pos.x && response.b.name == "RightTurn" && this.orientation != "RIGHT") {
            var modifier = 8;
            if (this.orientation == "DOWN") {
                modifier = -64;
            }
            this.orientation = "RIGHT";
            this.renderable.setCurrentAnimation("walkRight");
            this.pos.y = response.b.pos.y + modifier;
            return false;
        }
        // Leave the map when reaching the end of the path and remove a life
        if (response.b.name == "Finish" && game.data.enemies.includes(this)) {
			game.data.enemies.splice(game.data.enemies.indexOf(this), 1);
            game.data.life -= 1;
            me.game.world.removeChild(this);
            return false;
        }

        return false;
    }
});
