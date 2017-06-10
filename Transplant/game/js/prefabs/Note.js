//
// Door.js
// Prefab for door objects

//Door constructor
function Note(game, frame, name, leadsTo, xPos, yPos) {

	// call to Phaser.Sprite
	Phaser.Sprite.call(this, game, xPos, yPos, frame);

	// constructor customized properties
	this.xPos = xPos;
	this.yPos = yPos; 
	this.name = name;
	this.leadsTo = leadsTo;

	this.poppingUp = false;
	this.popup;
	this.anchor.set(0.5, 0.5);
}

Note.prototype = Object.create(Phaser.Sprite.prototype);
Note.prototype.constructor = Note;