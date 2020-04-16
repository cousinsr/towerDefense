game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
		
		function addRandomEnemy() {
			var choice = Math.floor(Math.random() * 3) + 1;
            if (choice == 1) {
				me.game.world.addChild(me.pool.pull("clothedSkeleton", 0, 832));
			}
            else if (choice == 2) {
				me.game.world.addChild(me.pool.pull("robedSkeleton", 0, 832));
			}
            else {
				me.game.world.addChild(me.pool.pull("armoredSkeleton", 0, 832));
			}
		}
		
		// Load first level * CHANGE LOADLEVEL TO TEST YOUR LEVEL *
		me.levelDirector.loadLevel("level03");
        me.game.world.addChild(new me.ColorLayer("background", "#000000"), 0);
		
		// Generate enemies * COMMENT OUT UNTIL YOUR LEVEL IS READY FOR ENEMIES (COLLISION OBJECTS SET UP) *
		addRandomEnemy();
        me.timer.setInterval(addRandomEnemy, 5000, true);
		
        // reset the score
        game.data.score = 0;

        // Add our HUD to the game world, add it last so that this is on top of the rest.
        // Can also be forced by specifying a "Infinity" z value to the addChild function.
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);
    },

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        // remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
    }
});
