
/*
 * GET home page.
 */

 exports.index = function(req, res){
  res.render('index', { title: 'SongShare', session: req.session });
};


exports.userlist = function(db) {
  return function(req, res) {
    var users = db.get('users');
    users.find({}, {}, function(e, docs) {
      res.render('userlist', { title: 'Users', users: docs, session: req.session });
    });
  };
};

exports.user = function(db){
  return function(req, res) {
    var users = db.get('users');
    users.findOne({'username': req.params.username}, {}, function(e, doc) {
      res.render('user', { title: doc.username, user: doc, session: req.session });
    });
  }
};

exports.inbox = function(req, res){
  res.render('inbox', { title: 'Inbox', session: req.session });
};

exports.listen = function(req, res){
  res.render('listen', { title: 'Listen', session: req.session });
};

exports.picksong = function(req, res){
  res.render('picksong', { title: 'Pick Song', session: req.session });
};

exports.pickfriend = function(req, res){
  res.render('pickfriend', { title: 'Pick Friend', session: req.session });
};

exports.signup = function(req, res){
  res.render('signup', { title: 'Sign Up', session: req.session });
};

exports.login = function(db) {
  return function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    var collection = db.get('users');

    collection.findOne({'username': username}, {}, function(e, doc) {
      if (doc)
        if (doc.password == password) {
          req.session.user = doc;
          res.location('/');
          res.redirect('/');
        } else {
          res.send('incorrect password');
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
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var password = req.body.password;

    var collection = db.get('users');

    collection.insert({
      'username': username,
      'email': email,
      'firstname': firstname,
      'lastname': lastname,
      'password': password
    }, function (err, doc) {
      if (err) {
        // If it failed, return error
        res.send('There was a problem adding the information to the database.');
      }
      else {
        // If it worked, set the header so the address bar doesn't still say /adduser
        res.location('userlist');
        // And forward to success page
        res.redirect('userlist');
      }
    });
  }
}