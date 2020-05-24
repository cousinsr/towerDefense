/********************************************************************
 * Classes for 'unselected' and 'selected' Tower node GUI objects.
 *
 * Parameters:
 *   - x and y are the (x, y) coordinates where the object will be created.
 *
 * This object is created/destroyed from the play.js events.
 * Tower types and costs are found in constants.js.
 ********************************************************************/
game.TowerNode = me.GUI_Object.extend(
{
    // constructor:
    init: function (x, y)
    {
        // Initialize to a 64x64 'unselected' node image.
        var settings = {};
        settings.image = "towerNode";
        settings.framewidth = TILE_WIDTH;
        settings.frameheight = TILE_HEIGHT;
        // super constructor
        this._super(me.GUI_Object, "init", [x, y, settings]);
        this.anchorPoint.set(0,0);

        // set tower node properties to integrate with tower menu.
        this.name = "TowerNode";
        this.x = x;
        this.y = y;
        this.selected = false;
        this.placed = false;

        // A 'unselected' tower node is always the parent tower.
        // Current tower will be unselected, selected, or a placed tower. 
        this.parentTower = this;
        this.currentTower = this;
    },

    // If a tower node is clicked, it is either being selected for 1) selling,
    // 2) buying or 3) changing back to unselected.
    onClick: function (event)
    {
        if (!game.data.isPaused)
        {
            // Check if any other tower nodes are already selected.
            // If there are any, they need to be unselected before selecting a tower.
            var towerNodes = me.game.world.getChildByName("TowerNode");
            for (var i = 0; i < towerNodes.length; i++)
                if (towerNodes[i].selected)
                {
                    towerNodes[i].selected = false;
                    // Remove the selected tower node, if the node doesn't have a tower.
                    // If a node with a tower has been selected, the sellTower property
                    // will be true.
                    if (game.data.sellTower == false)
                    {
                        me.game.world.removeChild(towerNodes[i].currentTower);
                        towerNodes[i].currentTower = towerNodes[i];
                    }
                }

            // If a tower has been placed on this node, then the node has been 
            // selected for selling. Change the sellTower property to true.
            if (this.placed == true)
            {
                this.selected = true;
                game.data.sellTower = true;
            }

            // The node does not have a tower placed so it was selected for buying a
            // tower. Change to a 'selected' node if there is enough gold to purchase
            // the cheapest tower.
            else 
            {
                game.data.sellTower = false;
                if (game.data.gold >= TOWER_MIN_COST)
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
        // Initialize to a 64x64 'selected' node image.
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
        this.placed = false;
        this.parentTower = parentTower;
        this.currentTower = this;
    },

    // Change back to 'unselected' tower node object if a tower hasn't already been placed.
    onClick: function (event)
    {
        // The node does not have a tower placed on it so it was selected to 'unselect' it.
        // Change to a 'unselected' node.
        if (this.placed == false && !game.data.isPaused) 
        {
            this.parentTower.selected = false;
            me.game.world.removeChild(this);
        }

        // don't propagate the event
        return false;
    }
});