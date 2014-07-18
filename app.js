var express = require('express');
var bodyParser = require('body-parser');
var cookitParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var Userctrl = require('./controllers/user');
var parseSignedCookie = require('connect').utils.parseSignedCookie;
var Cookie = require('cookie');

var sessionStore = new MongoStore({
    db: 'chatroom'
});

var app = express();
var port = process.env.port || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookitParser());
app.use(session({
    secret: 'chatroom',
    cookit: {
        maxAge: 60*1000
    },
    store: sessionStore
}));
app.use(express.static(__dirname + '/static'));
app.use(function(req, res) {
    res.sendfile('./static/index.html');
});

app.get('/api/validate', function(req, res) {
    _userId = req.session._userId;
    if (_userId) {
        Userctrl.findUserById(_userId, function(err, user) {
            if (err) return res.json(401, {msg: err});
            return res.json(user);
        });
    } else {
        return res.json(401, null);
    }
});

app.post('/api/validate', function(req, res) {
    email = req.body.email;
    if (email) {
        Userctrl.findByEmailOrCreate(email, function(err, user) {
            if (err) return res.json(500, {msg: err});
            req.session._userId = user._id;
            return res.json(user);
        });
    } else {
        return res.json(403);
    }

});

app.get('/api/logout', function(req, res) {
    req.session._userId = null;
    return res.json(401);
});


var io = require('socket.io').listen(app.listen(port));

io.set('authorization', function(handshakeData, accept) {
    handshakeData.cookie = Cookie.parse(handshakeData.header.cookie);
    var connectSid = handshakeData.cookie['connect.sid'];
    connectSid = parseSignedCookie(connectSid, 'chatroom');

    if (connectSid) {
        sessionStore.get(connectSid, function(err, session) {
            if (err) accept(err.message, false);
            handshakeData.session = session;
            if (session._userId) {
                accept(null, true);
            } else {
                accept('No login');
            }
        });
    } else {
        accept('No session');
    }
})

console.log('The server is listening on port ' + port);