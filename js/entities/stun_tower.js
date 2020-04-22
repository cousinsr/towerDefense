game.StunTower = me.Entity.extend(
{
    init: function (x, y, settings)
    {
        // Update settings:
        //  - tower image
        //  - client (tile) height/width
        // NOTE - the current image in /data/img/towers is a placeholder
        // and will need to be replaced.
        settings.image = "stunTower";
        settings.framewidth = TILE_WIDTH;
        settings.frameheight = TILE_HEIGHT;

        // Construct and postion tower in the center of tower node.
        this._super(me.Entity, "init", [x, y, settings]);
    }
});