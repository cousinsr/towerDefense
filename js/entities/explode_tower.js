/*
Reference:
Code for calculating target angle, rotating using that angle, and moving a projectile to the target using
that angle is based on code posted by users Ian_ and agmcleod at the forum linked below, with
necessary modifications added for correct functionality in this game.
https://www.html5gamedevs.com/topic/34225-shooting-projectiles-in-a-specific-direction/
*/


/*
Class for an explosion attack tower entity

Parameters:
---x and y coordinates for the location of the tower on the map.
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
        this.renderable.addAnimation("exist", [206]);

        // Set initial animation
        this.renderable.setCurrentAnimation("exist");

        // Set tower cost
        this.towerCost = TOWER_COST_EXPLODE;

		// Set attack cooldown variables.
		this.cooldownActive = false;
		this.cooldownDuration = 6000; // Milliseconds
		this.cooldownTimeCount = 0; // Milliseconds
		
		// Set tower attack range and bomb explosion radius variables.
		this.range = 6 * ((TILE_WIDTH + TILE_HEIGHT) / 2); // Range = rangeMultipler * tileSize
		this.explosionRadius = 3 * ((TILE_WIDTH + TILE_HEIGHT) / 2);
		// centerX and centerY are used to take into account "top lefty-ness" of entity position when
		// checking if targets are in attack range.
		this.centerOffsetX = TILE_WIDTH / 2;
		this.centerOffsetY = TILE_HEIGHT / 2;
		
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
			
			// Select the closest target within range of the tower.
			var i, shortestTargetDistance = this.range + 7;
			for (i = 0; i < game.data.enemies.length; i++) {
				var targetDistance = Math.sqrt(
					Math.pow((game.data.enemies[i].pos.x + this.centerOffsetX) -
						(this.pos.x + this.centerOffsetX), 2) +
					Math.pow((game.data.enemies[i].pos.y + this.centerOffsetY) -
						(this.pos.y + this.centerOffsetY), 2)
				);
				
				// Check if the target is within range and closer to this tower than previously
				// checked targets.
				if ((targetDistance <= this.range) && (targetDistance < shortestTargetDistance)) {
					shortestTargetDistance = targetDistance;
					target = game.data.enemies[i];
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
				
				// Generate a bomb launch sound.
				me.audio.play("rlauncher");
				
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


/*
Class for a static position marker entity that is placed at a location where a projectile entity is
intended to travel to. In other words, this entity is a static target for a projectile entity.
This entity is used by the RangeTower entities' projectiles when their initially assigned enemy targets
cease to exist before they reach them. All projectiles of the ExplodeTower entities are set to travel to
PositionMarker entities.

Parameters:
---x and y coordinates for the location of the static position marker on the map.

Note:
This entity uses an image that is by default set to be invisible. For debugging purposes that invisibility
can be disabled when the developer needs to see where a PositionMarker entity is placed on the map.
*/
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
		if (!game.data.isPaused) {
            this._super(me.Entity, "update", [dt]);
		}
		return true;
    },

	onCollision : function (response) {
        return false;
    }
});


/*
Class for a bomb projectile entity used by the explosion attack tower entity

Parameters:
---x and y coordinates for the initial location of the missile on the map.
---The GUID of the target entity that the missile will travel to.
---The radius of the explosion damage range of the bomb.

Note:
melonJS documentation regarding the GUID value:
http://melonjs.github.io/melonJS/docs/me.Renderable.html#.GUID
*/
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
        this.renderable.addAnimation("exist", [252]);

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
		this.positionMarkerTarget = me.game.world.getChildByGUID(targetGUID);
		this.rotated = false;
		
		// Set the explosion radius of this bomb.
		this.explosionRadius = explosionRadius;
		// centerX and centerY are used to take into account "top lefty-ness" of entity position when
		// checking if targets are in explosion range.
		this.centerOffsetX = TILE_WIDTH / 2;
		this.centerOffsetY = TILE_HEIGHT / 2;
    },

    update : function (dt) {
		if (game.data.isPaused) {
			return true;
		}
        // Update the animation appropriately
        this._super(me.Entity, "update", [dt]);
		
		// Calculate the angle of the target relative to this projectile.
		var target = this.positionMarkerTarget;
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
        if (response.b.GUID == this.positionMarkerTarget.GUID) {
			// Remove the projectile from the map.
			me.game.world.removeChild(response.a);
			
			// Generate an explosion sound.
			me.audio.play("explode");
			
			// Spawn a static temporary decal effect.
			var blastSite = me.game.world.addChild(
				me.pool.pull("groundDecal", response.b.pos.x, response.b.pos.y,
				{width: TILE_WIDTH, height: TILE_HEIGHT})
			);
			
			// Remove the position marker from the map.
			me.game.world.removeChild(response.b);
			
			// Distribute damage to each target within the bomb's explosion radius.
			var i;
			for (i = 0; i < game.data.enemies.length; i++) {
				// The targetDistance calculation uses the coordinates of the target hit (blastSite)
				// instead of the projectile (response.a, or "this") because the explosion is intended
				// emanate from the point of impact that is where the projectile meets the target.
				var targetDistance = Math.sqrt(
					Math.pow((game.data.enemies[i].pos.x + this.centerOffsetX) -
						(blastSite.pos.x + this.centerOffsetX), 2) +
					Math.pow((game.data.enemies[i].pos.y + this.centerOffsetY) -
						(blastSite.pos.y + this.centerOffsetY), 2)
				);
				
				// Check if the target is within the bomb's explosion radius.
				if (targetDistance <= this.explosionRadius) {
					// Lower the health of the target.
					game.data.enemies[i].health -= this.damage;
					
					// Set a position for the explosion effect that is offset from the target.
					// The position of the effect relative to the target is offset instead of being
					// placed directly on the target because we have not yet found a solution for the
					// bug where sometimes effects are placed below (obscured by) the target.
					var xOffset = 0;
					var yOffset = 0;
					var positionOffset = Math.floor(Math.random() * 8);
					
					// Set the position offset of the stun effect from the target.
					switch (positionOffset) {
						// East of target.
						case 0:
							xOffset = TILE_WIDTH * 0.5;
							yOffset = 0;
							break;
						// West of target.
						case 1:
							xOffset = TILE_WIDTH * -0.5;
							yOffset = 0;
							break;
						// North of target.
						case 2:
							xOffset = 0;
							yOffset = TILE_WIDTH * -0.5;
							break;
						// South of target.
						case 3:
							xOffset = 0;
							yOffset = TILE_WIDTH * 0.5;
							break;
						// Southeast of target.
						case 4:
							xOffset = TILE_WIDTH * 0.5;
							yOffset = TILE_WIDTH * 0.5;
							break;
						// Southwest of target.
						case 5:
							xOffset = TILE_WIDTH * -0.5;
							yOffset = TILE_WIDTH * 0.5;
							break;
						// Northeast of target.
						case 6:
							xOffset = TILE_WIDTH * 0.5;
							yOffset = TILE_WIDTH * -0.5;
							break;
						// Northwest of target.
						case 7:
							xOffset = TILE_WIDTH * -0.5;
							yOffset = TILE_WIDTH * -0.5;
					}
					
					// Have the target flicker if it is still alive, and apply an effect to the target.
					if (game.data.enemies[i].health > 0) {
						game.data.enemies[i].renderable.flicker(1000);
						
						// Generate an effect near the target.
						me.game.world.addChild(
								me.pool.pull("explosionEffect",
								game.data.enemies[i].pos.x, game.data.enemies[i].pos.y,
								{width: TILE_WIDTH, height: TILE_HEIGHT}, game.data.enemies[i].GUID,
								xOffset, yOffset, 1000)
						);
					// The target died, so place an effect at its current position.
					} else {
						// Set the duration of the effect at targetDistance from the point of impact.
						// The further out the effect is from the point of impact, the lower its duration.
						var effectLifetime = 1000 *
							(this.explosionRadius - targetDistance) / this.explosionRadius;
						
						// Generate an effect near the target.
						me.game.world.addChild(
								me.pool.pull("explosionEffect",
								game.data.enemies[i].pos.x, game.data.enemies[i].pos.y,
								{width: TILE_WIDTH, height: TILE_HEIGHT}, null, xOffset, yOffset,
								effectLifetime)
						);
					}
				}
			}
			
			return true;
        }

        return false;
    }
});


/*
Class for an explosion effect entity used by the explosion attack tower entity

Parameters:
---x and y coordinates for the initial location of the effect on the map.
---The GUID of the target entity that the effect will be placed near to, if any.
---The horizontal and vertical positional offset distance to shift the effect relative to its location.
This positional offset is used to help ensure the effect is always visible near its intended target since
there is an unsolved bug where effects placed directly on a target are sometimes not visible.
---The duration of this effect in milliseconds.

Note:
melonJS documentation regarding the GUID value:
http://melonjs.github.io/melonJS/docs/me.Renderable.html#.GUID
*/
game.ExplosionEffect = me.Entity.extend(
{
    init: function (x, y, settings, targetGUID, xOffset, yOffset, lifetime)
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

		// Set the positional offset of this effect from its target.
		this.xOffset = xOffset;
		this.yOffset = yOffset;

        // Call the parent constructor.
        this._super(me.Entity, 'init', [x + xOffset, y + yOffset, settings]);

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
		if (game.data.isPaused) {
			return true;
		}
		// Update the animation appropriately
        this._super(me.Entity, "update", [dt]);
		
		// Check if the effect needs to move to stay on target.
		if (this.targetGUID != null) {
			// Confirm that the target still exists.
			var i, target = null;
			for (i = 0; i < game.data.enemies.length; i++) {
				if (game.data.enemies[i].GUID == this.targetGUID) {
					target = game.data.enemies[i];
					break;
				}
			}
			
			if (target != null) {
				// Match this effect's position to the target's position.
				this.pos.x = target.pos.x + this.xOffset;
				this.pos.y = target.pos.y + this.yOffset;
			// The target no longer exists, so remove this effect from the play screen.
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