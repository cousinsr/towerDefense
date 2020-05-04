/********************************************************************
 * Class for a Robed Skeleton Entity
 *
 * Parameters: x is the x position where the object will be created,
 * and y is the y position.
 *
 * This is the medium speed, medium health enemy used in the game.
 ********************************************************************/
game.RobedSkeleton = game.Skeleton.extend(
{
    init: function (x, y)
    { 
        // Set the attributes for calling the constructor
        var speed = 150;
        var health = 8;
        var reward = ENEMY_GOLD_ROBED;

        // Call the parent constructor
        this._super(game.Skeleton, 'init', [x, y, "robed_skeleton", speed, health, reward]);
    }
});