
/*
 * GET home page.
 */

 exports.index = function(db) {
  return function(req, res) {
    loadUser(req.session.username, db, function(user) {
      req.session.user = user;
      res.render('index', { title: 'SongShare', db: db, session: req.session });
    });
  };
}

exports.friends = function(db) {
  return function(req, res) {
    loadUser(req.session.username, db, function(user) {
      var users = db.get('users');
      users.find({username: {$in: user.friends}}, {}, function(e, docs) {
        req.session.user = user;
        res.render('friends', { title: 'Friends', friends: docs, db: db, session: req.session });
      });
    });
  };
}

exports.dashboard = function(db) {
  return function(req, res) {
    loadUser(req.session.username, db, function(user) {
      req.session.user = user;
      var requests = db.get('songrequests');
      requests.find({$or: [ {receiver_name: user.username}, {requester_name: user.username}]}, {}, function(e, requests) {    
        var users = db.get('users');
        users.find({username: {$in: user.friends}}, {}, function(e, friends) {
          res.render('dashboard', { title: user.username, requests: requests, friends: friends, db: db, session: req.session });
        });
      });
    });
  }
}

exports.shares = function(db){
  return function(req, res) {
    var requests = db.get('songrequests');
    requests.find({$and: [{receiver_name: req.session.user.username}, {active: '1'}]}, {}, function(e, docs) {
      loadUser(req.session.username, db, function(user) {
        req.session.user = user;
        res.render('shares', { title: 'Shares', requests: docs, db: db, session: req.session });
      });
    });
  }
}

exports.historyPage = function(db){
  return function(req, res) {
    var requests = db.get('songrequests');
    var user = req.session.user;
    requests.find({$and: [{$or: [ {receiver_name: user.username}, {requester_name: user.username} ]}, {active: '0'} ]}, {}, function(e, docs) {
      loadUser(req.session.username, db, function(user) {
        req.session.user = user;
        res.render('history', { title: 'History', requests: docs, db: db, session: req.session });
      });
    });
  }
}

exports.listeningRoom = function(db,io) {
  return function(req, res){
    loadUser(req.session.username, db, function(user) {
      req.session.user = user;
      var collection = db.get('songrequests');

      collection.findOne({listeningroom_id: req.params.id}, {}, function(e,doc){
        var partnerName = (user.username == doc.receiver_name) ? doc.requester_name : doc.receiver_name;                                      
        res.render('listen', { title: 'Listen', listeningroom_id: req.params.id, videoId: req.query.videoId, partner_name: partnerName, db: db, session: req.session });  

        console.log(doc.oneConnected);
        if (doc.oneConnected == "0") {
          console.log("firstuser")
          collection.update(
            { listeningroom_id: req.params.id },
            { $set: { oneConnected: "1" }},
            {}
          );

          var connectCounter = 0;

          var listenRoom = io.of("/listen"+req.params.id).on('connection', function(socket) {           
            connectCounter++;
            listenRoom.emit('connections', { connections: connectCounter} );

            socket.on('paused', function (data) {
              listenRoom.emit('pauseplayer');
            });

            socket.on('resumed', function (data) {
              listenRoom.emit('playplayer');
            }); 

            socket.on('newMessage', function (data) {
              listenRoom.emit('newMessage', { message: data.message });
            });

            socket.on('disconnect', function () {
              console.log("disconnected" + req.session.username);
              connectCounter--;
            });
          });
        }

      });      
    });
  };
}

exports.getVideoId = function(db) {
  return function(req, res){
      var roomId = req.params.roomId;

      var listeningrooms = db.get('listeningrooms');

      listeningrooms.findOne({"_id": roomId}, {}, function(e, doc) {
        res.json(doc);
      });
  }
}

exports.picksong = function(db) {
  return function(req, res){
    loadUser(req.session.username, db, function(user) {
      req.session.user = user;
      res.render('picksong', { title: 'Song Search', session: req.session });
    });
  };
}

exports.pickfriend = function(db) {
  return function(req, res){
    loadUser(req.session.username, db, function(user) {
      req.session.user = user;
      var users = db.get('users');
      users.find({username: {$in: user.friends}}, {}, function(e, friends) {
        res.render('pickfriend', { title: 'Choose Friend', video_id: req.body.video_id, thumbnail_url: req.body.thumbnail_url, video_title: req.body.video_title, friends: friends, session: req.session });
      });
    });
  };
}

exports.signup = function(db) {
  return function(req, res){
    loadUser(req.session.username, db, function(user) {
      req.session.user = user;
      res.render('signup', { title: 'Sign Up', db: db, session: req.session });
    });
  };
}

function loadUser(username, db, callback) {
  var users = db.get('users');
  users.findOne({'username': username}, {}, function(e, doc) {
    if (callback) callback(doc);
  });
}

