/********************************************************************
 * Instructions screens for the beginning of the game
 *
 * CITATION: This code is heavily altered but still based on the
 * MelonJS tutorial at http://melonjs.github.io/tutorial-platformer/
 *
 ********************************************************************/
game.InstructionScreen = me.Stage.extend({

  onResetEvent : function (imageName) {
	// Set necessary variables to track which screen is being shown
	var screenNum = 1;
	var rewinds = 0;
	var lastScreen = 5;
	
	// Play a music track, fading in
	me.audio.play("Woodland Fantasy", true, null, 0.0);
	me.audio.fade("Woodland Fantasy", 0.0, 1.0, 5000);

	// Set and scale the image for the initial screen
	var instructionsImage = new me.Sprite(0, 0, {
            image: me.loader.getImage("instructions" + screenNum),
        }
    );
    instructionsImage.anchorPoint.set(0, 0);
    instructionsImage.scale(me.game.viewport.width / instructionsImage.width, me.game.viewport.height / instructionsImage.height);
	me.game.world.addChild(instructionsImage, 1);

	// Bind necessary keys to navigate screens
    me.input.bindKey(me.input.KEY.SPACE, "space", true);
    me.input.bindKey(me.input.KEY.BACKSPACE, "back", true);

	// Response to keystrokes
    this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
		// Load the next screen image, one z-position higher than the last
        if (action === "space" && screenNum < lastScreen) {
			screenNum++;
			instructionsImage = new me.Sprite(0, 0, {
					image: me.loader.getImage("instructions" + screenNum),
				}
			);
			instructionsImage.anchorPoint.set(0, 0);
			instructionsImage.scale(me.game.viewport.width / instructionsImage.width, me.game.viewport.height / instructionsImage.height);
			me.game.world.addChild(instructionsImage, screenNum + rewinds * lastScreen); 
        }
		// Begin the game after finishing the instructions
        else if (action === "space") {
            me.state.change(me.state.PLAY);
        }
		// Reset to the beginning of the instruction screen images, again increasing the z-position
		if (action === "back" && screenNum == lastScreen) {
			screenNum = 1;
			rewinds++;
			instructionsImage = new me.Sprite(0, 0, {
					image: me.loader.getImage("instructions" + screenNum),
				}
			);
			instructionsImage.anchorPoint.set(0, 0);
			instructionsImage.scale(me.game.viewport.width / instructionsImage.width, me.game.viewport.height / instructionsImage.height);
			me.game.world.addChild(instructionsImage, screenNum + rewinds * lastScreen);
		}
    });
  },

  onDestroyEvent : function () {
    me.input.unbindKey(me.input.KEY.SPACE);
    me.input.unbindKey(me.input.KEY.BACKSPACE);
    me.event.unsubscribe(this.handler);
	me.audio.stop("Woodland Fantasy");
  }
});