//Global Variables
var title; //title logo and background
var playButton; //the play button

var controlsState = {
	create: function(){
		console.log('Controls: create');
    
		title = game.add.tileSprite(0,0,1200,800, 'controlsScreen');
		playButton = game.add.button(1050, 480, 'playButton', this.actionOnClick, this, 1, 1);
		playButton.scale.x = 1.4;
		playButton.scale.y = 1.4

		playButton.onInputOver.add(this.over, this);
		playButton.onInputOut.add(this.out, this);
		//Make transparent
		title.alpha = 0;
		playButton.alpha = 0;

		//Adding fade effects
		game.add.tween(title).to( {alpha: 1}, 2000, Phaser.Easing.Linear.None, true, 0, 0, false); //(sprite).to({variable change}, speed between changes, style, loop maybe, ms delay, # of iterations, ???)
		game.add.tween(playButton).to( {alpha: 0.5}, 2000, Phaser.Easing.Linear.None, true, 0, 0, false); //initial fade for playButton to coincide with title
	},
	over: function(){
		//when hovering over
		playButton.alpha = 1;
	},
	out: function(){
		//when not hovering over
		playButton.alpha = 0.5;
	},
	actionOnClick: function() { //when player clicks on playButton
		this.state.start('play'); //Switch to the next state
	}
};