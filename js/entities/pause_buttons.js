/********************************************************************
 * BUTTONS
 ********************************************************************/
game.PauseButton = me.GUI_Object.extend({
    init: function (x, y, settings) {
        settings.image = "pause";
        settings.framewidth = TILE_WIDTH;
        settings.frameheight = TILE_HEIGHT;
        this._super(me.GUI_Object, 'init', [x, y , settings]);
		this.setOpacity(0.5);
		this.menuButtons = [];
    },

	onOver: function (event) {
		this.setOpacity(1.0);
		return false;
	},

	onOut: function (event) {
		this.setOpacity(0.5);
        return false;
	},

    onClick: function (event)
    {
		this.setOpacity(0.5);
		if (!game.data.isPaused) {
			this.menuButtons.push(new game.ResumeButton(TILE_WIDTH * 4, TILE_HEIGHT, {}, this));
			this.menuButtons.push(new game.RestartButton(TILE_WIDTH * 8.5, TILE_HEIGHT, {}, this));
			this.menuButtons.push(new game.QuitButton(TILE_WIDTH * 13, TILE_HEIGHT, {}, this));
			me.game.world.addChild(this.menuButtons[0]);
			me.game.world.addChild(this.menuButtons[1]);
			me.game.world.addChild(this.menuButtons[2]);
			game.data.isPaused = true;
		}
		else {
			game.data.isPaused = false;
			me.game.world.removeChild(this.menuButtons[2]);
			me.game.world.removeChild(this.menuButtons[1]);
			me.game.world.removeChild(this.menuButtons[0]);
			this.menuButtons = [];
		}
        return false;
    }
});

game.ResumeButton = me.GUI_Object.extend({
    init: function (x, y, settings, pause) {
        settings.image = "resume";
        settings.width = TILE_WIDTH * 4;
        settings.height = TILE_HEIGHT * 2;
        this._super(me.GUI_Object, 'init', [x, y , settings]);
		this.setOpacity(0.9);
		this.pause = pause;
		this.menu = pause.menuButtons;
    },
	onOver: function (event) {
		this.setOpacity(1.0);
		return false;
	},

	onOut: function (event) {
		this.setOpacity(0.9);
        return false;
	},
	onClick: function (event)
	{
		this.pause.menuButtons = [];
		me.game.world.removeChild(this.menu[0]);
		me.game.world.removeChild(this.menu[1]);
		me.game.world.removeChild(this.menu[2]);
		game.data.isPaused = false;
		return false;
	}
});

game.RestartButton = me.GUI_Object.extend({
    init: function (x, y, settings, pause) {
        settings.image = "restart";
        settings.width = TILE_WIDTH * 4;
        settings.height = TILE_HEIGHT * 2;
        this._super(me.GUI_Object, 'init', [x, y , settings]);
		this.setOpacity(0.9);
		this.pause = pause;
		this.menu = pause.menuButtons;
    },
	onOver: function (event) {
		this.setOpacity(1.0);
		return false;
	},

	onOut: function (event) {
		this.setOpacity(0.9);
        return false;
	},
	onClick: function (event)
	{
		// Code to return to level introduction screen
		game.data.isPaused = false;
		this.pause.menuButtons = [];
		me.state.change(RESTART);
		return false;
	}
});

game.QuitButton = me.GUI_Object.extend({
    init: function (x, y, settings, pause) {
        settings.image = "quit";
        settings.width = TILE_WIDTH * 4;
        settings.height = TILE_HEIGHT * 2;
        this._super(me.GUI_Object, 'init', [x, y , settings]);
		this.setOpacity(0.9);
		this.pause = pause;
    },
	onOver: function (event) {
		this.setOpacity(1.0);
		return false;
	},

	onOut: function (event) {
		this.setOpacity(0.9);
        return false;
	},
	onClick: function (event)
	{
		game.data.isPaused = false;
		this.pause.menuButtons = [];
		game.data.life = START_LIFE;
		game.data.wave = 0;
		game.data.gold = START_GOLD;
		game.data.level = 0;
		me.state.change(me.state.MENU);
		return false;
	}
});