// Tower menu option
game.TowerMenuItem = me.GUI_Object.extend(
{
    // constructor:
    init: function(x, y, towerType, towerCost)
    {
        settings = {};
        settings.image = "towerMenu";
        settings.frameheight = TILE_HEIGHT;
        settings.framewidth = TILE_WIDTH;
        this._super(me.GUI_Object, "init", [x, y, settings]);

        // set button images
        this.addAnimation("button", [towerType-1]);
        this.addAnimation("confirm", [4]);
        this.addAnimation("cancel", [5]);
        if (towerType == TOWER_MENU_SELL)
            this.setCurrentAnimation("cancel");
        else
            this.setCurrentAnimation("button");

        // set button properties
        this.isClickable = false;
        this.confirm = false;
        this.towerType = towerType;
        this.towerCost = towerCost;
    },

    onOut: function (event) 
    {
        this.confirm = false;
        return false;
    },

    onClick: function (event)
    {
        // single click:
        if (this.confirm == false) {
            this.confirm = true;

        // double click:
        }
        else
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

            // A selected tower node has been found.
            if (x > 0) 
            {
                // Selling tower 
                if (this.towerType == TOWER_MENU_SELL)
                {
                    // Update global game variables.
                    game.data.gold += TOWER_SELL_RATE * tower.currentTower.towerCost;
                    game.data.sellTower = false;

                    // Remove tower.
                    tower.selected = false;
                    tower.locked = false;
                    me.game.world.removeChild(tower.currentTower);
                }
                else if (this.towerCost <= game.data.gold)
                {
                    // Add tower since it is affordable.
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
            }
        }

        // don't propagate the event
        return false;
    },

    update: function ()
    {
        if (this.confirm == true) 
        {
            this.setCurrentAnimation("confirm");
            this.isClickable = true;
        }
        else if (this.towerType == TOWER_MENU_SELL)
        {
            if (game.data.sellTower == true)
            {
                this.setCurrentAnimation("button");
                this.isClickable = true;
            }
            else
            {
                this.setCurrentAnimation("cancel");
                this.isClickable = false;
            }
        }
        else if (this.towerCost <= game.data.gold)
        {
            this.setCurrentAnimation("button");
            this.isClickable = true;
        }
        else
        {
            this.setCurrentAnimation("cancel");
            this.isClickable = false;
        }
        return true;
    }
});