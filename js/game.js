/* Game namespace */
var game = {

    // an object where to store game information
    data : {
        // score
        score : 0
    },


    // Run on page load.
    "onload" : function () {
        // Initialize the video.
        if (!me.video.init(1280, 1280, {wrapper : "screen", scale : "auto", scaleMethod : "fit"})) {
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
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());

        // Add our player entity in the entity pool
        me.pool.register("mainPlayer", game.PlayerEntity);

        // Add the enemy skeleton objects to the entity pool
        me.pool.register("clothedSkeleton", game.ClothedSkeleton);
        me.pool.register("robedSkeleton", game.RobedSkeleton);
        me.pool.register("armoredSkeleton", game.ArmoredSkeleton);

        // Add the turn collision objects to the entity pool
        me.pool.register("DownTurn", game.DownTurn);
        me.pool.register("UpTurn", game.UpTurn);
        me.pool.register("RightTurn", game.RightTurn);
        me.pool.register("LeftTurn", game.LeftTurn);

        // Add the tower objects to the entity pool
        me.pool.register("TowerNode", game.TowerNode);
        me.pool.register("RangeTower", game.RangeTower);
        me.pool.register("StunTower", game.StunTower);
        me.pool.register("ExplodeTower", game.ExplodeTower);

        // Add the finishing zone to the game
        me.pool.register("Finish", game.Finish);

        // Start the game.
        me.state.change(me.state.PLAY);
    }
};

game.functions =
{
    //remove all menu objects
    removeMenu: function(childName)
    {
        var menuObjects = me.game.world.getChildByName(childName);
        var menuObjectsLength = menuObjects.length;

        // Remove objects from world
        for (var i = 0; i < menuObjectsLength; i++)
            me.game.world.removeChild(menuObjects[i]);
    }
}
