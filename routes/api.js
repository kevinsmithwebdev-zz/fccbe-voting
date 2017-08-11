var express = require('express');
var router = express.Router();
// /:username/:pollname'
var Poll = require('../models/poll');

router.get('/', function(req, res) {
  console.log("in api/polls")
  console.log(req.query.creator);
  Poll.getPoll(req.query.creator, req.query.poll, function(err, poll) {
    if (err) {
      console.log("Error finding poll - /polls/" + req.params.username + "/" + req.params.pollname);
      console.log(err);
    } else {
      console.log("got poll for api call...");
      console.log(poll);
      res.json(poll);
    }
  });
});

module.exports = router;
