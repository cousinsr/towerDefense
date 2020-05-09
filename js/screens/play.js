/********************************************************************
 * Play screen for the actual game

 * CITATION: This code is adapted from the MelonJS Boilerplate
 *
 ********************************************************************/
game.PlayScreen = me.Stage.extend({

    onResetEvent: function() {
        // Load first level with a black background covering the default melonJS background
        me.levelDirector.loadLevel(TILE_LEVELS[game.data.level]);
        me.game.world.addChild(new me.ColorLayer("background", "#373737"), 0);

        // Set composition of each wave for Level 01
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
        var enemies = [w1, w2, w3, w4, w5, w6, w7, w8, w9, w10];

        // Set number of enemies in each wave, time between each wave (in seconds), and available spawn points
        var counts = [2, 2, 3, 3, 4, 4, 5, 5, 6, 8];
        var timeGaps = [3, 10, 12, 12, 15, 15, 18, 18, 21, 25];
        var spawnPoints = me.game.world.getChildByProp("name", "Start");
        me.game.world.addChild(me.pool.pull("waveManager", enemies, counts, timeGaps, spawnPoints));

        // Add static tower menu buttons
        me.game.world.addChild(me.pool.pull("TowerMenuItem", 23*TILE_WIDTH, 2.5*TILE_HEIGHT,
            TOWER_MENU_RANGE, "button50", TOWER_COST_RANGE));
        me.game.world.addChild(me.pool.pull("TowerMenuItem", 23*TILE_WIDTH, 4.5*TILE_HEIGHT,
            TOWER_MENU_STUN, "button50", TOWER_COST_STUN));
        me.game.world.addChild(me.pool.pull("TowerMenuItem", 23*TILE_WIDTH, 6.5*TILE_HEIGHT,
            TOWER_MENU_EXPLODE, "button75", TOWER_COST_EXPLODE));

        // Begin empty array of missed skeletons
        game.data.missedSkeletons = [];

        // Add the HUD to the game
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);
    },

    onDestroyEvent: function() {
        // Remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
    }
});
