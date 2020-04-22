var TILE_WIDTH = 64;
var TILE_HEIGHT = 64;

var MENU_RANGE = 1;
var MENU_EXPLODE = 2;
var MENU_STUN = 3;
var MENU_CANCEL = 4;

game.TowerMenu = game.TowerMenu || {};

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
        this.x = x;
        this.y = y;
        this.locked = false;
        this.towerObject = this;
    },

    // show tower menu when the object is clicked
    onClick: function (event)
    {
        var settings = {};
        settings.parent_x = this.x;
        settings.parent_y = this.y;
        settings.towerObject = this.towerObject;

        // place menu to the right of the tile, passing (x,y,w,h,settings)
        if (this.locked == false)
        {
            this.Menu = new game.TowerMenu(
                this.x + TILE_WIDTH * 1.5, this.y, 
                TILE_WIDTH * 1.5, TILE_HEIGHT * 1.5,
                settings);
            me.game.world.addChild(this.Menu);
        }

        // don't propagate the event
        return false;
     }
});


// TowerMenu container
game.TowerMenu = me.Container.extend(
{
    init: function (x, y, w, h, settings)
    {
        this._super(me.Container, "init", [x, y, w, h]);
        this.name = "TowerMenu";
        this.floating = true;

        // Add tower and cancel menu buttons
        settings.menu_button = MENU_RANGE;
        me.game.world.addChild(
            new game.TowerMenu.Button(x, y, settings));

        settings.menu_button = MENU_EXPLODE;
        me.game.world.addChild(
            new game.TowerMenu.Button(x, y + TILE_HEIGHT * 1.5, settings));

        settings.menu_button = MENU_STUN;
        me.game.world.addChild(
            new game.TowerMenu.Button(x, y + TILE_HEIGHT * 3, settings));

        settings.menu_button = MENU_CANCEL;
        me.game.world.addChild(
            new game.TowerMenu.Button(x, y + TILE_HEIGHT * 4.5, settings));
    }
});


// Tower menu option
game.TowerMenu.Button = me.GUI_Object.extend(
{
    // constructor:
    init: function(x, y, settings)
    {
        // NOTE - the current image in /data/img/towers is for
        // demonstrative purposes and will need to be replaced.
        settings.image = "menu_button";
        settings.frameheight = 75; //TILE_HEIGHT;
        settings.framewidth = 150; //TILE_WIDTH;
        this._super(me.GUI_Object, "init", [x, y, settings]);

        this.name = ("TowerMenuButton");
        this.addAnimation("button", [0]);
        this.addAnimation("hover", [1]);
        this.addAnimation("confirm", [2]);
        this.setCurrentAnimation("button");
        this.anchorPoint.set(0.0, 0.0);
        this.confirm = false;

        this.menu_button = settings.menu_button;
        this.parent_x = settings.parent_x;
        this.parent_y = settings.parent_y;
        this.towerObject = settings.towerObject;
    },

    onOver: function(e)
    {
        this.setCurrentAnimation("hover");
    },

    onOut: function(e)
    {
        this.setCurrentAnimation("button");
        this.confirm = false;
    },

    onClick(e)
    {
        if (this.confirm == false) {
            this.confirm = true;
        } else {
            // Lock tower node so can no longer add a menu.
            if (this.menu_button != MENU_CANCEL)
                this.towerObject.locked = true;

            // Add correct tower object.
            if (this.menu_button == MENU_RANGE)
                this.towerObject = me.game.world.addChild(
                    new game.RangeTower(this.parent_x, this.parent_y, 
                        {width: TILE_WIDTH, height: TILE_HEIGHT}));

            else if (this.menu_button == MENU_EXPLODE)
                this.towerObject = me.game.world.addChild(
                    new game.ExplodeTower(this.parent_x, this.parent_y, 
                        {width: TILE_WIDTH, height: TILE_HEIGHT}));

            else if (this.menu_button == MENU_STUN)
                this.towerObject = me.game.world.addChild(
                    new game.StunTower(this.parent_x, this.parent_y, 
                        {width: TILE_WIDTH, height: TILE_HEIGHT}));

            // Remove menu container and buttons.
            game.functions.removeMenu(this.name);
            game.functions.removeMenu("TowerMenu");
        }
    },

    update: function(dt)
    {
        if (this.confirm == true)
            this.setCurrentAnimation("confirm");
        return true;
    },
});