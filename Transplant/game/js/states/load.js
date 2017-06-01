var load = {
	preload: function(){
		console.log('Load: preload');
		var loadLabel = this.add.text(80, 150, 'Loading...', {font: '30px Courier', fill: '#ffffff'}); //text on the screen to indicate the game is loading
		game.load.path = '../game/assets/img/';
		game.load.image('grass', 'platform.png');

		// background
		game.load.image('title', 'titleScreen.png');
		game.load.image('hallRoomSprite', 'HallOne.jpg');
		game.load.image('startRoomSprite', 'Level01.jpg');
		game.load.image('shadowsHallOne', 'shadowsHallOne.png');
		game.load.image('endingBackground', 'Ending.jpg');
		game.load.image('endingTallGrass', 'endingTallGrass.png');
		

		//title screen
		game.load.image('title', 'titleScreen.png');
		game.load.image('playButton', 'playButton.png');

		// sprites
		game.load.image('box', 'box.png');
		game.load.atlas('atlas', 'patient.png', 'patient.json');
		game.load.spritesheet('ducktor', 'ducktor.png', 385, 1332);
		
		game.load.image('normalDoor', 'normalDoor.png');
		game.load.image('transitionDoor', 'door2.png');
		game.load.image('elevator', 'Elevator.png');
		game.load.image('darkDoor', 'door.png');
		game.load.image('medicalLocker', 'medicalLocker.png');
		game.load.image('stairs', 'Stairs.png');
		game.load.image('bigLight', 'bigLight.png');
		game.load.image('cabinet', 'filingCabinet.png');
		game.load.image('keyCard303', 'keyCard303.png');
		game.load.image('bookShelf', 'bookShelf.jpg');
		game.load.image('bed', 'hospitalBed.png');
		// load in level files
		game.load.path = '../game/data/';
		game.load.json('level0', 'Level0-StartRoom.json');
		game.load.json('level1', 'Level1-Hallway.json');
		game.load.json('endLevel', 'endLevel.json');
		game.load.json('room303', 'room303.json'); 


	},
	create: function(){
		console.log('Load: create');
		game.physics.startSystem(Phaser.Physics.ARCADE); //can change physics system if needed
		game.state.start('menu'); //move to next state after preload is finished
	}
};
