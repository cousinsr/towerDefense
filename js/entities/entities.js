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
		
		// For tower attack POC, set name for this unit since it may serve as target of a tower.
		settings.name = "killMe";

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
		
		// For tower attack POC, set name for this unit since it may serve as target of a tower.
		settings.name = "killMe";

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
		
		// For tower attack POC, set name for this unit since it may serve as target of a tower.
		settings.name = "killMe";

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


/*
Reference:
Code for calculating target angle, rotating using that angle, and moving a projectile to the target using
that angle is based on code posted by users Ian_ and agmcleod at the forum linked below, with
necessary modifications added for correct functionality in this game.
https://www.html5gamedevs.com/topic/34225-shooting-projectiles-in-a-specific-direction/
*/
game.BasicRangedAttackTower = me.Entity.extend(
{
    init: function (x, y)
    { 
        // Set the image file.
        settings = {};
        settings.image = "towerDefense";

        // Set the size to match the sprite sheet.
        settings.framewidth = settings.width = 64;
        settings.frameheight = settings.height = 64;

        // Call the parent constructor.
        this._super(me.Entity, 'init', [x, y, settings]);

        // Set the image to the appropriate tower.
        this.renderable.addAnimation("exist", [249]);

        // Set initial animation
        this.renderable.setCurrentAnimation("exist");
		
		// Set attack cooldown variables.
		this.cooldownActive = false;
		this.cooldownDuration = 1000; // Milliseconds
		this.cooldownTimeCount = 0; // Milliseconds
		
		// Set attack range variable.
		this.range = 4 * 64; // Range = rangeMultipler * tileSize
		
        // Set target tracking variables.
		this.lastTargetAngle = 0;
		this.lastTargetGUID = null;
    },

    update : function (dt) {
		// Update the animation appropriately
        this._super(me.Entity, "update", [dt]);

		// If the tower has an active cooldown, increment the cooldown time tracker and check if the
		// cooldown period is over.
		if (this.cooldownActive) {
			this.cooldownTimeCount += dt;
			if (this.cooldownTimeCount >= this.cooldownDuration) {
				this.cooldownActive = false;
			}
		}

		// Tower should only look for and attack targets if it is not in cooldown.
		if (this.cooldownActive == false) {
			var target = null;
			
			// Check if there was a previous target attacked by this tower.
			if (this.lastTargetGUID != null) {
				var lastTarget = me.game.world.getChildByGUID(this.lastTargetGUID);
				
				// Check if the last target attacked by this tower still exists in the game world.
				if (lastTarget != null) {
					lastTargetDistance = Math.sqrt(
						Math.pow(lastTarget.pos.x - this.pos.x, 2) +
						Math.pow(lastTarget.pos.y - this.pos.y, 2)
					);
					
					// Check if the last target is within range of this tower.
					if (lastTargetDistance <= this.range) {
						target = lastTarget;
					}
				}
			}
			
			// Check if a new target should be searched for.
			if (target == null) {
				// Find all targets in the world that have a name of "killMe".
				var targetsArray = me.game.world.getChildByName("killMe");
				
				// Select the closest target within range of the tower.
				var i, shortestTargetDistance = this.range + 7;
				for (i = 0; i < targetsArray.length; i++) {
					targetDistance = Math.sqrt(
						Math.pow(targetsArray[i].pos.x - this.pos.x, 2) +
						Math.pow(targetsArray[i].pos.y - this.pos.y, 2)
					);
					
					// Check if the target is within range and closer to this tower than previously
					// checked targets.
					if ((targetDistance <= this.range) && (targetDistance < shortestTargetDistance)) {
						shortestTargetDistance = targetDistance;
						target = targetsArray[i];
					}
				}
			}
			
			// Check if the tower needs to react to a target.
			if (target != null) {

				// Calculate the angle of the target relative to this tower.
				var targetAngle = Math.atan2(target.pos.y - this.pos.y, target.pos.x - this.pos.x);
				
				// Reset the tower's rotation if it was previously rotated to face a target.
				if (this.lastTargetGUID != null) {
					this.renderable.rotate(-1 * this.lastTargetAngle - 90 * Math.PI / 180);
				}
				
				// Point this tower at the target.
				this.renderable.rotate(targetAngle + 90 * Math.PI / 180);
				// Record the latest target angle used to rotate the tower.
				this.lastTargetAngle = targetAngle;
				
				// Launch a projectile at the current target.
				me.game.world.addChild(
					me.pool.pull("missile", this.pos.x, this.pos.y, target.GUID)
				);
				
				// Track the latest target of this tower.
				this.lastTargetGUID = target.GUID;
				
				// Initiate target attack cooldown period.
				this.cooldownActive = true;
				this.cooldownTimeCount = 0;
			}
		}
		
		return true;
    },

	// Tower should not react to a collision.
	onCollision : function (response) {
        return false;
    }
});


/*
Reference:
Code for calculating target angle, rotating using that angle, and moving a projectile to the target using
that angle is based on code posted by users Ian_ and agmcleod at the forum linked below, with
necessary modifications added for correct functionality in this game.
https://www.html5gamedevs.com/topic/34225-shooting-projectiles-in-a-specific-direction/
*/
game.Missile = me.Entity.extend({
    init : function (x, y, targetGUID)
	{
        // Set the image file.
        settings = {};
        settings.image = "towerDefense";

        // Set the size to match the sprite sheet.
        settings.framewidth = settings.width = 64;
        settings.frameheight = settings.height = 64;

        // Call the parent constructor.
        this._super(me.Entity, 'init', [x, y, settings]);

        // Set the image to the appropriate projectile.
        this.renderable.addAnimation("exist", [251]);

        // Set initial animation
        this.renderable.setCurrentAnimation("exist");

		// Define physics characteristics of the projectile.
		// Setting these values appropriately is necessary for the projectile to reach its target.
		this.body.force.set(1000,1000);
		this.body.setMaxVelocity(50,50);
		this.body.friction.set(0,0);
		this.body.gravity.set(0,0);

		this.damage = 4;

		// Set the projectile target and initial rotation (towards target) status.
		this.targetGUID = targetGUID;
		this.rotated = false;
    },

    update : function (dt) {
        // Update the animation appropriately
        this._super(me.Entity, "update", [dt]);
		
		// Calculate the angle of the target relative to this projectile.
		var target = me.game.world.getChildByGUID(this.targetGUID);
		var targetAngle = 0;
		
		// Confirm the target still exists.
		if (target != null) {
			targetAngle = Math.atan2(target.pos.y - this.pos.y, target.pos.x - this.pos.x);
		//The target no longer exists, so remove the projectile from the map.
		} else {
			me.game.world.removeChild(this);
		}
		
		// Check if the projectile needs to be pointed at the target.
		if (this.rotated == false) {
			// Point this projectile at the target.
			this.renderable.rotate(targetAngle + 90 * Math.PI / 180);
			this.rotated = true;
		}
		
		// Set the direction and speed of the projectile.
		// Increasing the number in a product below will increase the speed of the projectile's movement
		// with	respect to that axis.
		this.body.setVelocity(Math.cos(targetAngle) * 6, Math.sin(targetAngle) * 6);
		
        // Check for collisions
        me.collision.check(this);
		
		this.body.update(dt);

        return true;
    },
	
	onCollision : function (response) {
        // Check if the projectile hit its target.
        if (response.b.GUID == this.targetGUID) {
			// Remove the projectile from the map.
			me.game.world.removeChild(response.a);
			// Lower the health of the target.
			response.b.health -= this.damage;
			// Remove the target from the map if appropriate. Otherwise, have the target flicker if it took
			// damage but is still alive following this collision.
			// This is a temporary means of removing the target given this POC works with older enemy code.
			// Once this POC is merged with master, removal of targets with 0 health will most likely be
			// done by enemy object code.
			if (response.b.health <= 0) {
				me.game.world.removeChild(response.b);
			} else {
				response.b.renderable.flicker(500);
			}
			
			return true;
        }

        return false;
    }
});


/*
Reference:
Code for calculating target angle, rotating using that angle, and moving a projectile to the target using
that angle is based on code posted by users Ian_ and agmcleod at the forum linked below, with
necessary modifications added for correct functionality in this game.
https://www.html5gamedevs.com/topic/34225-shooting-projectiles-in-a-specific-direction/
*/
game.ExplosiveDamageTower = me.Entity.extend(
{
    init: function (x, y)
    { 
        // Set the image file.
        settings = {};
        settings.image = "towerDefense";

        // Set the size to match the sprite sheet.
        settings.framewidth = settings.width = 64;
        settings.frameheight = settings.height = 64;

        // Call the parent constructor.
        this._super(me.Entity, 'init', [x, y, settings]);

        // Set the image to the appropriate tower.
        this.renderable.addAnimation("exist", [226]);

        // Set initial animation
        this.renderable.setCurrentAnimation("exist");
		
		// Set attack cooldown variables.
		this.cooldownActive = false;
		this.cooldownDuration = 4000; // Milliseconds
		this.cooldownTimeCount = 0; // Milliseconds
		
		// Set tower attack range and bomb explosion radius variables.
		this.range = 8 * 64; // Range = rangeMultipler * tileSize
		this.explosionRadius = 4 * 64;
		
        // Set target tracking variables.
		this.lastTargetAngle = 0;
		this.lastTargetGUID = null;
    },

    update : function (dt) {
		// Update the animation appropriately
        this._super(me.Entity, "update", [dt]);

		// If the tower has an active cooldown, increment the cooldown time tracker and check if the
		// cooldown period is over.
		if (this.cooldownActive) {
			this.cooldownTimeCount += dt;
			if (this.cooldownTimeCount >= this.cooldownDuration) {
				this.cooldownActive = false;
			}
		}

		// Tower should only look for and attack targets if it is not in cooldown.
		if (this.cooldownActive == false) {
			var target = null;
			
			// Find all targets in the world that have a name of "killMe".
			var targetsArray = me.game.world.getChildByName("killMe");
			
			// Select the closest target within range of the tower.
			var i, shortestTargetDistance = this.range + 7;
			for (i = 0; i < targetsArray.length; i++) {
				targetDistance = Math.sqrt(
					Math.pow(targetsArray[i].pos.x - this.pos.x, 2) +
					Math.pow(targetsArray[i].pos.y - this.pos.y, 2)
				);
				
				// Check if the target is within range and closer to this tower than previously
				// checked targets.
				if ((targetDistance <= this.range) && (targetDistance < shortestTargetDistance)) {
					shortestTargetDistance = targetDistance;
					target = targetsArray[i];
				}
			}
			
			// Check if the tower needs to react to a target.
			if (target != null) {

				// Calculate the angle of the target relative to this tower.
				var targetAngle = Math.atan2(target.pos.y - this.pos.y, target.pos.x - this.pos.x);
				
				// Reset the tower's rotation if it was previously rotated to face a target.
				if (this.lastTargetGUID != null) {
					this.renderable.rotate(-1 * this.lastTargetAngle - 90 * Math.PI / 180);
				}
				
				// Point this tower at the target.
				this.renderable.rotate(targetAngle + 90 * Math.PI / 180);
				// Record the latest target angle used to rotate the tower.
				this.lastTargetAngle = targetAngle;
				
				// Set a static marker for the target's current position.
				var targetPosition = me.game.world.addChild(
					me.pool.pull("positionMarker", target.pos.x, target.pos.y)
				);
				
				// Launch a projectile at the target's current position marker.
				me.game.world.addChild(
					me.pool.pull("bomb", this.pos.x, this.pos.y, targetPosition.GUID, this.explosionRadius)
				);
				
				// Track the latest target of this tower.
				this.lastTargetGUID = target.GUID;
				
				// Initiate target attack cooldown period.
				this.cooldownActive = true;
				this.cooldownTimeCount = 0;
			}
		}
		
		return true;
    },

	// Tower should not react to a collision.
	onCollision : function (response) {
        return false;
    }
});


game.PositionMarker = me.Entity.extend(
{
    init: function (x, y)
    { 
        // Set the image file.
        settings = {};
        settings.image = "towerDefense";

        // Set the size to match the sprite sheet.
        settings.framewidth = settings.width = 64;
        settings.frameheight = settings.height = 64;

        // Call the parent constructor.
        this._super(me.Entity, 'init', [x, y, settings]);

		// Set animations.
        this.renderable.addAnimation("positionMarked", [22]);

        // Set initial animation.
        this.renderable.setCurrentAnimation("positionMarked");
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


/*
Reference:
Code for calculating target angle, rotating using that angle, and moving a projectile to the target using
that angle is based on code posted by users Ian_ and agmcleod at the forum linked below, with
necessary modifications added for correct functionality in this game.
https://www.html5gamedevs.com/topic/34225-shooting-projectiles-in-a-specific-direction/
*/
game.Bomb = me.Entity.extend({
    init : function (x, y, targetGUID, explosionRadius)
	{
        // Set the image file.
        settings = {};
        settings.image = "towerDefense";

        // Set the size to match the sprite sheet.
        settings.framewidth = settings.width = 64;
        settings.frameheight = settings.height = 64;

        // Call the parent constructor.
        this._super(me.Entity, 'init', [x, y, settings]);

        // Set the image to the appropriate projectile.
        this.renderable.addAnimation("exist", [297]);

        // Set initial animation
        this.renderable.setCurrentAnimation("exist");

		// Define physics characteristics of the projectile.
		// Setting these values appropriately is necessary for the projectile to reach its target.
		this.body.force.set(1000,1000);
		this.body.setMaxVelocity(50,50);
		this.body.friction.set(0,0);
		this.body.gravity.set(0,0);

		this.damage = 8;

		// Set the projectile target and initial rotation (towards target) status.
		this.targetGUID = targetGUID;
		this.rotated = false;
		
		// Set the explosion radius of this bomb.
		this.explosionRadius = explosionRadius;
    },

    update : function (dt) {
        // Update the animation appropriately
        this._super(me.Entity, "update", [dt]);
		
		// Calculate the angle of the target relative to this projectile.
		var target = me.game.world.getChildByGUID(this.targetGUID);
		var targetAngle = 0;
		
		// Confirm the target still exists.
		if (target != null) {
			targetAngle = Math.atan2(target.pos.y - this.pos.y, target.pos.x - this.pos.x);
		//The target no longer exists, so remove the projectile from the map.
		} else {
			me.game.world.removeChild(this);
		}
		
		// Check if the projectile needs to be pointed at the target.
		if (this.rotated == false) {
			// Point this projectile at the target.
			this.renderable.rotate(targetAngle + 90 * Math.PI / 180);
			this.rotated = true;
		}
		
		// Set the direction and speed of the projectile.
		// Increasing the number in a product below will increase the speed of the projectile's movement
		// with	respect to that axis.
		this.body.setVelocity(Math.cos(targetAngle) * 10, Math.sin(targetAngle) * 10);
		
        // Check for collisions
        me.collision.check(this);
		
		this.body.update(dt);

        return true;
    },
	
	onCollision : function (response) {
        // Check if the projectile hit its target.
        if (response.b.GUID == this.targetGUID) {
			// Remove the projectile and position marker from the map.
			me.game.world.removeChild(response.a);
			me.game.world.removeChild(response.b);
			
			// Find all targets in the world that have a name of "killMe".
			var targetsArray = me.game.world.getChildByName("killMe");
			
			// Distribute damage to each target within the bomb's explosion radius.
			var i;
			for (i = 0; i < targetsArray.length; i++) {
				targetDistance = Math.sqrt(
					Math.pow(targetsArray[i].pos.x - this.pos.x, 2) +
					Math.pow(targetsArray[i].pos.y - this.pos.y, 2)
				);
				
				// Check if the target is within the bomb's explosion radius.
				if (targetDistance <= this.explosionRadius) {
					// Lower the health of the target.
					targetsArray[i].health -= this.damage;
					// Remove the target from the map if appropriate. Otherwise, have the target flicker if
					// it took	damage but is still alive following this collision.
					// This is a temporary means of removing the target given this POC works with older
					// enemy code. Once this POC is merged with master, removal of targets with 0 health
					// will most likely be done by enemy object code.
					if (targetsArray[i].health <= 0) {
						me.game.world.removeChild(targetsArray[i]);
					} else {
						targetsArray[i].renderable.flicker(500);
					}
				}
			}
			
			return true;
        }

        return false;
    }
});


/*
Reference:
Code for calculating target angle, rotating using that angle, and moving a projectile to the target using
that angle is based on code posted by users Ian_ and agmcleod at the forum linked below, with
necessary modifications added for correct functionality in this game.
https://www.html5gamedevs.com/topic/34225-shooting-projectiles-in-a-specific-direction/
*/
/*
game.StunTower = me.Entity.extend(
{
    init: function (x, y)
    { 
        // Set the image file.
        settings = {};
        settings.image = "towerDefense";

        // Set the size to match the sprite sheet.
        settings.framewidth = settings.width = 64;
        settings.frameheight = settings.height = 64;

        // Call the parent constructor.
        this._super(me.Entity, 'init', [x, y, settings]);

        // Set the image to the appropriate tower.
        this.renderable.addAnimation("exist", [226]);

        // Set initial animation
        this.renderable.setCurrentAnimation("exist");
		
		// Set attack cooldown variables.
		this.cooldownActive = false;
		this.cooldownDuration = 4000; // Milliseconds
		this.cooldownTimeCount = 0; // Milliseconds
		
		// Set tower attack range and bomb explosion radius variables.
		this.range = 8 * 64; // Range = rangeMultipler * tileSize
		this.explosionRadius = 2.5 * 64;
		
        // Set target tracking variables.
		this.lastTargetAngle = 0;
		this.lastTargetGUID = null;
    },

    update : function (dt) {
		// Update the animation appropriately
        this._super(me.Entity, "update", [dt]);

		// If the tower has an active cooldown, increment the cooldown time tracker and check if the
		// cooldown period is over.
		if (this.cooldownActive) {
			this.cooldownTimeCount += dt;
			if (this.cooldownTimeCount >= this.cooldownDuration) {
				this.cooldownActive = false;
			}
		}

		// Tower should only look for and attack targets if it is not in cooldown.
		if (this.cooldownActive == false) {
			// Find all targets in the world that have a name of "killMe".
			var targetsArray = me.game.world.getChildByName("killMe");
			
			// Select the targets within range of the tower.
			var target = null;
			var targetsInRangeGUIDs = [];
			var i, shortestTargetDistance = this.range + 7;
			for (i = 0; i < targetsArray.length; i++) {
				targetDistance = Math.sqrt(
					Math.pow(targetsArray[i].pos.x - this.pos.x, 2) +
					Math.pow(targetsArray[i].pos.y - this.pos.y, 2)
				);
				
				//Check if the target is within range.
				if (targetDistance <= this.range) {
					targetsInRangeGUIDs.push(targetsArray[i].GUID);
					
					// Check if the target is closer to this tower than previously checked targets.
					if (targetDistance < shortestTargetDistance) {
						target = targetsArray[i];
						shortestTargetDistance = targetDistance;
					}
				}
			}
			
			// Check if the tower needs to react to a target.
			if (target != null) {

				// Calculate the angle of the target relative to this tower.
				var targetAngle = Math.atan2(target.pos.y - this.pos.y, target.pos.x - this.pos.x);
				
				// Reset the tower's rotation if it was previously rotated to face a target.
				if (this.lastTargetGUID != null) {
					this.renderable.rotate(-1 * this.lastTargetAngle - 90 * Math.PI / 180);
				}
				
				// Point this tower at the target.
				this.renderable.rotate(targetAngle + 90 * Math.PI / 180);
				// Record the latest target angle used to rotate the tower.
				this.lastTargetAngle = targetAngle;
				
				// Set a static marker for the target's current position.
				var targetPosition = me.game.world.addChild(
					me.pool.pull("positionMarker", target.pos.x, target.pos.y)
				);
				
				// Launch a projectile at the target's current position marker.
				me.game.world.addChild(
					me.pool.pull("bomb", this.pos.x, this.pos.y, targetPosition.GUID, targetsInRangeGUIDs)
				);
				
				// Track the latest target of this tower.
				this.lastTargetGUID = target.GUID;
				
				// Initiate target attack cooldown period.
				this.cooldownActive = true;
				this.cooldownTimeCount = 0;
			}
		}
		
		return true;
    },

	// Tower should not react to a collision.
	onCollision : function (response) {
        return false;
    }
});
*/


/*
Reference:
Code for calculating target angle, rotating using that angle, and moving a projectile to the target using
that angle is based on code posted by users Ian_ and agmcleod at the forum linked below, with
necessary modifications added for correct functionality in this game.
https://www.html5gamedevs.com/topic/34225-shooting-projectiles-in-a-specific-direction/
*/
/*
game.StunBomb = me.Entity.extend({
    init : function (x, y, targetGUID, targetsInRangeGUIDs)
	{
        // Set the image file.
        settings = {};
        settings.image = "towerDefense";

        // Set the size to match the sprite sheet.
        settings.framewidth = settings.width = 64;
        settings.frameheight = settings.height = 64;

        // Call the parent constructor.
        this._super(me.Entity, 'init', [x, y, settings]);

        // Set the image to the appropriate projectile.
        this.renderable.addAnimation("exist", [297]);

        // Set initial animation
        this.renderable.setCurrentAnimation("exist");

		// Define physics characteristics of the projectile.
		// Setting these values appropriately is necessary for the projectile to reach its target.
		this.body.force.set(1000,1000);
		this.body.setMaxVelocity(50,50);
		this.body.friction.set(0,0);
		this.body.gravity.set(0,0);

		this.damage = 8;

		// Set the projectile target and initial rotation (towards target) status.
		this.targetGUID = targetGUID;
		this.rotated = false;
		
		// Set the list of targets to be affected by this bomb.
		this.targetsInRangeGUIDs = targetsInRangeGUIDs;
    },

    update : function (dt) {
        // Update the animation appropriately
        this._super(me.Entity, "update", [dt]);
		
		// Calculate the angle of the target relative to this projectile.
		var target = me.game.world.getChildByGUID(this.targetGUID);
		var targetAngle = 0;
		
		// Confirm the target still exists.
		if (target != null) {
			targetAngle = Math.atan2(target.pos.y - this.pos.y, target.pos.x - this.pos.x);
		//The target no longer exists, so remove the projectile from the map.
		} else {
			me.game.world.removeChild(this);
		}
		
		// Check if the projectile needs to be pointed at the target.
		if (this.rotated == false) {
			// Point this projectile at the target.
			this.renderable.rotate(targetAngle + 90 * Math.PI / 180);
			this.rotated = true;
		}
		
		// Set the direction and speed of the projectile.
		// Increasing the number in a product below will increase the speed of the projectile's movement
		// with	respect to that axis.
		this.body.setVelocity(Math.cos(targetAngle) * 10, Math.sin(targetAngle) * 10);
		
        // Check for collisions
        me.collision.check(this);
		
		this.body.update(dt);

        return true;
    },
	
	onCollision : function (response) {
        // Check if the projectile hit its target.
        if (response.b.GUID == this.targetGUID) {
			// Remove the projectile and position marker from the map.
			me.game.world.removeChild(response.a);
			me.game.world.removeChild(response.b);
			
			// Distribute damage to each target within the bomb's explosion radius.
			var i;
			// Find all targets in the world that have a name of "killMe".
			var targetsArray = me.game.world.getChildByName("killMe");
			
			// Select the closest target within range of the tower.
			var i, shortestTargetDistance = this.range + 7;
			for (i = 0; i < targetsArray.length; i++) {
				targetDistance = Math.sqrt(
					Math.pow(targetsArray[i].pos.x - this.pos.x, 2) +
					Math.pow(targetsArray[i].pos.y - this.pos.y, 2)
				);
				
				// Check if the target is within range and closer to this tower than previously
				//checked targets.
				if ((targetDistance <= this.range) && (targetDistance < shortestTargetDistance)) {
					shortestTargetDistance = targetDistance;
					target = targetsArray[i];
				}
			}
			
			for (i = 0; i < this.targetsInRangeGUIDs.length; i++) {
				var singleTarget = me.game.world.getChildByGUID(this.targetsInRangeGUIDs[i]);
				
				// Check that the target still exists in the game world.
				if (singleTarget != null) {
					// Lower the health of the target.
					singleTarget.health -= this.damage;
					// Remove the target from the map if appropriate. Otherwise, have the target flicker if
					// it took	damage but is still alive following this collision.
					// This is a temporary means of removing the target given this POC works with older
					// enemy code. Once this POC is merged with master, removal of targets with 0 health
					// will most likely be done by enemy object code.
					if (singleTarget.health <= 0) {
						me.game.world.removeChild(singleTarget);
					} else {
						singleTarget.renderable.flicker(500);
					}
				}
			}
			
			return false;
        }

        return false;
    }
});
*/