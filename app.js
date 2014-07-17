var express = require('express');

var app = express();
var port = process.env.port || 3000;

app.use(express.static(__dirname + '/static'));
app.use(function(req, res) {
    res.sendFile('./static/index.html');
});

var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function(socket) {
    socket.emit('connected');
});

console.log('The server is listening on port ' + port);