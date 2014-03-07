exports.login = function(db) {
  return function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    var users = db.get('users');

    users.findOne({'username': username}, {}, function(e, doc) {
      if (doc) {
        if (doc.password == password) {
          setAvailability(username, true, db);
          req.session.username = username;
          if (doc.site == 'A') {
            res.redirect('/dashboard');
          } else {
            res.redirect('Http://songshare147b.herokuapp.com/dashboard');
          }
        } else {
          res.send('incorrect password');
        }
      } else {
        res.send('incorrect username');
      }
    });
  }
}

exports.logout = function(db) {
  return function(req, res) {
    setAvailability(req.session.username, false, db);
    req.session.username = null;
    req.session.user = null;
    res.location('/');
    res.redirect('/');
  }
}

exports.adduser = function(db, nodemailer) {
  return function(req, res) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var site;
    if (Math.random() < 0.5) {
      site = 'A';
    } else {
      site = 'B';
    }

    var users = db.get('users');

    users.insert({
      'username': username,
      'email': email,
      'password': password,
      'friends': [],
      'site': site
    }, function (err, doc) {
      if (err) {
        res.send('There was a problem adding the information to the database.');
      }
      else {
        sendWelcomeEmail(doc, nodemailer);
        setAvailability(username, true, db);
        req.session.username = username;
        if (site == 'A') {
          res.location('/dashboard');
          res.redirect('/dashboard');
        } else {
          res.location('http://songshare147b.herokuapp.com/dashboard');
          res.redirect('http://songshare147b.herokuapp.com/dashboard');
        }
      }
    });
  }
}

function setAvailability(username, value, db) {
  var users = db.get('users');
  users.update(
    { username: username },
    { $set: { available: value }},
    {});
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