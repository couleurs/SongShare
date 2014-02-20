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
        req.session.username = username;
        // If it worked, set the header so the address bar doesn't still say /adduser
        res.location('/user/' + username);
        // And forward to success page
        res.redirect('/user/' + username);
      }
    });
  }
}