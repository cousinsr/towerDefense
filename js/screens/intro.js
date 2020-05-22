game.IntroScreen = me.Stage.extend({

    onResetEvent: function() {
        // Load the intro screen
        me.levelDirector.loadLevel("intro");
        me.game.world.addChild(new me.ColorLayer("background", "#373737"), 0);
        this.enemyGenerator = me.pool.pull("enemyGenerator");
        me.game.world.addChild(this.enemyGenerator);
    },

    onDestroyEvent: function() {
        // Remove the enemyGenerator from the game world
        me.game.world.removeChild(this.enemyGenerator);
    }
});
