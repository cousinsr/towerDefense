/********************************************************************
 * Class for a Tower menu button
 *
 * Parameters:
 *   - x and y are the (x, y) coordinates where the object will be created.
 *   - tower type is range, stun, explode, or sell types.
 *   - tower cost is how much the type of tower costs to build.
 *
 * This object is created/destroyed from the play.js events.
 * Tower types and costs are found in constants.js.
 ********************************************************************/
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

        // set button images from 'towerMenu' sprite
        this.addAnimation("button", [towerType-1]);
        this.addAnimation("confirm", [4]);
        this.addAnimation("cancel", [5]);
        this.setCurrentAnimation("cancel");

        // initialize button properties
        this.isClickable = false;
        this.confirm = false;
        this.towerType = towerType;
        this.towerCost = towerCost;
    },

    onOut: function (event) 
    {
        // button was not double clicked:
        this.confirm = false;
        return false;
    },

    onClick: function (event)
    {
        // single click:
        if (this.confirm == false && !game.data.isPaused)
            this.confirm = true;

        // double click:
        else if (!game.data.isPaused)
        {
            // Find the coordintaes of the selected tower node for selling/buying a tower.
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
                // Tower is being sold: 
                if (this.towerType == TOWER_MENU_SELL)
                {
                    // Update global game variables.
                    game.data.gold += TOWER_SELL_RATE * tower.currentTower.towerCost;
                    game.data.sellTower = false;
                    me.audio.play("CashRegister");

                    // Remove tower.
                    tower.selected = false;
                    tower.placed = false;
                    me.game.world.removeChild(tower.currentTower);
                }
                else if (this.towerCost <= game.data.gold)
                {
                    // Tower is being bought since it is affordable.
                    // Remove the selected tower node before adding new tower.
                    tower.selected = false;
                    tower.placed = true;
                    me.game.world.removeChild(tower.currentTower);
                    me.audio.play("Plop");

                    // Add tower that is being bought:
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
        // Update button image and clickable properties based on game's state.
        if (this.confirm == true) 
        {
            // Button was single clicked; change to checkbox for double click.
            this.setCurrentAnimation("confirm");
            this.isClickable = true;
        }
        else if (this.towerType == TOWER_MENU_SELL)
        {
            // Change sell button to dollar sign if this isn't wave 10.
            if (game.data.sellTower == true && game.data.wave < 10)
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
            // Change button to buy image if there is enough gold to buy the tower.
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