// 
//  KeyCard.js
//  Prefab that creates enemies of varying walkSpeeds and walk patterns


// KeyCard Constructor
// game, key, frame are all required for Phaser.Sprite
// key is image location, such as atlas
// frame is the image name as determined in load
function KeyCard(game, frame, xPos, yPos, name) {
	// call to Phaser.Sprite 
	// new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, xPos, yPos, frame);

	this.anchor.set(0.5); // set anchor point to middle 
	game.physics.enable(this); // give physics
	this.body.gravity.y = 300;
	this.body.collideWorldBounds = true; // does not hit edges
	this.body.bounce.set(1);

	this.name = name;
}

KeyCard.prototype = Object.create(Phaser.Sprite.prototype);
KeyCard.prototype.constructor = KeyCard;