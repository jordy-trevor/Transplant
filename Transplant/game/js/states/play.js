//Global Variables
var foreground = true; //variable to keep track of which layer player will be in
var group1;
var group2;
var group3;
var player;
var enemyGroup;
var obstacleGroup;
var obstacleClimbGroup;
var canClimb = false;
var isClimbing = false;
var canControl = true;

var playState = {
	preload: function(){
		console.log('Play: preload');
		//preload more things if needed
	},

	create: function() {
		console.log('Play: create')

		//Create the layers to do hiding
		group1 = game.add.group();//layer above background
		group2 = game.add.group();//middle layer
		group3 = game.add.group();//top layer
		enemyGroup = game.add.group(); // enemies
		obstacleGroup = game.add.group(); // obstacles
		obstacleClimbGroup = game.add.group(); //climbable obstacles

		//Object to hide behind
		var object = game.add.sprite(400,game.world.height-175, 'box');
		object.scale.setTo(0.25,0.25);
		group2.add(object); //set object to middle layer

		


		// TREVOR'S TESTS ==================================================

		
		// TEMP: Object Creation
		this.generateLevel('level1');

		// ==================================================================

		//Player object
		player = game.add.sprite(32, game.world.height - 150, 'player');
		//player properties
		game.physics.enable([player], Phaser.Physics.ARCADE);
		player.body.setSize(600, 1800, 420, 25); // adjusts hitbox
		player.anchor.set(0.5);
		player.scale.x = 0.05;
		player.scale.y = 0.05;
		game.physics.enable(player);
		player.body.gravity.y = 300;
		player.body.collideWorldBounds = true;
		//animations for walking
		player.animations.add('walkRight', [1,2,3,4,5,6], 10, true);
		player.animations.add('walkLeft', [8,9,10,11,12,13], 10, true);
		group3.add(player); //set player to top layer
		game.world.bringToTop(group3);

		// TEMP: Enemy Creation
		var enemyTest = new Enemy(game, 'box', 500, 400, 30, 150, 0, 'left', player);

		game.add.existing(enemyTest);
		enemyTest.scale.setTo(0.15, 0.15);
		enemyGroup.add(enemyTest);

		//Creating a ground to stand on
		platforms = game.add.group();
		platforms.enableBody = true; 
		var ground = platforms.create(0, game.world.height - 64, 'grass');
		ground.body.immovable = true;
		ground.scale.setTo(10, 0.5);
		
		

		

		//Adding use of various keys
		cursors = game.input.keyboard.createCursorKeys(); 
		this.input.keyboard.addKey(Phaser.Keyboard.W);
		this.input.keyboard.addKey(Phaser.Keyboard.A);
		this.input.keyboard.addKey(Phaser.Keyboard.D);
		this.input.keyboard.addKey(Phaser.Keyboard.S);

		//Use H key to swap between layers
		this.hideKey = game.input.keyboard.addKey(Phaser.Keyboard.H);
		this.hideKey.onDown.add(this.hide, this);
	},

	update: function(){
		var hitPlatform = game.physics.arcade.collide(player, [platforms,obstacleGroup]);
		var enemyHitPlatform = game.physics.arcade.collide(enemyGroup, platforms);
		var climb = game.physics.arcade.overlap(player,obstacleClimbGroup);

		//Climb objects
		if(climb && group3.children.indexOf(player) > -1){ //can only climb when in front of the object
			canClimb = true; //disable jump
			player.body.gravity.y = 0; //player doesn't automatically fall off
			if(game.input.keyboard.isDown(Phaser.Keyboard.W)){
				//player goes up
				player.body.velocity.y = -50;
				isClimbing = true; //disable left and right movement
			}
			else if(game.input.keyboard.isDown(Phaser.Keyboard.S)){
				//player goes down
				player.body.velocity.y = 50;
				isClimbing = true; //disable left and right movement
			}
			else{
				//if no key is pressed, player stays in place
				player.body.velocity.y = 0;
			}

		}

		//reset variables away from climbing
		if(!climb){
			canClimb = false;
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

		if (hitPlatform) {
			canControl = true;
			isClimbing = false;
		}

		//console.log('canClimb:' + canClimb + ", isClimbing:" + isClimbing);

		player.body.velocity.x = 0; //reset player velocity

		//Movement system
		if(game.input.keyboard.isDown(Phaser.Keyboard.W) && player.body.touching.down && canClimb==false){
			player.body.velocity.y = -250; //jump height
			//play animation
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

	generateLevel: function(levelName) {

		var levelData = game.cache.getJSON('level1');
		
		// generate all platforms from the data
		for (var index = 0; index < levelData.obstacleData.length; index++) {
			// set element to the object and use it's parameters
			var obstacleTemp = new Obstacle(game, levelData.obstacleData[index].frame, levelData.obstacleData[index].xPos, levelData.obstacleData[index].yPos, levelData.obstacleData[index].xScale, levelData.obstacleData[index].yScale, levelData.obstacleData[index].pushable, levelData.obstacleData[index].climbable, levelData.obstacleData[index].collidable, levelData.obstacleData[index].gravityEnabled);
			game.add.existing(obstacleTemp);
			obstacleGroup.add(obstacleTemp);

			if(obstacleTemp.climbable == true) {
				obstacleClimbGroup.add(obstacleTemp);
			}

			console.log(index);
			console.log(obstacleTemp);
			
		} 
	
	},
	render: function() {
		 game.debug.bodyInfo(player, 32, 32);
		 game.debug.body(player);
	}
};
