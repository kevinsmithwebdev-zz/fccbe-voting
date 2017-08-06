var express = require('express');
var router = express.Router();

// get homepage

router.get('/', ensureAuthenticated, function(req, res) {
  res.render('index');
});

router.get('/polls', ensureAuthenticated, function(req, res) {
  console.log("in router.get /polls");
  res.render('polls');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/users/login');
  }
}


module.exports = router;
