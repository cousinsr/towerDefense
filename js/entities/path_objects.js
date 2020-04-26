/********************************************************************
 * The four classes below simply allow Tiled to include turn objects
 * to be used to set up the path for skeleton entities to take through
 * the map in the game.
 ********************************************************************/
game.DownTurn = me.Entity.extend({
    init: function (x, y, settings) {
        this._super(me.Entity, 'init', [x, y , settings]);
    }
});

game.UpTurn = me.Entity.extend({
    init: function (x, y, settings) {
        this._super(me.Entity, 'init', [x, y , settings]);
    }
});

game.LeftTurn = me.Entity.extend({
    init: function (x, y, settings) {
        this._super(me.Entity, 'init', [x, y , settings]);
    }
});

game.RightTurn = me.Entity.extend({
    init: function (x, y, settings) {
        this._super(me.Entity, 'init', [x, y , settings]);
    }
});

/********************************************************************
 * This class simply allows Tiled to include start and finish objects
 * to indicate where a skeleton entity enters and leaves the path.
 ********************************************************************/
game.Start = me.Entity.extend({
    init: function (x, y, settings) {
        this._super(me.Entity, 'init', [x, y , settings]);
    }
});

game.Finish = me.Entity.extend({
    init: function (x, y, settings) {
        this._super(me.Entity, 'init', [x, y , settings]);
    }
});