// ADD

exports.addfriend = function(db) {
  return function(req, res) {
    var friendUsername = req.body.username;
    var username = req.session.user.username;

    addToFriendsList(username, friendUsername, db);
    addToFriendsList(friendUsername, username, db);

    req.session.user.friends.push(friendUsername);
    console.log(req.session.user.friends);
    res.location('/user/' + friendUsername);
    res.redirect('/user/' + friendUsername);
  }
}

function addToFriendsList(user, friend, db) {
  var collection = db.get('users');
  collection.findOne({'username': user}, {}, function(e, doc) {
    var newFriends;
    if (doc.friends == null) {
      newFriends = [friend];
    } else {
      newFriends = doc.friends;
      newFriends.push(friend);
    }

    collection.update(
      { username: user },
      { $set : {friends: newFriends }},
      {}
    );
  });
}

// REMOVE

exports.removefriend = function(db) {
  return function(req, res) {
    var friendUsername = req.body.username;
    var username = req.session.user.username;

    removeFromFriendsList(username, friendUsername, db);
    removeFromFriendsList(friendUsername, username, db);

    var index = req.session.user.friends.indexOf(friendUsername);
    req.session.user.friends.splice(index, 1);
    console.log(req.session.user.friends);
    res.location('/user/' + friendUsername);
    res.redirect('/user/' + friendUsername);
  }
}

function removeFromFriendsList(user, friend, db) {
  var collection = db.get('users');
  collection.findOne({'username': user}, {}, function(e, doc) {
    var friends = doc.friends;
    var newFriends = [];
    for (var i = 0; i < friends.length; i++) {
      if (friends[i] != friend)
        newFriends.push(friends[i]);
    }

    collection.update(
      { username: user },
      { $set : {friends: newFriends }},
      {}
    );
  });
}