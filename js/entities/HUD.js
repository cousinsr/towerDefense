/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};


game.HUD.Container = me.Container.extend({

    init: function() {
        // call the constructor
        this._super(me.Container, 'init');

        // persistent across level change
        this.isPersistent = true;

        // make sure we use screen coordinates
        this.floating = true;

        // give a name
        this.name = "HUD";

        // add our child score object at the top left corner
        //this.addChild(new game.HUD.ScoreItem(5, 5));
		
		// Add the player "life" indicator to the HUD.
		this.addChild(new game.HUD.LifeItem(-10, -10));
    }
});


/**
 * a basic HUD item to display score
 */
game.HUD.ScoreItem = me.Renderable.extend({
    /**
     * constructor
     */
    init: function(x, y) {

        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, 'init', [x, y, 10, 10]);

        // local copy of the global score
        this.score = -1;
    },

    /**
     * update function
     */
    update : function () {
        // we don't do anything fancy here, so just
        // return true if the score has been updated
        if (this.score !== game.data.score) {
            this.score = game.data.score;
            return true;
        }
        return false;
    },

    /**
     * draw the score
     */
    draw : function (context) {
        // draw it baby !
    }

});


/**
 * HUD item to display player life.
 */
game.HUD.LifeItem = me.Renderable.extend({
    /**
     * constructor
     */
    init: function(x, y) {

        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, 'init', [x, y, 10, 10]);

		// create the font object
		this.font = new me.BitmapText(x, y, {font:"PressStart2P"});

		// Align the font to the right and bottom of the screen.
		this.font.textAlign = "right";
		this.font.textBaseline = "bottom";
		
		// Set the font color to red.
		this.tint = new me.Color(255, 0, 0);

        // Local copy of the global life.
        this.life = -1;
    },

    /**
     * update function
     */
    update : function () {
        // we don't do anything fancy here, so just
        // return true if the life has been updated
        if (this.life != game.data.life) {
            this.life = game.data.life;
            return true;
        }
        return false;
    },

    /**
     * draw the life balance
     */
    draw : function (renderer) {
		// Treating the bottom right corner of the game play screen as the origin of (0,0), we can 
		// use this.pos.x and this.pos.y to shift HUD font left and up from the bottom right of the screen.
		this.font.draw (renderer, "Life: " + game.data.life, me.game.viewport.width + this.pos.x,
			me.game.viewport.height - TILE_HEIGHT);
		
		// Check if the player is out of life balance.
		// Note: This is a temporary game over indicator until the "end of game screen" is implemented.
		if (game.data.life <= 0) {
			this.font.draw (renderer, "Game Over", me.game.viewport.width + this.pos.x,
			me.game.viewport.height + this.pos.x);
		}
    }
});