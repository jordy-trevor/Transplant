var endState = {
	create: function(){
		var end = game.add.tileSprite(0,0,1200,800, 'gameOver');
		var button = game.add.button(1055, 535, 'menuButton', this.actionOnClick, this);
		//button.scale.setTo(1.65,0.5);
		//button.alpha = 0;

		//Make transparent
		end.alpha = 0;

		//Adding fade effects
		game.add.tween(end).to( {alpha: 1}, 2000, Phaser.Easing.Linear.None, true, 0, 0, false);
	},
	actionOnClick: function(){
		game.state.start('menu');
	}
};