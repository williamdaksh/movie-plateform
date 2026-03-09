const express = require('express');
const WatchHistory = require('../models/watchHistory.model');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// GET /api/history
router.get('/', protect, async (req, res) => {
  try {
    const history = await WatchHistory.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'History load nahi hui!' });
  }
});

// POST /api/history — upsert (same movie dobara add karo toh duplicate nahi banega)
router.post('/', protect, async (req, res) => {
  try {
    const { movieId, title, poster, mediaType, rating } = req.body;

    const history = await WatchHistory.findOneAndUpdate(
      { userId: req.user._id, movieId },              // find
      { title, poster, mediaType, rating, createdAt: new Date() }, // update
      { upsert: true, new: true }                     // create if not exists
    );

    res.status(201).json(history);
  } catch (error) {
    res.status(500).json({ message: 'History add nahi hui!' });
  }
});

// DELETE /api/history/:id — single item delete (by _id)
router.delete('/:id', protect, async (req, res) => {
  try {
    await WatchHistory.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    res.json({ message: 'History remove ho gayi!' });
  } catch (error) {
    res.status(500).json({ message: 'History remove nahi hui!' });
  }
});

// DELETE /api/history — poori history clear
router.delete('/', protect, async (req, res) => {
  try {
    await WatchHistory.deleteMany({ userId: req.user._id });
    res.json({ message: 'Poori history clear ho gayi!' });
  } catch (error) {
    res.status(500).json({ message: 'History clear nahi hui!' });
  }
});

module.exports = router;