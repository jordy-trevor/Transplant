// 
//  Enemy.js
//  Prefab that creates enemies of varying speeds and walk patterns


// Enemy Constructor
// game, key, frame are all required for Phaser.Sprite
// key is image location, such as atlas
// frame is the image name as determined in load
function Enemy(game, frame, x, y, speed, walkDist, turnTime, target) {
	// call to Phaser.Sprite 
	// new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, frame);

	this.anchor.set(0.5); // set anchor point to middle 
	game.physics.enable(this); // give physics
	this.body.gravity.y = 300;
	this.body.collideWorldBounds = false; // does not hit edges

	this.speed = speed;
	this.walkDist = walkDist;
	this.turnTime = turnTime;
	this.target = target;

	var seesPlayer = false;

}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

// create update function specifically for this
Enemy.prototype.update = function() {
	if ( this.body.position.x <= this.target.body.position.x) {
		this.body.velocity.x = this.speed;
	} else if (this. body.position.x >= this.target.body.position.x) {
		this.body.velocity.x = -1 * this.speed;
	}

}

Enemy.prototype.chasePlayer = function() {

	
}