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

        this.waveManager = me.pool.pull("waveManager", LEVEL_COMP, game.data.level);
        me.game.world.addChild(this.waveManager);

        // Add static tower menu buttons
        me.game.world.addChild(me.pool.pull("TowerMenuItem", 23*TILE_WIDTH, 2.5*TILE_HEIGHT,
            TOWER_MENU_RANGE, "button50", TOWER_COST_RANGE));
        me.game.world.addChild(me.pool.pull("TowerMenuItem", 23*TILE_WIDTH, 4.5*TILE_HEIGHT,
            TOWER_MENU_STUN, "button50", TOWER_COST_STUN));
        me.game.world.addChild(me.pool.pull("TowerMenuItem", 23*TILE_WIDTH, 6.5*TILE_HEIGHT,
            TOWER_MENU_EXPLODE, "button75", TOWER_COST_EXPLODE));

        // Add the HUD to the game
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);
    },

    onDestroyEvent: function() {
        // Remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
		me.game.world.removeChild(this.waveManager);
    }
});
