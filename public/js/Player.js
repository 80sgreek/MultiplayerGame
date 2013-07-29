/**************************************************
** GAME PLAYER CLASS
**************************************************/
(function (window) {
	function Player(imgLinkWalkSouth, imgLinkIdleSouth, 
					imgLinkWalkNorth, imgLinkIdleNorth, 
					imgLinkWalkEast, imgLinkIdleEast, 
					imgLinkWalkWest, imgLinkIdleWest) {
		this.initialize(imgLinkWalkSouth, imgLinkIdleSouth, 
						imgLinkWalkNorth, imgLinkIdleNorth, 
						imgLinkWalkEast, imgLinkIdleEast, 
						imgLinkWalkWest, imgLinkIdleWest);		
	}
	Player.prototype = new createjs.BitmapAnimation();	
	Player.prototype.BitmapAnimation_initialize = Player.prototype.initialize;     
	Player.prototype.initialize = function (imgLinkWalkSouth, imgLinkIdleSouth, 
												imgLinkWalkNorth, imgLinkIdleNorth, 
												imgLinkWalkEast, imgLinkIdleEast, 
												imgLinkWalkWest, imgLinkIdleWest) {														
		var localSpriteSheet = new createjs.SpriteSheet({
			images: [imgLinkWalkSouth, imgLinkIdleSouth, 
						imgLinkWalkNorth, imgLinkIdleNorth, 
						imgLinkWalkEast, imgLinkIdleEast, 
						imgLinkWalkWest, imgLinkIdleWest],
			frames: {width: 16, height: 24, regX: 8, regY: 12 },
			animations: {
				walkSouth: [0, 7, "walkSouth", 4],
				idleSouth: [8,8],
				walkNorth: [9, 16, "walkNorth", 4],
				idleNorth: [17,17],
				walkEast: [18, 24, "walkEast", 4],
				idleEast: [25,25],
				walkWest: [26, 32, "walkWest", 4],
				idleWest: [33,33]
			}
		});
		this.BitmapAnimation_initialize(localSpriteSheet);  
		this.gotoAndPlay("idleSouth");        
		this.scaleX = this.scaleY = 2;        
		this.name = "Player";
		this.directionX = 0;
		this.directionY = 0;        
		this.vX = 3;
		this.vY = 3;
		this.moving = false;
		
	}	
	Player.prototype.tick = function () {	
	
		var prevX = this.x, prevY = this.y, prevMoving = this.moving;		
		            
		this.x += this.vX * this.directionX;			
		this.y += this.vY * this.directionY;            
				
		if((prevX == this.x && prevY == this.y)){
			this.moving = false;
			if(this.currentAnimation == "walkSouth"){
				this.gotoAndPlay("idleSouth");
			} else if(this.currentAnimation == "walkNorth"){
				this.gotoAndPlay("idleNorth");
			} else if(this.currentAnimation == "walkEast"){
				this.gotoAndPlay("idleEast");
			} else if(this.currentAnimation == "walkWest"){
				this.gotoAndPlay("idleWest");
			}			
		} 
		else if(prevY != this.y){
			this.moving = true;
			if(prevY < this.y && this.currentAnimation != "walkSouth"){
				this.gotoAndPlay("walkSouth");
			} else if(prevY > this.y && this.currentAnimation != "walkNorth"){
				this.gotoAndPlay("walkNorth");
			}
		} 
		else if(prevX != this.x){
			this.moving = true;
			if(prevX < this.x && this.currentAnimation != "walkEast"){
				this.gotoAndPlay("walkEast");
			} else if(prevX > this.x && this.currentAnimation != "walkWest"){
				this.gotoAndPlay("walkWest");
			}
		}				
		return (prevX != this.x || prevY != this.y || this.moving != prevMoving) ? true : false;
	}	
	Player.prototype.getX = function() {
		return this.x;
	};	
	Player.prototype.getY = function() {
		return this.y;
	};
	Player.prototype.getDirectionX = function() {
		return this.directionX;
	};	
	Player.prototype.getDirectionY = function() {		
		return this.directionY;
	};	
	Player.prototype.setX = function(newX) {
		this.x = newX;
	};
	Player.prototype.setY = function(newY) {
		this.y = newY;
	};
	Player.prototype.setDirectionX = function(newDirectionX) {
		this.directionX = newDirectionX;
	};
	Player.prototype.setDirectionY = function(newDirectionY) {
		this.directionY = newDirectionY;
	};	
	window.Player = Player;
} (window));