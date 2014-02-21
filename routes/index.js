
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

exports.userlist = function(db) {
  return function(req, res) {
    var users = db.get('users');
    users.find({}, {}, function(e, docs) {
      loadUser(req.session.username, db, function(user) {
        req.session.user = user;
        res.render('userlist', { title: 'Users', users: docs, db: db, session: req.session });
      });
    });
  };
}

exports.user = function(db){
  return function(req, res) {
    var users = db.get('users');
    var username;
    if (req.params.username != 'undefined')
      username = req.params.username;
    else
      username = req.session.username

    users.findOne({'username': username}, {}, function(e, doc) {
      loadUser(req.session.username, db, function(user) {
        req.session.user = user;
        var requests = db.get('songrequests');
        if (user)
          requests.find({receiver_name: req.session.user.username, active: "1"}, {}, function(e, requests) {    
            users.find({username: {$in: user.friends}}, {}, function(e, friends) {
              res.render('user', { title: doc.username, profile: doc, requests: requests, friends: friends, db: db, session: req.session });
            });
          });
        else
          res.render('user', { title: doc.username, profile: doc, requests: [], friends: [], db: db, session: req.session });
      });
    });
  }
}

exports.inbox = function(db){
  return function(req, res) {
    var requests = db.get('songrequests');
    requests.find({receiver_name: req.session.user.username}, {}, function(e, docs) {
      loadUser(req.session.username, db, function(user) {
        req.session.user = user;
        res.render('inbox', { title: 'Inbox', requests: docs, db: db, session: req.session });
      });
    });
  }
}

exports.listeningRoom = function(db) {
  return function(req, res){
    loadUser(req.session.username, db, function(user) {
      req.session.user = user;
      console.log(req.params.id);
      res.render('listen', { title: 'Listen', listeningroom_id: req.params.id, videoId: req.query.videoId, db: db, session: req.session });
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
      res.render('picksong', { title: 'Pick Song', receiver_username: req.body.username, session: req.session });
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

