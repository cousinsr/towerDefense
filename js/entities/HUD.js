/********************************************************************
 * HUD for the information in the bottom right portion of the menu.
 * Each piece of information is a child of the container.
 * 
 * CITATION: This code is very similar to the code used for the MelonJS
 * platformer tutorial at http://melonjs.github.io/tutorial-platformer/
 *  
 ********************************************************************/

game.HUD = game.HUD || {};

game.HUD.Container = me.Container.extend({

    init: function() {
        this._super(me.Container, 'init');
        this.isPersistent = true;
        this.floating = true;
        this.name = "HUD";

        // Add the player "life" indicator to the HUD.
        this.addChild(new game.HUD.LifeItem(-10, -10));

        // Add the wave indicator to the HUD.
        this.addChild(new game.HUD.WaveItem(-10, -10));

        // Add the gold indicator to the HUD.
        this.addChild(new game.HUD.GoldItem(-10, -10));

        // Add the level indicator to the HUD.
        this.addChild(new game.HUD.LevelItem(-10, -10));
    }
});

/********************************************************************
 * HUD item to display player life.
  ********************************************************************/

game.HUD.LifeItem = me.Renderable.extend({

    init: function(x, y) {

        this._super(me.Renderable, 'init', [x, y, 10, 10]);

		// Set the font for this information
		this.font = new me.BitmapText(x, y, {font:"PressStart2P"});

		// Align the font to the right and bottom of the screen
		this.font.textAlign = "right";
		this.font.textBaseline = "bottom";
		
		// Set the font color to red (not currently working)
		// this.tint = new me.Color(255, 0, 0);

        // Local copy of the global life
        this.life = -1;
    },

    update : function () {
        // Keep the local data for life up to date
        if (this.life != game.data.life) {
            this.life = game.data.life;
            return true;
        }
        return false;
    },

    draw : function (renderer) {
		// Treating the bottom right corner of the game play screen as the origin of (0,0), we can 
		// use this.pos.x and this.pos.y to shift HUD font left and up from the bottom right of the screen.
		this.font.draw(renderer, "Life: " + game.data.life, me.game.viewport.width - TILE_WIDTH,
			me.game.viewport.height - TILE_HEIGHT);
		
		// Go to the game over screen if the player is out of life balance.
		if (game.data.life <= 0) {
			me.state.change(me.state.GAMEOVER);
		}
		// Change font color to red if the player has 3 lives or less remaining.
		else if (game.data.life <= 3) {
			this.tint = new me.Color(255, 0, 0);
		}
		

    }
});

/********************************************************************
 * HUD item to display the current wave.
  ********************************************************************/
game.HUD.WaveItem = me.Renderable.extend({

    init: function(x, y) {

        this._super(me.Renderable, 'init', [x, y, 10, 10]);

		// Set the font for this information
		this.font = new me.BitmapText(x, y, {font:"PressStart2P"});

		// Align the font to the right and bottom of the screen
		this.font.textAlign = "right";
		this.font.textBaseline = "bottom";

        // Local copy of the global wave
        this.wave = -1;
    },

    update : function () {
        // Keep the local data for life up to date
        if (this.wave != game.data.wave) {
            this.wave = game.data.wave;
            return true;
        }
        return false;
    },

    draw : function (renderer) {
		// Place it two tiles from the bottom right
		this.font.draw (renderer, "Wave: " + game.data.wave, me.game.viewport.width - TILE_WIDTH,
			me.game.viewport.height - TILE_HEIGHT * 2);
    }
});

/********************************************************************
 * HUD item to display gold.
  ********************************************************************/

game.HUD.GoldItem = me.Renderable.extend(
{
    init: function(x, y)
    {
        this._super(me.Renderable, 'init', [x, y, 10, 10]);

        // Set the font for this information
        this.font = new me.BitmapText(x, y, {font:"PressStart2P"});

        // Align the font to the right and bottom of the screen
        this.font.textAlign = "right";
        this.font.textBaseline = "bottom";

        // Set the font color to red (not currently working)
        // this.tint = new me.Color(255, 0, 0);

        // Local copy of the global gold
        this.gold = -1;
    },

    update : function ()
    {
        // Keep the local data for gold up to date
        if (this.gold != game.data.gold)
        {
            this.gold = game.data.gold;
            return true;
        }
        return false;
    },

    draw : function (renderer)
    {
        // Place it three tiles from the bottom right
        this.font.draw (renderer, "Gold: " + game.data.gold,
            me.game.viewport.width - TILE_WIDTH,
            me.game.viewport.height - TILE_HEIGHT * 3);
    }
});

/********************************************************************
 * HUD item to display level.
  ********************************************************************/

game.HUD.LevelItem = me.Renderable.extend(
{
    init: function(x, y)
    {
        this._super(me.Renderable, 'init', [x, y, 10, 10]);

        // Set the font for this information
        this.font = new me.BitmapText(x, y, {font:"PressStart2P"});

        // Align the font to the right and bottom of the screen
        this.font.textAlign = "right";
        this.font.textBaseline = "bottom";

        // Set the font color to red (not currently working)
        // this.tint = new me.Color(255, 0, 0);

        // Local copy of the global level
        this.level = -1;
    },

    update : function ()
    {
        // Keep the local data for level up to date
        if (this.level != game.data.level + 1)
        {
            this.level = game.data.level + 1;
            return true;
        }
        return false;
    },

    draw : function (renderer)
    {
        // Place it four tiles from the bottom right
        var level = game.data.level + 1; 
        this.font.draw (renderer, "Level: " + level,
            me.game.viewport.width - TILE_WIDTH,
            me.game.viewport.height - TILE_HEIGHT * 19);
    }
});