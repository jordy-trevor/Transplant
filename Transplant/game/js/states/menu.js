//Global Variables
var title; //title logo and background
var playButton; //the play button

var menuState = {
	create: function(){
		console.log('Menu: create');

		title = game.add.tileSprite(0,0,1200,800, 'title');
		playButton = game.add.tileSprite(75, 350, 80, 61, 'playButton');
		//Make transparent
		title.alpha = 0;
		playButton.alpha = 0;

		//Do event after 500 ms
		game.time.events.add(Phaser.Timer.HALF, this.fadeOption, this);

		//Adding fade effects
		game.add.tween(title).to( {alpha: 1}, 2000, Phaser.Easing.Linear.None, true, 0, 0, false); //(sprite).to({variable change}, speed between changes, style, loop maybe, ms delay, # of iterations, ???)
		game.add.tween(playButton).to( {alpha: 1}, 2000, Phaser.Easing.Linear.None, true, 0, 0, false); //initial fade for playButton to coincide with title
	},
	fadeOption: function(){
		game.add.tween(playButton).to( {alpha: 1}, 750, Phaser.Easing.Linear.None, true, 0, 6000, true).loop(true); //playButton continues to fade and faster
		this.EKey = this.input.keyboard.addKey(Phaser.Keyboard.E); //use of E on keyboard
		this.input.keyboard.addKeyCapture(Phaser.Keyboard.E); //disable browser capturing key for unintended effects
		this.EKey.onDown.add(this.PressE, this); //create function when E key is pressed
	},
	PressE: function() {
		this.state.start('play'); //Switch to the next state
	}
};