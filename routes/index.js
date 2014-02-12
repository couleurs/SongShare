
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'SongShare' });
};


exports.userlist = function(db) {
  return function(req, res) {
    var users = db.get('users');
    users.find({}, {}, function(e, docs) {
      res.render('userlist', { title: 'Users', users: docs });
    });
  };
};

exports.user = function(db){
  return function(req, res) {
    var users = db.get('users');
    users.findOne({"username": req.params.username}, {}, function(e, doc) {
      res.render('user', { title: doc.username, user: doc });
    });
  }
};

exports.inbox = function(req, res){
  res.render('inbox', { title: 'Inbox' });
};

exports.listen = function(req, res){
  res.render('listen', { title: 'Listen' });
};

exports.picksong = function(req, res){
  res.render('picksong', { title: 'Pick Song' });
};

exports.pickfriend = function(req, res){
  res.render('pickfriend', { title: 'Pick Friend' });
};

exports.signup = function(req, res){
  res.render('signup', { title: 'Sign Up' });
};

exports.adduser = function(db) {
    return function(req, res) {

        // Get our form values. These rely on the "name" attributes
        var username = req.body.username;
        var email = req.body.email;
        var firstname = req.body.firstname;
        var lastname = req.body.lastname;
        var password = req.body.password;

        var collection = db.get('users');

        collection.insert({
            "username": username,
            "email": email,
            "firstname": firstname,
            "lastname": lastname,
            "password": password
        }, function (err, doc) {
            if (err) {
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            }
            else {
                // If it worked, set the header so the address bar doesn't still say /adduser
                res.location("userlist");
                // And forward to success page
                res.redirect("userlist");
            }
        });
        

    }
}