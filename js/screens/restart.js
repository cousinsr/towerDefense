/********************************************************************
 * Restart screen for when the player has chosen to restart the level
 *
 * CITATION: This code is heavily altered but still based on the
 * MelonJS tutorial at http://melonjs.github.io/tutorial-platformer/
 *
 ********************************************************************/
game.RestartScreen = me.Stage.extend({

  onResetEvent : function (imageName) {

	// Set and scale the image for the initial screen
	var restartImage = new me.Sprite(0, 0, {
            image: me.loader.getImage("restartScreen"),
        }
    );
    restartImage.anchorPoint.set(0, 0);
    restartImage.scale(me.game.viewport.width / restartImage.width,
		me.game.viewport.height / restartImage.height);
	me.game.world.addChild(restartImage, 1);

	// Bind necessary keys to navigate screens
    me.input.bindKey(me.input.KEY.SPACE, "space", true);

	// Respond to keystrokes
    this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
		// Return to the play screen at the level where the player lost
        if (action === "space" && game.data.level > 0) {
            game.data.life = game.data.lastStartingLife;
			game.data.wave = 0;
			game.data.gold = game.data.lastStartingGold;
			me.state.change(me.state.PLAY);
        }
		else if (action == "space" && game.data.level <= 0) {
			game.data.life = START_LIFE;
			game.data.wave = 0;
			game.data.gold = START_GOLD;
			game.data.level = 0;
			me.state.change(me.state.PLAY);
		}
    });
  },

  onDestroyEvent : function () {
    me.input.unbindKey(me.input.KEY.SPACE);
    me.event.unsubscribe(this.handler);
  }
});