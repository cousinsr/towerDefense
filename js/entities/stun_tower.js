game.StunTower = me.Entity.extend(
{
    init: function (x, y, settings)
    {
        // Update settings:
        //  - tower image
        //  - client (tile) height/width
        // NOTE - the current image in /data/img/towers is a placeholder
        // and will need to be replaced.
        settings.image = "NihilAce-pack_4_stunTowerSnip";
        settings.framewidth = TILE_WIDTH;
        settings.frameheight = TILE_HEIGHT;

        // Construct and postion tower in the center of tower node.
        this._super(me.Entity, "init", [x, y, settings]);

        // Set tower cost
        this.towerCost = TOWER_COST_STUN;

		// Set the fraction of target speed that will be taken away upon hit.
		// this.speedModifier = 0.75;
		
		// Set the length of time in milliseconds the enemy will be stunned
		this.stunTime = 10000;
		
		// Set attack cooldown variables.
		this.cooldownActive = false;
		this.cooldownDuration = 4000; // Milliseconds
		this.cooldownTimeCount = 0; // Milliseconds
		
		// Set tower attack range.
		this.range = 4 * ((TILE_WIDTH + TILE_HEIGHT) / 2); // Range = rangeMultipler * tileSize
		// centerX and centerY are used to take into account "top lefty-ness" of entity position when
		// checking if targets are in attack range.
		this.centerOffsetX = TILE_WIDTH / 2;
		this.centerOffsetY = TILE_HEIGHT / 2;
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
			var targetsInRangeGUIDs = [];
			
			// Select the targets within range of the tower.
			var i;
			for (i = 0; i < game.data.enemies.length; i++) {
				var targetDistance = Math.sqrt(
					Math.pow((game.data.enemies[i].pos.x + this.centerOffsetX) -
						(this.pos.x + this.centerOffsetX), 2) +
					Math.pow((game.data.enemies[i].pos.y + this.centerOffsetY) -
						(this.pos.y + this.centerOffsetY), 2)
				);
				
				// Check if the target is within range of this tower.
				if (targetDistance <= this.range) {
					targetsInRangeGUIDs.push(game.data.enemies[i].GUID);
				}
			}
			
			// Check if the tower needs to react to a target.
			if (targetsInRangeGUIDs.length > 0) {
				// Generate a stun effect on the tower.
				me.game.world.addChild(
					me.pool.pull("stunEffect", this.pos.x, this.pos.y,
					{width: TILE_WIDTH, height: TILE_HEIGHT}, null, 0, 0)
				);
				// Generate stun effects around the tower.
				// Left of tower.
				me.game.world.addChild(
					me.pool.pull("stunEffect", this.pos.x, this.pos.y,
					{width: TILE_WIDTH, height: TILE_HEIGHT}, null, -1 * TILE_WIDTH, 0)
				);
				// Right of tower.
				me.game.world.addChild(
					me.pool.pull("stunEffect", this.pos.x, this.pos.y,
					{width: TILE_WIDTH, height: TILE_HEIGHT}, null, TILE_WIDTH, 0)
				);
				// Above the tower.
				me.game.world.addChild(
					me.pool.pull("stunEffect", this.pos.x, this.pos.y,
					{width: TILE_WIDTH, height: TILE_HEIGHT}, null, 0, -1 * TILE_HEIGHT)
				);
				// Below the tower.
				me.game.world.addChild(
					me.pool.pull("stunEffect", this.pos.x, this.pos.y,
					{width: TILE_WIDTH, height: TILE_HEIGHT}, null, 0, TILE_HEIGHT)
				);
				
				// Generate a stun attack sound.
				me.audio.play("qubodup-PowerDrain");
				
				// Reduce the speed of each target within range, and flicker each impacted target.
				var j;
				for (j = 0; j < targetsInRangeGUIDs.length; j++) {
					var k, singleTarget = null;
					for (k = 0; k < game.data.enemies.length; k++) {
						if (game.data.enemies[k].GUID == targetsInRangeGUIDs[j]) {
							singleTarget = game.data.enemies[k];
							break;
						}
					}
					singleTarget.renderable.flicker(500);
					singleTarget.stunned = true;
					singleTarget.stunTimer = this.stunTime;
					
					// Set a position for the stun effect that is offset from the target.
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
					
					// Generate an effect near the target.
					me.game.world.addChild(
						me.pool.pull("stunEffect", singleTarget.pos.x, singleTarget.pos.y,
						{width: TILE_WIDTH, height: TILE_HEIGHT}, singleTarget.GUID, xOffset, yOffset)
					);
				}
				
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


game.StunEffect = me.Entity.extend(
{
    init: function (x, y, settings, targetGUID, xOffset, yOffset)
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
        this.renderable.addAnimation("stunCloud", [22]);

        // Set initial animation.
        this.renderable.setCurrentAnimation("stunCloud");
		
		// Set the target over which this effect will appear.
		this.targetGUID = targetGUID;
		
		// Set this entity to be transparent.
		this.renderable.setOpacity(0.95);
		
		// Set this entity to flicker for the 250 ms.
        this.renderable.flicker(250);

        // Set up a countdown as a timer (in milliseconds) before this entity is removed.
        this.countdown = 250;
    },

    update : function (dt) {
		if (game.data.isPaused) {
			return true;
		}
		// Update the animation appropriately
        this._super(me.Entity, "update", [dt]);
		
		// Check if the effect needs to move to stay on target.
		if (this.targetGUID != null) {
			// Check that the target still exists.
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
		
		// Rotate the effect by 10 degrees.
		this.renderable.rotate(10 * Math.PI / 180);
		
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