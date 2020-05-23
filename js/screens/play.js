/********************************************************************
 * Play screen for the actual game

 * CITATION: This code is adapted from the MelonJS Boilerplate
 *
 ********************************************************************/
game.PlayScreen = me.Stage.extend({

    onResetEvent: function() {
		
		// Level enemy compositions:
		var level = {};

		// Set composition of each wave for Level 01
		if (game.data.level == 0) {

			var w1 = ["clothedSkeleton"];
			var w2 = ["clothedSkeleton", "clothedSkeleton", "robedSkeleton"];
			var w3 = ["clothedSkeleton", "robedSkeleton", "robedSkeleton"];
			var w4 = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
			var w5 = ["clothedSkeleton", "clothedSkeleton", "armoredSkeleton"];
			var w6 = ["robedSkeleton", "armoredSkeleton"];
			var w7 = ["robedSkeleton", "armoredSkeleton"];
			var w8 = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
			var w9 = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
			var w10 = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
			var enemies01 = [w1, w2, w3, w4, w5, w6, w7, w8, w9, w10];
			level.enemies = enemies01;
			level.counts = [2, 2, 3, 3, 4, 4, 5, 5, 6, 8];
			level.timeGaps = [3, 10, 12, 12, 15, 15, 18, 18, 21, 25];
		}

		// Set composition of each wave for Level 02
		else if (game.data.level == 1) {
			w1 = ["clothedSkeleton"];
			w2 = ["clothedSkeleton", "clothedSkeleton", "robedSkeleton"];
			w3 = ["clothedSkeleton", "robedSkeleton", "robedSkeleton"];
			w4 = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
			w5 = ["clothedSkeleton", "clothedSkeleton", "armoredSkeleton"];
			w6 = ["robedSkeleton", "armoredSkeleton"];
			w7 = ["robedSkeleton", "armoredSkeleton"];
			w8 = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
			w9 = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
			w10 = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
			var enemies02 = [w1, w2, w3, w4, w5, w6, w7, w8, w9, w10];
			level.enemies = enemies02;
			level.counts = [2, 2, 3, 3, 4, 4, 5, 5, 6, 8];
			level.timeGaps = [3, 10, 12, 12, 15, 15, 18, 18, 21, 25];
		}

		// Set composition of each wave for Level 03
		else if (game.data.level == 2) {
			w1 = ["clothedSkeleton"];
			w2 = ["clothedSkeleton", "clothedSkeleton", "robedSkeleton"];
			w3 = ["clothedSkeleton", "robedSkeleton", "robedSkeleton"];
			w4 = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
			w5 = ["clothedSkeleton", "clothedSkeleton", "armoredSkeleton"];
			w6 = ["robedSkeleton", "armoredSkeleton"];
			w7 = ["robedSkeleton", "armoredSkeleton"];
			w8 = ["clothedSkeleton", "robedSkeleton", "robedSkeleton"];
			w9 = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
			w10 = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
			var enemies03 = [w1, w2, w3, w4, w5, w6, w7, w8, w9, w10];
			level.enemies = enemies03;
			level.counts = [2, 2, 3, 3, 4, 4, 5, 4, 5, 6];
			level.timeGaps = [3, 10, 12, 12, 15, 15, 18, 18, 21, 25];
		}

		// Set composition of each wave for Level 04
		else {
			w1 = ["clothedSkeleton"];
			w2 = ["clothedSkeleton", "clothedSkeleton", "robedSkeleton"];
			w3 = ["clothedSkeleton", "robedSkeleton", "robedSkeleton"];
			w4 = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
			w5 = ["clothedSkeleton", "clothedSkeleton", "armoredSkeleton"];
			w6 = ["robedSkeleton", "armoredSkeleton"];
			w7 = ["robedSkeleton", "armoredSkeleton"];
			w8 = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
			w9 = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
			w10 = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
			var enemies04 = [w1, w2, w3, w4, w5, w6, w7, w8, w9, w10];
			level.enemies = enemies04;
			level.counts = [2, 2, 3, 3, 4, 4, 5, 5, 6, 8];
			level.timeGaps = [3, 10, 12, 12, 15, 15, 18, 18, 21, 25];
		}

        // Load first level with a black background covering the default melonJS background
        me.levelDirector.loadLevel(TILE_LEVELS[game.data.level]);
        me.game.world.addChild(new me.ColorLayer("background", "#373737"), 0);

        this.waveManager = me.pool.pull("waveManager", level.enemies, level.counts, level.timeGaps);
        me.game.world.addChild(this.waveManager);

        // Add static tower menu buttons
        this.towerMenuRange = new game.TowerMenuItem(23*TILE_WIDTH+10, 4.5*TILE_HEIGHT,
            TOWER_MENU_RANGE, TOWER_COST_RANGE);
        me.game.world.addChild(this.towerMenuRange);

        this.towerMenuStun = new game.TowerMenuItem(23*TILE_WIDTH+10, 6.5*TILE_HEIGHT,
            TOWER_MENU_STUN, TOWER_COST_STUN);
        me.game.world.addChild(this.towerMenuStun);

        this.towerMenuExplode = new game.TowerMenuItem(23*TILE_WIDTH+10, 8.5*TILE_HEIGHT,
            TOWER_MENU_EXPLODE, TOWER_COST_EXPLODE)
        me.game.world.addChild(this.towerMenuExplode);

        this.towerMenuSell = new game.TowerMenuItem(23*TILE_WIDTH+10, 10.5*TILE_HEIGHT,
            TOWER_MENU_SELL, 0)
        me.game.world.addChild(this.towerMenuSell);

        // Add the HUD to the game
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);
    },

    onDestroyEvent: function() {
        // Remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
        me.game.world.removeChild(this.waveManager);
        me.game.world.removeChild(this.towerMenuRange);
        me.game.world.removeChild(this.towerMenuStun);
        me.game.world.removeChild(this.towerMenuExplode);
        me.game.world.removeChild(this.towerMenuSell);
    }
});
