var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/static'));
app.use(function(req, res, next) {
    res.sendfile('static/index.html');
});

var io = require('socket.io').listen(app.listen(port));

var messages = []; //store all messages
io.sockets.on('connection', function(socket) {
	socket.on('allMessages', function() {
		socket.emit('allMessages', messages);
	});
    
    socket.on('createNewMessage', function(message) {
    	messages.push(message);
    	io.sockets.emit('messageAdd', message);
    });
});

console.log('chat room is on ' + port);