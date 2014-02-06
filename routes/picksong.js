
/*
 * GET choose song page.
 */

exports.render = function(req, res){
  res.render('picksong', { title: 'SongShare' });
};