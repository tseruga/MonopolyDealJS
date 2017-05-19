var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var GameServerController = require('./server/gameServerController');
var SocketManager = require('./server/socketManager.js');

var gsc = new GameServerController();
gsc.start();

var sm = new SocketManager(gsc, io);

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/src/index.html');
});

io.on('connection', function(socket) {
  sm.createUser(socket);
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});


