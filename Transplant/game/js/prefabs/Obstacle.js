//
// Obstacle.js
// Prefab that creates objects of various properties

// Obstacle Constructor
// game, key, frame are all required from Phaser.Sprite
// key is image location, such as atlas
// frame is the image name as determed in load
// collidable can be "full", "top", or "none"
function Obstacle(game, frame, xPos, yPos, xScale, yScale, pushable, climbable, collidable, gravityEnabled, hidable) {

	// call to Phaser.Sprite
	// new Sprite(game, x, y, key, frame) 
	Phaser.Sprite.call(this, game, xPos, yPos, frame);

	// constructor customized properties
	this.frame2 = frame;
	this.xPos = xPos;
	this.yPos = yPos;
	this.xScale = xScale;
	this.yScale = yScale;
	this.pushable = pushable;
	this.climbable = climbable;
	this.collidable = collidable;
	this.gravityEnabled = gravityEnabled;
	this.hidable = hidable;
	//this.weight = weight;

	
	game.physics.arcade.enable(this); // give physics
	this.enableBody = true;
	//this.anchor.set(0.5); // set anchor point to middle
	this.body.collideWorldBounds = true;
	this.scale.setTo(xScale, yScale); // set scale appropriately

	if(gravityEnabled){
		this.body.gravity.y = 450;
	}

	this.climbable = climbable;
	this.collidable = collidable;

	if (this.collidable == 'top') {
		this.body.checkCollision.left = false;
		this.body.checkCollision.right = false;
	}

}

Obstacle.prototype = Object.create(Phaser.Sprite.prototype);
Obstacle.prototype.constructor = Obstacle;

Obstacle.prototype.update = function() {

	var collision1 = game.physics.arcade.collide(platforms, this);
	var collision2 = game.physics.arcade.collide(obstacleGroup, this);
	var collision3 = game.physics.arcade.collide(obstacleClimbGroup, this);
	//var collision4 = game.physics.arcade.collide(obstacleHideGroup, this);

	if (this.collidable == 'full' || this.collidable == 'top') {
		if(isClimbing == false){
			game.physics.arcade.collide(player, this);
		}
	}
	// can the object be pushed?
	if (this.pushable) {
		if(foreground == true){
			this.body.immovable = false;
			this.body.drag.x = 300;
		}
	}
	else{
		this.body.immovable = true;
		if(collision1 || collision2 || collision3 /*|| collision4*/){
			this.body.velocity.y = 0;
			//this.body.gravity.y = 0;
		}
	}
}
