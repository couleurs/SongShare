exports.login = function(db) {
  return function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    var collection = db.get('users');

    collection.findOne({'username': username}, {}, function(e, doc) {
      if (doc) {
        if (doc.password == password) {
          req.session.username = username;
          res.location('/user/' + username);
          res.redirect('/user/' + username);
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
  req.session.username = null;
  req.session.user = null;
  res.location('/');
  res.redirect('/');
}

exports.adduser = function(db, nodemailer) {
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
        res.send('There was a problem adding the information to the database.');
      }
      else {
        sendWelcomeEmail(doc, nodemailer);
        req.session.username = username;
        res.location('/user/' + username);
        res.redirect('/user/' + username);
      }
    });
  }
}

function sendWelcomeEmail(user, nodemailer) {
  var smtpTransport = nodemailer.createTransport('SMTP',{
      service: 'Gmail',
      auth: {
          user: 'songshare147@gmail.com',
          pass: 'zMwEspe2bR0Spqo'
      }
  });

  var mailOptions = {
      from: "SongShare <songshare147@gmail.com>", // sender address
      to: user.email, // list of receivers
      subject: "Welcome to SongShare, " + user.username + "!", // Subject line
      html: '<p>Now, find your friends and share some songs!</p><p><a href="songshare147.herokuapp.com">SongShare</a></p>♪♫♪♫♪♫♪'
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