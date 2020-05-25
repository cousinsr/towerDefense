/********************************************************************
 * Play screen for the actual game

 * CITATION: This code is adapted from the MelonJS Boilerplate
 *
 ********************************************************************/

// 1 enemy combinations
var c1C = ["clothedSkeleton"];
var c1R = ["robedSkeleton"];
var c1A = ["armoredSkeleton"];

// 2 enemy combinations
var c2CR = ["clothedSkeleton", "robedSkeleton"];
var c2CCR = ["clothedSkeleton", "clothedSkeleton", "robedSkeleton"];
var c2CRR = ["clothedSkeleton", "robedSkeleton", "robedSkeleton"];

var c2CA = ["clothedSkeleton", "armoredSkeleton"];
var c2CCA = ["clothedSkeleton", "clothedSkeleton", "armoredSkeleton"];
var c2CAA = ["clothedSkeleton", "armoredSkeleton", "armoredSkeleton"];

var c2RA = ["robedSkeleton", "armoredSkeleton"];
var c2RRA = ["robedSkeleton", "robedSkeleton", "armoredSkeleton"];
var c2RAA = ["robedSkeleton", "armoredSkeleton", "armoredSkeleton"];

// 3 enemy combinations
var c3CRA = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
var c3CCRA = ["clothedSkeleton", "clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
var c3CRRA = ["clothedSkeleton", "robedSkeleton", "robedSkeleton", "armoredSkeleton"];
var c3CRAA = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton", "armoredSkeleton"];

game.PlayScreen = me.Stage.extend({

    onResetEvent: function() {
        // Level enemy compositions:
        var level = {};

        // Set composition of each wave for Level 01
        if (game.data.level == 0) {
            level.enemies = [c1C, c2CCR, c2CRR, c3CCRA, c2CCA, c2RRA, c3CRA, c2RA, c3CRA, c3CRAA];
            level.counts = [2, 2, 3, 3, 4, 4, 5, 5, 6, 6];
            level.timeGaps = [3, 10, 12, 12, 15, 15, 18, 18, 21, 25];
        }

        // Set composition of each wave for Level 02
        else if (game.data.level == 1) {
            level.enemies = [c2CR, c2CA, c2CA, c3CCRA, c3CCRA, c2RRA, c2RRA, c3CRA, c3CRRA, c3CRRA];
            level.counts = [3, 3, 3, 3, 4, 4, 4, 5, 5, 5];
            level.timeGaps = [3, 5, 7, 9, 11, 4, 4, 4, 4, 4];
        }

        // Set composition of each wave for Level 03
        else if (game.data.level == 2) {
            level.enemies = [c2CR, c3CRA, c2CA, c3CCRA, c3CCRA, c2RA, c2RA, c3CRAA, c3CRRA, c3CRRA];
            level.counts = [3, 3, 3, 3, 4, 4, 5, 5, 6, 6];
            level.timeGaps = [3, 10, 12, 12, 15, 15, 18, 18, 21, 21];
        }

        // Set composition of each wave for Level 04
        else {
            level.enemies = [c1C, c2CCR, c2CRR, c3CRA, c2CCA, c2RA, c2RA, c3CRA, c3CRA, c3CRA];
            level.counts = [4, 4, 4, 4, 4, 6, 6, 6, 6, 8];
            level.timeGaps = [3, 5, 5, 5, 5, 10, 10, 10, 10, 12];
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
