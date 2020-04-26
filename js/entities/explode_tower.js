/*
Reference:
Code for calculating target angle, rotating using that angle, and moving a projectile to the target using
that angle is based on code posted by users Ian_ and agmcleod at the forum linked below, with
necessary modifications added for correct functionality in this game.
https://www.html5gamedevs.com/topic/34225-shooting-projectiles-in-a-specific-direction/
*/

game.ExplodeTower = me.Entity.extend(
{
    init: function (x, y, settings)
    {
        // Update settings:
        //  - tower image
        //  - client (tile) height/width
        // NOTE - the current image in /data/img/towers is a placeholder
        // and will need to be replaced.
        settings.image = "towerDefense";
        settings.framewidth = TILE_WIDTH;
        settings.frameheight = TILE_HEIGHT;

        // Construct and postion tower in the center of tower node.
        this._super(me.Entity, "init", [x, y, settings]);
		
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
					me.pool.pull("positionMarker", target.pos.x, target.pos.y,
					{width: TILE_WIDTH, height: TILE_HEIGHT})
				);
				
				// Launch a projectile at the target's current position marker.
				me.game.world.addChild(
					me.pool.pull("bomb", this.pos.x, this.pos.y,
					{width: TILE_WIDTH, height: TILE_HEIGHT}, targetPosition.GUID, this.explosionRadius)
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
    init: function (x, y, settings)
    { 
        // Set the image file.
        settings = {};
        settings.image = "towerDefense";

        // Set the size to match the sprite sheet.
        settings.framewidth = settings.width = TILE_WIDTH;
        settings.frameheight = settings.height = TILE_HEIGHT;

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


game.Bomb = me.Entity.extend({
    init : function (x, y, settings, targetGUID, explosionRadius)
	{
        // Set the image file.
        settings = {};
        settings.image = "towerDefense";

        // Set the size to match the sprite sheet.
        settings.framewidth = settings.width = TILE_WIDTH;
        settings.frameheight = settings.height = TILE_HEIGHT;

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
					// Have the target flicker if it took damage but is still alive following this
					// collision.
					if (targetsArray[i].health > 0) {
						targetsArray[i].renderable.flicker(500);
					}
				}
			}
			
			return true;
        }

        return false;
    }
});