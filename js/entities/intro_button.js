/********************************************************************
 * Class for an Intro Button object to begin the game
 *
 * Parameters: x and y coordinates for the location of the button in
 * the screen
 *
 ********************************************************************/
game.IntroButton = me.GUI_Object.extend({
    init: function (x, y, settings) {
		// Set up appearance
        settings.image = "click";
		// Call the constructor
        this._super(me.GUI_Object, 'init', [x, y , settings]);
		// Set the opacity to be lower
		this.setOpacity(0.7);
    },
	// Cause the button to stand out when hovered over
	onOver: function (event) {
		this.setOpacity(1.0);
		return false;
	},
	// Return to regular opacity
	onOut: function (event) {
		this.setOpacity(0.7);
        return false;
	},
	// Go to title menu when clicked
	onClick: function (event)
	{
		me.state.change(me.state.MENU);		
		return false;
	}
});