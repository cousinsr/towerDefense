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
		this.cooldownDuration = 6000; // Milliseconds
		this.cooldownTimeCount = 0; // Milliseconds
		
		// Set tower attack range and bomb explosion radius variables.
		this.range = 6 * 64; // Range = rangeMultipler * tileSize
		this.explosionRadius = 3 * 64;
		
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
			
			// Find all targets in the world that have a name of "enemy".
			var targetsArray = me.game.world.getChildByName("enemy");
			
			// Select the closest target within range of the tower.
			var i, shortestTargetDistance = this.range + 7;
			for (i = 0; i < targetsArray.length; i++) {
				var targetDistance = Math.sqrt(
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
        this.renderable.addAnimation("positionMarked", [272]);

        // Set initial animation.
        this.renderable.setCurrentAnimation("positionMarked");
		
		// Set this entity to be invisible.
		this.renderable.setOpacity(0);
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

		this.damage = 4;
		this.hit = null;

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
			// Remove the projectile from the map.
			me.game.world.removeChild(response.a);
			
			// Spawn a static temporary decal effect.
			var blastSite = me.game.world.addChild(
				me.pool.pull("groundDecal", response.b.pos.x, response.b.pos.y,
				{width: TILE_WIDTH, height: TILE_HEIGHT})
			);
			
			// Remove the position marker from the map.
			me.game.world.removeChild(response.b);
			
			/*
			// Generate effects around the point of impact and within the bomb's explosion radius.
			var blastX = 0, blastY = 0;
			// Fill each row with effects.
			while (blastY < this.explosionRadius) {
				// Fill each column with effects.
				while (blastX < this.explosionRadius) {
					// Check the distance between the point to place an effect at, and the point of impact.
					var pointDistance = Math.sqrt(
						Math.pow(blastX, 2) + Math.pow(blastY, 2)
					);
					
					// Set the duration of the effect at pointDistance from the point of impact.
					// The further out the effect is from the point of impact, the lower its duration.
					var effectLifetime = 500 *
						(this.explosionRadius - pointDistance) / this.explosionRadius;
					
					// Spawn effects in each quadrant, and at random.
					// Ensure that effects are only generated inside the bomb's explosion radius.
					if (pointDistance <= this.explosionRadius) {
						if (Math.floor(Math.random() * 6) == 0) {
							me.game.world.addChild(
								me.pool.pull("explosionEffect",
								blastSite.pos.x + blastX, blastSite.pos.y + blastY,
								{width: TILE_WIDTH, height: TILE_HEIGHT}, null, effectLifetime)
							);
						}
						if (Math.floor(Math.random() * 6) == 0) {
							me.game.world.addChild(
								me.pool.pull("explosionEffect",
								blastSite.pos.x - blastX, blastSite.pos.y + blastY,
								{width: TILE_WIDTH, height: TILE_HEIGHT}, null, effectLifetime)
							);
						}
						if (Math.floor(Math.random() * 6) == 0) {
							me.game.world.addChild(
								me.pool.pull("explosionEffect",
								blastSite.pos.x + blastX, blastSite.pos.y - blastY,
								{width: TILE_WIDTH, height: TILE_HEIGHT}, null, effectLifetime)
							);
						}
						if (Math.floor(Math.random() * 6) == 0) {
							me.game.world.addChild(
								me.pool.pull("explosionEffect",
								blastSite.pos.x - blastX, blastSite.pos.y - blastY,
								{width: TILE_WIDTH, height: TILE_HEIGHT}, null, effectLifetime)
							);
						}
					}
					
					blastX += TILE_WIDTH / 4;
				}
				blastX = 0;
				blastY += TILE_HEIGHT / 4;
			}*/
			
			// Find all targets in the world that have a name of "enemy".
			var targetsArray = me.game.world.getChildByName("enemy");
			
			// Distribute damage to each target within the bomb's explosion radius.
			var i;
			for (i = 0; i < targetsArray.length; i++) {
				// The targetDistance calculation uses the coordinates of the target hit (blastSite)
				// instead of the projectile (response.a, or "this") because the explosion is intended
				// emanate from the point of impact that is where the projectile meets the target.
				// The projectile position is to the left of that point of impact by TILE_WIDTH.
				var targetDistance = Math.sqrt(
					Math.pow(targetsArray[i].pos.x - blastSite.pos.x, 2) +
					Math.pow(targetsArray[i].pos.y - blastSite.pos.y, 2)
				);
				
				// Check if the target is within the bomb's explosion radius.
				if (targetDistance <= this.explosionRadius) {
					// Lower the health of the target.
					targetsArray[i].health -= this.damage;
					// Have the target flicker if it is still alive, and apply an effect to the target.
					if (targetsArray[i].health > 0) {
						targetsArray[i].renderable.flicker(1000);
						me.game.world.addChild(
								me.pool.pull("explosionEffect",
								targetsArray[i].pos.x, targetsArray[i].pos.y,
								{width: TILE_WIDTH, height: TILE_HEIGHT}, targetsArray[i].GUID, 1000)
						);
					// The target died, so place an effect at its current position.
					} else {
						// Set the duration of the effect at targetDistance from the point of impact.
						// The further out the effect is from the point of impact, the lower its duration.
						var effectLifetime = 1000 *
							(this.explosionRadius - targetDistance) / this.explosionRadius;
						
						me.game.world.addChild(
								me.pool.pull("explosionEffect",
								targetsArray[i].pos.x, targetsArray[i].pos.y,
								{width: TILE_WIDTH, height: TILE_HEIGHT}, null, effectLifetime)
						);
					}
				}
			}
			
			return true;
        }

        return false;
    }
});


game.ExplosionEffect = me.Entity.extend(
{
    init: function (x, y, settings, targetGUID, lifetime)
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
        this.renderable.addAnimation("explodeEffect", [298]);

        // Set initial animation.
        this.renderable.setCurrentAnimation("explodeEffect");
		
		// Set the target over which this effect will appear.
		this.targetGUID = targetGUID;
		
		// Set this entity to be transparent.
		this.renderable.setOpacity(0.95);
		
		// Set this entity to flicker for the lifetime ms.
        this.renderable.flicker(lifetime);

        // Set up a countdown as a timer (in milliseconds) before this entity is removed.
        this.countdown = lifetime;
    },

    update : function (dt) {
		// Update the animation appropriately
        this._super(me.Entity, "update", [dt]);
		
		// Check if the effect needs to move to stay on target.
		if (this.targetGUID != null) {
			// Confirm that the target still exists.
			var target = me.game.world.getChildByGUID(this.targetGUID);
			if (target != null) {
				// Match this effect's position to the target's position.
				this.pos.x = target.pos.x;
				this.pos.y = target.pos.y;
			} else {
				me.game.world.removeChild(this);
			}
		}

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