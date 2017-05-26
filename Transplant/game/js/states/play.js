//Global Variables
var foreground = true; //variable to keep track of which layer player will be in
var backgroundGroup; // background
var doorGroup; //group to distinguish what will be a door
var group1; //right in front of background
var group2; //middle layer
var enemyGroup; //group for enemies
var obstacleGroup;	//Obstacle group for obejcts with full hit box
var obstacleClimbGroup; //Obstacle group for objects that player can climb and only top hitbox
var group3; //top layer
var group4; //Layer above everything to do lighting
var isClimbing = false; //variable to check if player is climbing or not
var canControl = true; //variable to check if player has control at the moment
var player; //the player
var hitPlatform; //did player hit the ground or an object?
var climb; //can the player climb right now?
var distanceFromGround; //player's y-distance from the ground
var door1; //door in the starting room
var ground; //the ground player stannds on

var playState = {
	preload: function(){
		console.log('Play: preload');
		//preload more things if needed
	},

	create: function() {
		console.log('Play: create')

		//Create the layers to do hiding
		backgroundGroup = game.add.group();// background
		doorGroup = game.add.group();
		group0 = game.add.group();//interactable in background
		group1 = game.add.group();//layer above background
		group2 = game.add.group();//middle layer
		enemyGroup = game.add.group(); // enemies
		obstacleGroup = game.add.group(); // obstacles
		obstacleClimbGroup = game.add.group(); //climbable obstacles
		group3 = game.add.group();//top layer
		group4 = game.add.group();//Lighting layer
		platforms = game.add.group();


		generateLevel('level0');

		game.world.bringToTop(group3);
		game.world.bringToTop(group4);


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
		if(climb && foreground == true && player.body.velocity.y < 15.1){ //can only climb when in front of the object
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
			player.body.gravity.y = 450;
		}

		//Allow left to right movement when not climbing but not when climbing something
		if(isClimbing == true){
			canControl = false;
		}
		else if(isClimbing == false){
			canControl = true;
			player.body.gravity.y = 450;
		}
		//Give control back when touching the ground
		if (hitPlatform) {
			canControl = true;
			isClimbing = false;
		}

		player.body.velocity.x = 0; //reset player velocity

		//Movement system
		if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
			console.log(enemyHitPlatform);
		}
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
		if((player.position.x<400 || player.position.x>528) && isClimbing == false){ //Don't allow player to hide when in front of the object
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
		//Scenario checks to see if you can jump
		//Touching the ground, while climbing, in front of a climbable object on the ground, on top of obstacleGroup
		if((hitPlatform && distanceFromGround <= 5) || isClimbing == true || (climb == true && distanceFromGround <= 5)|| player.body.touching.down){
			player.body.velocity.y = -235; //jump height
			isClimbing = false;
			//play animation
		}
	},

	
	interactDoor: function(){
		var doorEntering;
		for(var i = 0; i < doorGroup.children.length; i++) {
			
			doorEntering = doorGroup.children[i];
			if(game.physics.arcade.overlap(player, doorEntering)){

				this.generateLevel(doorEntering.leadsTo);
				console.log(doorEntering.leadsTo);
				break;
			}
			
		}
		
	}

	
};

var generateLevel = function(levelName) {

		console.log('generated');

		backgroundGroup.forEach(function (c) {c.kill();});
		doorGroup.forEach(function (c) {c.kill();});
		group1.forEach(function (c) {c.kill();});
		group2.forEach(function (c) {c.kill();});
		enemyGroup.forEach(function (c) {c.kill();});
		obstacleGroup.forEach(function (c) {c.kill();}); 
		obstacleClimbGroup.forEach(function (c) {c.kill();});
		group3.forEach(function (c) {c.kill();});
		group4.forEach(function (c) {c.kill();});

		var levelData = game.cache.getJSON(levelName);

		//Set camera bounds
		//Change this to work per level in the JSON
		game.world.setBounds(0, 0, 2400, 600);

		var background = game.add.sprite(0,0, levelData.backgroundData);
		game.world.sendToBack(background);
		backgroundGroup.add(background);

		//Lighting filter for room
		var shadows = game.add.sprite(0,0, levelData.shadowData); //Currently set to hall one, eventually changed to load from JSON file
		group4.add(shadows);

		// generate all doors from the data
		for (var index = 0; index < levelData.doorData.length; index++) {
			// set element to the object and use it's parameters
			var doorTemp = new Door(game, levelData.doorData[index].frame, levelData.doorData[index].name, levelData.doorData[index].leadsTo, levelData.doorData[index].xPos, levelData.doorData[index].yPos);
			console.log(doorTemp.name);
			game.physics.enable(doorTemp);
			game.add.existing(doorTemp);
			doorGroup.add(doorTemp);
		}

		// generate all enemies from the data
		for (var index = 0; index < levelData.obstacleData.length; index++) {
			// set element to the object and use it's parameters
			var obstacleTemp = new Obstacle(game, levelData.obstacleData[index].frame, levelData.obstacleData[index].xPos, levelData.obstacleData[index].yPos, levelData.obstacleData[index].xScale, levelData.obstacleData[index].yScale, levelData.obstacleData[index].pushable, levelData.obstacleData[index].climbable, levelData.obstacleData[index].collidable, levelData.obstacleData[index].gravityEnabled);
			game.add.existing(obstacleTemp);
			if(obstacleTemp.climbable == true) {
				obstacleClimbGroup.add(obstacleTemp);
			}
			else{
				obstacleGroup.add(obstacleTemp);
			}
			console.log(obstacleTemp);
		} 

		//Player object
		player = game.add.sprite(32, game.world.height - 200, 'player');
		//player properties
    game.physics.enable([player], Phaser.Physics.ARCADE);
		player.body.setSize(600, 1800, 420, 25); // adjusts hitbox
		player.anchor.set(0.5);
		player.scale.x = 0.075;
		player.scale.y = 0.075;
		game.physics.enable(player);
		player.body.gravity.y = 450;
		player.body.collideWorldBounds = true;
		//animations for walking
		player.animations.add('walkRight', [1,2,3,4,5,6], 10, true);
		player.animations.add('walkLeft', [8,9,10,11,12,13], 10, true);
		group3.add(player); //set player to top layer

		game.camera.follow(player, Phaser.PLATFORMER);

		// generate enemies
		for (var index = 0; index < levelData.enemyData.length; index++) {
			// set element to the object and use it's parameters
			var enemyTemp = new Enemy(game, levelData.enemyData[index].frame, levelData.enemyData[index].xPos, levelData.enemyData[index].yPos, levelData.enemyData[index].speed, levelData.enemyData[index].walkDist, levelData.enemyData[index].turnTime, levelData.enemyData[index].facing, player);
			enemyTemp.scale.x = 0.17;
			enemyTemp.scale.y = 0.145;
			console.log(enemyTemp.target);
			game.add.existing(enemyTemp);
			enemyGroup.add(enemyTemp);

			console.log(enemyTemp);
			console.log('make');
		} 

		
		// platforms
		platforms.enableBody = true;
		ground = platforms.create(0, game.world.height - 100, 'grass'); //Note use a better placeholder art next time
		ground.scale.setTo(40, 0.5);
		ground.body.immovable = true; 
		ground.alpha = 0;

		console.log('done');
	}


