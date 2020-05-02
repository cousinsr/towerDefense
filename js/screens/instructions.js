game.InstructionScreen = me.ScreenObject.extend({

  onResetEvent : function () {
    /*
	// Set and scale the image for the title screen
    var titleImage = new me.ImageLayer(0, 0, {
        image:"instructions"
        });
    titleImage.resize(TILE_WIDTH * TILE_COUNT_WIDTH, TILE_HEIGHT * TILE_COUNT_HEIGHT);
    */
	
	// Set a instructions screen image.
	var instructionsImage = new me.Sprite(0, 0, {
            image: me.loader.getImage('instructions'),
        }
    );
	// Position and scale the instructions image to fit with the viewport size.
    instructionsImage.anchorPoint.set(0, 0);
    instructionsImage.scale(me.game.viewport.width / instructionsImage.width, me.game.viewport.height / instructionsImage.height);
	
	me.game.world.addChild(instructionsImage, 1);

	// change to play state on press Enter or click/tap
    me.input.bindKey(me.input.KEY.ENTER, "enter", true);
    this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
      if (action === "enter") {
        me.state.change(me.state.PLAY);
      }
    });
  },

  onDestroyEvent : function () {
    me.input.unbindKey(me.input.KEY.ENTER);
    me.event.unsubscribe(this.handler);
  }
});