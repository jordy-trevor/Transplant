var game = new Phaser.Game(1200, 600, Phaser.AUTO, 'gameDiv'); //define game, temp screen size

//adding states
game.state.add('load', load);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('hall', hallState);

game.state.start('load'); //start at load