// TowerNode GUI Object
game.TowerNode = me.GUI_Object.extend(
{
    // constructor:
    init: function (x, y)
    {
        var settings = {};
        settings.image = "towerNode";
        settings.framewidth = TILE_WIDTH;
        settings.frameheight = TILE_HEIGHT;
        // super constructor
        this._super(me.GUI_Object, "init", [x, y, settings]);
        this.anchorPoint.set(0,0);

        // set tower node properties for displaying tower menu and replacing node.
        this.name = "TowerNode";
        this.x = x;
        this.y = y;
        this.selected = false;
        this.locked = false;
        this.parentTower = this;
        this.currentTower = this;
    },

    // Change to selected tower object if a tower hasn't already been placed.
    onClick: function (event)
    {
		if (!game.data.isPaused) {
            // Check if any other tower nodes are already selected.
            var towerNodes = me.game.world.getChildByName("TowerNode");
            for (var i = 0; i < towerNodes.length; i++)
                if (towerNodes[i].selected)
                {
                    towerNodes[i].selected = false;
                    // Remove the selected tower node, if the node doesn't have a tower.
                    if (game.data.sellTower == false)
                    {
                        me.game.world.removeChild(towerNodes[i].currentTower);
                        towerNodes[i].currentTower = towerNodes[i];
                    }
                }

            // If this node is locked, select to sell tower.
            if (this.locked == true)
            {
                this.selected = true;
                game.data.sellTower = true;
            }

            // The node is not locked so select it if there is enough gold to purchase a tower.
            else 
            {
                game.data.sellTower = false;
                if (game.data.gold >= TOWER_COST_RANGE)
                {
                    // Select the existing tower.
                    this.selected = true;
                    this.currentTower = me.game.world.addChild(
                        new game.TowerSelectedNode(this.x, this.y, this.parentTower));
                }
            }
        }
        // don't propagate the event
        return false;
    }
});

game.TowerSelectedNode = me.GUI_Object.extend(
{
    // constructor:
    init: function (x, y, parentTower)
    {
        var settings = {};
        settings.image = "selectedNode";
        settings.framewidth = TILE_WIDTH;
        settings.frameheight = TILE_HEIGHT;
        // super constructor
        this._super(me.GUI_Object, "init", [x, y, settings]);
        this.anchorPoint.set(0,0);

        // set tower node properties for displaying tower menu and replacing node.
        this.name = "TowerNode";
        this.x = x;
        this.y = y;
        this.selected = true;
        this.locked = false;
        this.parentTower = parentTower;
        this.currentTower = this;
    },

    // Change back to tower node object if a tower hasn't already been placed.
    onClick: function (event)
    {
        if (this.locked == false && !game.data.isPaused) 
        {
            this.parentTower.selected = false;
            me.game.world.removeChild(this);
        }

        // don't propagate the event
        return false;
    }
});