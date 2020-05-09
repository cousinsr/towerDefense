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
        this.menuButtons.push(new game.ResumeButton(TILE_WIDTH * 4, TILE_HEIGHT, {}, this));
        this.menuButtons.push(new game.RestartButton(TILE_WIDTH * 4, TILE_HEIGHT * 3, {}, this));
        this.menuButtons.push(new game.QuitButton(TILE_WIDTH * 4, TILE_HEIGHT * 5, {}, this));
        me.game.world.addChild(this.menuButtons[0]);
        me.game.world.addChild(this.menuButtons[1]);
        me.game.world.addChild(this.menuButtons[2]);
        me.state.pause();
        return false;
    }
});

game.ResumeButton = me.GUI_Object.extend({
    init: function (x, y, settings, pause) {
        settings.image = "resume";
        settings.width = TILE_WIDTH * 4;
        settings.height = TILE_HEIGHT * 2;
        this._super(me.GUI_Object, 'init', [x, y , settings]);
		this.pause = pause;
		this.menu = pause.menuButtons;
    },
	onClick: function (event)
	{
		this.pause.menuButtons = [];
		me.game.world.removeChild(this.menu[0]);
		me.game.world.removeChild(this.menu[1]);
		me.game.world.removeChild(this.menu[2]);
		me.state.resume();
		return false;
	},
});

game.RestartButton = me.GUI_Object.extend({
    init: function (x, y, settings, pause) {
        settings.image = "restart";
        settings.width = TILE_WIDTH * 4;
        settings.height = TILE_HEIGHT * 2;
        this._super(me.GUI_Object, 'init', [x, y , settings]);
		this.pause = pause;
		this.menu = pause.menuButtons;
    },
	onClick: function (event)
	{
		// Code to return to level introduction screen
		me.state.resume();
		this.pause.menuButtons = [];
		me.state.change(me.state.MENU);
		return false;
	}
});

game.QuitButton = me.GUI_Object.extend({
    init: function (x, y, settings, pause) {
        settings.image = "quit";
        settings.width = TILE_WIDTH * 4;
        settings.height = TILE_HEIGHT * 2;
        this._super(me.GUI_Object, 'init', [x, y , settings]);
		this.pause = pause
    },
	onClick: function (event)
	{
		me.state.resume();
		this.pause.menuButtons = [];
		me.state.change(me.state.MENU);
		return false;
	}
});