
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