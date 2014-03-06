exports.usersearch = function(db, app) {
  return function(req, res) {
    var users = db.get('users');
    if (req.body.q == '') {
      var response = {
        html: ''
      };
      res.json(response);
    } else {
      users.findOne({'username': req.body.username}, {}, function(e, user) {
        users.find({username: {$regex: '.*' + req.body.q + '.*', $options: 'i'}}, {}, function(e, docs) {
          app.render('usersearch', {layout: false, results: docs, user: user}, function(err, html){
            var response = {
              html: html
            };
            res.json(response);
          });
        });
      });
    }
  };
}