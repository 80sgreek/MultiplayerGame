/**************************************************
** GAME VARIABLES
**************************************************/
var canvas,			// Canvas DOM element
	stage,			// Canvas rendering context
	keys,			// Keyboard input
	localPlayer,	// Local player
	remotePlayers,
	socket,
	screen_width,
	screen_height,
	contentManager;
	
var KEYCODE_SPACE = 32; 	//usefull keycode
var KEYCODE_UP = 38; 	//usefull keycode
var KEYCODE_DOWN = 40; 	//usefull keycode
var KEYCODE_LEFT = 37; 	//usefull keycode
var KEYCODE_RIGHT = 39; 	//usefull keycode
var KEYCODE_W = 87; 		//usefull keycode
var KEYCODE_S = 83; 		//usefull keycode
var KEYCODE_A = 65; 		//usefull keycode
var KEYCODE_D = 68; 		//usefull keycode

/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {

	// Initialise keyboard controls
	

	//find canvas and load images, wait for last image to load
    canvas = document.getElementById("gameCanvas");
    // create a new stage and point it at our canvas:
    stage = new createjs.Stage(canvas);    
    contentManager = new ContentManager();
    contentManager.SetDownloadCompleted(startGame);
    contentManager.StartDownload();

	// Maximise the canvas + grab canvas width and height for later calculations
	canvas.width = screen_width = 800;//window.innerWidth;
	canvas.height = screen_height = 600;//window.innerHeight;
		
	remotePlayers = [];
	socket = io.connect("/", {port: 80, transports: ["websocket"]});
	
	// Start listening for events
	setEventHandlers();	
};

function startGame() {
    	
	// Our localPlayer can be moved with the arrow keys (left, right)
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;

    // Creating the localPlayer
	//var player_name = new createjs.Text("<Player 1>");
	//var shape = new createjs.Shape();
	//shape.graphics.beginFill("#ffffff").drawRoundRect(0, 0, 100, 20, 5);
	
	
	localPlayer = new Player(contentManager.imgLinkWalkSouth, contentManager.imgLinkIdleSouth, 
	contentManager.imgLinkWalkNorth, contentManager.imgLinkIdleNorth,
	contentManager.imgLinkWalkEast, contentManager.imgLinkIdleEast,
	contentManager.imgLinkWalkWest, contentManager.imgLinkIdleWest);
	localPlayer.x = 400;
	localPlayer.y = 300;
	
	//player_name.x = localPlayer.x  - player_name.getMeasuredWidth()/2;
	//player_name.y = localPlayer.y - 50;	
	
	//shape.x = localPlayer.x  - 50;
	//shape.y = localPlayer.y  - 53;
	
	//stage.addChild(shape);
	//stage.addChild(player_name);	
	stage.addChild(localPlayer);
	
	
		
    // we want to do some work before we update the canvas,
    // otherwise we could use Ticker.addListener(stage);
	createjs.Ticker.addListener(window);
    // Best Framerate targeted (60 FPS)
	createjs.Ticker.useRAF = true;
	createjs.Ticker.setFPS(60);
}

function tick() {    
    // Update logic of the localPlayer
    if(localPlayer.tick()){
		updateServer();
	}	
	
	var allPlayers = remotePlayers.slice(0);
	allPlayers.push(localPlayer);
	allPlayers.sort(function(a,b){
		return a.getY() - b.getY();
	});
	
	var i;
	for (i = 0; i < allPlayers.length; i++) {
		stage.setChildIndex(allPlayers[i], i);
	};
	
    // update the stage:
    stage.update();
}

/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {	

	// Window resize
	//window.addEventListener("resize", onResize, false);
	
	socket.on("connect", onSocketConnected);
	socket.on("disconnect", onSocketDisconnect);
	socket.on("new player", onNewPlayer);
	socket.on("move player", onMovePlayer);
	socket.on("remove player", onRemovePlayer);
	socket.on("current player info", onCurrentPlayerInfo);
};



// Browser window resize
function onResize(e) {
	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

function onSocketConnected() {
    console.log("Connected to socket server");
	socket.emit("new player", {x: localPlayer.getX(), y: localPlayer.getY()});
};

function onSocketDisconnect(data) {
	console.log("Player has disconnected: "+this.id);
	var removePlayer = playerById(data.id);
	if (!removePlayer) {
		console.log("Player not found: "+data.id);
		return;
	};
	remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
};

function onNewPlayer(data) {    
	var newPlayer = new Player(contentManager.imgLinkWalkSouth, contentManager.imgLinkIdleSouth, 
	contentManager.imgLinkWalkNorth, contentManager.imgLinkIdleNorth,
	contentManager.imgLinkWalkEast, contentManager.imgLinkIdleEast,
	contentManager.imgLinkWalkWest, contentManager.imgLinkIdleWest);
	newPlayer.x = data.x;	
	newPlayer.y = data.y;
	newPlayer.id = data.id;
	remotePlayers.push(newPlayer);
	stage.addChild(newPlayer);
	console.log("New player connected: "+data.id +" ("+remotePlayers.length+" total)");
};

function onMovePlayer(data) {
	var movePlayer = playerById(data.id);

	if (!movePlayer) {
		console.log("Player not found: "+data.id);
		return;
	};	
	movePlayer.setX(data.x);
	movePlayer.setY(data.y);
	movePlayer.setDirectionX(data.directionX);
	movePlayer.setDirectionY(data.directionY);
	movePlayer.tick();
};

function onRemovePlayer(data) {
	var removePlayer = playerById(data.id);

	if (!removePlayer) {
		console.log("Player not found: "+data.id);
		return;
	};

	remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
	stage.removeChild(removePlayer);
	console.log("Player disconnected: "+data.id +" ("+remotePlayers.length+" total)");
};

function onCurrentPlayerInfo(data) {
	localPlayer.id = data.id;
};

/**************************************************
** GAME UPDATE
**************************************************/
function updateServer() {	
	socket.emit("move player", {
		x: localPlayer.getX(), 
		y: localPlayer.getY(), 
		directionX: localPlayer.getDirectionX(),
		directionY: localPlayer.getDirectionY()
	});		
};

function handleKeyDown(e) {
    //cross browser issues exist
    if (!e) { var e = window.event; }
    switch (e.keyCode) {
        case KEYCODE_W: ;
        case KEYCODE_UP:
            localPlayer.directionY = -1;
			break;
        case KEYCODE_S: ;
        case KEYCODE_DOWN:
            localPlayer.directionY = 1;
            break;
		case KEYCODE_A: ;
        case KEYCODE_LEFT:            
            localPlayer.directionX = -1;            
			break;
        case KEYCODE_D: ;
        case KEYCODE_RIGHT:
            localPlayer.directionX = 1;
            break;
    }
}

function handleKeyUp(e) {
    //cross browser issues exist
    if (!e) { var e = window.event; }
    switch (e.keyCode) {	
        case KEYCODE_W: ;
        case KEYCODE_UP: ;  
        case KEYCODE_S: ;
        case KEYCODE_DOWN: ;
			localPlayer.directionY = 0;
			break;
		case KEYCODE_A: ;
        case KEYCODE_LEFT: ;  
        case KEYCODE_D: ;
        case KEYCODE_RIGHT: ;
			localPlayer.directionX = 0;            
            break;
    }
}

function playerById(id) {
    var i;
    for (i = 0; i < remotePlayers.length; i++) {
        if (remotePlayers[i].id == id)
            return remotePlayers[i];
    };

    return false;
};

