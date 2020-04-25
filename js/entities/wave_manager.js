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
        this._super(me.Entity, 'init', [0, 0, {width: 16, height: 16}]);
        this.enemies = enemies;
        this.counts = counts;
        this.gaps = gaps;
        this.spawnPoints = spawnPoints;
        this.wave = 1;
        this.numWaves = counts.length;
        this.enemiesRemaining = counts[0];
		this.timeBeforeNextEnemy = gaps[0] * 1000;
    },
    update : function (dt) {
        this.timeBeforeNextEnemy -= dt;
        if (this.timeBeforeNextEnemy <= 0) {
            this.timeBeforeNextEnemy = 1000;
            this.enemiesRemaining -= 1;
            var numEnemyChoices = this.enemies[this.wave - 1].length;
            var enemyChoice = Math.floor(Math.random() * numEnemyChoices);
            if (enemyChoice >= numEnemyChoices) {
                enemyChoice = numEnemyChoices - 1;
            }
            var numSpawnChoices = this.spawnPoints.length;
            var spawnChoice = Math.floor(Math.random() * numSpawnChoices);
            if (spawnChoice >= numSpawnChoices) {
                spawnChoice = numSpawnChoices - 1;
            }
            var randomNum = Math.floor(Math.random() * 3);
            if (randomNum >= 3) {
                randomNum = 2;
            }
            me.game.world.addChild(me.pool.pull(this.enemies[this.wave - 1][enemyChoice], this.spawnPoints[spawnChoice].pos.x, this.spawnPoints[spawnChoice].pos.y - (24 * randomNum)));
        }
        if (this.enemiesRemaining <= 0 && this.wave < this.numWaves) {
            this.timeBeforeNextEnemy = this.gaps[this.wave] * 1000;
            this.enemiesRemaining = this.counts[this.wave];
            this.wave += 1;
        }
        if (this.enemiesRemaining <= 0 && this.wave >= this.numWaves) {
            me.game.world.removeChild(this);
        }		
    }
});