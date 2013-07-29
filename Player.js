var Player = function(startX, startY) {
    var x = startX,
        y = startY,
        id, 
		directionX = 0,
		directionY = 0;
    
    var getX = function() {
        return x;
    };

    var getY = function() {
        return y;
    };

    var setX = function(newX) {
        x = newX;
    };

    var setY = function(newY) {
        y = newY;
    };
	
	var getDirectionX = function() {
		return directionX;
	};
	
	var setDirectionX = function(newDirectionX) {
		directionX = newDirectionX;
	};
	
	var getDirectionY = function() {
		return directionY;
	};
	
	var setDirectionY = function(newDirectionX) {
		directionY = newDirectionX;
	};

    return {
        getX: getX,
        getY: getY,
        setX: setX,
        setY: setY,
		getDirectionX: getDirectionX,
		setDirectionX: setDirectionX,
		getDirectionY: getDirectionY,
		setDirectionY: setDirectionY,
        id: id
    }
};

exports.Player = Player;