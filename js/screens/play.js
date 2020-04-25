game.PlayScreen = me.ScreenObject.extend({
	
    onResetEvent: function() {
        // Add chosen enemy to one of three paths
        function addToRandomPath(enemyName, x, y) {
            var randomNum = Math.floor(Math.random() * 3);
            if (randomNum >= 3) {
                randomNum = 2;
            }
            me.game.world.addChild(me.pool.pull(enemyName, x, y - (24 * randomNum)));
        }

        // Add one of the passed enemies on one of three paths on one of the passed spawn points
        function addRandomEnemy(enemyArray, spawnPointArray) {
            var numEnemyChoices = enemyArray.length;
            var enemyChoice = Math.floor(Math.random() * numEnemyChoices);
            if (enemyChoice >= numEnemyChoices) {
                enemyChoice = numEnemyChoices - 1;
            }
            var numSpawnChoices = spawnPointArray.length;
            var spawnChoice = Math.floor(Math.random() * numSpawnChoices);
            if (spawnChoice >= numSpawnChoices) {
                spawnChoice = numSpawnChoices - 1;
            }
            addToRandomPath(enemyArray[enemyChoice], spawnPointArray[spawnChoice].pos.x, spawnPointArray[spawnChoice].pos.y);
        }

        // Load first level with a black background covering the default melonJS background
        me.levelDirector.loadLevel("level01");
        me.game.world.addChild(new me.ColorLayer("background", "#373737"), 0);
		
		// Generate random enemies every five seconds
        var spawnPoints = me.game.world.getChildByProp("name", "Start");
        var enemies = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
        addRandomEnemy(enemies, spawnPoints);
        me.timer.setInterval(addRandomEnemy, 5000, true, enemies, spawnPoints);
		
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

