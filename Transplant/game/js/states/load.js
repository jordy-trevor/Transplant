var load = {
	preload: function(){
		console.log('Load: preload');
		var loadLabel = this.add.text(80, 150, 'Loading...', {font: '30px Courier', fill: '#ffffff'}); //text on the screen to indicate the game is loading
		game.load.path = '../game/assets/img/';
		game.load.image('grass', 'platform.png');
		game.load.image('box', 'box.png');
		game.load.spritesheet('player', 'patient.png', 1500, 1837);

		// load in level files
		game.load.path = '../game/data/';
		game.load.json('level1', 'Level1-Hallway.json');

	},
	create: function(){
		console.log('Load: create');
		game.physics.startSystem(Phaser.Physics.ARCADE); //can change physics system if needed
		game.state.start('menu'); //move to next state after preload is finished
	}
}
