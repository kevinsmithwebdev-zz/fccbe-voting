var express = require('express');

var router = express.Router();

var Poll = require('../models/poll');

// poll

router.post('/poll', function(req, res) {

    console.log("poll post");
    console.log(req.title);


}); // post poll

module.exports = router;
