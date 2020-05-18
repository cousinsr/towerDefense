/********************************************************************
 * Game End screens for when the player has won
 *
 * CITATION: This code is heavily altered but still based on the
 * MelonJS tutorial at http://melonjs.github.io/tutorial-platformer/
 *
 ********************************************************************/
game.GameEndScreen = me.Stage.extend({

  onResetEvent : function (imageName) {
	// Set necessary variables to track which screen is being shown
	var screenNum = 1;
	var lastScreen = 2;

	// Set and scale the image for the initial screen
	var gameEndImage = new me.Sprite(0, 0, {
            image: me.loader.getImage("gameend" + screenNum),
        }
    );
    gameEndImage.anchorPoint.set(0, 0);
    gameEndImage.scale(me.game.viewport.width / gameEndImage.width,
		me.game.viewport.height / gameEndImage.height);
	me.game.world.addChild(gameEndImage, screenNum);

	// Play a looping music track.
	me.audio.play("tgfcoder-FrozenJam-SeamlessLoop", true);

	// Bind necessary keys to navigate screens
    me.input.bindKey(me.input.KEY.SPACE, "space", true);

	// Respond to keystrokes
    this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
		// Load the next screen image, one z-position higher than the last
        if (action === "space" && screenNum < lastScreen) {
			screenNum++;
			gameOverImage = new me.Sprite(0, 0, {
					image: me.loader.getImage("gameend" + screenNum),
				}
			);
			
			gameOverImage.anchorPoint.set(0, 0);
			gameOverImage.scale(me.game.viewport.width / gameOverImage.width,
				me.game.viewport.height / gameOverImage.height);
			me.game.world.addChild(gameOverImage, screenNum);
        }
		// Return to the game title screen after finishing the game end screens.
        else if (action === "space") {
			// Stop the music.
			me.audio.stop("tgfcoder-FrozenJam-SeamlessLoop");
			
			game.data.life = START_LIFE;
			game.data.wave = 0;
			game.data.gold = START_GOLD;
			game.data.level = 0;
			me.state.change(me.state.MENU);
        }
    });
  },

  onDestroyEvent : function () {
    me.input.unbindKey(me.input.KEY.SPACE);
    me.event.unsubscribe(this.handler);
  }
});