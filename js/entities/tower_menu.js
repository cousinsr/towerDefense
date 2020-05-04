// Tower menu option
game.TowerMenuItem = me.GUI_Object.extend(
{
    // constructor:
    init: function(x, y, towerType, imageName, towerCost)
    {
        settings = {};
        settings.image = imageName;
        settings.frameheight = TILE_HEIGHT;
        settings.framewidth = TILE_WIDTH*2;
        this._super(me.GUI_Object, "init", [x, y, settings]);

        this.isClickable = false;
        this.towerType = towerType;
        this.towerCost = towerCost;
    },

    onClick: function (event)
    {
        // Find the selected tower node
        var towerNodes = me.game.world.getChildByName("TowerNode");
        var tower = null;
        var x = 0;
        var y = 0;

        for (var i = 0; i < towerNodes.length; i++)
            if (towerNodes[i].selected)
            {
                tower = towerNodes[i];
                x = tower.x;
                y = tower.y;
                break;
            }

        // Add correct tower object if tower has been found and is affordable.
        if ((x > 0) && (this.towerCost <= game.data.gold)) 
        {
            tower.selected = false;
            tower.locked = true;
            me.game.world.removeChild(tower.currentTower);

            if (this.towerType == TOWER_MENU_RANGE)
                tower.currentTower = me.game.world.addChild(
                    new game.RangeTower(x, y, {width: TILE_WIDTH, height: TILE_HEIGHT}));

            else if (this.towerType == TOWER_MENU_STUN)
                tower.currentTower = me.game.world.addChild(
                    new game.StunTower(x, y, {width: TILE_WIDTH, height: TILE_HEIGHT}));

            else if (this.towerType == TOWER_MENU_EXPLODE)
                tower.currentTower = me.game.world.addChild(
                    new game.ExplodeTower(x, y, {width: TILE_WIDTH, height: TILE_HEIGHT}));

            // Update gold balance.
            game.data.gold -= this.towerCost;
        }

        // don't propagate the event
        return false;
    },

    update: function ()
    {
        if (this.towerCost <= game.data.gold)
            this.isClickable = true;
        else
            this.isClickable = false;
    }
});