game.PlayScreen = me.ScreenObject.extend({
	
    onResetEvent: function() {
        //Function to add one of the three different skeleton types at random
        function addRandomEnemy() {
            var choice = Math.floor(Math.random() * 3) + 1;
            if (choice == 1) {
                me.game.world.addChild(me.pool.pull("clothedSkeleton", 0, 192));
            }
            else if (choice == 2) {
                me.game.world.addChild(me.pool.pull("robedSkeleton", 0, 192));
            }
            else {
                me.game.world.addChild(me.pool.pull("armoredSkeleton", 0, 192));
            }
        }

        // Load first level with a black background covering the default melonJS background
        me.levelDirector.loadLevel("level01");
        me.game.world.addChild(new me.ColorLayer("background", "#000000"), 0);
		
		// Generate random enemies every five seconds
        addRandomEnemy();
        me.timer.setInterval(addRandomEnemy, 5000, true);
		
        // FROM BOILERPLATE: Reset the score
        game.data.score = 0;

        // FROM BOILERPLATE: Add our HUD to the game world, add it last so that this is on top of the rest.
        // Can also be forced by specifying a "Infinity" z value to the addChild function.
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);
    },

    /**
     *  ALL FROM BOILERPLATE: action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        // remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
    }
});
