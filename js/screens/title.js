/********************************************************************
 * Title screen
 *
 * CITATION: This code is adapted from the code from the MelonJS
 * platformer tutorial at http://melonjs.github.io/tutorial-platformer/
 *
 ********************************************************************/
game.TitleScreen = me.Stage.extend({

  onResetEvent : function () {
	// Set and scale the image for the title screen
	var titleImage = new me.Sprite(0, 0, {
            image: me.loader.getImage('title'),
        }
    );
    titleImage.anchorPoint.set(0, 0);
    titleImage.scale(me.game.viewport.width / titleImage.width, me.game.viewport.height / titleImage.height);
	me.game.world.addChild(titleImage, 1);

	// Play a music track
    me.audio.play("Soliloquy", true);

    // Bind necessary keys and left click
    me.input.bindKey(me.input.KEY.ENTER, "enter", true);
    me.input.bindPointer(me.input.pointer.LEFT, me.input.KEY.ENTER);
	me.input.bindKey(me.input.KEY.SPACE, "space", true);
	me.input.bindKey(me.input.KEY.C, "cKey", true);

	// Begin the game if enter is pressed or there is a left click
    this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
      if (action === "enter" || action === "click") {
        me.state.change(me.state.PLAY);
      }
	  if (action === "space") {
		me.state.change(me.state.SETTINGS);
	  }
	  if (action === "cKey") {
		me.state.change(me.state.CREDITS);
	  }
    });
  },

  onDestroyEvent : function () {
    me.input.unbindKey(me.input.KEY.ENTER);
    me.input.unbindKey(me.input.KEY.SPACE);
    me.input.unbindPointer(me.input.pointer.LEFT);
    me.event.unsubscribe(this.handler);
	me.audio.stop("Soliloquy");
  }
});