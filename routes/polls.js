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

    var context = { results: results };

    res.render('polls-show', context);
  });
});

// /:username/:pollname

router.get('/:username/:pollname', function(req, res) {

  Poll.getPoll(req.params.username, req.params.pollname, function(err, poll) {
    if (err) {
      console.log("Error finding poll - /polls/" + req.params.username + "/" + req.params.pollname);
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


function buildPollChart(poll) {

  var html =  "<script>" +
              "var ctx = document.getElementById('myChart').getContext('2d');" +
              "var myChart = new Chart(ctx, {" +
              "type: 'bar'," +
                "data: {" +
                  "labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange']," +
                  "datasets: [{" +
                      "label: '# of Votes'," +
                      "data: [12, 19, 3, 5, 2, 3]," +
                      "backgroundColor: [" +
                        "'rgba(255, 99, 132, 0.2)'," +
                        "'rgba(54, 162, 235, 0.2)'," +
                        "'rgba(255, 206, 86, 0.2)'," +
                        "'rgba(75, 192, 192, 0.2)'," +
                        "'rgba(153, 102, 255, 0.2)'," +
                        "'rgba(255, 159, 64, 0.2)'" +
                      "]," +
                      "borderColor: [" +
                        "'rgba(255,99,132,1)'," +
                        "'rgba(54, 162, 235, 1)'," +
                        "'rgba(255, 206, 86, 1)'," +
                        "'rgba(75, 192, 192, 1)'," +
                        "'rgba(153, 102, 255, 1)'," +
                        "'rgba(255, 159, 64, 1)'" +
                      "]," +
                      "borderWidth: 1" +
                    "}]" +
                  "}," +
                  "options: {" +
                      "scales: {" +
                        "  yAxes: [{" +
                              "ticks: {" +
                                  "beginAtZero:true" +
                              "}" +
                          "}]" +
                      "}" +
                  "}" +
              "});" +
            "</script>";



  return html;
}



module.exports = router;
