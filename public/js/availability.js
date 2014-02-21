function changeAvailability(username, value, db) {
  var users = db.get('users');
  users.update(
    { username: username },
    { $set: { available: value }},
    {});
  console.log("blah");
}