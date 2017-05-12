//
// Obstacle.js
// Prefab that creates objects of various properties

// Obstacle Constructor
// game, key, frame are all required from Phaser.Sprite
// key is image location, such as atlas
// frame is the image name as determed in load
// collidable can be "full", "top", or "none"
function Obstacle(game, frame, xPos, yPos, pushable, climbable, collidable, gravityEnabled) {

	// call to Phaser.Sprite
	// new Sprite(game, x, y, key, frame) 
	Phaser.Sprite.call(this, game, xPos, yPos, frame);
	// constructor customized properties
	this.xPos = xPos;
	this.yPos = yPos;
	this.pushable = pushable;
	//this.weight = weight;

	
	game.physics.enable(this); // give physics
	this.enableBody = true;
	this.anchor.set(0.5); // set anchor point to middle
	this.body.collideWorldBounds = true;

	// does the object have gravity?
	if (gravityEnabled) {	
		this.body.gravity.y = 300;
	} 

	this.climbable = climbable;
	this.collidable = collidable;

	if (this.collidable == 'top') {
		this.body.checkCollision.down = false;
		this.body.checkCollision.left = false;
		this.body.checkCollision.right = false;
	}

}

Obstacle.prototype = Object.create(Phaser.Sprite.prototype);
Obstacle.prototype.constructor = Obstacle;

Obstacle.prototype.update = function() {

	game.physics.arcade.collide(platforms, this);
	game.physics.arcade.collide(obstacleGroup, this);
	if (this.collidable == 'full' || this.collidable == 'top') {
		game.physics.arcade.collide(player, this);
	} 
	

	// can the object be pushed?
	if (this.pushable && foreground == true) {
		this.body.immovable = false;
		this.body.drag.x = 300;
	} else {
		this.body.immovable = true;
	}
}