game.IntroButton = me.GUI_Object.extend({
    init: function (x, y, settings, pause) {
        settings.image = "click";
        this._super(me.GUI_Object, 'init', [x, y , settings]);
		this.setOpacity(0.7);
    },
	
	onOver: function (event) {
		this.setOpacity(1.0);
		return false;
	},

	onOut: function (event) {
		this.setOpacity(0.7);
        return false;
	},
	
	onClick: function (event)
	{
		me.state.change(me.state.MENU);		
		return false;
	}
});