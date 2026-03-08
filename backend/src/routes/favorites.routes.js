const express = require('express');
const Favorite = require('../models/favorite.model');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// GET /api/favorites — sab favorites lo
router.get('/', protect, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: 'Favorites load nahi hue!' });
  }
});

// POST /api/favorites — favorite add karo
router.post('/', protect, async (req, res) => {
  try {
    const { movieId, title, poster, mediaType, rating } = req.body;

    const exists = await Favorite.findOne({
      userId: req.user._id,
      movieId,
    });

    if (exists) {
      return res.status(400).json({ message: 'Pehle se favorite hai!' });
    }

    const favorite = await Favorite.create({
      userId: req.user._id,
      movieId,
      title,
      poster,
      mediaType,
      rating,
    });

    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ message: 'Favorite add nahi hua!' });
  }
});

// DELETE /api/favorites/:movieId — favorite remove karo
router.delete('/:movieId', protect, async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      userId: req.user._id,
      movieId: req.params.movieId,
    });

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite nahi mila!' });
    }

    res.json({ message: 'Favorite remove ho gaya! ❌' });
  } catch (error) {
    res.status(500).json({ message: 'Favorite remove nahi hua!' });
  }
});

// GET /api/favorites/check/:movieId — favorite hai ya nahi check karo
router.get('/check/:movieId', protect, async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      userId: req.user._id,
      movieId: req.params.movieId,
    });

    res.json({ isFavorite: !!favorite });
  } catch (error) {
    res.status(500).json({ message: 'Check nahi hua!' });
  }
});

module.exports = router;
