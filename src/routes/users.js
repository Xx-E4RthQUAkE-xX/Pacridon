const User = require('../models/user');
const UserSession = require('../models/user_session')

module.exports = function (app) {
  app.get('/signup', function (req, res) {
    res.render('signup');
  });

  app.post('/signup', function (req, res) {
    let nickname = req.body.nickname;
    let email = req.body.email;
    let password = req.body.password;
    User.create(nickname, email, password).then((user) => {
      res.redirect('/login');
    }).catch((err) => {
      console.log(err);
      res.render("signup", { error: true });
    });
  });

  app.get('/login', function (req, res) {
    res.render('login');
  });

  app.post('/login', function (req, res) {
    let email = req.body.email;
    let password = req.body.password;
    
    User.authenticate(email, password).then((user) => {
      return UserSession.create(user);
    }).then((session) => {
      res.cookie("session_id", session.data.id, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 30)),
        signed: true
      });
      res.redirect("/");
    }).catch((err) => {
      res.render("login", { error: true });
    })
  });
};