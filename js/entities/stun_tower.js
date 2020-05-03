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
		
		// Set the fraction of target speed that will be taken away upon hit.
		// this.speedModifier = 0.75;
		
		// Set the length of time in milliseconds the enemy will be stunned
		this.stunTime = 10000;
		
		// Set attack cooldown variables.
		this.cooldownActive = false;
		this.cooldownDuration = 4000; // Milliseconds
		this.cooldownTimeCount = 0; // Milliseconds
		
		// Set tower attack range.
		this.range = 3.5 * 64; // Range = rangeMultipler * tileSize
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
			var targetsInRangeGUIDs = [];
			
			// Find all targets in the world that have a name of "enemy".
			var targetsArray = me.game.world.getChildByName("enemy");
			
			// Select the targets within range of the tower.
			var i;
			for (i = 0; i < targetsArray.length; i++) {
				var targetDistance = Math.sqrt(
					Math.pow(targetsArray[i].pos.x - this.pos.x, 2) +
					Math.pow(targetsArray[i].pos.y - this.pos.y, 2)
				);
				
				// Check if the target is within range of this tower.
				if (targetDistance <= this.range) {
					targetsInRangeGUIDs.push(targetsArray[i].GUID);
				}
			}
			
			// Check if the tower needs to react to a target.
			if (targetsInRangeGUIDs.length > 0) {
				// Generate a stun effect on the tower.
				me.game.world.addChild(
					me.pool.pull("stunEffect", this.pos.x, this.pos.y,
					{width: TILE_WIDTH, height: TILE_HEIGHT}, null)
				);
				// Generate stun effects around the tower.
				// Left of tower.
				me.game.world.addChild(
					me.pool.pull("stunEffect", this.pos.x - TILE_WIDTH, this.pos.y,
					{width: TILE_WIDTH, height: TILE_HEIGHT}, null)
				);
				// Right of tower.
				me.game.world.addChild(
					me.pool.pull("stunEffect", this.pos.x + TILE_WIDTH, this.pos.y,
					{width: TILE_WIDTH, height: TILE_HEIGHT}, null)
				);
				// Above the tower.
				me.game.world.addChild(
					me.pool.pull("stunEffect", this.pos.x, this.pos.y - TILE_HEIGHT,
					{width: TILE_WIDTH, height: TILE_HEIGHT}, null)
				);
				// Below the tower.
				me.game.world.addChild(
					me.pool.pull("stunEffect", this.pos.x, this.pos.y + TILE_HEIGHT,
					{width: TILE_WIDTH, height: TILE_HEIGHT}, null)
				);
				
				// Reduce the speed of each target within range, and flicker each impacted target.
				var j;
				for (j = 0; j < targetsInRangeGUIDs.length; j++) {
					var singleTarget = me.game.world.getChildByGUID(targetsInRangeGUIDs[j]);
					//singleTarget.speed *= this.speedModifier;
					singleTarget.renderable.flicker(500);
					singleTarget.stunned = true;
					singleTarget.stunTimer = this.stunTime;
					
					// Generate a stun effect on the target.
					me.game.world.addChild(
						me.pool.pull("stunEffect", singleTarget.pos.x, singleTarget.pos.y,
						{width: TILE_WIDTH, height: TILE_HEIGHT}, singleTarget.GUID)
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
    init: function (x, y, settings, targetGUID)
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