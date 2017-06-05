//Global Variables
var foreground = true; //variable to keep track of which layer player will be in
var backgroundGroup; // background
var doorGroup; //group to distinguish what will be a door
var group1; //right in front of background
var obstacleHideGroup; //Obstacle group for objects that youv can hide behind
var obstacleGroup;	//Obstacle group for obejcts with full hit box
var obstaclePushGroup; //Obstacle group for objects that player can push
var obstacleClimbGroup; //Obstacle group for objects that player can climb and only top hitbox
var enemyGroup; //group for enemies
var group2; //top layer
var group3; //Layer above everything to do lighting
var isClimbing = false; //variable to check if player is climbing or not
var canControl = true; //variable to check if player has control at the moment
var player; //the player
var hitPlatform; //did player hit the ground or an object?
var climb; //can the player climb right now?
var hide; //is the player overlapping with a hidable object?
var distanceFromGround; //player's y-distance from the ground
var door1; //door in the starting room
var ground; //the ground player stands on
var ground2; //the ground player will stand on when hiding
var playerGravity = 800;
var playerDirection = 1;
var hidePlatform; //hit detection on ground when player is hiding
var playerSpawnX = 50; // where to spawn the player after entering a door, etc
var pushCollide; //check if player is collidiing with pushable objects
var pushOverlap; //check if player is overlapping with pushable objects

var playState = {
	preload: function(){
		console.log('Play: preload');
		//preload more things if needed
	},

	create: function() {
		console.log('Play: create')

		//Layers from Back to Front
		backgroundGroup = game.add.group();// background
		doorGroup = game.add.group();
		group1 = game.add.group();//layer above background
		obstacleHideGroup = game.add.group(); //hidable objects
		obstacleGroup = game.add.group(); // obstacles
		obstaclePushGroup = game.add.group(); //pushable objects
		obstacleClimbGroup = game.add.group(); //climbable obstacles
		enemyGroup = game.add.group(); // enemies
		group2 = game.add.group();//top layer
		group3 = game.add.group();//Lighting layer

		//Groups unrelated to layers
		platforms = game.add.group();
		platforms2 = game.add.group();


		generateLevel('level0');

		//Bring these groups to the forefront
		game.world.bringToTop(group2);
		game.world.bringToTop(group3);


		//Adding use of various keys 
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
		if(foreground == true){
			hitPlatform = game.physics.arcade.collide(player, [platforms,obstacleGroup,obstaclePushGroup]);
		}
		pushOverlap = game.physics.arcade.overlap(player,obstaclePushGroup);
		var enemyHitPlatform = game.physics.arcade.collide(enemyGroup, platforms);
		climb = game.physics.arcade.overlap(player,obstacleClimbGroup);
		hide = game.physics.arcade.overlap(player,obstacleHideGroup);
		if(foreground == false){
			hidePlatform = game.physics.arcade.collide(player, platforms2);
		}

		distanceFromGround = (game.world.height-128) - player.position.y; //continually calculate

		//Climb objects
		if(climb && foreground == true && player.body.velocity.y < 15.1){ //can only climb when in front of the object
			if(game.input.keyboard.isDown(Phaser.Keyboard.W) && player.body.velocity.y == 0){
				if(player.frame >= 13 || player.frame <= 0){ //reset the frames
					player.frame = 0; //set to bottom climb frames
				}
				player.frame ++; //Go through each frame of climb
				//player goes up
				player.body.position.y -= 2;
				isClimbing = true; //disable left and right movement
				player.body.gravity.y = 0; //player doesn't automatically fall off
			}
			if(game.input.keyboard.isDown(Phaser.Keyboard.S) && !hitPlatform && !game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
				if(player.frame >= 13 || player.frame <= 0){ //reset the frames
					player.frame = 13; //set to top of climb frames
				}
				player.frame --; //Go through each frame of climb backwards
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
			player.body.gravity.y = playerGravity;
		}

		//Allow left to right movement when not climbing but not when climbing something
		if(isClimbing == true){
			canControl = false;
		}
		else if(isClimbing == false){
			canControl = true;
			player.body.gravity.y = playerGravity;
		}
		//Give control back when touching the ground
		if (hitPlatform) {
			canControl = true;
			isClimbing = false;
		}

		//Movement system
		player.body.velocity.x = 0; //reset player velocity

		//Check Direction player is moving in
		if(playerDirection >= 1){
			playerDirection = 1; //Right
		}
		if(playerDirection <= 0){
			playerDirection = 0; //Left
		}

		if(game.input.keyboard.isDown(Phaser.Keyboard.A) && canControl == true){
			//move left
			playerDirection --; //player was moving left
			if(foreground == true){
				//Allow player to move on the ground and move in the air while jumping
				player.body.velocity.x = -150;
				if(player.body.touching.down){
					//Walking animation
					player.animations.play('walkLeft');
				}
				//jump animation
				else{
					if(player.body.velocity.y < 0){
						//Going up animation
						player.frame = 43;
					}
					if(player.body.velocity.y > 0){
						//Going down animation
						player.frame = 44;
					}
				}
			}
			else{
				//Crawling animation
				player.animations.play('crawlLeft');
				player.body.velocity.x = -75;
			}
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.D) && canControl ==true){
			//move right
			playerDirection ++; //player was moving right
			if(foreground == true){
				//Allow player to move on the ground and move in the air while jumping
				player.body.velocity.x = 150;
				if(player.body.touching.down){
					//Walking animation
					player.animations.play('walkRight');
				}
				//jump animation
				else{
					if(player.body.velocity.y < 0){
						//Going up animation
						player.frame = 35;
					}
					if(player.body.velocity.y > 0){
						//Going down animation
						player.frame = 36;
					}
				}
			}
			else{
				//crawling animations
				player.animations.play('crawlRight');
				player.body.velocity.x = 75;
			}
		}

		else{
			//stand still
			player.animations.stop();
			if((!isClimbing || player.body.touching.down) && foreground == true){
				if(playerDirection == 0){
					player.frame = 53; //Face Left
				}
				if(playerDirection == 1){
					player.frame = 46; //Face right
				}
   			}
   		}
	},
	hide: function(){
		if(isClimbing == false && !climb && !hide && !pushOverlap){ //Don't allow player to hide when in front of the object
			if(foreground==true && distanceFromGround <= 40){
				//move player from foreground to layer behind the object
				group2.remove(player);
				group1.add(player);
				foreground=false;
				if(playerDirection == 0){
					player.frame = 21;
				}
				if(playerDirection == 1){
					player.frame = 14;
				}
				player.position.y = game.world.height - 225; //set player to hide platform
			}
			else if(foreground == false && hidePlatform){
				//move player to the foreground
				group1.remove(player);
				group2.add(player);
				foreground=true;
				if(playerDirection == 0){
					player.frame = 53; //Face Left
				}
				if(playerDirection == 1){
					player.frame = 46; //Face right
				}
				player.position.y = game.world.height - 175; //set player to normal platform
			}
		}
	},
	jump: function(){
		//Scenario checks to see if you can jump
		//Touching the ground, while climbing, in front of a climbable object on the ground, on top of obstacleGroup
		if((hitPlatform && distanceFromGround <= 40) || isClimbing == true || (climb == true && distanceFromGround <= 40)|| player.body.touching.down){
			if(foreground == true){
				player.animations.stop();
				if(playerDirection == 0){
					player.frame = 41; // Jumping Left
				}
				if(playerDirection == 1){
					player.frame = 35; //Jumping Right
				}
				player.body.velocity.y = -400; //jump height
				isClimbing = false;
			}
		}
	},
	interactDoor: function(){
		var doorEntering;
		if(foreground == true){
			for(var i = 0; i < doorGroup.children.length; i++) {
			
				doorEntering = doorGroup.children[i];
				if(game.physics.arcade.overlap(player, doorEntering)){

					playerSpawnX = doorEntering.spawnAtx; // set appropriate place to spawn
					this.generateLevel(doorEntering.leadsTo);
				
					console.log(doorEntering.leadsTo);
					break;
				}
				
			}
		}
		
	}

	
};

var generateLevel = function(levelName) {

	console.log('generated');

	backgroundGroup.forEach(function (c) {c.kill();});
	doorGroup.forEach(function (c) {c.kill();});
	group1.forEach(function (c) {c.kill();});
	obstacleHideGroup.forEach(function (c) {c.kill();}); 
	obstacleGroup.forEach(function (c) {c.kill();});
	obstaclePushGroup.forEach(function (c) {c.kill();});
	obstacleClimbGroup.forEach(function (c) {c.kill();});
	while(enemyGroup.length > 0) {
		// destroy can cause forEach to skip index. While loop helps ensure that all enemies get destroyed.
		enemyGroup.forEach(function (c) {c.kill(); c.destroy(); console.log('destroyed');});
	}
	
	group2.forEach(function (c) {c.kill();});
	group3.forEach(function (c) {c.kill();});

	var levelData = game.cache.getJSON(levelName);

	//Set camera bounds
	//Change this to work per level in the JSON
	game.world.setBounds(0, 0, levelData.worldBounds.x, levelData.worldBounds.y);

	var background = game.add.sprite(0,0, levelData.backgroundData);
	game.world.sendToBack(background);
	backgroundGroup.add(background);

	//Lighting filter for room
	var shadows = game.add.sprite(0,0, levelData.shadowData); 
	group3.add(shadows);

	// generate all doors from the data
	for (var index = 0; index < levelData.doorData.length; index++) {
		// set element to the object and use it's parameters
		var doorTemp = new Door(game, levelData.doorData[index].frame, levelData.doorData[index].name, levelData.doorData[index].leadsTo, levelData.doorData[index].xPos, levelData.doorData[index].yPos, levelData.doorData[index].spawnAtx);
		console.log(doorTemp.name);
		game.physics.enable(doorTemp);
		game.add.existing(doorTemp);
		doorGroup.add(doorTemp);
	}

	// generate all enemies from the data
	for (var index = 0; index < levelData.obstacleData.length; index++) {
		// set element to the object and use it's parameters
		var obstacleTemp = new Obstacle(game, levelData.obstacleData[index].frame, levelData.obstacleData[index].xPos, levelData.obstacleData[index].yPos, levelData.obstacleData[index].xScale, levelData.obstacleData[index].yScale, levelData.obstacleData[index].pushable, levelData.obstacleData[index].climbable, levelData.obstacleData[index].collidable, levelData.obstacleData[index].gravityEnabled, levelData.obstacleData[index].hidable);
		game.add.existing(obstacleTemp);
		if(obstacleTemp.climbable == true) {
			obstacleClimbGroup.add(obstacleTemp);
		}
		else if(obstacleTemp.hidable == true){
			obstacleHideGroup.add(obstacleTemp);
		}
		else if(obstalceTemp.pushable == true){
			obstaclePushGroup.add(obstacleTemp);
		}
		else{
			obstacleGroup.add(obstacleTemp);
		}
		//console.log(obstacleTemp);
	} 

	//Player object
	player = game.add.sprite(playerSpawnX, game.world.height - 175, 'atlas', 'patient 1.png');
	//player properties
	game.physics.enable([player], Phaser.Physics.ARCADE);
	player.body.setSize(600, 1800, 420, 25); // adjusts hitbox
	player.anchor.set(0.5);
	player.scale.x = 0.075;
	player.scale.y = 0.075;
	game.physics.enable(player);
	player.body.gravity.y = playerGravity;
	player.body.collideWorldBounds = true;
	//animations for walking
	player.animations.add('walkRight', [47,48,49,50,51,52], 10, true);
	player.animations.add('walkLeft', [54,55,56,57,58,59], 10, true);
	player.animations.add('crawlRight',[14,15,16,17,18,19,20], 10, true);
	player.animations.add('crawlLeft',[21,22,23,24,25,26,27], 10, true);
	group2.add(player); //set player to top layer

	game.camera.follow(player, Phaser.PLATFORMER);

	// generate enemies
	for (var index = 0; index < levelData.enemyData.length; index++) {
		// set element to the object and use it's parameters
		var enemyTemp = new Enemy(game, levelData.enemyData[index].frame, levelData.enemyData[index].xPos, levelData.enemyData[index].yPos, levelData.enemyData[index].walkSpeed, levelData.enemyData[index].runSpeed, levelData.enemyData[index].walkDist, levelData.enemyData[index].turnTime, levelData.enemyData[index].facing, player);
		enemyTemp.scale.x = 0.17;
		enemyTemp.scale.y = 0.145;
		console.log(enemyTemp.target);
		game.add.existing(enemyTemp);
		enemyGroup.add(enemyTemp);

		//console.log(enemyTemp);
		//console.log('make');
	} 

	
	// platforms
	platforms.enableBody = true;
	ground = platforms.create(0, game.world.height - 100, 'grass'); //Note use a better placeholder art next time
	ground.scale.setTo(100, 0.5);
	ground.body.immovable = true; 
	ground.alpha = 0;

	//Ground for when hiding to have alignment with hidable objects
	platforms2.enableBody = true;
	ground2 = platforms2.create(0, game.world.height - 150, 'grass'); //Note use a better placeholder art next time
	ground2.scale.setTo(100, 0.5);
	ground2.body.immovable = true; 
	ground2.alpha = 0;

	console.log('done');
}


