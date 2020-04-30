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
        this.towerObject = this;
    },

    // Change to selected tower object if a tower hasn't already been placed.
    onClick: function (event)
    {
        if (this.locked == false) 
        {
            // Check if any other tower nodes are already selected.
            var towerNodes = me.game.world.getChildByName("TowerNode");
            for (var i = 0; i < towerNodes.length; i++)
                if (towerNodes[i].selected)
                {
                    towerNodes[i].selected = false;
                    me.game.world.removeChild(towerNodes[i].towerObject);
                    towerNodes[i].towerObject = me.game.world.addChild(
                        new game.TowerNode(towerNodes[i].x, towerNodes[i].y));
                }

            // Select the existing tower.
            this.selected = true;
            this.towerObject = me.game.world.addChild(
                new game.TowerSelectedNode(this.x, this.y));
        }

        // don't propagate the event
        return false;
    }
});

game.TowerSelectedNode = me.GUI_Object.extend(
{
    // constructor:
    init: function (x, y)
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
        this.towerObject = this;
    },

    // Change back to tower node object if a tower hasn't already been placed.
    onClick: function (event)
    {
        if (this.locked == false) 
        {
            me.game.world.removeChild(this.towerObject);
            this.towerObject = me.game.world.addChild(
                new game.TowerNode(this.x, this.y));
            this.selected = false;
        }

        // don't propagate the event
        return false;
    }
});