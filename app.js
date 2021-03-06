
/**
* Module dependencies.
*/

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var friend = require('./routes/friend');
var listen = require('./routes/listen');
var ajax = require('./routes/ajax');
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
// var db = monk('localhost:27017/songshare'); 
// for heroku
var db = monk(process.env.MONGOLAB_URI);

var users = db.get('users');
users.update(
    {},
    { $set: { available: false }},
    {multi:true});

var nodemailer = require('nodemailer');

var less = require('less');


app.get('/', routes.index(db));
app.get('/dashboard', routes.dashboard(db));
app.get('/shares', routes.shares(db));
app.get('/friends', routes.friends(db));
app.get('/history', routes.historyPage(db));

//listening room stuff
app.post('/picksong', routes.picksong(db));
app.get('/getVideoId/:roomId', routes.getVideoId(db));
app.get('/signup', routes.signup(db));
app.get('/expireroom/:listeningroom_id', listen.expire(db));
app.post('/listen', listen.listen(db, nodemailer));

app.get('/logout', user.logout(db));
app.post('/login', user.login(db));
app.post('/adduser', user.adduser(db, nodemailer));

app.post('/addfriend', friend.addfriend(db));
app.post('/removefriend', friend.removefriend(db));

app.post('/usersearch', ajax.usersearch(db, app));

var server = http.createServer(app);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

//Socket.IO stuff
var io = require('socket.io').listen(server);

// var connectCounter = 0;

// var listenRoom = io.of("/listen").on('connection', function(socket) {	
//   console.log("connected");
//   connectCounter++;
//   listenRoom.emit('connections', { connections: connectCounter} );

//   socket.on('paused', function (data) {
//     listenRoom.emit('pauseplayer');
//   });

//   socket.on('resumed', function (data) {
//     listenRoom.emit('playplayer');
//   });	

//   socket.on('disconnect', function () {
//     connectCounter--;
//   });
// });

app.get('/listeningroom/:id', routes.listeningRoom(db,io));
