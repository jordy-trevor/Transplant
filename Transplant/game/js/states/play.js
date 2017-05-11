//Global Variables
var foreground = true; //variable to keep track of which layer player will be in
var group1;
var group2;
var group3;
var enemyGroup;

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

		//Object to hide behind
		var object = game.add.sprite(400,game.world.height-175, 'box');
		object.scale.setTo(0.25,0.25);
		group2.add(object); //set object to middle layer

		//Player object
		player = game.add.sprite(32, game.world.height - 150, 'player');
		//player properties
		player.anchor.set(0.5);
		player.scale.x = 0.05;
		player.scale.y = 0.05;
		game.physics.enable(player);
		player.body.gravity.y = 300;
		player.body.collideWorldBounds = true;
		//animations for walking
		player.animations.add('walkRight', [2,4,5,6,8], 10, true);
		player.animations.add('walkLeft', [13,12,11,3,7], 10, true);
		group3.add(player); //set player to top layer

		// TEMP: Enemy Creation
		var enemyTest = new Enemy(game, 'box', 500, 400, 30, 150, 0, 'left', player);

		game.add.existing(enemyTest);
		enemyTest.scale.setTo(0.15, 0.15);
		enemyGroup.add(enemyTest);

		

		//Creating a ground to stand on
		platforms = game.add.group();
		platforms.enableBody = true;
		var ground = platforms.create(0, game.world.height - 64, 'grass'); //Note use a better placeholder art next time
		ground.scale.setTo(10, 0.5);
		ground.body.immovable = true; 

		cursors = game.input.keyboard.createCursorKeys(); 
		//Use H key to swap between layers
		this.hideKey = game.input.keyboard.addKey(Phaser.Keyboard.H);
		this.hideKey.onDown.add(this.hide, this);
	},
	update: function(){
		var hitPlatform = game.physics.arcade.collide(player, platforms);
		var enemyHitPlatform = game.physics.arcade.collide(enemyGroup, platforms);

		player.body.velocity.x = 0; //reset player velocity

		//Movement system
		if(cursors.up.isDown && player.body.touching.down){
			player.body.velocity.y = -250; //jump height
			//play animation
		}
		if(cursors.left.isDown){
			//move left
			player.animations.play('walkLeft');
			player.body.velocity.x = -150;
		}
		else if(cursors.right.isDown){
			//move right
			player.animations.play('walkRight');
			player.body.velocity.x = 150;
		}

		else{
			//stand still
			player.animations.stop();
			player.frame = 1; //Currently only facing right when stopped, can be changed later
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
	}
};
