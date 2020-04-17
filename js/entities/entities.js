/**
 * Player Entity
 */
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

game.ClothedSkeleton = me.Entity.extend(
{
    init: function (x, y)
    { 
        // Set the image to the appropriate skeleton
        settings = {};
        settings.image = "clothed_skeleton";

        // Set the size to match the sprite sheet
        settings.framewidth = settings.width = 64;
        settings.frameheight = settings.height = 64;

        // Call the parent constructor
        this._super(me.Entity, 'init', [x, y, settings]);

        // Set animations
        this.renderable.addAnimation("standRight", [27]);
        this.renderable.addAnimation("walkRight", [27, 28, 29, 30, 31, 32, 33, 34, 35], 75);
        this.renderable.addAnimation("standDown", [18]);
        this.renderable.addAnimation("walkDown", [18, 19, 20, 21, 22, 23, 24, 25, 26], 75);
        this.renderable.addAnimation("standLeft", [9]);
        this.renderable.addAnimation("walkLeft", [9, 10, 11, 12, 13, 14, 15, 16, 17], 75);
        this.renderable.addAnimation("standUp", [0]);
        this.renderable.addAnimation("walkUp", [0, 1, 2, 3, 4, 5, 6, 7, 8], 75);

        // Set initial animation
        this.renderable.setCurrentAnimation("walkRight");

        // Set up initial attributes of this enemy
        this.speed = 250;
        this.health = 4;
        this.orientation = "RIGHT";
    },

    update : function (dt) {
        // Update the animation appropriately
        this._super(me.Entity, "update", [dt]);

        // Move in the appropriate direction
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

        return true;
    },

	onCollision : function (response) {
        // Turn to walk down the map
        if (response.b.name == "DownTurn" && this.orientation != "DOWN") {
            this.orientation = "DOWN";
            this.renderable.setCurrentAnimation("walkDown");
			return false;
        }
        // Turn to walk up the map
        if (response.b.name == "UpTurn" && this.orientation != "UP") {
            this.orientation = "UP";
            this.renderable.setCurrentAnimation("walkUp");
			return false;
        }
        // Turn to walk left on the map
        if (response.b.name == "LeftTurn" && this.orientation != "LEFT") {
            this.orientation = "LEFT";
            this.renderable.setCurrentAnimation("walkLeft");
			return false;
        }
        // Turn to walk right on the map
        if (response.b.name == "RightTurn" && this.orientation != "RIGHT") {
            this.orientation = "RIGHT";
            this.renderable.setCurrentAnimation("walkRight");
			return false;
        }
        // Leave the map
        if (response.b.name == "Finish") {
            // Remove the skeleton from the end of the map
            me.game.world.removeChild(response.a);
			return false;
        }

        return false;
    }
});

game.RobedSkeleton = me.Entity.extend(
{
    init: function (x, y)
    { 
        // Set the image to the appropriate skeleton
        settings = {};
        settings.image = "robed_skeleton";

        // Set the size to match the sprite sheet
        settings.framewidth = settings.width = 64;
        settings.frameheight = settings.height = 64;

        // Call the parent constructor
        this._super(me.Entity, 'init', [x, y, settings]);

        // Set animations
        this.renderable.addAnimation("standRight", [27]);
        this.renderable.addAnimation("walkRight", [27, 28, 29, 30, 31, 32, 33, 34, 35], 100);
        this.renderable.addAnimation("standDown", [18]);
        this.renderable.addAnimation("walkDown", [18, 19, 20, 21, 22, 23, 24, 25, 26], 100);
        this.renderable.addAnimation("standLeft", [9]);
        this.renderable.addAnimation("walkLeft", [9, 10, 11, 12, 13, 14, 15, 16, 17], 100);
        this.renderable.addAnimation("standUp", [0]);
        this.renderable.addAnimation("walkUp", [0, 1, 2, 3, 4, 5, 6, 7, 8], 100);

        // Set initial animation
        this.renderable.setCurrentAnimation("walkRight");

        // Set up initial attributes of this enemy
        this.speed = 175;
        this.health = 8;
        this.orientation = "RIGHT";
    },

    update : function (dt) {
        // Update the animation appropriately
        this._super(me.Entity, "update", [dt]);

        // Move in the appropriate direction
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

        return true;
    },

	onCollision : function (response) {
        // Turn to walk down the map
        if (response.b.name == "DownTurn" && this.orientation != "DOWN") {
            this.orientation = "DOWN";
            this.renderable.setCurrentAnimation("walkDown");
			return false;
        }
        // Turn to walk up the map
        if (response.b.name == "UpTurn" && this.orientation != "UP") {
            this.orientation = "UP";
            this.renderable.setCurrentAnimation("walkUp");
			return false;
        }
        // Turn to walk left on the map
        if (response.b.name == "LeftTurn" && this.orientation != "LEFT") {
            this.orientation = "LEFT";
            this.renderable.setCurrentAnimation("walkLeft");
			return false;
        }
        // Turn to walk right on the map
        if (response.b.name == "RightTurn" && this.orientation != "RIGHT") {
            this.orientation = "RIGHT";
            this.renderable.setCurrentAnimation("walkRight");
			return false;
        }
        // Leave the map
        if (response.b.name == "Finish") {
            // Remove the skeleton from the end of the map
            me.game.world.removeChild(response.a);
			return false;
        }

        return false;
    }
});


game.ArmoredSkeleton = me.Entity.extend(
{
    init: function (x, y)
    { 
        // Set the image to the appropriate skeleton
        settings = {};
        settings.image = "armored_skeleton";

        // Set the size to match the sprite sheet
        settings.framewidth = settings.width = 64;
        settings.frameheight = settings.height = 64;

        // Call the parent constructor
        this._super(me.Entity, 'init', [x, y, settings]);

        // Set animations
        this.renderable.addAnimation("standRight", [27]);
        this.renderable.addAnimation("walkRight", [27, 28, 29, 30, 31, 32, 33, 34, 35], 125);
        this.renderable.addAnimation("standDown", [18]);
        this.renderable.addAnimation("walkDown", [18, 19, 20, 21, 22, 23, 24, 25, 26], 125);
        this.renderable.addAnimation("standLeft", [9]);
        this.renderable.addAnimation("walkLeft", [9, 10, 11, 12, 13, 14, 15, 16, 17], 125);
        this.renderable.addAnimation("standUp", [0]);
        this.renderable.addAnimation("walkUp", [0, 1, 2, 3, 4, 5, 6, 7, 8], 125);

        // Set initial animation
        this.renderable.setCurrentAnimation("walkRight");

        // Set up initial attributes of this enemy
        this.speed = 100;
        this.health = 12;
        this.orientation = "RIGHT";
    },

    update : function (dt) {
        // Update the animation appropriately
        this._super(me.Entity, "update", [dt]);

        // Move in the appropriate direction
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

        return true;
    },

	onCollision : function (response) {
        // Turn to walk down the map
        if (response.b.name == "DownTurn" && this.orientation != "DOWN") {
            this.orientation = "DOWN";
            this.renderable.setCurrentAnimation("walkDown");
			return false;
        }
        // Turn to walk up the map
        if (response.b.name == "UpTurn" && this.orientation != "UP") {
            this.orientation = "UP";
            this.renderable.setCurrentAnimation("walkUp");
			return false;
        }
        // Turn to walk left on the map
        if (response.b.name == "LeftTurn" && this.orientation != "LEFT") {
            this.orientation = "LEFT";
            this.renderable.setCurrentAnimation("walkLeft");
			return false;
        }
        // Turn to walk right on the map
        if (response.b.name == "RightTurn" && this.orientation != "RIGHT") {
            this.orientation = "RIGHT";
            this.renderable.setCurrentAnimation("walkRight");
			return false;
        }
        // Leave the map
        if (response.b.name == "Finish") {
            // Remove the skeleton from the end of the map
            me.game.world.removeChild(response.a);
			return false;
        }

        return false;
    }
});

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

game.Finish = me.Entity.extend({
    init: function (x, y, settings) {
        this._super(me.Entity, 'init', [x, y , settings]);
    }
});

game.RedTower = me.Entity.extend(
{
    init: function (x, y)
    { 
        // Set the image to the appropriate tower.
        settings = {};
        settings.image = "towerDefense";

        // Set the size to match the sprite sheet.
        settings.framewidth = settings.width = 64;
        settings.frameheight = settings.height = 64;

        // Call the parent constructor.
        this._super(me.Entity, 'init', [x, y, settings]);

        // Set animations.
        this.renderable.addAnimation("exist", [250]);

        // Set initial animation
        this.renderable.setCurrentAnimation("exist");

        // Set up initial attributes of this enemy
        this.speed = 0;
        this.health = 999;
        this.orientation = "UP";
		this.currentTargetGUID = null;
    },

    update : function (dt) {
        // Update the animation appropriately
        this._super(me.Entity, "update", [dt]);

		// Select 'the first' target in the world that has a name of "killMe" (a green tower).
		var targetsArray = me.game.world.getChildByName("killMe");
		var target = targetsArray[0];

		// Check if the tower needs to be rotated to face a new ["killMe"] target.
		/* Reference:
			Code for calculating target angle, rotating using that angle, and moving using that angle is
			based on code posted by users Ian_ and agmcleod at the forum linked below.
			https://www.html5gamedevs.com/topic/34225-shooting-projectiles-in-a-specific-direction/
		*/
		if (this.currentTargetGUID != target.GUID) {

			// Calculate the angle of the target relative to this tower.
			var targetAngle = Math.atan2(target.pos.y - this.pos.y, target.pos.x - this.pos.x);
			
			// Point this tower at the target.
			this.renderable.rotate(targetAngle + 90 * Math.PI / 180);
			
			// Update the current target of this tower.
			this.currentTargetGUID = target.GUID;
			
			// Launch a missile at the current target.
			me.game.world.addChild(me.pool.pull("missile", this.pos.x, this.pos.y, this.currentTargetGUID));
		}

        return true;
    },

	// Tower should not react to a collision.
	onCollision : function (response) {
        return false;
    }
});

game.GreenTower = me.Entity.extend(
{
    init: function (x, y)
    { 
        // Set the image to the appropriate tower.
        settings = {};
        settings.image = "towerDefense";
		
		// For tower attack POC, set name for the green tower since it serves as target of red tower.
		settings.name = "killMe";

        // Set the size to match the sprite sheet.
        settings.framewidth = settings.width = 64;
        settings.frameheight = settings.height = 64;

        // Call the parent constructor.
        this._super(me.Entity, 'init', [x, y, settings]);

        // Set animations.
        this.renderable.addAnimation("exist", [249]);

        // Set initial animation
        this.renderable.setCurrentAnimation("exist");

        // Set up initial attributes of this enemy
        this.speed = 0;
        this.health = 999;
        this.orientation = "UP";
    },

    update : function (dt) {
        // Update the animation appropriately
        this._super(me.Entity, "update", [dt]);

        return true;
    },

	onCollision : function (response) {
        return false;
    }
});

game.Missile = me.Entity.extend({
    init : function (x, y, targetGUID)
	{
        // Set the image to the appropriate tower.
        settings = {};
        settings.image = "towerDefense";
		
		// For tower attack POC, set name for the green tower since it serves as target of red tower.
		settings.name = "missile";

        // Set the size to match the sprite sheet.
        settings.framewidth = settings.width = 64;
        settings.frameheight = settings.height = 64;

        // Call the parent constructor.
        this._super(me.Entity, 'init', [x, y, settings]);

        // Set animations.
        this.renderable.addAnimation("exist", [252]);

        // Set initial animation
        this.renderable.setCurrentAnimation("exist");

        // Set up initial attributes of this enemy
        this.speed = 100;
        this.damage = 999;
		this.targetGUID = targetGUID;
		this.rotated = false;
    },

    update : function (dt) {
        // Update the animation appropriately
        this._super(me.Entity, "update", [dt]);
		
		// Check if the tower needs to be rotated to face a new ["killMe"] target.
		/* Reference:
			Code for calculating target angle, rotating using that angle, and moving using that angle is
			based on code posted by users Ian_ and agmcleod at the forum linked below.
			https://www.html5gamedevs.com/topic/34225-shooting-projectiles-in-a-specific-direction/
		*/
		// Calculate the angle of the target relative to this missile.
		var target = me.game.world.getChildByGUID(this.targetGUID);
		var targetAngle = Math.atan2(target.pos.y - this.pos.y, target.pos.x - this.pos.x);
		
		// Check if the missile needs to be pointed at the target.
		if (this.rotated == false) {
			// Point this missile at the target.
			this.renderable.rotate(targetAngle + 90 * Math.PI / 180);
			
			this.rotated = true;
		}
		
		this.body.setVelocity(Math.cos(targetAngle) * 3, Math.sin(targetAngle) * 3);
		
		this.body.vel.x += this.body.accel.x * me.timer.tick;
		this.body.vel.y += this.body.accel.y * me.timer.tick;
		
        // Check for collisions
        me.collision.check(this);
		
		this.body.update(dt);

        return true;
    },
	
	onCollision : function (response) {
        // Check if the missile hit its target.
        if (response.b.name == "killMe") {
			// Remove the projectile and the target from the map
            me.game.world.removeChild(response.a);
			me.game.world.removeChild(response.b);
			
			return false;
        }

        return false;
    }
});