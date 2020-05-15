/*
Reference:
Code for calculating target angle, rotating using that angle, and moving a projectile to the target using
that angle is based on code posted by users Ian_ and agmcleod at the forum linked below, with
necessary modifications added for correct functionality in this game.
https://www.html5gamedevs.com/topic/34225-shooting-projectiles-in-a-specific-direction/
*/

game.RangeTower = me.Entity.extend(
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
        this.renderable.addAnimation("exist", [250]);

        // Set initial animation
        this.renderable.setCurrentAnimation("exist");

        // Set tower cost
        this.towerCost = TOWER_COST_RANGE;

		// Set attack cooldown variables.
		this.cooldownActive = false;
		this.cooldownDuration = 1000; // Milliseconds
		this.cooldownTimeCount = 0; // Milliseconds
		
		// Set attack range variable.
		this.range = 3.5 * 64; // Range = rangeMultipler * tileSize
		
        // Set target tracking variables.
		this.lastTargetAngle = 0;
		this.lastTargetGUID = null;
    },
	
	update : function (dt) {
		if (game.data.isPaused) {
			return true;
		}
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
				// Attempt to get the previous target object.
				var i, lastTarget = null;
				for (i = 0; i < game.data.enemies.length; i++) {
					if (game.data.enemies[i].GUID == this.lastTargetGUID) {
						lastTarget = game.data.enemies[i];
						break;
					}
				}
				
				// Check if the last target attacked by this tower still exists in the game world.
				if (lastTarget != null) {
					var lastTargetDistance = Math.sqrt(
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
				// Select the closest target within range of the tower.
				var i, shortestTargetDistance = this.range + 7;
				for (i = 0; i < game.data.enemies.length; i++) {
					var targetDistance = Math.sqrt(
						Math.pow(game.data.enemies[i].pos.x - this.pos.x, 2) +
						Math.pow(game.data.enemies[i].pos.y - this.pos.y, 2)
					);
					
					// Check if the target is within range and closer to this tower than previously
					// checked targets.
					if ((targetDistance <= this.range) && (targetDistance < shortestTargetDistance)) {
						shortestTargetDistance = targetDistance;
						target = game.data.enemies[i];
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
					me.pool.pull("missile", this.pos.x, this.pos.y,
						{width: TILE_WIDTH, height: TILE_HEIGHT}, target.GUID)
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


game.Missile = me.Entity.extend({
    init : function (x, y, settings, targetGUID)
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

		this.damage = 2;
		this.hit = null;

		// Set the projectile target and initial rotation (towards target) status.
		this.targetGUID = targetGUID;
		this.rotated = false;
		
		// Track the last known coordinates of the target.
		var i, target = null;
		for (i = 0; i < game.data.enemies.length; i++) {
			if (game.data.enemies[i].GUID == this.targetGUID) {
				target = game.data.enemies[i];
				break;
			}
		}
		this.targetLastXPos = target.pos.x;
		this.targetLastYPos = target.pos.y;
		
		// freeAgent is false if the projectile has an exclusive target.
		// freeAgent is true if the projectile is allowed to collide with any enemy target.
		this.freeAgent = false;
		
		this.positionMarkerTarget = null;
    },

    update : function (dt) {
		if (game.data.isPaused) {
			return false;
		}
        // Update the animation appropriately
        this._super(me.Entity, "update", [dt]);
		
		var target = null;
		// Check if the missile has an assigned enemy target.
		if (!this.freeAgent) {
			var i;
			for (i = 0; i < game.data.enemies.length; i++) {
				if (game.data.enemies[i].GUID == this.targetGUID) {
					target = game.data.enemies[i];
					break;
				}
			}
		// The target is a positionMarker entity.
		} else {
			target = this.positionMarkerTarget;
		}
		
		// Confirm the target still exists.
		if (target != null) {
			this.targetLastXPos = target.pos.x;
			this.targetLastYPos = target.pos.y;
		//The target no longer exists, so replace it with a static position marker.
		} else {
			target = me.game.world.addChild(
						me.pool.pull("positionMarker", this.targetLastXPos, this.targetLastYPos,
						{width: TILE_WIDTH, height: TILE_HEIGHT})
					);
			this.targetGUID = target.GUID;
			this.freeAgent = true;
			this.positionMarkerTarget = target;
		}
		
		// Calculate the angle of the target relative to this projectile.
		var targetAngle = Math.atan2(target.pos.y - this.pos.y, target.pos.x - this.pos.x);
		
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
        // Check if the projectile hit its original target, or if it is a free agent and hit an enemy.
        if ((!this.freeAgent && response.b.GUID == this.targetGUID) ||
		(this.freeAgent && response.b.name == "enemy")) {
			// Remove the projectile from the map.
			me.game.world.removeChild(response.a);
			// Lower the health of the target.
			if (this.hit != response.b) {
				this.hit = response.b;
				response.b.health -= this.damage;
			}
			// Have the target flicker if it took damage but is still alive following this collision.
			if (response.b.health > 0) {
				response.b.renderable.flicker(500);
			}
			// Check if a static position marker needs to be removed.
			if (this.freeAgent) {
				me.game.world.removeChild(this.positionMarkerTarget);
			}
			
			return true;
		// Check if the projectile is a free agent that hit its static position marker.
        } else if (this.freeAgent && response.b.GUID == this.targetGUID) {
			// Remove the projectile from the map.
			me.game.world.removeChild(response.a);
			// Spawn a static temporary decal effect.
			me.game.world.addChild(
				me.pool.pull("groundDecal", response.b.pos.x, response.b.pos.y,
				{width: TILE_WIDTH, height: TILE_HEIGHT})
			);
			// Remove the static position marker from the map.
			me.game.world.removeChild(response.b);
			
			return true;
		}

        return false;
    }
});


game.GroundDecal = me.Entity.extend(
{
    init: function (x, y, settings)
    { 
        // Update settings:
        //  - tower image
        //  - client (tile) height/width
        // NOTE - the current image in /data/img/towers is a placeholder
        // and will need to be replaced.
        settings = {};
        settings.image = "towerDefense";
        settings.framewidth = settings.width = TILE_WIDTH;
        settings.frameheight = settings.height = TILE_HEIGHT;

        // Call the parent constructor.
        this._super(me.Entity, 'init', [x, y, settings]);

		// Set animations.
        this.renderable.addAnimation("groundDecal", [21]);

        // Set initial animation.
        this.renderable.setCurrentAnimation("groundDecal");

        // Set up a countdown as a timer (in milliseconds) before this entity is removed.
        this.countdown = 1000;
    },

    update : function (dt) {
		if (game.data.isPaused) {
			return true;
		}
		// Update the animation appropriately
        this._super(me.Entity, "update", [dt]);
		
		// Update the countdown.
        this.countdown -= dt;

        // Remove the entity after the countdown reaches 0.
        if (this.countdown <= 0) {
            me.game.world.removeChild(this);
        }
		
		return true;
    },

	onCollision : function (response) {
        return false;
    }
});