//
// Door.js
// Prefab for door objects

//Door constructor
function Door(game, frame, name, leadsTo, xPos, yPos, spawnAtx, keyRequired) {

	// call to Phaser.Sprite
	Phaser.Sprite.call(this, game, xPos, yPos, frame);

	// constructor customized properties
	this.frame2 = frame;
	this.xPos = xPos;
	this.yPos = yPos; 
	this.name = name;
	this.leadsTo = leadsTo;
	this.spawnAtx = spawnAtx;
	this.keyRequired = keyRequired;

	this.anchor.set(0.5, 0.5);
}

Door.prototype = Object.create(Phaser.Sprite.prototype);
Door.prototype.constructor = Door;