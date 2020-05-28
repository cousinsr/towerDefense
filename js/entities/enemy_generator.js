/********************************************************************
 * Class for an EnemyGenerator
 *
 * This simply generates enemies alternating between two spawnPoints
 * and is used for the game intro screen.
 *
 ********************************************************************/
game.EnemyGenerator = me.Entity.extend({
    init: function () {
        // Call the parent constructor
        this._super(me.Entity, 'init', [0, 0, {width: 16, height: 16}]);
		// Set up initial properties about how spawning enemies
		this.timeBeforeNextEnemy = 750;
		this.idx = 0;
		this.enemies = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
        this.spawnPoints = me.game.world.getChildByProp("name", "Start");
    },
	
    update : function (dt) { 
		// Update timer
		this.timeBeforeNextEnemy -= dt;
		// Add an enemy if the timer has reached 0
		if (this.timeBeforeNextEnemy <= 0) {
			// Update timer and enemy count
			this.timeBeforeNextEnemy = 750;
			// Choose a random enemy from the enemies available
			var numEnemyChoices = 3;
			var enemyChoice = Math.floor(Math.random() * numEnemyChoices);
			if (enemyChoice >= numEnemyChoices) {
				enemyChoice = numEnemyChoices - 1;
			}
			// Add the chosen enemy on one of three paths from the chosen spawn point
			var randomNum = Math.floor(Math.random() * 3);
			if (randomNum >= 3) {
				randomNum = 2;
			}
			var newSkeleton = me.pool.pull(this.enemies[enemyChoice],
									       this.spawnPoints[this.idx].pos.x,
										   this.spawnPoints[this.idx].pos.y - (24 * randomNum));
			me.game.world.addChild(newSkeleton);
			// Update the index so that it will alternate between two paths
			if (this.idx > 0) {
				this.idx = 0;
			}
			else {
				this.idx = 1;
			}
		}
	}
});