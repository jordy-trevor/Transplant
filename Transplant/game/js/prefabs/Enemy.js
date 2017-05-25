// 
//  Enemy.js
//  Prefab that creates enemies of varying speeds and walk patterns


// Enemy Constructor
// game, key, frame are all required for Phaser.Sprite
// key is image location, such as atlas
// frame is the image name as determined in load
function Enemy(game, frame, xPos, yPos, speed, walkDist, turnTime, facing, target) {
	// call to Phaser.Sprite 
	// new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, xPos, yPos, frame);

	this.anchor.set(0.5); // set anchor point to middle 
	game.physics.enable(this); // give physics
	this.body.gravity.y = 300;
	this.body.collideWorldBounds = true; // does not hit edges

	this.xPos = xPos;
	this.yPos = yPos;
	this.speed = speed;
	this.walkDist = walkDist;
	this.turnTime = turnTime;
	this.facing = facing;
	this.target = target;

}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

var seesPlayer = false;

// create update function specifically for this
Enemy.prototype.update = function() {

	// if you are within 100 sight range of the player, you see them
	if (((this.body.position.x - this.target.body.position.x > -100 && this.body.position.x - this.target.body.position.x < 0 && this.facing == 'right' )
		|| (this.body.position.x - this.target.body.position.x < 100 && this.body.position.x - this.target.body.position.x > 0 && this.facing == 'left')) && foreground == true) {
		seesPlayer = true;
	}

	if ( seesPlayer ) {
		// chase player
		if ( this.body.position.x <= this.target.body.position.x) {
			this.body.velocity.x = 100;
			this.facing = 'right';
		} else if (this. body.position.x >= this.target.body.position.x) {
			this.body.velocity.x = -100;
			this.facing = 'left';
		}
	} else {
		// walk left or right for the distance specified by walkDist
		if ( this.body.position.x < this.xPos + this.walkDist + this.speed && this.body.position.x > this.xPos + this.walkDist - this.speed  ) {
			this.body.position.x -= 1;
			this.facing = 'left'; 
		} else if (this.body.position.x < this.xPos - this.walkDist + this.speed && this.body.position.x > this.xPos - this.walkDist - this.speed   ){
			this.body.position.x += 1;
			this.facing = 'right';
		}

		if (this.facing == 'left') {
			this.body.velocity.x = -1 * this.speed;
		} else if (this.facing == 'right') {
			this.body.velocity.x = this.speed;
		}
	}
		
	
}


