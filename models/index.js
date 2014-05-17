var mongoose = require('mongoose');
var User = require('./user');

mongoose.connect('mongodb://localhost/chatroom');
exports.User = mongoose.model('User', User);