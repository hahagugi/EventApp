var express = require('express');
var router = express.Router();
const passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { user:req.user });
});

router.get('/login', (req, res) => {
  res.render('login');
})

//auth lougout
router.get('/logout', (req,res) => {
  //handle with passport
  req.logout();
  res.redirect('/');
});

//auth with google
router.get('/google', passport.authenticate("google", {
  scope: ["profile"]
}));

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  //res.send(req.user);
  res.redirect('/profile/');
  req.user
  res.send("you reached the callbackURL");
});

module.exports = router;
