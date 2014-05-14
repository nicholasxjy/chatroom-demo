var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/static'));
app.use(function(req, res, next) {
    res.sendfile('static/index.html');
});

var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function(socket) {
    console.log('new connection');
    socket.emit('connected');
});

console.log('chat room is on ' + port);