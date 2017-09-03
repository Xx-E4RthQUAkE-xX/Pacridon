module.exports = function(app) {
  app.get('/', function(req, res) {
    if(!res.locals.currentUser) {
      res.redirect('/login');
      return;
    }

      res.render('timeline');
  });

  require('./users')(app);
  require('./api')(app);
}