
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

//mongodb
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('mongodb://localhost/mydb');

/*
var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/mydb';

mongo.Db.connect(mongoUri, function (err, db) {
  db.collection('mydocs', function(er, collection) {
    collection.insert({'mykey': 'myvalue'}, {safe: true}, function(er,rs) {
    });
  });
});
*/

app.get('/', routes.index);
app.get('/user', routes.userlist(db));
app.get('/inbox', routes.inbox);
app.get('/listen', routes.listen);
app.get('/picksong', routes.picksong);
app.get('/pickfriend', routes.pickfriend);
app.get('/user/:id(\\d+)', routes.user);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
