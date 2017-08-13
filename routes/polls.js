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
  res.send("/");

}); // post polls/new


// show polls


router.get('/show', function(req, res) {

  Poll.find(function (err, results) {
    if (err) {
      console.log("error in Poll.find");
      throw err;
    }

    var context = { results: results };

    res.render('polls-show', context);
  });
});

// /:username/:pollname

router.get('/', function(req, res) {
  var creator = req.query.creator;
  var pollName = req.query.poll;

  Poll.getPoll(creator, pollName, function(err, poll) {
    if (err) {
      console.log("Error finding poll - /polls/" + creator + "/" + pollName);
      console.log(err);
    } else {

      var context = {poll: poll,
        helpers: {
          wowsers: function () {
             return buildPollChart(poll);
           }
        }
      };

      res.render('poll-show', context);
    }
  });

});

router.delete('/:id', function(req, res) {

  Poll.removePollById(req.params.id, function (err, results) {
    if (err) {
      console.log("error in Poll.remove");
      req.flash("error_msg", 'Failed to remove poll.')
      throw err;
    } else {
      req.flash("error_success", 'Poll removed.');
    }
    return res.render("polls-show");
  });
});

module.exports = router;
