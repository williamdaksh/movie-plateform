const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
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

const favoriteModel = mongoose.model('Favorite', favoriteSchema);

module.exports = favoriteModel;