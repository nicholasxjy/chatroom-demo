var mongoose = require('mongoose');
var User = require('./user');
var Message = require('./message');

mongoose.connect('mongodb://localhost/chatroom');
exports.User = mongoose.model('User', User);
exports.Message = mongoose.model('Message', Message);