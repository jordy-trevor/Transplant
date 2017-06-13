var button;

var endState = {
	create: function(){
		//Reset variables
		inventory = ['none'];
		foreground = true;
		isClimbing = false;
		canControl = true;
		playerSpawnX = 120;
		canMove = true;
		isJumping = false;
		isColliding = false;
		doorWasOpened = false;
		fadeMade = false;
		playerCamera = false;
		seenLevel1 = false;
		seenLevel2 = false;
		seenLevel3 = false;
		seenLevel4 = false;
		seenLevel5 = false;

		//End screen and menu button
		var end = game.add.tileSprite(0,0,1200,800, 'gameOver');
		button = game.add.button(1055, 535, 'menuButton', this.actionOnClick, this, 1, 1);

		button.onInputOver.add(this.over, this);
		button.onInputOut.add(this.out, this);

		//Make transparent
		end.alpha = 0;
		button.alpha = 0;

		//Adding fade effects
		game.add.tween(end).to( {alpha: 1}, 2000, Phaser.Easing.Linear.None, true, 0, 0, false);
		game.add.tween(button).to( {alpha: 0.5}, 2000, Phaser.Easing.Linear.None, true, 0, 0, false);
	},
	over: function(){
		//when hover over
		button.alpha = 1;
	},
	out: function(){
		//when not hovering
		button.alpha = 0.5;
	},
	actionOnClick: function(){
		//When clicked on by mouse
		music.stop(); //stop music from playing
		game.state.start('menu'); //send to title screen
	}
};