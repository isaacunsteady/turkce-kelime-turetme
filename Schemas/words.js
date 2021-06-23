const mongoose = require('mongoose');

const words = mongoose.Schema({
  guild: String,
  words: Array
});

module.exports = mongoose.model('wordsDatabase', words);