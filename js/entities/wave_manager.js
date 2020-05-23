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
    init: function (enemies, counts, timeGaps) {
        // Call the parent constructor
        this._super(me.Entity, 'init', [0, 0, {width: 16, height: 16}]);
        // Set beginning of level attributes 
        this.wave = 1;
		// Set information for the waves in the current level
        this.numWaves = 10;
		this.enemies = enemies;
		this.counts = counts;
		this.gaps = timeGaps;
        this.spawnPoints = me.game.world.getChildByProp("name", "Start");
        // Set attributes to track the status of waves and the level
		this.enemiesRemaining = counts[0];
		this.timeBeforeNextEnemy = timeGaps[0] * 1000;
		this.startOfWave = true;
		this.waitingForNextLevel = false;
		this.resetAudio = true;
		this.levelCompleteCountdown = 3000;
		// Reset the global variables
		game.data.wave = 0;
		game.data.enemies = [];
		game.data.dyingEnemies = [];
    },
	
    update : function (dt) {
 
		if (game.data.isPaused) {
			return true;
		}
        // Update the wave manager until all enemies have been added to the level
		if (!this.waitingForNextLevel) {
			// Update timer
			this.timeBeforeNextEnemy -= dt;
			// Play audio if wave will start in the next 3 seconds and hasn't already been played.
			if (this.timeBeforeNextEnemy <= 3000 && this.resetAudio) {
				me.audio.play("creaky_door_4");
				this.resetAudio = false;
			}
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
				} else if (game.data.level == 2 && this.wave < 9) {
					spawnChoice = 1;			// only spawn second path for waves 9 and 10
				}
				// Add the chosen enemy on one of three paths from the chosen spawn point
				var randomNum = Math.floor(Math.random() * 3);
				if (randomNum >= 3) {
					randomNum = 2;
				}
				var newSkeleton = me.pool.pull(this.enemies[this.wave - 1][enemyChoice],
											   this.spawnPoints[spawnChoice].pos.x,
											   this.spawnPoints[spawnChoice].pos.y - (24 * randomNum));
				me.game.world.addChild(newSkeleton);
				if (!game.data.enemies.includes(newSkeleton)) {
					game.data.enemies.push(newSkeleton);
				}
			}
			// Prepare for the upcoming wave if the current wave is complete and there are waves remaining
			if (this.enemiesRemaining <= 0 && this.wave < this.numWaves) {
				this.timeBeforeNextEnemy = this.gaps[this.wave] * 1000;
				this.enemiesRemaining = this.counts[this.wave];
				this.wave += 1;
				this.startOfWave = true;
				this.resetAudio = true;
			}
			// Remove the wave manager from the game if all enemies have been added
			if (this.enemiesRemaining <= 0 && this.wave >= this.numWaves) {
				this.waitingForNextLevel = true;
			}
		}
		// Wait for the current level to be complete
		else {
			if (game.data.enemies.length <= 0 && game.data.dyingEnemies.length <= 0) {
				this.levelCompleteCountdown -= dt;
				if (this.levelCompleteCountdown <= 0) {
					// Check if there are more levels to play.
					if (game.data.level < TILE_LEVELS.length - 1) {
						// Change to screen between levels
						me.state.change(me.state.READY);
					// The player has completed all levels in the game.
					} else {
						// Show the game end (player victory) screen.
						me.state.change(me.state.GAME_END);
					}
				}
			}
		}
    }
});