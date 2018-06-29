var express = require('express');
var router = express.Router();


var authCheck = (req, res, next) => {
  if(!req.user){
    // if user is not logged in
    res.redirect('/login');
  } else {
    // if logged in d
    next();
  }
};


router.get('/', authCheck, (req, res) => {
  res.render('profile', {user: req.user});
});

module.exports = router;
