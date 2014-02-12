
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

exports.user = function(req, res){
  res.render('user', { title: 'Dummy profile' });
};

exports.inbox = function(req, res){
  res.render('inbox', { title: 'SongShare' });
};

exports.listen = function(req, res){
  res.render('listen', { title: 'SongShare' });
};

exports.picksong = function(req, res){
  res.render('picksong', { title: 'SongShare' });
};

exports.pickfriend = function(req, res){
  res.render('pickfriend', { title: 'SongShare' });
};