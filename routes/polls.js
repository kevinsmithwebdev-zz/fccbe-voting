var express = require('express');
var router = express.Router();

var Poll = require('../models/poll');

// polls/new

router.get('/new', function(req, res) {
  res.render('poll-new');
});

router.post('/new', function(req, res) {

  req.body.title = req.body.title.trim();
  req.body.choices = req.body.choices
                .map(function(choice) {return choice.trim() })
                .filter (function (choice, i, arr) { return choice && arr.indexOf (choice) == i; });

  req.checkBody({
   'title': {
      notEmpty: true,
      errorMessage: 'Invalid title'
    },
    'choices': {
      enoughChoices: true,
      errorMessage: 'At least two unique choices are required'
    }
  });

  var errors = req.validationErrors();

  var newPoll = new Poll({
    title: req.body.title,
    choices: req.body.choices.map(function(name) {
        return {name: name, votes: 0}
      }, {}),
    creator: res.locals.user.username,
    voted: []
  });

  Poll.createPoll(newPoll, function(err, poll) {
    if (err) throw err;
  });

  req.flash("success_msg", "Poll succesfully made")
  res.redirect("/");

}); // post polls/new


// show polls


router.get('/show', function(req, res) {

  Poll.find(function (err, results) {
    if (err) {
      console.log("error in Poll.find");
      throw err;
    }
    console.log("\n\n\n\nsuccess with Poll.find\n\n\n");
    console.log(results);

    var context = { results: results };

    res.render('polls-show', context);
  });
});

// /:username/:pollname

router.get('/:username/:pollname', function(req, res) {

  console.log('\n\n\nin get /:username/:pollname');
  console.log(req.params);

  Poll.getPoll(req.params.username, req.params.pollname, function(err, obj) {
    if (err) {
      console.log("Error finding poll");
      console.log(err);
    } else {
      console.log("poll found!!!");
      console.log(obj);
    }
  });

});





module.exports = router;
