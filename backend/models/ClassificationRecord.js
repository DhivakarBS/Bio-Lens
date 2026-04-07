const mongoose = require('mongoose');

const classificationRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },
  predictedClass: { type: String, required: true },
  confidence: { type: Number, required: true }, // overall confidence
  wqi: { type: Number, default: 0 }, // water quality index
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ClassificationRecord', classificationRecordSchema);
