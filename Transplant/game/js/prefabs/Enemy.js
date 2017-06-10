// 
//  Enemy.js
//  Prefab that creates enemies of varying walkSpeeds and walk patterns


// Enemy Constructor
// game, key, frame are all required for Phaser.Sprite
// key is image location, such as atlas
// frame is the image name as determined in load
function Enemy(game, key, frame, xPos, yPos, walkSpeed, runSpeed, walkDist, turnTime, facing, target) {
	// call to Phaser.Sprite 
	// new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, xPos, yPos, key, frame);

	this.anchor.set(0.5); // set anchor point to middle 
	game.physics.enable(this); // give physics
	this.body.gravity.y = 300;
	this.body.collideWorldBounds = true; // does not hit edges

	this.xPos = xPos;
	this.yPos = yPos;
	this.walkSpeed = walkSpeed;
	this.runSpeed = runSpeed;
	this.walkDist = walkDist;
	this.turnTime = turnTime;
	this.facing = facing;
	this.wasFacing = facing; // used to make enemy wait at end of each walk duration
	this.turning = false; // used for turning
	this.target = target;

	this.seesPlayer = false;

	this.animations.add('walkRight', [0,1,2,3,4,5,6,7], 10, true);
	this.animations.add('walkLeft', [8,9,10,11,12,13,14,15], 10, true);
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;


// create update function specifically for this
Enemy.prototype.update = function() {
	// if you are within 100 sight range of the player, you see them
	// can only see the player when they are at the same y level as you
	if (((this.body.position.x - this.target.body.position.x > -450 && this.body.position.x - this.target.body.position.x < 0 && this.wasFacing == 'right' )
		|| (this.body.position.x - this.target.body.position.x < 450 && this.body.position.x - this.target.body.position.x > 0 && this.wasFacing == 'left')) 
		&&  (!hide||foreground == true) == true && (this.target.body.y + this.target.body.height/2) > this.body.y - this.body.height/2 + 20 && (this.target.body.y - this.target.body.height/2) < this.body.y + this.body.height/2 + 20){
		this.seesPlayer = true;
		this.walkSpeed = this.runSpeed; // changed speed to runspeed, which in turn triggers proper animation
	}
	//console.log(this.facing);

	if ( this.seesPlayer ) {
		// chase player
		if ( this.body.position.x <= this.target.body.position.x) {
			this.body.velocity.x = this.walkSpeed;
			this.facing = 'right';
		} else if (this. body.position.x >= this.target.body.position.x) {
			this.body.velocity.x = -1 * this.walkSpeed;
			this.facing = 'left';
		}

		
	} else {
		// if they are about to turn, execute pause
		if (this.wasFacing != this.facing && !this.turning) { // if they are about to turn
			this.turning = true;
			var tmp = this.walkSpeed; // store current walkSpeed
			var tmpDirection = this.facing;
			//console.log('change direction');
			this.facing = this.wasFacing;
			this.walkSpeed = 0; // stop moving 
			game.time.events.add(Phaser.Timer.SECOND * this.turnTime, function(){this.walkSpeed = tmp; this.turning = false; this.facing = tmpDirection; this.wasFacing = this.facing;}, this); // pause event waits for specified seconds, then executes func
		}  else if (!this.turning) {
			// walk left or right for the distance specified by walkDist
			if ( this.body.position.x < this.xPos + this.walkDist + this.walkSpeed && this.body.position.x > this.xPos + this.walkDist - this.walkSpeed  ) {
				this.body.position.x -= 1;
				this.facing = 'left'; 
			} else if (this.body.position.x < this.xPos - this.walkDist + this.walkSpeed && this.body.position.x > this.xPos - this.walkDist - this.walkSpeed   ){
				this.body.position.x += 1;
				this.facing = 'right';
			}
		}
		
		// handle actual movement
		if (this.facing == 'left' ) {
			this.body.velocity.x = -1 * this.walkSpeed;
		} else if (this.facing == 'right' ) {
			this.body.velocity.x = this.walkSpeed;
		}
	}

	// handle animations
	// plays animations only if walkSpeed isn't 0, aka if not turning
	if (this.facing == 'left' && this.walkSpeed != 0) {
		this.animations.play('walkLeft');
	} else if (this.facing == 'right' && this.walkSpeed != 0) {
		this.animations.play('walkRight');
	} else if ( this.facing == 'left' && this.walkSpeed == 0 ) {
		this.animations.stop();
	} else if ( this.facing == 'right' && this.walkSpeed == 0) {
		this.animations.stop();
	}
};