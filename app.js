var express = require('express');
var controllers = require('./controllers/user');

var app = express();
var port = process.env.PORT || 3000;

var parseSignedCookie = require('connect').utils.parseSignedCookie;
var MongoStore = require('connect-mongo')(express);
var Cookie = require('cookie');
var sessionStore = new MongoStore({
    url: 'mongodb://localhost/chatroom'
});

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({
    secret: 'chatroom',
    cookite: {
        maxAge: 60*1000
    },
    store: sessionStore
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
                controllers.User.online(user._id, function(err, user) {
                    if (err) {
                        res.json(500, {msg: err});
                    } else {
                        res.json(user);
                    }
                });
                res.json(user);
            }
        });
    } else {
        res.json(403);
    }
});

app.get('api/logout', function(req, res) {
    _userId = req.session._userId;
    controllers.User.offline(_userId, function(err, user) {
        if (err) {
            res.json(500, {msg: err});
        } else {
            res.json(200);
            delete req.session._userId;
        }
    })
    res.json(401);
});

var io = require('socket.io').listen(app.listen(port));

io.set('authorization', function(handshakeData, accept) {
    handshakeData.cookie = Cookie.parse(handshakeData.headers.cookie);
    var connectSid = handshakeData.cookie['connect.sid'];
    connectSid = parseSignedCookie(connectSid, 'chatroom');
    if (connectSid) {
        sessionStore.get(connectSid, function(error, session) {
            if (error) {
                accept(error.message, false);
            } else {
                handshakeData.session = session;
                if (session._userId) {
                    accept(null, true);
                } else {
                    accept('No, login');
                }
            }
        })
    } else {
        accept('No session');
    }
})
var messages = []; //store all messages
io.sockets.on('connection', function(socket) {
    socket.on('getRoom', function() {
        controllers.User.getOnlineUsers(function(err, users) {
            if (err) {
                socket.emit('err', {msg: err});
            } else {
                socket.emit('roomData', {users: users, messages: messages});
            }
        });
    });

    socket.on('createNewMessage', function(message) {
    	messages.push(message);
    	io.sockets.emit('messageAdd', message);
    });
});

console.log('chat room is on ' + port);