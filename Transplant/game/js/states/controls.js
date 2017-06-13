//Global Variables
var controls; //the control screen background
var playButton; //the play button

var controlsState = {
	create: function(){
		console.log('Controls: create');
    	//control screen
		controls = game.add.tileSprite(0,0,1200,800, 'controlsScreen');
		playButton = game.add.button(1025, 485, 'playButton', this.actionOnClick, this);
		playButton.scale.x = 1.45;
		playButton.scale.y = 1.45
		//Make transparent
		controls.alpha = 0;
		playButton.alpha = 0;

		//Adding fade effects
		game.add.tween(controls).to( {alpha: 1}, 2000, Phaser.Easing.Linear.None, true, 0, 0, false); //(sprite).to({variable change}, speed between changes, style, loop maybe, ms delay, # of iterations, ???)
	},
	actionOnClick: function() { //when player clicks on playButton
		playButton.destroy();
		controls.destroy();
		this.state.start('play'); //Switch to the next state
	}
};