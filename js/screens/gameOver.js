/********************************************************************
 * Game Over screens for when the player has been defeated
 *
 * CITATION: This code is heavily altered but still based on the
 * MelonJS tutorial at http://melonjs.github.io/tutorial-platformer/
 *
 ********************************************************************/
game.GameOverScreen = me.Stage.extend({

  onResetEvent : function (imageName) {
	// Set necessary variables to track which screen is being shown
	var screenNum = 1;
	var lastScreen = 2;

	// Set and scale the image for the initial screen
	var gameOverImage = new me.Sprite(0, 0, {
            image: me.loader.getImage("gameover" + screenNum),
        }
    );
    gameOverImage.anchorPoint.set(0, 0);
    gameOverImage.scale(me.game.viewport.width / gameOverImage.width,
		me.game.viewport.height / gameOverImage.height);
	me.game.world.addChild(gameOverImage, screenNum);

	// Play a looping music track.
	me.audio.playTrack("Iwan Gabovitch - Dark Ambience Loop");

	// Bind necessary keys to navigate screens
    me.input.bindKey(me.input.KEY.SPACE, "space", true);
	me.input.bindKey(me.input.KEY.BACKSPACE, "backspace", true);
	me.input.bindKey(me.input.KEY.ENTER, "enter", true);

	// Respond to keystrokes
    this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
		// Load the next screen image, one z-position higher than the last
        if (action === "space" && screenNum < lastScreen) {
			screenNum++;
			
			// Check if the player lost at the first level.
			if (game.data.level == 0) {
				gameOverImage = new me.Sprite(0, 0, {
						image: me.loader.getImage("gameover" + screenNum + "a"),
					}
				);
			// The player lost at level02 or later.
			} else {
				gameOverImage = new me.Sprite(0, 0, {
						image: me.loader.getImage("gameover" + screenNum + "b"),
					}
				);
			}
			
			gameOverImage.anchorPoint.set(0, 0);
			gameOverImage.scale(me.game.viewport.width / gameOverImage.width,
				me.game.viewport.height / gameOverImage.height);
			me.game.world.addChild(gameOverImage, screenNum);
        }
		// Return to the game title screen after finishing the game over screens.
        else if ((action === "space" && game.data.level == 0) ||
			(action === "enter" && screenNum == lastScreen)) {
            // Stop the music.
			me.audio.stopTrack();
			
			game.data.life = START_LIFE;
			game.data.wave = 0;
			game.data.gold = START_GOLD;
			game.data.level = 0;
			me.state.change(me.state.MENU);
        }
		// Return to the play screen at the level after level01 where the player lost, if they want.
        else if (action === "backspace" && game.data.level > 0) {
            // Stop the music.
			me.audio.stopTrack();
			
			game.data.life = game.data.lastStartingLife;
			game.data.wave = 0;
			game.data.gold = game.data.lastStartingGold;
			me.state.change(me.state.PLAY);
        }
    });
  },

  onDestroyEvent : function () {
    me.input.unbindKey(me.input.KEY.SPACE);
	me.input.unbindKey(me.input.KEY.BACKSPACE);
	me.input.unbindKey(me.input.KEY.ENTER);
    me.event.unsubscribe(this.handler);
  }
});