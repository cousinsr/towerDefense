/********************************************************************
 * Class for a Armored Skeleton Entity
 *
 * Parameters: x is the x position where the object will be created,
 * and y is the y position.
 *
 * This is the slow speed, high health enemy used in the game.
 ********************************************************************/
game.ArmoredSkeleton = game.Skeleton.extend(
{
    init: function (x, y)
    { 
        // Set the attributes for calling the constructor
        var speed = 100;
        var health = 12;
        var reward = ENEMY_GOLD_ARMORED;

        // Call the parent constructor
        this._super(game.Skeleton, 'init', [x, y, "armored_skeleton", speed, health, reward]);
    }
});