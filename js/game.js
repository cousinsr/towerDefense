/********************************************************************
 * Game Namespace
 *
 * CITATION: This code is adapted from the MelonJS Boilerplate
 *
 ********************************************************************/
var game = {

    // Global game information
    data : {
        // HUD: Player life balance
        life: START_LIFE,
        // HUD: Wave count
        wave: 0,
        // HUD: Player gold balance
        gold: START_GOLD,
        // HUD: Current level
        level: 0,
        // Tower node/menu: selected for selling
        sellTower: false,
        // Track data as of the start of the most recent level reached.
        // Player life balance
        lastStartingLife: START_LIFE,
        // Player gold balance
        lastStartingGold: START_GOLD,
        // Pause tracker
        isPaused: false,
        // Mute audio tracker
        isMuted: false,
        // Enemy arrays
        enemies: [],
        dyingEnemies: []
    },

    // Run on page load.
    "onload" : function () {
        // Initialize the video.
        if (!me.video.init(TILE_WIDTH*TILE_COUNT_WIDTH, TILE_HEIGHT*TILE_COUNT_HEIGHT, {wrapper : "screen", renderer : me.video.CANVAS, scale : "auto", scaleMethod : "fit"})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // Initialize the audio.
        me.audio.init("mp3,ogg");

        // set and load all resources.
        // (this will also automatically switch to the loading screen)
        me.loader.preload(game.resources, this.loaded.bind(this));
    },

    // Run on game resources loaded.
    "loaded" : function () {
        // Add all game screens.
        me.state.set(INTRO, new game.IntroScreen());
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.SETTINGS, new game.InstructionScreen());
        me.state.set(me.state.CREDITS, new game.CitationsScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.state.set(me.state.READY, new game.NextLevelScreen());
        me.state.set(RESTART, new game.RestartScreen());
        me.state.set(me.state.GAMEOVER, new game.GameOverScreen());
        me.state.set(me.state.GAME_END, new game.GameEndScreen());

        // Add the enemy skeleton objects to the entity pool
        me.pool.register("Skeleton", game.Skeleton);
        me.pool.register("clothedSkeleton", game.ClothedSkeleton);
        me.pool.register("robedSkeleton", game.RobedSkeleton);
        me.pool.register("armoredSkeleton", game.ArmoredSkeleton);
        me.pool.register("dyingSkeleton", game.DyingSkeleton);

        // Add the entity that manages waves within a level
        me.pool.register("waveManager", game.WaveManager);
        me.pool.register("enemyGenerator", game.EnemyGenerator);

        // Add the turn collision objects to the entity pool
        me.pool.register("DownTurn", game.DownTurn);
        me.pool.register("UpTurn", game.UpTurn);
        me.pool.register("RightTurn", game.RightTurn);
        me.pool.register("LeftTurn", game.LeftTurn);

        // Add the tower objects to the entity pool
        me.pool.register("TowerNode", game.TowerNode);
        me.pool.register("TowerSelectedNode", game.TowerSelectedNode);
        me.pool.register("TowerMenuItem", game.TowerMenuItem);
        me.pool.register("RangeTower", game.RangeTower);
        me.pool.register("StunTower", game.StunTower);
        me.pool.register("ExplodeTower", game.ExplodeTower);

        // Add the projectile objects (launched by towers) to the entity pool.
        me.pool.register("missile", game.Missile);
        me.pool.register("bomb", game.Bomb);
        // Add a static position marker used by the ExplodeTower to shoot a bomb at a fixed position.
        me.pool.register("positionMarker", game.PositionMarker);
        // Add a stun effect visual used by the StunTower when it launches attacks.
        me.pool.register("stunEffect", game.StunEffect);
        // Add an explosion effect visual used by the ExplodeTower bombs after they impact a target.
        me.pool.register("explosionEffect", game.ExplosionEffect);
        // Add a static decal effect marking where a projectile (missile) hit the ground.
        me.pool.register("groundDecal", game.GroundDecal);

        // Add the spawn point and finishing zone to the game
        me.pool.register("Start", game.Start);
        me.pool.register("Finish", game.Finish);

        // Add the object for deciding whether to turn or not
        me.pool.register("DecisionPoint", game.DecisionPoint);

        // Add button objects
        me.pool.register("PauseButton", game.PauseButton);
        me.pool.register("IntroButton", game.IntroButton);

        // Start the intro screen
        me.state.change(INTRO);
    }
};