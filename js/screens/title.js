game.TitleScreen = me.Stage.extend({

  onResetEvent : function () {
    /*
	// Set and scale the image for the title screen
    var titleImage = new me.ImageLayer(0, 0, {
        image:"title"
        });
    titleImage.resize(TILE_WIDTH * TILE_COUNT_WIDTH, TILE_HEIGHT * TILE_COUNT_HEIGHT);
	*/
    
	// Set a title screen image.
	var titleImage = new me.Sprite(0, 0, {
            image: me.loader.getImage('title'),
        }
    );
	// Position and scale the title image to fit with the viewport size.
    titleImage.anchorPoint.set(0, 0);
    titleImage.scale(me.game.viewport.width / titleImage.width, me.game.viewport.height / titleImage.height);
	
	me.game.world.addChild(titleImage, 1);

	// change to play state on press Enter or click/tap
    me.input.bindKey(me.input.KEY.ENTER, "enter", true);
	me.input.bindKey(me.input.KEY.I, "i", true);
    this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
      if (action === "enter") {
        me.state.change(me.state.PLAY);
      }
	  if (action === "i") {
		me.state.change(me.state.INFO);
	  }
    });
  },

  onDestroyEvent : function () {
    me.input.unbindKey(me.input.KEY.ENTER);
    me.input.unbindKey(me.input.KEY.I);
    me.event.unsubscribe(this.handler);
  }
});