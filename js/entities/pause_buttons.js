/********************************************************************
 * Class for a Pause Button entity
 *
 * Parameters: x is the x position where the object will be created,
 * and y is the y position.
 *
 ********************************************************************/
game.PauseButton = me.GUI_Object.extend({
    init: function (x, y, settings) {
		// Set up the appearance of the button
        settings.image = "pausePlay";
        settings.framewidth = settings.width = TILE_WIDTH;
        settings.frameheight = settings.height = TILE_HEIGHT;
		// Call the constructor
        this._super(me.GUI_Object, 'init', [x, y , settings]);		
		// Set available button appearances
		this.addAnimation("play", [0]);
		this.addAnimation("pause", [1]);
		// Set initial appearance of button depending on value of game.data.isPaused
		if (game.data.isPaused) {
			this.setCurrentAnimation("play");
		} else {
			this.setCurrentAnimation("pause");
		}
		// Set opacity to allow highlighting the button when hovered over
		this.setOpacity(0.5);
		// Track the buttons that it spawns
		this.menuButtons = [];
    },
	// Cause the button to stand out when hovered over
	onOver: function (event) {
		this.setOpacity(1.0);
		return false;
	},
	// Return to normal opacity when no longer hovering
	onOut: function (event) {
		this.setOpacity(0.5);
        return false;
	},
	// Spawn menu buttons when clicked or resume game if paused
    onClick: function (event)
    {
		// Return to normal opacity
		this.setOpacity(0.5);
		// Generate the menu buttons if clicked when the game isn't already paused
		if (!game.data.isPaused) {
			this.menuButtons.push(new game.ResumeButton(TILE_WIDTH * 4, TILE_HEIGHT, {}, this));
			this.menuButtons.push(new game.RestartButton(TILE_WIDTH * 8.5, TILE_HEIGHT, {}, this));
			this.menuButtons.push(new game.QuitButton(TILE_WIDTH * 13, TILE_HEIGHT, {}, this));
			this.menuButtons.push(new game.MuteButton(TILE_WIDTH * 17.5, TILE_HEIGHT, {}, this));
			me.game.world.addChild(this.menuButtons[0]);
			me.game.world.addChild(this.menuButtons[1]);
			me.game.world.addChild(this.menuButtons[2]);
			me.game.world.addChild(this.menuButtons[3]);
			
			// Mute all game sounds.
			me.audio.muteAll();
			// Set the game to be paused (pauses all other entities)
			game.data.isPaused = true;
		}
		// Resume the game if clicked when the game is already paused
		else {
			// Set the game not to be paused (resumes all other entity updates)
			game.data.isPaused = false;
			// Remove the buttons it spawned
			me.game.world.removeChild(this.menuButtons[3]);
			me.game.world.removeChild(this.menuButtons[2]);
			me.game.world.removeChild(this.menuButtons[1]);
			me.game.world.removeChild(this.menuButtons[0]);
			this.menuButtons = [];
			
			// Unmute game audio upon pause menu exit if desired by the user.
			if (!game.data.isMuted) {
				// Unmute all game sounds.
				me.audio.unmuteAll();
			}
		}
		
		// Update the button depending on value of game.data.isPaused .
		if (game.data.isPaused) {
			this.setCurrentAnimation("play");
		} else {
			this.setCurrentAnimation("pause");
		}
		
        return false;
    }
});

/********************************************************************
 * Class for a Resume Button entity
 *
 * Parameters: x is the x position where the object will be created,
 * and y is the y position; pause is the pauseButton that spawned
 * this object
 *
 ********************************************************************/
game.ResumeButton = me.GUI_Object.extend({
    init: function (x, y, settings, pause) {
		// Set up the appearance of the button
        settings.image = "resume";
        settings.width = TILE_WIDTH * 4;
        settings.height = TILE_HEIGHT * 2;
		// Call the constructor
        this._super(me.GUI_Object, 'init', [x, y , settings]);
		// Set opacity to allow highlighting the button when hovered over
		this.setOpacity(0.9);
		// Track the pause button and buttons it spawned
		this.pause = pause;
		this.menu = pause.menuButtons;
    },
	// Cause the button to stand out when hovered over
	onOver: function (event) {
		this.setOpacity(1.0);
		return false;
	},
	// Return to normal opacity when no longer hovering
	onOut: function (event) {
		this.setOpacity(0.9);
        return false;
	},
	// Resume game if clicked
	onClick: function (event)
	{
		// Remove the buttons it spawned
		this.pause.menuButtons = [];
		me.game.world.removeChild(this.menu[0]);
		me.game.world.removeChild(this.menu[1]);
		me.game.world.removeChild(this.menu[2]);
		me.game.world.removeChild(this.menu[3]);
		// Set the game not to be paused (resumes all other entity updates)
		game.data.isPaused = false;
		
		// Unmute game audio upon pause menu exit if desired by the user.
		if (!game.data.isMuted) {
			// Unmute all game sounds.
			me.audio.unmuteAll();
		}
		// Set the current animation of the pause button
		this.pause.setCurrentAnimation("pause");
		
		return false;
	}
});

/********************************************************************
 * Class for a Restart Button entity
 *
 * Parameters: x is the x position where the object will be created,
 * and y is the y position; pause is the pauseButton that spawned
 * this object
 *
 ********************************************************************/
game.RestartButton = me.GUI_Object.extend({
    init: function (x, y, settings, pause) {
		// Set up the appearance of the button
        settings.image = "restart";
        settings.width = TILE_WIDTH * 4;
        settings.height = TILE_HEIGHT * 2;
		// Call the constructor
        this._super(me.GUI_Object, 'init', [x, y , settings]);
		// Set opacity to allow highlighting the button when hovered over
		this.setOpacity(0.9);
		// Track the pause button and buttons it spawned
		this.pause = pause;
		this.menu = pause.menuButtons;
    },
	// Cause the button to stand out when hovered over
	onOver: function (event) {
		this.setOpacity(1.0);
		return false;
	},
	// Return to normal opacity when no longer hovering
	onOut: function (event) {
		this.setOpacity(0.9);
        return false;
	},
	// Go to restart screen if clicked
	onClick: function (event)
	{
		// Code to return to level introduction screen
		game.data.isPaused = false;
		this.pause.menuButtons = [];
		
		// Unmute game audio upon pause menu exit if desired by the user.
		if (!game.data.isMuted) {
			// Unmute all game sounds.
			me.audio.unmuteAll();
		}
		// Go to restart screen
		me.state.change(RESTART);
		return false;
	}
});

/********************************************************************
 * Class for a Quit Button entity
 *
 * Parameters: x is the x position where the object will be created,
 * and y is the y position; pause is the pauseButton that spawned
 * this object
 *
 ********************************************************************/
game.QuitButton = me.GUI_Object.extend({
    init: function (x, y, settings, pause) {
		// Set up the appearance of the button
        settings.image = "quit";
        settings.width = TILE_WIDTH * 4;
        settings.height = TILE_HEIGHT * 2;
		// Call the constructor
        this._super(me.GUI_Object, 'init', [x, y , settings]);
		// Set opacity to allow highlighting the button when hovered over
		this.setOpacity(0.9);
		// Track the pause button that spawned this
		this.pause = pause;
    },
	// Cause the button to stand out when hovered over
	onOver: function (event) {
		this.setOpacity(1.0);
		return false;
	},
	// Return to normal opacity when no longer hovering
	onOut: function (event) {
		this.setOpacity(0.9);
        return false;
	},
	// Return to title screen if clicked
	onClick: function (event)
	{
		// Reset game data
		game.data.isPaused = false;
		this.pause.menuButtons = [];
		game.data.life = START_LIFE;
		game.data.wave = 0;
		game.data.gold = START_GOLD;
		game.data.level = 0;
		
		// Unmute game audio upon pause menu exit if desired by the user
		if (!game.data.isMuted) {
			// Unmute all game sounds
			me.audio.unmuteAll();
		}
		// Go to title screen
		me.state.change(me.state.MENU);
		return false;
	}
});

/********************************************************************
 * Class for a game audio mute and unmute button entity
 *
 * Parameters: x and y coordinates for the location of the button in
 * the screen; the PauseButton entity that created this MuteButton
 * entity
 *
 ********************************************************************/
game.MuteButton = me.GUI_Object.extend({
    init: function (x, y, settings, pause) {
		// Set up the appearance of the button
        settings.image = "muteUnmuteAudio";
        settings.framewidth = settings.width = TILE_WIDTH * 4;
        settings.frameheight = settings.height = TILE_HEIGHT * 2;
		// Call the constructor
        this._super(me.GUI_Object, 'init', [x, y , settings]);		
		// Set available button appearances.
		this.addAnimation("unmute", [0]);
		this.addAnimation("mute", [1]);
		// Set initial appearance of button in pause menu depending on value of game.data.isMuted .
		if (game.data.isMuted) {
			this.setCurrentAnimation("unmute");
		} else {
			this.setCurrentAnimation("mute");
		}
		// Set opacity to allow highlighting the button when hovered over
		this.setOpacity(0.9);
		// Track the pause button that spawned this
		this.pause = pause;
    },
	// Cause the button to stand out when hovered over
	onOver: function (event) {
		this.setOpacity(1.0);
		return false;
	},
	// Return to normal opacity when no longer hovering
	onOut: function (event) {
		this.setOpacity(0.9);
        return false;
	},
	// Mute or unmute when clicked
	onClick: function (event)
	{
		// Switch the value of the global isMuted boolean
		game.data.isMuted = !game.data.isMuted;
		// Update the button depending on value of game.data.isMuted .
		if (game.data.isMuted) {
			this.setCurrentAnimation("unmute");
		} else {
			this.setCurrentAnimation("mute");
		}
		
		return false;
	}
});