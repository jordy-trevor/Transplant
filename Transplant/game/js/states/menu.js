var menuState = {
	preload: function(){
		console.log('Menu: preload');
		//preload anything else needed
	},
	create: function(){
		console.log('Menu: create');
		var gameName = this.add.text(300, 150, 'Transplant', {font: '30px Courier', fill: '#800080'}); //Game title

		//Filler state changer
		var startLabel = this.add.text(225, 300, 'Press Space to Start', {font: '30px Courier', fill: '#FFFFFF'}); //Text in the middle of the screen to prompt the player to start the game
		this.spaceBar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR); //use of space bar on keyboard
		this.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR); //enable use of keyboard
	},

	update: function() {
		if(this.spaceBar.isDown) { //check if space bar was pressed
			this.state.start('play'); //Switch to the next state
		}
	}
};