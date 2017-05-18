var load = {
	preload: function(){
		console.log('Load: preload');
		var loadLabel = this.add.text(80, 150, 'Loading...', {font: '30px Courier', fill: '#ffffff'}); //text on the screen to indicate the game is loading
		game.load.path = '../game/assets/img/';
		game.load.image('grass', 'platform.png');
		game.load.image('box', 'box.png');
		game.load.spritesheet('player', 'patient.png', 1500, 1837);
		game.load.image('hall', 'HallOne.jpg');
		game.load.image('level1', 'Level_01.jpg');
		game.load.image('normalDoor', 'normalDoor.png');
		game.load.image('door302', 'door2.png');
		game.load.image('Elevator', 'Elevator.png');
		game.load.image('door', 'door.png');

	},
	create: function(){
		console.log('Load: create');
		game.physics.startSystem(Phaser.Physics.ARCADE); //can change physics system if needed
		game.state.start('menu'); //move to next state after preload is finished
	}
};
