const mongoose = require('mongoose');

const point = mongoose.Schema({
  guild: String,
  user: String,
  point: Number
});

module.exports = mongoose.model('pointDatabase', point);