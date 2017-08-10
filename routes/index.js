var express = require('express');
var router = express.Router();
var Poll = require('../models/poll');

// var ClickHandlerClient = require(process.cwd() + '/controllers/clickController.client.js');

// get homepage

router.get('/', ensureAuthenticated, function(req, res) {
  Poll.getUserPolls(res.locals.user.username, function(err, polls) {
    if (err) {
      console.log("Error get polls for user " + res.locals.user.username);
      console.log(err);
      throw err;
      req.flash("success_error", 'Error getting polls for user "' + res.locals.user.username + '"');
      res.render('index');
    } else {
      res.render('index', {polls: polls});
    }

  });

});

// ***************************************

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/users/login');
  }
}


module.exports = router;
