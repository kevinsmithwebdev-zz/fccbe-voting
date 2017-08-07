var mongoose = require("mongoose");

var PollSchema = mongoose.Schema({
  title: {
    type: String,
    index: true
  },
  creator: String,
  choices: [{ name: String, votes: Number }],
  voted: [String]
});

var User = module.exports = mongoose.model('Poll', PollSchema);

module.exports.createPoll = function(newPoll, callback) {
  newPoll.save(callback);
}
