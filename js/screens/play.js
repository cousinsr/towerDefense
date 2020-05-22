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
