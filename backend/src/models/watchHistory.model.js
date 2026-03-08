const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  movieId: {
    type: String,
    required: true,
  },
  title: String,
  poster: String,
  mediaType: {
    type: String,
    enum: ['movie', 'tv'],
    default: 'movie',
  },
  rating: Number,
}, { timestamps: true });

module.exports = mongoose.model('WatchHistory', watchHistorySchema);