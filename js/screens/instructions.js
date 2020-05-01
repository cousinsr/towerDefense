game.InstructionScreen = me.ScreenObject.extend({

  onResetEvent : function () {
    // Set and scale the image for the title screen
    var titleImage = new me.ImageLayer(0, 0, {
        image:"instructions"
        });
    titleImage.resize(TILE_WIDTH * TILE_COUNT_WIDTH, TILE_HEIGHT * TILE_COUNT_HEIGHT);
    me.game.world.addChild(titleImage, 1);

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