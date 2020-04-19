// create a basic GUI Object
game.TowerNode = me.GUI_Object.extend(
{
    init: function (x, y)
    {
        var settings = {}
        // NOTE - the current image in /data/img/towers is a
        // placehold and will need to be replaced. 
        settings.image = "towerNode";
        settings.framewidth = 64;
        settings.frameheight = 64;
        // super constructor
        this._super(me.GUI_Object, "init", [x, y, settings]);

        // TODO:
        //  - determine why x coordinate is off
        //  - why is there animation in the image???
        // define the object z order
//        this.pos.z = 4;

//        this.x = x;
//        this.y = y;
        this.anchorPoint.set(0,0);
//        this.towerExists = false;
    },

    // output something in the console
    // when the object is clicked
    onClick:function (event)
    {
//        console.log("clicked!");
        // TODO:
        //   - show menu with three towers
        //   - replace tower location with the tower object 
        return false;
     }
});