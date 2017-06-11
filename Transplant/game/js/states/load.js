var load = {
	preload: function(){
		console.log('Load: preload');
		var loadLabel = this.add.text(80, 150, 'Loading...', {font: '30px Courier', fill: '#ffffff'}); //text on the screen to indicate the game is loading
		game.load.path = '../game/assets/img/';
		//ground art but won't be seen
		game.load.image('grass', 'platform.png');

		// background
		game.load.image('title', 'titleScreen.png');
		game.load.image('controls', 'Controls.png');
		game.load.image('hallRoomSprite', 'HallOne.jpg');
		game.load.image('startRoomSprite', 'Level01.jpg');
		game.load.image('shadowsHallOne', 'shadowsHallOne.png');
		game.load.image('endingBackground', 'Ending.jpg');
		game.load.image('endingTallGrass', 'endingTallGrass.png');
		game.load.image('patientRoom', 'patientRoom.jpg');
		game.load.image('HallBG', 'HallBG.jpg');
		game.load.image('hall2', 'HallTwo.jpg');
		game.load.image('shadowsHallTwo', 'shadowsHallTwo.png');
		game.load.image('lab', 'lab.jpg');
		game.load.image('gameOver', 'gameOver.jpg');
		game.load.image('runTutorial', 'runTutorial.jpg');
		game.load.image('burntLab', 'burntLab.jpg');

		//title screen
		game.load.image('title', 'titleScreen.png');
		game.load.image('playButton', 'playButton.png');
		game.load.image('menuButton', 'menuButton.png');
		game.load.image('controlsScreen', 'Controls.png');

		// sprites
		game.load.image('box', 'box.png');
		game.load.atlas('atlas', 'patient.png', 'patient.json');
		game.load.atlas('atlas2', 'ducktor.png', 'ducktor.json');
		game.load.atlas('atlas3', 'lab ducktor.png', 'lab ducktor.json');
		game.load.atlas('elevatorAtlas', 'elevatorPanel.png', 'elevatorPanel.json');
		
		//Additional assests
		game.load.image('normalDoor', 'normalDoor.png');
		game.load.image('transitionDoor', 'door2.png');
		game.load.image('elevator', 'Elevator.png');
		game.load.image('darkDoor', 'door.png');
		game.load.image('medicalLocker', 'medicalLocker.png');
		game.load.image('stairs', 'Stairs.png');
		game.load.image('bigLight', 'bigLight.png');
		game.load.image('cabinet', 'filingCabinet.png');
		game.load.image('keyCard303', 'keyCard303.png');


		game.load.image('floor1ElevatorCode', 'floor1ElevatorCode.png');
		game.load.image('floor2ElevatorCode', 'floor2ElevatorCode.png');
		game.load.image('floor3ElevatorCode', 'floor3ElevatorCode.png');
		game.load.image('morgueElevatorCode', 'morgueElevatorCode.png');
		game.load.image('entranceFloorElevatorCode', 'entranceFloorElevatorCode.png');


		game.load.image('bookShelf', 'bookShelf.jpg');
		game.load.image('bed', 'hospitalBed.png');
		game.load.image('medBox', 'MedBox.png');
		game.load.image('labDoor', 'labDoor.png');
		game.load.image('blackScreen', 'black.png');
		game.load.image('desk', 'Desk.png');
		game.load.image('airVent', 'airVent.png');
		game.load.image('airVentPart', 'airVentPart.png');
		game.load.image('horizontalPipes', 'horizontalPipes.png');
		game.load.image('verticalPipes', 'verticalPipes.png');
		game.load.image('doubleDoor', 'doubleDoor.png');
		game.load.image('table', 'Table.png');
		game.load.image('interactableE', 'interactableE.png');
		game.load.image('burntLabDoor', 'burntLabDoor.png');



		//notes
		game.load.image('newsArticle', 'newsArticle.png');
		game.load.image('medCabinet', 'medicalCabinet.jpg');
		game.load.image('wheelChair', 'wheelchair.png');
		game.load.image('note1', 'familyPortrait.jpg');
		game.load.image('complaint', 'complaint.png');


		// inventory
		game.load.image('entranceFloorElevatorCodeInventory', 'inventory/Entrance.png');
		game.load.image('floor1ElevatorCodeInventory', 'inventory/Floor 1.png');
		game.load.image('floor2ElevatorCodeInventory', 'inventory/Floor 2.png');
		game.load.image('floor3ElevatorCodeInventory', 'inventory/Floor 3.png');
		game.load.image('inventoryBackgroundInventory', 'inventory/inventory.png');
		game.load.image('morgueElevatorCodeInventory', 'inventory/Morgue.png');
		game.load.image('keyCard105Inventory', 'inventory/Room 105 Key Card.png');
		game.load.image('keyCard201Inventory', 'inventory/Room 201 Key Card.png');
		game.load.image('keyCard203Inventory', 'inventory/Room 203 Key Card.png');
		game.load.image('keyCard205Inventory', 'inventory/Room 205 Key Card.png');
		game.load.image('keyCard303Inventory', 'inventory/Room 303 Key Card.png');
		

		// load in level files
		game.load.path = '../game/data/';
		game.load.json('level0', 'Level0-StartRoom.json');
		game.load.json('level1', 'Level1-Hallway.json');
		game.load.json('level2', 'Level2-HallwayF2.json');
		game.load.json('level3', 'Level3-HallwayF1.json');
		game.load.json('labLevel', 'Level4-lab.json');
		game.load.json('endLevel', 'endLevel.json');
		game.load.json('room303', 'room303.json'); 
		game.load.json('room305', 'room305.json');
		game.load.json('doctorOffice', 'doctorOffice.json');
		game.load.json('room203', 'room203.json');
		game.load.json('room205', 'room205.json');
		game.load.json('room101', 'room101.json');
		game.load.json('room103', 'room103.json');
		game.load.json('room105', 'room105.json');
		game.load.json('burntLab', 'Level5-burntLab.json');

		// sound
		game.load.path = '../game/assets/audio/';
		game.load.audio('hospitalMusic', 'hospitalMusic.mp3');
		game.load.audio('indoorFootsteps', 'indoorFootsteps.mp3');
		game.load.audio('doorOpenClose', 'doorOpenClose.mp3');


	},
	create: function(){
		console.log('Load: create');
		game.physics.startSystem(Phaser.Physics.ARCADE); //can change physics system if needed
		game.state.start('menu'); //move to next state after preload is finished
	}
};
