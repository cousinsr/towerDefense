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
		this.alive = true;
    },

    update : function (dt) {
        // Update the animation appropriately
        this._super(me.Entity, "update", [dt]);
		
        // Update countdown
        this.countdown -= dt;

        // Remove the entity after the countdown reaches 0
        if (this.countdown <= 0) {
            me.game.world.removeChild(this);
			if (game.data.dyingEnemies.includes(this)) {
				game.data.dyingEnemies.splice(game.data.dyingEnemies.indexOf(this), 1);
			}
        }

        return true;
    }
});