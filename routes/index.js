
/*
 * GET home page.
 */

 exports.index = function(req, res){
  res.render('index', { title: 'SongShare', session: req.session });
}


exports.userlist = function(db) {
  return function(req, res) {
    var users = db.get('users');
    users.find({}, {}, function(e, docs) {
      res.render('userlist', { title: 'Users', users: docs, session: req.session });
    });
  };
}

exports.user = function(db){
  return function(req, res) {
    var users = db.get('users');
    users.findOne({'username': req.params.username}, {}, function(e, doc) {
      res.render('user', { title: doc.username, profile: doc, session: req.session });
    });
  }
}

exports.inbox = function(db){
  return function(req, res) {
    var requests = db.get('songrequests');
    res.render('inbox', { title: 'Inbox', requests: requests, session: req.session });
  }
}

exports.listen = function(db) {
  return function(req, res){
    var collection = db.get('listeningrooms');

    collection.insert({
        "video_id": req.body.videoid
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {        
            var reqcollection = db.get('songrequests');
            reqcollection.insert({
              "requester_name": req.session.user.username,
              "receiver_name": req.body.username,
              "listeningroom_id": doc._id,
              "video_id": doc.video_id
            }, function(err, doc) {

              res.redirect("listeningroom/" + doc._id + "?videoId=" + doc.videoId);
            });        
        }
    });
  }
};

exports.listeningRoom = function(req, res){
  res.render('listen', { title: 'Listen', videoId: req.query.videoId, session: req.session });
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

exports.picksong = function(req, res){
  res.render('picksong', { title: 'Pick Song', session: req.session });
}

exports.pickfriend = function(req, res){
  res.render('pickfriend', { title: 'Pick Friend', videoId: req.query.videoId, session: req.session });
};

exports.signup = function(req, res){
  res.render('signup', { title: 'Sign Up', session: req.session });
}

exports.login = function(db) {
  return function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    var collection = db.get('users');

    collection.findOne({'username': username}, {}, function(e, doc) {
      if (doc) {
        if (doc.password == password) {
          req.session.user = doc;
          res.location('/');
          res.redirect('/');
        } else {
          res.send('incorrect password');
        }
      } else {
        res.send('incorrect username');
      }
    });
  }
}

exports.logout = function(req, res) {
  req.session.user = null;
  res.location('/');
  res.redirect('/');
}

exports.adduser = function(db) {
  return function(req, res) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    var collection = db.get('users');

    collection.insert({
      'username': username,
      'email': email,
      'password': password,
      'friends': []
    }, function (err, doc) {
      if (err) {
        // If it failed, return error
        res.send('There was a problem adding the information to the database.');
      }
      else {
        // If it worked, set the header so the address bar doesn't still say /adduser
        res.location('/userlist');
        // And forward to success page
        res.redirect('/userlist');
      }
    });
  }
}

exports.addfriend = function(db) {
  return function(req, res) {
    var friendUsername = req.body.username;
    var username = req.session.user.username;

    addToFriendsList(username, friendUsername, db);
    addToFriendsList(friendUsername, username, db);

    req.session.user.friends.push(friendUsername);
    console.log(req.session.user.friends);
    res.location('/user/' + friendUsername);
    res.redirect('/user/' + friendUsername);
  }
}

function addToFriendsList(user, friend, db) {
  var collection = db.get('users');
  collection.findOne({'username': user}, {}, function(e, doc) {
    var newFriends;
    if (doc.friends == null) {
      newFriends = [friend];
    } else {
      newFriends = doc.friends;
      newFriends.push(friend);
    }

    collection.update(
      { username: user },
      { $set : {friends: newFriends }},
      {}
    );
  });
}

exports.removefriend = function(db) {
  return function(req, res) {
    var friendUsername = req.body.username;
    var username = req.session.user.username;

    removeFromFriendsList(username, friendUsername, db);
    removeFromFriendsList(friendUsername, username, db);

    var index = req.session.user.friends.indexOf(friendUsername);
    req.session.user.friends.splice(index, 1);
    console.log(req.session.user.friends);
    res.location('/user/' + friendUsername);
    res.redirect('/user/' + friendUsername);
  }
}

function removeFromFriendsList(user, friend, db) {
  var collection = db.get('users');
  collection.findOne({'username': user}, {}, function(e, doc) {
    var friends = doc.friends;
    var newFriends = [];
    for (var i = 0; i < friends.length; i++) {
      if (friends[i] != friend)
        newFriends.push(friends[i]);
    }

    collection.update(
      { username: user },
      { $set : {friends: newFriends }},
      {}
    );
  });
}