var playState = {
	preload: function(){
		console.log('Play: preload');
		//preload more things if needed
	},
	create: function() {
		console.log('Play: create')
		//some stuff here
		player = game.add.sprite(32, game.world.height - 150, 'player');
		player.anchor.set(0.5);
		player.scale.x = 0.05;
		player.scale.y = 0.05;
		game.physics.enable(player);
		player.body.gravity.y = 300;
		player.body.collideWorldBounds = true;

		player.animations.add('walkRight', [2,4,5,6,8], 10, true);
		player.animations.add('walkLeft', [13,12,11,3,7], 10, true);


		platforms = game.add.group();
		platforms.enableBody = true;
		var ground = platforms.create(0, game.world.height - 64, 'grass');
		ground.scale.setTo(10, 0.5); //scale (width, height)
		ground.body.immovable = true; 

		cursors = game.input.keyboard.createCursorKeys(); 
	},
	update: function(){
		//game loop here
		var hitPlatform = game.physics.arcade.collide(player, platforms);

		player.body.velocity.x = 0;

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
			player.frame = 1;
		}	
	}
}