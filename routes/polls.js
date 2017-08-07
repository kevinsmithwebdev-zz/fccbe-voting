var express = require('express');
var router = express.Router();


var Poll = require('../models/poll');


// polls/newPoll

router.get('/new', function(req, res) {
  console.log("inside GET polls/new");
  res.render('poll-new');
});

router.post('/new', function(req, res) {

  req.body.title = req.body.title.trim();
  req.body.choices = req.body.choices
                .map(function(choice) {return choice.trim() })
                .filter (function (choice, i, arr) { return choice && arr.indexOf (choice) == i; });

  // console.log("***" + req.body.title + "***");
  //
  // for (var i=0; i<req.body.choices.length; i++) {
  //   console.log(i + " ***" + req.body.choices[i] + "***");
  // }

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

  // console.log("errors...");
  // console.log(errors);
  //
  // if (errors) {
  //   res.render('poll-new', {
  //     errors: errors
  //   });
  // } else {
  //   console.log("time to enter new document");
  // }

  // for (var i=0; i<req.body.choices.length; i++) {
  //   console.log(i + " ***" + req.body.choices[i] + "***");
  // }

  console.log("*** user");
  console.log(this);


  var newPoll = new Poll({
    title: req.body.title,
    choices: req.body.choices.map(function(name) {
        return {name: name, votes: 0}
      }, {}),
    creator: "wowsers",
    voted: []
  });

  console.log("*** new poll");
  console.log(newPoll);

  Poll.createPoll(newPoll, function(err, poll) { // wowsers
    if (err) throw err;
    console.log(poll);
  });

  req.flash("success_msg", "Poll succesfully made")
  res.redirect("/");

}); // post poll/new

module.exports = router;
