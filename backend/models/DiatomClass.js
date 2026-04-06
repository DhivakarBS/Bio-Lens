const mongoose = require('mongoose');

const diatomClassSchema = new mongoose.Schema({
  name: { type: String, required: true },
  scientificDescription: { type: String, required: true },
  environmentalSignificance: { type: String, required: true },
  impacts: { type: String, required: true },
});

module.exports = mongoose.model('DiatomClass', diatomClassSchema);
