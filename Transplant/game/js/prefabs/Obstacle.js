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

	this.anchor.set(0.5, 0.5);
	
	game.physics.arcade.enable(this); // give physics
	this.enableBody = true;
	this.anchor.set(0.5); // set anchor point to middle
	this.body.collideWorldBounds = true;
	this.scale.setTo(xScale, yScale); // set scale appropriately

	if(gravityEnabled){
		this.body.gravity.y = playerGravity;
	}

	this.climbable = climbable;
	this.collidable = collidable;

	if (this.collidable == 'top') {
		this.body.checkCollision.left = false;
		this.body.checkCollision.right = false;
		this.body.checkCollision.down = false;
	}

	if(this.collidable == 'none'){
		this.body.checkCollision.up = false;
		this.body.checkCollision.left = false;
		this.body.checkCollision.right = false;
		this.body.checkCollision.down = false;
	}
}

Obstacle.prototype = Object.create(Phaser.Sprite.prototype);
Obstacle.prototype.constructor = Obstacle;

Obstacle.prototype.update = function() {

	//Collision with the ground and other obstacles in different groups
	var collision1 = game.physics.arcade.collide(platforms, this);
	var collision2 = game.physics.arcade.collide(obstacleGroup, this);
	var collision3 = game.physics.arcade.collide(obstacleClimbGroup, this);
	var collision4 = game.physics.arcade.collide(obstacleHideGroup, this);
	var collision5 = game.physics.arcade.collide(obstaclePushGroup, this);
	var collision6 = game.physics.arcade.collide(obstacleEnemyPushGroup, this);

	//Check collision with the player
	if (this.collidable == 'top') {
		if(isClimbing == false){
			isColliding = true;
		}
		else{
			isColliding = false;
		}
	}
	if(this.collidable == 'full'){
		game.physics.arcade.collide(player, obstacleGroup);
		if(foreground == true){
			game.physics.arcade.collide(player, [obstacleGroup,obstaclePushGroup]);
		}
	}

	//Case for obstacles with "none" collision
	//Turn on collision on top when hiding behind an hidable object
	if(this.collidable == 'none' && this.hidable == true && foreground == false){
		this.body.checkCollision.up = true;
	}
	//Turn off collision on top when hiding behind an hidable object
	else if(this.collidable == 'none' && this.hidable == true && foreground == true){
		this.body.checkCollision.up = false;
	}


	// can the object be pushed?
	if (this.pushable) {
		if(foreground == true){
			//collide with immovable obstacles and the ground, can't push through them and made into immovable obstacles
			if(collision2 && collision1){
				this.body.velocity.x = 0;
				this.body.velocity.y = 0;
				this.body.gravity.y = 0;
				this.body.immovable = true;
				this.body.allowGravity = false;
			}
			//collide with pushable objects and immovable obastacles
			else if(collision5 && collision2){
				this.body.velocity.y = 0;
				this.body.velocity.x = 0;
				this.body.gravity.y = 0;
				this.body.immovable = true;
				this.body.allowGravity = false;
			}
			else if(collision1){
				this.body.velocity.y = 0;
				this.body.gravity.y = 0;
				this.body.allowGravity = false;
			}
			else if(collision5){
				if((player.position.y >= this.position.y)){
					this.body.velocity.x = 0;
					this.body.velocity.y = 0;
					this.body.gravity.y = 0;
					this.body.allowGravity = false;
				}
			}
			else{
				this.body.immovable = false;
				this.body.drag.x = 300;
				this.body.allowGravity = true;
				this.body.gravity.y = playerGravity;
			}
		}
	}
	else{
		this.body.immovable = true;
		this.body.allowGravity = false;
		//stop the obstacles from falling when something is collided if they have gravityEnabled
		if((collision1 || collision2 || collision3 || collision4 || collision5) && this.gravityEnabled){
			this.body.velocity.y = 0;
		}
		else if(!this.gravityEnabled){
			this.body.velocity.y = 0;
			this.body.gravity.y = 0;
		}
	}
}
