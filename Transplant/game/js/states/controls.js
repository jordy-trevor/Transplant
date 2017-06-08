//Global Variables
var controls; //controls text and bg
var playButton; //the play button
var scale = 1;
var controlsState = {
	create: function(){
		console.log('controls: create');
    
		controls = game.add.tileSprite(0,0,1200,800, 'controls');
		playButton = game.add.button(1024, 482, 'playButton', this.actionOnClick, this, 1.5, 1.5);

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
		playButton.alpha = 1;
	},
	out: function(){
		playButton.alpha = 0.5;
	},
	actionOnClick: function() { //when player clicks on playButton
		this.state.start('play'); //Switch to the next state
	}
};