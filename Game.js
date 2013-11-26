var util = require("util"),    
	express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require("socket.io").listen(server),
	path = require('path'),
	Player = require("./Player").Player,
	players = [],
	port = 4000;
	
function init() {	
	server.listen(port);
	util.log("Listening on port:"+port);

	app.use(express.compress());
	app.use(express.static(path.join(__dirname, 'public')));
		
	io.configure(function() {
		io.set("transports", ["websocket"]);
		io.set("log level", 1);
	});
	
	setEventHandlers();
};

var setEventHandlers = function() {
    io.sockets.on("connection", onSocketConnection);
};

function onSocketConnection(client) {    	
    client.on("disconnect", onClientDisconnect);
    client.on("new player", onNewPlayer);
    client.on("move player", onMovePlayer);		
};

function onClientDisconnect() {
    util.log("Player has disconnected: "+this.id);
	var removePlayer = playerById(this.id);
	if (!removePlayer) {
		util.log("Player not found: "+this.id);
		return;
	};
	players.splice(players.indexOf(removePlayer), 1);
	this.broadcast.emit("remove player", {id: this.id});
};

function onNewPlayer(data) {
	util.log("New player has connected: "+this.id);
	var newPlayer = new Player(data.x, data.y);
	newPlayer.id = this.id;
	
	this.broadcast.emit("new player", 
	{id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()});
	
	var i, existingPlayer;
	for (i = 0; i < players.length; i++) {
		existingPlayer = players[i];
		this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
	};	
	players.push(newPlayer);
	this.emit("current player info", {id: newPlayer.id});
};

function onMovePlayer(data) {
	var movePlayer = playerById(this.id);
	if (!movePlayer) {
		util.log("Player not found: "+this.id);
		return;
	};
	movePlayer.setX(data.x);
	movePlayer.setY(data.y);
	movePlayer.setDirectionX(data.directionX);
	movePlayer.setDirectionY(data.directionY);	
	this.broadcast.emit("move player", {
		id: movePlayer.id, 
		x: movePlayer.getX(), 
		y: movePlayer.getY(), 
		directionX: movePlayer.getDirectionX(), 
		directionY: movePlayer.getDirectionY()
	});
};

function onRemovePlayer(data) {
	var removePlayer = playerById(this.id);
	if (!removePlayer) {
		util.log("Player not found: "+this.id);
		return;
	};
	players.splice(players.indexOf(removePlayer), 1);
	this.broadcast.emit("remove player", {id: this.id});
};

function playerById(id) {
    var i;
    for (i = 0; i < players.length; i++) {
        if (players[i].id == id)
            return players[i];
    };
    return false;
};

init();