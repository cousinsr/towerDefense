game.PlayScreen = me.Stage.extend({

    onResetEvent: function() {
        // Load first level with a black background covering the default melonJS background
        me.levelDirector.loadLevel(TILE_LEVEL);
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
        me.game.world.addChild(me.pool.pull("TowerMenuItem", 23*TILE_WIDTH, 2.5*TILE_HEIGHT, MENU_RANGE, "button50"));
        me.game.world.addChild(me.pool.pull("TowerMenuItem", 23*TILE_WIDTH, 4.5*TILE_HEIGHT, MENU_STUN, "button50"));
        me.game.world.addChild(me.pool.pull("TowerMenuItem", 23*TILE_WIDTH, 6.5*TILE_HEIGHT, MENU_EXPLODE, "button75"));

        // FROM BOILERPLATE: Reset the score
        game.data.score = 0;
        // Reset player life balance.
        game.data.life = 10;
        // Begin empty array of missed skeletons
        game.data.missedSkeletons = [];

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
