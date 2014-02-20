exports.listen = function(db, nodemailer) {
  return function(req, res){
    var collection = db.get('listeningrooms');

    collection.insert({
        "video_id": req.body.video_id,
        "thumbnail_url": req.body.thumbnail_url,
        "title": req.body.video_title
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            var reqcollection = db.get('songrequests');
            reqcollection.insert({
              "requester_name": req.session.user.username,
              "receiver_name": req.body.username,
              "listeningroom_id": doc._id,
              "video_id": doc.video_id
            }, function(err, doc2) {
              if (err) {
                console.log("ERROR is " + err);
              }
              else {
                console.log("song request created");
                var url = "listeningroom/" + doc._id + "?videoId=" + doc.video_id;
                var emailUrl = req.headers.host + "/" + url;
                sendRequestEmail(doc2, emailUrl, db, nodemailer);
                res.redirect(url);
              }
            });        
        }
    });
  }
};

function sendRequestEmail(request, url, db, nodemailer) {
  var users = db.get('users');
  users.findOne({'username': request.receiver_name}, {}, function(e, doc) {
    if (doc) {
      var smtpTransport = nodemailer.createTransport('SMTP',{
          service: 'Gmail',
          auth: {
              user: 'songshare147@gmail.com',
              pass: 'zMwEspe2bR0Spqo'
          }
      });
      var htmlstr = '<p>Click <a href="' + url + '">here</a> to listen with ' + request.requester_name + '.</p>' + url;
      console.log(htmlstr);
      var mailOptions = {
          from: "SongShare <songshare147@gmail.com>", // sender address
          to: doc.email, // list of receivers
          subject: request.requester_name + " has shared a song with you!", // Subject line
          html: htmlstr
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
  });
}