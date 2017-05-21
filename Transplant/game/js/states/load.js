var load = {
	preload: function(){
		console.log('Load: preload');
		var loadLabel = this.add.text(80, 150, 'Loading...', {font: '30px Courier', fill: '#ffffff'}); //text on the screen to indicate the game is loading
		game.load.path = '../game/assets/img/';
		game.load.image('grass', 'platform.png');

		// background
		game.load.image('hallRoomSprite', 'HallOne.jpg');
		game.load.image('startRoomSprite', 'Level_01.jpg');

		// sprites
		game.load.image('box', 'box.png');
		game.load.spritesheet('player', 'patient.png', 1500, 1837);
		game.load.image('normalDoor', 'normalDoor.png');
		game.load.image('transitionDoor', 'door2.png');
		game.load.image('elevator', 'Elevator.png');
		game.load.image('darkDoor', 'door.png');
		game.load.image('medicalLocker', 'medicalLocker.png');

		// load in level files
		game.load.path = '../game/data/';
		game.load.json('level0', 'Level0-StartRoom.json');
		game.load.json('level1', 'Level1-Hallway.json');


	},
	create: function(){
		console.log('Load: create');
		game.physics.startSystem(Phaser.Physics.ARCADE); //can change physics system if needed
		game.state.start('menu'); //move to next state after preload is finished
	}
};
