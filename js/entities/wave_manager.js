/********************************************************************
 * Class for a WaveManager Entity
 *
 * Parameters: enemies is a 2D array containing 10 arrays of strings
 * that determine the enemy pool being chosen from in each wave; counts
 * is an array of 10 integers for how many enemies are in each wave; 
 * gaps is an array of 10 integers signifying the number of seconds
 * between each wave; spawnPoints are available Start objects where
 * enemies may be spawned.
 *
 * NOTE: All arrays go in order. enemies[0] is for the enemy composition 
 * for wave 1, counts[0] is for the enemy count for wave 1, and gaps[0]
 * is for the number of seconds between the start and wave 1.
 * 
 ********************************************************************/
game.WaveManager = me.Entity.extend({
    init: function (enemies, counts, gaps, spawnPoints) {
        // Call the parent constructor
        this._super(me.Entity, 'init', [0, 0, {width: 16, height: 16}]);

        // Set up necessary attributes for the wave manager
        this.enemies = enemies;
        this.counts = counts;
        this.gaps = gaps;
        this.spawnPoints = spawnPoints;
        this.wave = 1;
        this.numWaves = counts.length;
        this.enemiesRemaining = counts[0];
		this.timeBeforeNextEnemy = gaps[0] * 1000;
        this.startOfWave = true;
		
		// Reset the global wave counter
		game.data.wave = 0;
    },
    update : function (dt) {
        // Update timer
        this.timeBeforeNextEnemy -= dt;

        // Add an enemy if the timer has reached 0
        if (this.timeBeforeNextEnemy <= 0) {
			// Update the wave count
			if (this.startOfWave) {
				this.startOfWave = false;
				game.data.wave += 1;
			}
            // Update timer and enemy count
            this.timeBeforeNextEnemy = 1000;
            this.enemiesRemaining -= 1;
            // Choose a random enemy from the enemies available this wave
            var numEnemyChoices = this.enemies[this.wave - 1].length;
            var enemyChoice = Math.floor(Math.random() * numEnemyChoices);
            if (enemyChoice >= numEnemyChoices) {
                enemyChoice = numEnemyChoices - 1;
            }
            // Choose a random spawn point from those available on the map
            var numSpawnChoices = this.spawnPoints.length;
            var spawnChoice = Math.floor(Math.random() * numSpawnChoices);
            if (spawnChoice >= numSpawnChoices) {
                spawnChoice = numSpawnChoices - 1;
            }
            // Add the chosen enemy on one of three paths from the chosen spawn point
            var randomNum = Math.floor(Math.random() * 3);
            if (randomNum >= 3) {
                randomNum = 2;
            }
            me.game.world.addChild(me.pool.pull(this.enemies[this.wave - 1][enemyChoice], this.spawnPoints[spawnChoice].pos.x, this.spawnPoints[spawnChoice].pos.y - (24 * randomNum)));
        }
        // Prepare for the upcoming wave if the current wave is complete and there are waves remaining
        if (this.enemiesRemaining <= 0 && this.wave < this.numWaves) {
            this.timeBeforeNextEnemy = this.gaps[this.wave] * 1000;
            this.enemiesRemaining = this.counts[this.wave];
            this.wave += 1;
			this.startOfWave = true;
        }
        // Remove the wave manager from the game if all enemies have been added
        if (this.enemiesRemaining <= 0 && this.wave >= this.numWaves) {
            me.state.change(me.state.READY);
//            me.game.world.removeChild(this);
        }
    }
});