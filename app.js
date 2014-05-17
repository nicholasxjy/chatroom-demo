var express = require('express');
var controllers = require('./controllers');

var app = express();
var port = process.env.PORT || 3000;
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({
    secret: 'chatroom',
    cookite: {
        maxAge: 60*1000
    }
}));
app.use(express.static(__dirname + '/static'));

app.use(function(req, res, next) {
    res.sendfile('static/index.html');
});

app.get('api/validate', function(req, res) {
    _userId = req.session._userId;
    if (_userId) {
        controllers.User.findUserById(_userId, function(err, user) {
            if (err) {
                res.json(401, {msg: err});
            } else {
                res.json(user);
            }
        });
    } else {
        res.json(401, null);
    }
});

app.post('api/login', function(req, res) {
    email = req.body.email;
    if (email) {
        controllers.User.findByEmailOrCreate(email, function(err, user) {
            if (err) {
                res.json(500, {msg: err});
            } else {
                req.session._userId = user._id;
                res.json(user);
            }
        });
    } else {
        res.json(403);
    }
});

app.get('api/logout', function(req, res) {
    req.session._userId = null;
    res.json(401);
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