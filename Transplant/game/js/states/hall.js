//Global Variables
var room301; //starting room
var room302;
var elevator;

var hallState = {
	create: function() {
		console.log('hall: create')

		game.add.sprite(0,0, 'hall');

		//Create the layers to do hiding
		group1 = game.add.group();//layer above background
		group2 = game.add.group();//middle layer
		group3 = game.add.group();//top layer
		enemyGroup = game.add.group(); // enemies
		obstacleGroup = game.add.group(); // obstacles
		obstacleClimbGroup = game.add.group(); //climbable obstacles

		elevator = game.add.sprite(466, 419, 'Elevator');
		elevator.anchor.set(0.5, 0.5);
		game.physics.enable(elevator);
		group1.add(elevator);

		room301 = game.add.sprite(114, 425, 'normalDoor');
		room301.anchor.set(0.5, 0.5);
		game.physics.enable(room301);
		group1.add(room301);

		room302 = game.add.sprite(879, 425, 'door302');
		room302.anchor.set(0.5, 0.5);
		game.physics.enable(room302);
		group1.add(room302);

		//Object to hide behind
		var object = game.add.sprite(800,game.world.height-175, 'box');
		object.scale.setTo(1.5);
		group2.add(object); //set object to middle layer


		// TREVOR'S TESTS ==================================================

		
		// TEMP: Object Creation
		var obstacleTest = new Obstacle(game, 'box', 700, 500, false, true, 'full', false);
		game.add.existing(obstacleTest);
		obstacleTest.scale.setTo(1.25,1.25);
		var obstacleTest2 = new Obstacle(game, 'box', 200, 200, false, true, 'top', true);
		game.add.existing(obstacleTest2);
		obstacleTest2.scale.setTo(1);
		var obstacleTest3 = new Obstacle(game, 'box', 700, 200, true, true, 'full', true);
		game.add.existing(obstacleTest3);
		obstacleTest3.scale.setTo(1);

		obstacleGroup.add(obstacleTest);
		obstacleGroup.add(obstacleTest3);
		
		obstacleClimbGroup.add(obstacleTest2);
		// ==================================================================

		//Player object
		player = game.add.sprite(32, game.world.height - 150, 'player');
		//player properties
		player.anchor.set(0.5);
		player.scale.x = 0.075;
		player.scale.y = 0.075;
		game.physics.enable(player);
		player.body.gravity.y = 300;
		player.body.collideWorldBounds = true;
		//animations for walking
		player.animations.add('walkRight', [1,2,3,4,5,6], 10, true);
		player.animations.add('walkLeft', [8,9,10,11,12,13], 10, true);
		group3.add(player); //set player to top layer
		game.world.bringToTop(group3);

		// TEMP: Enemy Creation
		var enemyTest = new Enemy(game, 'box', 1000, 400, 30, 150, 0, 'left', player);
		game.add.existing(enemyTest);
		enemyTest.scale.setTo(0.5, 0.5);
		enemyGroup.add(enemyTest);

		//Creating a ground to stand on
		platforms = game.add.group();
		platforms.enableBody = true;
		ground = platforms.create(0, game.world.height - 64, 'grass'); //Note use a better placeholder art next time
		ground.scale.setTo(20, 0.5);
		ground.body.immovable = true; 
		ground.alpha = 0;

		//Adding use of various keys
		//cursors = game.input.keyboard.createCursorKeys(); 
		this.input.keyboard.addKey(Phaser.Keyboard.W);
		this.input.keyboard.addKey(Phaser.Keyboard.A);
		this.input.keyboard.addKey(Phaser.Keyboard.D);
		this.input.keyboard.addKey(Phaser.Keyboard.S);

		//Key press won't affect browser
		this.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);

		//Use H key to swap between layers
		this.hideKey = game.input.keyboard.addKey(Phaser.Keyboard.H);
		this.hideKey.onDown.add(this.hide, this);

		//Use Space Bar to jump
		this.jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.jumpKey.onDown.add(this.jump, this);

		//Use E key to open the door
		this.interactKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
		this.interactKey.onDown.add(this.interactDoor);

	},

	update: function(){
		hitPlatform = game.physics.arcade.collide(player, [platforms,obstacleGroup]);
		var enemyHitPlatform = game.physics.arcade.collide(enemyGroup, platforms);
		climb = game.physics.arcade.overlap(player,obstacleClimbGroup);

		distanceFromGround = (game.world.height-128) - player.position.y; //continually calculate

		//Climb objects
		if(climb && group3.children.indexOf(player) > -1){ //can only climb when in front of the object
			if(game.input.keyboard.isDown(Phaser.Keyboard.W) && player.body.velocity.y == 0){
				//player goes up
				player.body.position.y -= 2;
				isClimbing = true; //disable left and right movement
				player.body.gravity.y = 0; //player doesn't automatically fall off
			}
			if(game.input.keyboard.isDown(Phaser.Keyboard.S) && !hitPlatform && !game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
				//player goes down
				player.body.position.y += 2;
				isClimbing = true; //disable left and right movement
				player.body.velocity.y = 0;
				player.body.gravity.y = 0; //player doesn't automatically fall off
			}
		}

		//reset variables away from climbing
		if(!climb){
			isClimbing = false;
			player.body.gravity.y = 300;
		}

		//Allow left to right movement when not climbing but not when climbing something
		if(isClimbing == true){
			canControl = false;
		}
		else if(isClimbing == false){
			canControl = true;
		}

		//Give control back when touching the ground
		if (hitPlatform) {
			canControl = true;
			isClimbing = false;
		}

		player.body.velocity.x = 0; //reset player velocity

		//Movement system
		if(game.input.keyboard.isDown(Phaser.Keyboard.A) && canControl == true){
			//move left
			player.animations.play('walkLeft');
			player.body.velocity.x = -150;
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.D) && canControl ==true){
			//move right
			player.animations.play('walkRight');
			player.body.velocity.x = 150;
		}

		else{
			//stand still
			player.animations.stop();
			player.frame = 14; //Currently only facing right when stopped, can be changed later
		}

	},
	hide: function(){
		if(player.position.x<400 || player.position.x>528){ //Don't allow player to hide when in front of the object
			if(foreground==true){
				//move player from foreground to layer behind the object
				group3.remove(player);
				group1.add(player);
				foreground=false;
			}
			else{
				//move player to the foreground
				group1.remove(player);
				group3.add(player);
				foreground=true;
			}
		}
	},
	jump: function(){
		//console.log('Hitplatform:' + hitPlatform + ' isClimb:' + isClimbing + ' climb:' + climb + ' player touch down:' + player.body.touching.down);
		//Scenario checks to see if you can jump
		//Touching the ground, while climbing, in front of a climbable object on the ground, on top of obstacleGroup
		if((hitPlatform && distanceFromGround <= 5) || isClimbing == true || (climb == true && distanceFromGround <= 5)|| player.body.touching.down){
			player.body.velocity.y = -300; //jump height
			//play animation
		}
	},
	interactDoor: function(){
		if(game.physics.arcade.overlap(player, room301)){
			game.state.start('play');
		}
	}
};
