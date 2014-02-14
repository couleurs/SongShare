
/**
* Module dependencies.
*/

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var mongo = require('mongodb');
var monk = require('monk');

// for local testing
//var db = monk('localhost:27017/songshare'); 
// for heroku
var db = monk(process.env.MONGOLAB_URI);

app.get('/', routes.index);
app.get('/userlist', routes.userlist(db));
app.get('/inbox', routes.inbox(db));

//listening room stuff
app.post('/listen', routes.listen(db));
app.get('/listeningroom/:id', routes.listeningRoom);
app.get('/picksong', routes.picksong);
app.get('/pickfriend', routes.pickfriend);
app.get('/getVideoId/:roomId', routes.getVideoId(db));

app.get('/user/:username', routes.user(db));
app.get('/signup', routes.signup);
app.get('/logout', routes.logout);

app.post('/login', routes.login(db));
app.post('/adduser', routes.adduser(db));
app.post('/addfriend', routes.addfriend(db));
app.post('/removefriend', routes.removefriend(db));

var server = http.createServer(app);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

//Socket.IO stuff
var io = require('socket.io').listen(server);

var connectCounter = 0;

var listenRoom = io.of("/listen").on('connection', function(socket) {	
  connectCounter++;
  listenRoom.emit('connections', { connections: connectCounter} );

  socket.on('paused', function (data) {
    listenRoom.emit('pauseplayer');
  });

  socket.on('resumed', function (data) {
    listenRoom.emit('playplayer');
  });	

  socket.on('disconnect', function () {
    connectCounter--;
  });
});
