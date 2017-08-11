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

var Poll  = module.exports = mongoose.model('Poll', PollSchema);

module.exports.createPoll = function(newPoll, callback) {
  newPoll.save(callback);
}

module.exports.getPoll = function(username, pollname, callback) {
  var query = {creator: username, title: pollname};
  Poll.findOne(query, callback);
}

module.exports.getUserPolls = function(username, callback) {
  Poll.find({creator: username}, callback);
}

module.exports.removePollById = function(id, callback) {
  Poll.findByIdAndRemove(id, callback);
}
