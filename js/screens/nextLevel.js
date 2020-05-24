/********************************************************************
 * Screen between each level
 *
 * CITATION: This code is heavily altered but still based on the
 * MelonJS tutorial at http://melonjs.github.io/tutorial-platformer/
 *
 *******************************************************************/
game.NextLevelScreen = me.Stage.extend(
{
    onResetEvent : function ()
    {
        // Add level bonus
        game.data.gold += GOLD_LEVEL_REWARD;

        // Play audio
        me.audio.play("transition");

        // Set and scale the image for the initial screen
        var nextLevelImage = new me.Sprite(0, 0,
            {image: me.loader.getImage("nextLevel")});
        nextLevelImage.anchorPoint.set(0, 0);
        nextLevelImage.scale(
            me.game.viewport.width / nextLevelImage.width, 
            me.game.viewport.height / nextLevelImage.height);
        me.game.world.addChild(nextLevelImage, 1);

        // Bind necessary keys to navigate screens
        me.input.bindKey(me.input.KEY.SPACE, "space", true);

        // Respond to keystrokes.
        this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge)
        {
            // Go to the next level if the user presses spacebar.
            if (action === "space")
            {
                // Save player life and gold balance as of start of next level.
                game.data.lastStartingLife = game.data.life;
                game.data.lastStartingGold = game.data.gold;
                game.data.level += 1;
                me.state.change(me.state.PLAY);
            }
        });
    },

    onDestroyEvent : function ()
    {
        me.input.unbindKey(me.input.KEY.SPACE);
        me.event.unsubscribe(this.handler);
    }
});