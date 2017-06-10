//Global Variables

// ----------- GROUPS ------------------------------
var backgroundGroup; // background
var doorGroup; //group to distinguish what will be a door
var group1; //right in front of background
var obstacleHideGroup; //Obstacle group for objects that youv can hide behind
var obstacleGroup;	//Obstacle group for obejcts with full hit box
var obstaclePushGroup; //Obstacle group for objects that player can push
var obstacleClimbGroup; //Obstacle group for objects that player can climb and only top hitbox
var noteGroup; //group for notes
var enemyGroup; //group for enemies
var keyCardGroup; // group for keyCards
var group2; //top layer
var group3; //Layer above everything to do lighting
var platform; //ground layer when standing up
var platform2; //ground layer when crouching over
// ----------- Player Variables ---------------------
var foreground = true; //variable to keep track of which layer player will be in
var isClimbing = false; //variable to check if player is climbing or not
var canControl = true; //variable to check if player has control at the moment
var player; //the player
var hitPlatform; //did player hit the ground or an object?
var climb; //can the player climb right now?
var hide; //is the player overlapping with a hidable object?
var distanceFromGround; //player's y-distance from the ground
var playerGravity = 800;
var playerDirection = 1;
var hidePlatform; //hit detection on ground when player is hiding
var playerSpawnX = 120; // where to spawn the player at the start of the game
var pushCollide; //check if player is collidiing with pushable objects
var pushOverlap; //check if player is overlapping with pushable objects
var inventory = ['none']; // an array of strings that holds the names of keys collected thus far
var canMove = true; //Checks if player can move at this time
var isJumping = false; //is the player jumping right now?
var isColliding = false; //is the player colliding with the obstacles from the hide, climb, and normal obstacle groups
// 'none' allows players to open doors that are no locked
// ----------- Other Variables ---------------------
var door1; //door in the starting room
var ground; //the ground player stands on
var ground2; //the ground player will stand on when hiding
var levelData; //json file being used


// elevator panel that must be created global for proper destruction afterwards
var elevatorBackground; var elevatorText; var button0; var button1; var button2; var button3; var button4; var button5; var button6; var button7; var button8; var button9; var buttonEnter;
var invFloor1; var invFloor2; var invFloor3; var invEntrance; var invBack; var inv105; var inv203; var inv303; var invMorgue; var inv201; var inv205;
var inventoryOpen = false; // var to help with killing of inventory sprites
var elevatorOpen = false;

var playState = {
	create: function() {
		console.log('Play: create');
		
		//begin hospital music
		music = game.add.audio('hospitalMusic');
		music.loopFull(0.8);
		//initializes sound effects
		playerFootsteps = game.add.audio('indoorFootsteps');
		doorSound = game.add.audio('doorOpenClose');

		//Layers from Back to Front
		backgroundGroup = game.add.group();// background
		doorGroup = game.add.group();
		group1 = game.add.group();//layer above background
		obstacleHideGroup = game.add.group(); //hidable objects
		obstacleGroup = game.add.group(); // obstacles
		obstaclePushGroup = game.add.group(); //pushable objects
		obstacleClimbGroup = game.add.group(); //climbable obstacles
		noteGroup = game.add.group(); //notes
		enemyGroup = game.add.group(); // enemies
		keyCardGroup = game.add.group(); // keyCards
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
		this.input.keyboard.addKey(Phaser.Keyboard.SHIFT);

		//Key press won't affect browser
		this.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
		this.input.keyboard.addKeyCapture(Phaser.Keyboard.W);
		this.input.keyboard.addKeyCapture(Phaser.Keyboard.A);
		this.input.keyboard.addKeyCapture(Phaser.Keyboard.D);
		this.input.keyboard.addKeyCapture(Phaser.Keyboard.S);
		this.input.keyboard.addKeyCapture(Phaser.Keyboard.SHIFT);

		//Use H key to swap between layers
		this.hideKey = game.input.keyboard.addKey(Phaser.Keyboard.H);
		this.hideKey.onDown.add(this.hide, this);

		//Use Space Bar to jump
		this.jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.jumpKey.onDown.add(this.jump, this);

		//Use E key to open the door
		this.interactKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
		this.interactKey.onDown.add(this.interact);

		// Use I key for inventory
		this.inventoryKey = game.input.keyboard.addKey(Phaser.Keyboard.I);
		this.inventoryKey.onDown.add(this.inventory);
	},

	update: function(){
		//Collision and overlap checks for the player
		if(foreground == true){
			hitPlatform = game.physics.arcade.collide(player, [platforms,obstacleGroup,obstaclePushGroup]);
		}
		else{
			hitPlatform = game.physics.arcade.collide(player, [platforms,obstacleGroup]);
		}
		pushOverlap = game.physics.arcade.overlap(player,[obstaclePushGroup,obstacleGroup]);
		climb = game.physics.arcade.overlap(player, obstacleClimbGroup);
		hide = game.physics.arcade.overlap(player, obstacleHideGroup);
		if(isColliding == true){
			game.physics.arcade.collide(player, [obstacleGroup,obstacleClimbGroup,obstacleHideGroup]);
		}
		if(foreground == false){
			hidePlatform = game.physics.arcade.collide(player, platforms2);
		}

		//collision checks for enemies
		var enemyHitPlatform = game.physics.arcade.collide(enemyGroup, [platforms,obstacleGroup]);
		game.physics.arcade.collide(enemyGroup, obstacleGroup);
		game.physics.arcade.collide(enemyGroup, obstacleHideGroup);
		game.physics.arcade.collide(enemyGroup, obstacleClimbGroup);

		// keyCard can hit stuff
		game.physics.arcade.collide(keyCardGroup, obstacleGroup);
		game.physics.arcade.collide(keyCardGroup, platforms);
		game.physics.arcade.collide(keyCardGroup, obstacleHideGroup);

		// spawn 'E' when you approach interactable object
		/*
		noteGroup.forEach ( function(c) {
			if ((c.body.position.x - player.body.position.x > -50 || (c.body.position.x - player.body.position.x < 50 )) && c.poppingUp == false) {
				c.popup = game.add.sprite( c.body.position.x, c.body.position.y + c.body.height, 'interactableE');
				c.poppingUp = true;
			} else if (!((c.body.position.x - player.body.position.x > -50 || c.body.position.x - player.body.position.x < 50 ) && c.poppingUp == true)) {
				c.popup.destroy();
				c.poppingUp = false;
			}
		});) */

		// send you back to the start for getting caught
		enemyGroup.forEach(function (c) {
			// if you are touching this enemy and this enemy sees you
			if(game.physics.arcade.overlap(player, c) && c.seesPlayer == true) {
				//add a timer
				timer = game.time.create();

				//reset player properties
				playerSpawnX = 120;
				player.body.velocity.x = 0;
				player.body.velocity.y = 0;
				canMove = false;
				c.body.velocity.x = 0;

				//fade to black screen in a 500 ms timeframe
				var restart = game.add.tileSprite(0,0,1200,800, 'blackScreen');
				restart.alpha = 0;
				restart.fixedToCamera =  true;
				game.add.tween(restart).to( {alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0, 0, false);
				timer.add(500, function (){
					//after 500 ms generate starting room
					generateLevel('level0');
					//then fade out of black back to visibility
					game.add.tween(restart).to( {alpha: 0}, 500, Phaser.Easing.Linear.None, true, 0, 0, false)
				},this);
				timer.add(1400, function(){
					//once fades are done, player can move again and black screen is destroyed
					canMove = true;
					restart.destroy();
				}, this);

				//start the timer when function starts
				timer.start();
			}
		});

		// send you back to the start for getting caught
		keyCardGroup.forEach(function (k) {
			// if you are touching this enemy and this enemy sees you
			if(game.physics.arcade.overlap(player, k)) {			
				inventory.push(k.name);
				console.log('hit key');
				k.kill();
				k.destroy();
				console.log(inventory);
			}
		});

		//check player distance from the floor
		distanceFromGround = (game.world.height-128) - player.position.y; //continually calculate
		
		//Climb objects
		if(climb && foreground == true && (player.body.velocity.y < 15.1 || isJumping == true || isClimbing == true) && canMove == true){ //can only climb when in front of the object
			if(game.input.keyboard.isDown(Phaser.Keyboard.W) && (player.body.velocity.y == 0 || isJumping == true) && player.position.y > 69.25){
				if(player.frame >= 13 || player.frame <= 0){ //reset the frames
					player.frame = 0; //set to bottom climb frames
				}
				player.frame ++; //Go through each frame of climb
				//player goes up
				player.body.position.y -= 2;
				isClimbing = true; //disable normal left and right movement
				player.body.velocity.y = 0;
				player.body.gravity.y = 0; //player doesn't automatically fall off
			}
			if(game.input.keyboard.isDown(Phaser.Keyboard.S) && !hitPlatform && !game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && !game.input.keyboard.isDown(Phaser.Keyboard.W)){
				if(player.frame >= 13 || player.frame <= 0){ //reset the frames
					player.frame = 0; //set to bottom of climb frames
				}
				player.frame ++; //Go through each frame of climb
				//player goes down
				player.body.position.y += 2;
				isClimbing = true; //disable normal left and right movement
				player.body.velocity.y = 0;
				player.body.gravity.y = 0; //player doesn't automatically fall off
			}
			if(game.input.keyboard.isDown(Phaser.Keyboard.A) && (isClimbing == true || isJumping == true) && !game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && !game.input.keyboard.isDown(Phaser.Keyboard.D)){
				if(player.frame >= 13 || player.frame <= 0){ //reset the frames
					player.frame = 0; //set to bottom of climb frames
				}
				player.frame ++; //Go through each frame of climb
				//player goes left
				player.body.position.x -= 2;
				isClimbing = true; //disable normal left and right movement
				player.body.velocity.y = 0;
				player.body.gravity.y = 0; //player doesn't automatically fall off
			}
			if(game.input.keyboard.isDown(Phaser.Keyboard.D) && (isClimbing == true || isJumping == true) && !game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
				if(player.frame >= 13 || player.frame <= 0){ //reset the frames
					player.frame = 0; //set to bottom climb frames
				}
				player.frame ++; //Go through each frame of climbs
				//player goes right
				player.body.position.x += 2;
				isClimbing = true; //disable normal left and right movement
				player.body.velocity.y = 0;
				player.body.gravity.y = 0; //player doesn't automatically fall off
			}
		}

		//reset variables
		//reset away from climb
		if(!climb){
			isClimbing = false;
			player.body.gravity.y = playerGravity;
		}

		//Allow left to right movement when not climbing but not when climbing something
		if(isClimbing == true){
			canControl = false;
			isJumping = false;
		}
		else if(isClimbing == false){
			canControl = true;
			player.body.gravity.y = playerGravity;
		}
		//reset jump variable when landing
		if((hitPlatform && player.body.touching.down) || (player.body.touching.down && player.body.velocity.y == 0)){
			isJumping = false;
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

		if(game.input.keyboard.isDown(Phaser.Keyboard.A) && canControl == true && canMove == true){
			//move left
			playerDirection --; //player was moving left
			if(foreground == true){
				//Allow player to move on the ground and move in the air while jumping
				if(game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
						player.body.velocity.x = -250; //sprint speed
					}
					else{
						player.body.velocity.x = -150; //normal speed
					}
				if(player.body.touching.down){
					//Walking animation
					player.animations.play('walkLeft');
					//Walking sound
					playerFootsteps.play('',0,.5,false,false);					
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
		else if(game.input.keyboard.isDown(Phaser.Keyboard.D) && canControl == true && canMove == true){
			//move right
			playerDirection ++; //player was moving right
			if(foreground == true){
				//Allow player to move on the ground and move in the air while jumping
				if(game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
						player.body.velocity.x = 250; //sprint speed
					}
					else{
						player.body.velocity.x = 150; //normal speed
					}
				if(player.body.touching.down){
					//Walking animation
					player.animations.play('walkRight');
					//Walking sound
					playerFootsteps.play('',0,.5,false,false);
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
   		if(levelData.backgroundData == "endingBackground" && player.position.x >= 3500){
			game.state.start('end');
		}
	},
	hide: function(){
		if(isClimbing == false && !climb && !hide && !pushOverlap && canMove == true){ //Don't allow player to hide when in front of the object
			if(foreground==true && distanceFromGround <= 40){
				//move player from foreground to layer behind the object
				player.body.setSize(90, 145, 63, 4);			
				group2.remove(player);
				group1.add(player);
				foreground=false;
				if(playerDirection == 0){
					player.frame = 21;
				}
				if(playerDirection == 1){
					player.frame = 14;
				}
				player.position.y = game.world.height - 200; //set player to hide platform
			}
			else if(foreground == false && hidePlatform){
				//move player to the foreground
				player.body.setSize(90, 270, 63, 4);	
				group1.remove(player);
				group2.add(player);
				foreground=true;
				if(playerDirection == 0){
					player.frame = 53; //Face Left
				}
				if(playerDirection == 1){
					player.frame = 46; //Face right
				}
				player.position.y = game.world.height - 165; //set player to normal platform
			}
		}
	},
	jump: function(){
		//Scenario checks to see if you can jump
		//Touching the ground, while climbing, in front of a climbable object on the ground, on top of obstacleGroup
		if(canMove == true){	
			if((hitPlatform && player.body.touching.down) || isClimbing == true || (climb == true && distanceFromGround <= 40)|| (player.body.touching.down && player.body.velocity.y == 0)){
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
					isJumping = true;
				}
			}
		}
	},
	interact: function(){
		var doorEntering;
		var noteReading;
		for(var i = 0; i < noteGroup.children.length; i++){
			noteReading = noteGroup.children[i];
			//if player is overlaping with the noteGroup
			if(game.physics.arcade.overlap(player, noteReading)){
				if(canMove == true){	
					//Add the blown up version of the sprite on screen and stop player from moving
					read = game.add.sprite(100, -125, noteReading.leadsTo);
					read.alpha = 1;
					read.fixedToCamera = true;
					canMove = false;
				}
				else{
					//Destroy the blown up version of the sprite on screen and allow player to move again
					read.destroy();
					canMove = true;
				}
			}
		}
		if(foreground == true){
			for(var i = 0; i < doorGroup.children.length; i++) {
			
				doorEntering = doorGroup.children[i];
				// only enter the door if the key exists in your inventory
				if(game.physics.arcade.overlap(player, doorEntering) && inventory.indexOf(doorEntering.keyRequired) > -1){
					//play door audio
					doorSound.play();
					console.log('now entering: ' + doorEntering.name);
					if (doorEntering.name == 'elevator' && elevatorOpen == false) {
						console.log('show elevator');
						canMove = false;
						elevatorOpen = true;
						elevatorBackground = game.add.sprite(100, 20, 'elevatorAtlas', 'elevatorPanel');
						var elevatorString = '';
						elevatorText = game.add.text(175, 193, elevatorString);
						button1 = game.add.button(145, 325, 'elevatorAtlas', function() { if(elevatorString == "Invalid") { elevatorString = '';} if(elevatorString.length < 4) {elevatorString += '1'; elevatorText.setText(elevatorString);}} , this, 'button1', 'button1');
						button2 = game.add.button(225, 325, 'elevatorAtlas', function() { if(elevatorString == "Invalid") { elevatorString = '';} if(elevatorString.length < 4) {elevatorString += '2'; elevatorText.setText(elevatorString);}} , this, 'button2', 'button2');
						button3 = game.add.button(305, 325, 'elevatorAtlas', function() { if(elevatorString == "Invalid") { elevatorString = '';} if(elevatorString.length < 4) {elevatorString += '3'; elevatorText.setText(elevatorString);}} , this, 'button3', 'button3');
						button4 = game.add.button(145, 380, 'elevatorAtlas', function() { if(elevatorString == "Invalid") { elevatorString = '';} if(elevatorString.length < 4) {elevatorString += '4'; elevatorText.setText(elevatorString);}} , this, 'button4', 'button4');
						button5 = game.add.button(225, 380, 'elevatorAtlas', function() { if(elevatorString == "Invalid") { elevatorString = '';} if(elevatorString.length < 4) {elevatorString += '5'; elevatorText.setText(elevatorString);}} , this, 'button5', 'button5');
						button6 = game.add.button(305, 380, 'elevatorAtlas', function() { if(elevatorString == "Invalid") { elevatorString = '';} if(elevatorString.length < 4) {elevatorString += '6'; elevatorText.setText(elevatorString);}} , this, 'button6', 'button6');
						button7 = game.add.button(145, 435, 'elevatorAtlas', function() { if(elevatorString == "Invalid") { elevatorString = '';} if(elevatorString.length < 4) {elevatorString += '7'; elevatorText.setText(elevatorString);}} , this, 'button7', 'button7');
						button8 = game.add.button(225, 435, 'elevatorAtlas', function() { if(elevatorString == "Invalid") { elevatorString = '';} if(elevatorString.length < 4) {elevatorString += '8'; elevatorText.setText(elevatorString);}} , this, 'button8', 'button8');
						button9 = game.add.button(305, 435, 'elevatorAtlas', function() { if(elevatorString == "Invalid") { elevatorString = '';} if(elevatorString.length < 4) {elevatorString += '9'; elevatorText.setText(elevatorString);}} , this, 'button9', 'button9');
						button0 = game.add.button(225, 490, 'elevatorAtlas', function() { if(elevatorString == "Invalid") { elevatorString = '';} if(elevatorString.length < 4) {elevatorString += '0'; elevatorText.setText(elevatorString);}} , this, 'button0', 'button0');
						buttonEnter = game.add.button(305, 490, 'elevatorAtlas', 
							function() { 
								// if the code entered matches properly, generate level and close panel
								var shouldDestroy = false;
								if(elevatorString == '1379') {playerSpawnX = 621; generateLevel('level3'); shouldDestroy = true;} 
								else if(elevatorString == '2821') {playerSpawnX = 621; generateLevel('level2'); shouldDestroy = true;}
								else if(elevatorString == '3462') {playerSpawnX = 621; generateLevel('level1'); shouldDestroy = true;}
								else {elevatorString = 'Invalid'}
								if (shouldDestroy == true) {
									elevatorBackground.destroy();
									button1.destroy();
									button2.destroy();
									button3.destroy();
									button4.destroy();
									button5.destroy();
									button6.destroy();
									button7.destroy();
									button8.destroy();
									button9.destroy();
									button0.destroy();
									buttonEnter.destroy();
									elevatorText.destroy();
									canMove = true;
								}
								elevatorText.setText(elevatorString);
							}, this, 'buttonEnt', 'buttonEnt');
					} else if (doorEntering.name == 'elevator' && elevatorOpen == true) {
						console.log('kill elevator');
						console.log(canMove);
						elevatorBackground.destroy();
						button1.destroy();
						button2.destroy();
						button3.destroy();
						button4.destroy();
						button5.destroy();
						button6.destroy();
						button7.destroy();
						button8.destroy();
						button9.destroy();
						button0.destroy();
						buttonEnter.destroy();
						elevatorText.destroy();
						canMove = true;
						elevatorOpen = false
					} else {
						if(canMove == true){
							playerSpawnX = doorEntering.spawnAtx; // set appropriate place to spawn
							this.generateLevel(doorEntering.leadsTo);
						
							console.log(doorEntering.leadsTo);
						}
					}
					break;
				}
			}
		}
	},
	inventory: function() {
		if (!inventoryOpen) {
			canMove = false;
			invBack = game.add.image(player.body.position.x -100, 150, 'inventoryBackgroundInventory');
			invBack.scale.x = 0.5;
			invBack.scale.y = 0.5;


			if(inventory.indexOf('floor1ElevatorCode') > -1 ){
				invFloor1 = game.add.image(player.body.position.x +300, 300, 'floor1ElevatorCodeInventory');
				invFloor1.scale.x = 0.4;
				invFloor1.scale.y = 0.4;
			} 
			if (inventory.indexOf('floor2ElevatorCode') > -1) {
				invFloor2 = game.add.image(player.body.position.x+300, 255, 'floor2ElevatorCodeInventory');
				invFloor2.scale.x = 0.4;
				invFloor2.scale.y = 0.4;
			} 
			if (inventory.indexOf('floor3ElevatorCode') > -1) {
				invFloor3 = game.add.image(player.body.position.x+300, 205, 'floor3ElevatorCodeInventory');
				invFloor3.scale.x = 0.4;
				invFloor3.scale.y = 0.4;
			} 
			if (inventory.indexOf('morgueElevatorCode') > -1 ) {
				invMorgue = game.add.image(player.body.position.x+300, 350, 'morgueElevatorCodeInventory');
				invMorgue.scale.x = 0.4;
				invMorgue.scale.y = 0.4;
			} 
			if (inventory.indexOf('entranceFloorElevatorCode') > -1) {
				invEntrance = game.add.image(player.body.position.x+300, 400, 'entranceFloorElevatorCodeInventory');
				invEntrance.scale.x = 0.4;
				invEntrance.scale.y = 0.4;
			} 
			if (inventory.indexOf('keyCard105') > -1) {
				inv105 = game.add.image(player.body.position.x, 400, 'keyCard105Inventory');
				inv105.scale.x = 0.4;
				inv105.scale.y = 0.4;
			} 
			if (inventory.indexOf('keyCard201') > -1){
				inv201 = game.add.image(player.body.position.x, 255, 'keyCard201Inventory');
				inv201.scale.x = 0.4;
				inv201.scale.y = 0.4;
			} 
			if (inventory.indexOf('keyCard203') > -1) {
				inv203 = game.add.image(player.body.position.x, 300, 'keyCard203Inventory');
				inv203.scale.x = 0.4;
				inv203.scale.y = 0.4;
			} 
			if (inventory.indexOf('keyCard205') > -1) {
				inv205 = game.add.image(player.body.position.x, 350, 'keyCard205Inventory');
				inv205.scale.x = 0.4;
				inv205.scale.y = 0.4;
			} 
			if (inventory.indexOf('keyCard303') > -1) {
				inv303 = game.add.image(player.body.position.x, 205, 'keyCard303Inventory');
				inv303.scale.x = 0.4;
				inv303.scale.y = 0.4;
			} 
			
			
			inventoryOpen = true;
		} else {
			console.log('kill inv');
			if( invFloor1 != undefined) {invFloor1.destroy();}
			if( invFloor2 != undefined) {invFloor2.destroy();} 
			if( invFloor3 != undefined) {invFloor3.destroy();} 
			if( invEntrance != undefined) {invEntrance.destroy();} 
			if( invBack != undefined) {invBack.destroy();}
			if( inv105 != undefined) {inv105.destroy();} 
			if( inv203 != undefined) {inv203.destroy();} 
			if( inv303 != undefined) {inv303.destroy();} 
			if( invMorgue != undefined) {invMorgue.destroy();} 
			if( inv201 != undefined) {inv201.destroy(); }
			if( inv205 != undefined) {inv205.destroy();}
			inventoryOpen = false;
			canMove = true;
		}
	}
};

var generateLevel = function(levelName) {

	console.log('generated');

	// destroy can cause forEach to skip index. While loop helps ensure that all enemies get destroyed.
	while(backgroundGroup.length > 0) { backgroundGroup.forEach(function (c) {c.kill(); c.destroy(); });}
	while(doorGroup.length > 0) { doorGroup.forEach(function (c) {c.kill(); c.destroy(); });}
	while(group1.length > 0) { group1.forEach(function (c) {c.kill(); c.destroy(); });}
	while(obstacleHideGroup.length > 0) { obstacleHideGroup.forEach(function (c) {c.kill(); c.destroy(); });} 
	while(obstacleGroup.length > 0) { obstacleGroup.forEach(function (c) {c.kill(); c.destroy(); });}
	while(obstaclePushGroup.length > 0) { obstaclePushGroup.forEach(function (c) {c.kill(); c.destroy(); });}
	while(obstacleClimbGroup.length > 0) { obstacleClimbGroup.forEach(function (c) {c.kill(); c.destroy(); });}
	while(noteGroup.length > 0) { noteGroup.forEach(function (c) {c.kill(); c.destroy();});}
	while(keyCardGroup.length > 0) { keyCardGroup.forEach(function (c) {c.kill(); c.destroy();});}
	while(enemyGroup.length > 0) { enemyGroup.forEach(function (c) {c.kill(); c.destroy(); });}
	
	while(group2.length > 0) {group2.forEach(function (c) {c.kill(); c.destroy();});}
	while(group3.length > 0) {group3.forEach(function (c) {c.kill(); c.destroy();});}
	while(platforms.length > 0) {platforms.forEach(function (c) {c.kill(); c.destroy();});}
	while(platforms2.length > 0) {platforms2.forEach(function (c) {c.kill(); c.destroy();});}

	levelData = game.cache.getJSON(levelName);

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
		var doorTemp = new Door(game, levelData.doorData[index].frame, levelData.doorData[index].name, levelData.doorData[index].leadsTo, levelData.doorData[index].xPos, levelData.doorData[index].yPos, levelData.doorData[index].spawnAtx, levelData.doorData[index].keyRequired);
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
		else if(obstacleTemp.pushable == true){
			obstaclePushGroup.add(obstacleTemp);
		}
		else{
			obstacleGroup.add(obstacleTemp);
		}
		//console.log(obstacleTemp);
	} 

	//generate notes
	for (var index = 0; index < levelData.noteData.length; index++) {
		// set element to the object and use it's parameters
		var noteTemp = new Note(game, levelData.noteData[index].frame, levelData.noteData[index].name, levelData.noteData[index].leadsTo, levelData.noteData[index].xPos, levelData.noteData[index].yPos);
		noteTemp.scale.setTo(0.05, 0.05);
		if(levelData.backgroundData == 'startRoomSprite'){
			noteTemp.scale.setTo(0.075, 0.1);
			noteTemp.alpha = 0;
		}
		game.physics.enable(noteTemp);
		game.add.existing(noteTemp);
		noteGroup.add(noteTemp);
	} 

	//Player object
	player = game.add.sprite(playerSpawnX, game.world.height - 165, 'atlas', 'patient-1.png');
	//player properties
	game.physics.enable([player], Phaser.Physics.ARCADE);
	player.body.setSize(90, 270, 63, 4); // adjusts hitbox
	player.anchor.set(0.5);
	player.scale.x = 0.5;
	player.scale.y = 0.5;
	game.physics.enable(player);
	player.body.gravity.y = playerGravity;
	player.body.collideWorldBounds = true;
	//animations for walking
	player.animations.add('walkRight', [47,48,49,50,51,52], 10, true);
	player.animations.add('walkLeft', [54,55,56,57,58,59], 10, true);
	//animations for crawling
	player.animations.add('crawlRight',[14,15,16,17,18,19,20], 10, true);
	player.animations.add('crawlLeft',[21,22,23,24,25,26,27], 10, true);
	if(foreground == true){
		group2.add(player); //set player to top layer
	}
	else{//for if player gets caught while crouching
		//move player to the foreground
		group1.remove(player);
		group2.add(player);
		foreground=true;
	}

	game.camera.follow(player, Phaser.PLATFORMER);

	// generate enemies
	for (var index = 0; index < levelData.enemyData.length; index++) {
		// set element to the object and use it's parameters
		var enemyTemp = new Enemy(game, levelData.enemyData[index].key, levelData.enemyData[index].frame, levelData.enemyData[index].xPos, levelData.enemyData[index].yPos, levelData.enemyData[index].walkSpeed, levelData.enemyData[index].runSpeed, levelData.enemyData[index].walkDist, levelData.enemyData[index].turnTime, levelData.enemyData[index].facing, player);
		enemyTemp.scale.x = 0.17;
		enemyTemp.scale.y = 0.145;
		console.log(enemyTemp.target);
		game.add.existing(enemyTemp);
		enemyGroup.add(enemyTemp);

	} 

	// generate keyCards
	for (var index = 0; index < levelData.keyCardData.length; index++) {
		// only spawn keys that the player does not have
		if(inventory.indexOf(levelData.keyCardData[index].name) < 0) {
			// set element to the object and use it's parameters
			var keyCardTemp = new KeyCard(game, levelData.keyCardData[index].frame, levelData.keyCardData[index].xPos, levelData.keyCardData[index].yPos, levelData.keyCardData[index].name);
			game.add.existing(keyCardTemp);
			keyCardGroup.add(keyCardTemp);
		}
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
};