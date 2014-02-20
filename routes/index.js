  
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
    users.findOne({'username': req.params.username}, {}, function(e, doc) {
      loadUser(req.session.username, db, function(user) {
        req.session.user = user;
        res.render('user', { title: doc.username, profile: doc, db: db, session: req.session });
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

exports.listen = function(db, nodemailer) {
  return function(req, res){
    var collection = db.get('listeningrooms');

    collection.insert({
        "video_id": req.body.video_id,
        "thumbnail_url": req.body.thumbnail_url,
        "title": req.body.video_title
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
                var url = "listeningroom/" + doc._id + "?videoId=" + doc.video_id;
                var emailUrl = req.headers.host + "/" + url;
                sendRequestEmail(doc2, emailUrl, db, nodemailer);
                res.redirect(url);
              }
            });        
        }
    });
  }
};

function sendRequestEmail(request, url, db, nodemailer) {
  var users = db.get('users');
  users.findOne({'username': request.receiver_name}, {}, function(e, doc) {
    if (doc) {
      var smtpTransport = nodemailer.createTransport('SMTP',{
          service: 'Gmail',
          auth: {
              user: 'songshare147@gmail.com',
              pass: 'zMwEspe2bR0Spqo'
          }
      });

      var mailOptions = {
          from: "SongShare <songshare147@gmail.com>", // sender address
          to: doc.email, // list of receivers
          subject: request.requester_name + " has shared a song with you!", // Subject line
          html: '<p>Click <a href="' + url + '">here</a> to listen with ' + request.requester_name + '.</p>' + url
      }

      smtpTransport.sendMail(mailOptions, function(error, response){
          if(error){
              console.log(error);
          }else{
              console.log("Message sent: " + response.message);
          }

          // if you don't want to use this transport object anymore, uncomment following line
          smtpTransport.close(); // shut down the connection pool, no more messages
      });
    }
  });
}

exports.listeningRoom = function(db) {
  return function(req, res){
    loadUser(req.session.username, db, function(user) {
      req.session.user = user;
      res.render('listen', { title: 'Listen', videoId: req.query.videoId, db: db, session: req.session });
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

