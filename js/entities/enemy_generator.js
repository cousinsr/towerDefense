/********************************************************************
 * Class for an EnemyGenerator
 ********************************************************************/
game.EnemyGenerator = me.Entity.extend({
    init: function () {
        // Call the parent constructor
        this._super(me.Entity, 'init', [0, 0, {width: 16, height: 16}]);
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
			// Choose a random enemy from the enemies available this wave
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
			if (this.idx > 0) {
				this.idx = 0;
			}
			else {
				this.idx = 1;
			}
		}
	}
});