
/*
 * GET inbox page.
 */

exports.render = function(req, res){
  res.render('inbox', { title: 'SongShare' });
};