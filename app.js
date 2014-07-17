var express = require('express');

var app = express();
var port = process.env.port || 3000;

app.use(express.static(__dirname + '/static'));
app.use(function(req, res) {
    res.sendfile('./static/index.html');
});

var io = require('socket.io').listen(app.listen(port));


var messages = [];
io.sockets.on('connection', function(socket) {
    socket.on('getAllMessages', function() {
        socket.emit('allMessages', messages);
    });

    socket.on('createMessage', function(message) {
        messages.push(message);
        io.sockets.emit('messageAdd', message);
    });
});

console.log('The server is listening on port ' + port);