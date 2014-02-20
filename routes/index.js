
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
    requests.find({receiver_name: req.session.user.username}, {}, function(e, docs) {
      res.render('inbox', { title: 'Inbox', requests: docs, session: req.session });
    });
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
            }, function(err, doc2) {
              if (err) {
                console.log("ERROR is " + err);
              }
              else {
                console.log("song request created");

                res.redirect("listeningroom/" + doc._id + "?videoId=" + doc.video_id);
              }
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