/********************************************************************
 * Player Entity from the Boilerplate
 ********************************************************************/
game.PlayerEntity = me.Entity.extend({

    /**
     * constructor
     */
    init:function (x, y, settings) {
        // call the constructor
        this._super(me.Entity, 'init', [x, y , settings]);
    },

    /**
     * update the entity
     */
    update : function (dt) {

        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        // Make all other objects solid
        return true;
    }
});

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
    init: function (x, y, skeletonImage, speed, health) { 
        // Set the image to the appropriate skeleton
        settings = {};
        settings.image = skeletonImage;

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
        this.speed = speed;
        this.health = health;
        this.orientation = "RIGHT";
        this.dyingImage = "hurt_" + skeletonImage;
        this.alive = true;
    },

    update : function (dt) {
        // Update the animation appropriately
        this._super(me.Entity, "update", [dt]);

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
            me.game.world.addChild(me.pool.pull("dyingSkeleton", this.pos.x, this.pos.y, this.dyingImage));
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
        // Leave the map when reaching the end of the path
        if (response.b.name == "Finish") {
            me.game.world.removeChild(this);
            return false;
        }

        return false;
    }
});

/********************************************************************
 * Class for a Clothed Skeleton Entity
 *
 * Parameters: x is the x position where the object will be created,
 * and y is the y position.
 *
 * This is the fast but weak enemy used in the game.
 ********************************************************************/
game.ClothedSkeleton = game.Skeleton.extend(
{
    init: function (x, y)
    { 
        // Set the attributes for calling the constructor
        var speed = 200;
        var health = 4;

        // Call the parent constructor
        this._super(game.Skeleton, 'init', [x, y, "clothed_skeleton", speed, health]);
    }
});

/********************************************************************
 * Class for a Robed Skeleton Entity
 *
 * Parameters: x is the x position where the object will be created,
 * and y is the y position.
 *
 * This is the medium speed, medium health enemy used in the game.
 ********************************************************************/
game.RobedSkeleton = game.Skeleton.extend(
{
    init: function (x, y)
    { 
        // Set the attributes for calling the constructor
        var speed = 150;
        var health = 8;

        // Call the parent constructor
        this._super(game.Skeleton, 'init', [x, y, "robed_skeleton", speed, health]);
    }
});

/********************************************************************
 * Class for a Armored Skeleton Entity
 *
 * Parameters: x is the x position where the object will be created,
 * and y is the y position.
 *
 * This is the slow speed, high health enemy used in the game.
 ********************************************************************/
game.ArmoredSkeleton = game.Skeleton.extend(
{
    init: function (x, y)
    { 
        // Set the attributes for calling the constructor
        var speed = 100;
        var health = 12;

        // Call the parent constructor
        this._super(game.Skeleton, 'init', [x, y, "armored_skeleton", speed, health]);
    }
});

/********************************************************************
 * Class for a Dying Skeleton Entity
 *
 * Parameters: x is the x position where the object will be created,
 * and y is the y position; dyingSkeletonImage is the name of a 64x64
 * sprite sheet for this in /data/img/sprites showing character death.
 *
 * This entity takes the place of Skeleton objects when their health
 * reaches 0 in the game.
 ********************************************************************/
game.DyingSkeleton = me.Entity.extend(
{	
    init: function (x, y, dyingSkeletonImage)
    { 
        // Set the image to the appropriate skeleton
        settings = {};
        settings.image = dyingSkeletonImage;

        // Set the size to match the sprite sheet
        settings.framewidth = settings.width = 64;
        settings.frameheight = settings.height = 64;

        // Call the parent constructor
        this._super(me.Entity, 'init', [x, y, settings]);

        // Create and set animation
        this.renderable.addAnimation("die", [0, 1, 2, 3, 4, 5, 5, 5, 5, 5], 200);
        this.renderable.setCurrentAnimation("die");
		
		// Cause it to flicker for the first 1000 ms
        this.renderable.flicker(1000);

        // Set up countdown as a timer (in milliseconds) before the entity is removed
        this.countdown = 1400;
    },

    update : function (dt) {
        // Update the animation appropriately
        this._super(me.Entity, "update", [dt]);
		
        // Update countdown
        this.countdown -= dt;

        // Remove the entity after the countdown reaches 0
        if (this.countdown <= 0) {
            me.game.world.removeChild(this);
        }

        return true;
    }
});

/********************************************************************
 * The four classes below simply allow Tiled to include turn objects
 * to be used to set up the path for skeleton entities to take through
 * the map in the game.
 ********************************************************************/
game.DownTurn = me.Entity.extend({
    init: function (x, y, settings) {
        this._super(me.Entity, 'init', [x, y , settings]);
    }
});

game.UpTurn = me.Entity.extend({
    init: function (x, y, settings) {
        this._super(me.Entity, 'init', [x, y , settings]);
    }
});

game.LeftTurn = me.Entity.extend({
    init: function (x, y, settings) {
        this._super(me.Entity, 'init', [x, y , settings]);
    }
});

game.RightTurn = me.Entity.extend({
    init: function (x, y, settings) {
        this._super(me.Entity, 'init', [x, y , settings]);
    }
});

/********************************************************************
 * This class simply allows Tiled to include start and finish objects
 * to indicate where a skeleton entity enters and leaves the path.
 ********************************************************************/
game.Start = me.Entity.extend({
    init: function (x, y, settings) {
        this._super(me.Entity, 'init', [x, y , settings]);
    }
});

game.Finish = me.Entity.extend({
    init: function (x, y, settings) {
        this._super(me.Entity, 'init', [x, y , settings]);
    }
});