/********************************************************************
 * Citations screens for crediting authors of externally produced
 * sound and art assets
 *
 * CITATION: This code is heavily altered but still based on the
 * MelonJS tutorial at http://melonjs.github.io/tutorial-platformer/
 *
 ********************************************************************/
game.CitationsScreen = me.Stage.extend({

  onResetEvent : function () {
	// Set necessary variables to track which screen is being shown
	var screenNum = 1;
	var rewinds = 0;
	var lastScreen = 17;
	
	// Play a looping music track.
	me.audio.play("happy_adveture", true);

	// Set and scale the image for the initial screen
	var citationsImage = new me.Sprite(0, 0, {
            image: me.loader.getImage("citations" + screenNum),
        }
    );
    citationsImage.anchorPoint.set(0, 0);
    citationsImage.scale(me.game.viewport.width / citationsImage.width, me.game.viewport.height / citationsImage.height);
	me.game.world.addChild(citationsImage, 1);

	// Bind necessary keys to navigate screens
    me.input.bindKey(me.input.KEY.SPACE, "space", true);
    me.input.bindKey(me.input.KEY.BACKSPACE, "back", true);

	// Response to keystrokes
    this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
		// Load the next screen image, one z-position higher than the last
        if (action === "space" && screenNum < lastScreen) {
			screenNum++;
			citationsImage = new me.Sprite(0, 0, {
					image: me.loader.getImage("citations" + screenNum),
				}
			);
			citationsImage.anchorPoint.set(0, 0);
			citationsImage.scale(me.game.viewport.width / citationsImage.width, me.game.viewport.height / citationsImage.height);
			me.game.world.addChild(citationsImage, screenNum + rewinds * lastScreen); 
        }
		// Return to the Title screen after exiting the citations screen.
        else if (action === "space") {
            // Stop the music.
			me.audio.stop("happy_adveture");
			
			me.state.change(me.state.MENU);
        }
		// Reset to the beginning of the citations screen images, again increasing the z-position
		if (action === "back" && screenNum == lastScreen) {
			screenNum = 1;
			rewinds++;
			citationsImage = new me.Sprite(0, 0, {
					image: me.loader.getImage("citations" + screenNum),
				}
			);
			citationsImage.anchorPoint.set(0, 0);
			citationsImage.scale(me.game.viewport.width / citationsImage.width, me.game.viewport.height / citationsImage.height);
			me.game.world.addChild(citationsImage, screenNum + rewinds * lastScreen);
		}
    });
  },

  onDestroyEvent : function () {
    me.input.unbindKey(me.input.KEY.SPACE);
    me.input.unbindKey(me.input.KEY.BACKSPACE);
    me.event.unsubscribe(this.handler);
  }
});