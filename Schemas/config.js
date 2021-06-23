const mongoose = require('mongoose');

const config = mongoose.Schema({
  guild: String,
  user: String,
  word: String,
  letter: String
});

module.exports = mongoose.model('lastDatabase', config);