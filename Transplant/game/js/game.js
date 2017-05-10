var game = new Phaser.Game(800,600, Phaser.AUTO, 'gameDiv'); //define game, temp screen size

//adding states
game.state.add('load', load);
game.state.add('menu', menuState);
game.state.add('play', playState);

game.state.start('load'); //start at load