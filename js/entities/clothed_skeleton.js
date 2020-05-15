/********************************************************************
 * Class for a Clothed Skeleton Entity
 *
 * Parameters: x is the x position where the object will be created,
 * and y is the y position.
 *
 * This is the fast but weak enemy used in the game.
 ********************************************************************/
game.ClothedSkeleton = game.Skeleton.extend(
{
    init: function (x, y)
    { 
        // Set the attributes for calling the constructor
        var speed = 175;
        var health = 4;
		var speedRange = 50;
        var reward = ENEMY_GOLD_CLOTHED;

        // Call the parent constructor
        this._super(game.Skeleton, 'init', [x, y, "clothed_skeleton", speed, speedRange, health, reward]);
    }
});