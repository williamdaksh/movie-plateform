const express = require('express');
const WatchHistory = require('../models/watchHistory.model');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// GET /api/history — sab history lo
router.get('/', protect, async (req, res) => {
  try {
    const history = await WatchHistory.find({ userId: req.user._id })
      .sort({ createdAt: -1 }) // latest pehle
      .limit(20); // sirf 20 dikhao
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'History load nahi hui!' });
  }
});

// POST /api/history — movie add karo
router.post('/', protect, async (req, res) => {
  try {
    const { movieId, title, poster, mediaType, rating } = req.body;

    // Agar pehle se hai toh delete karo — duplicate nahi chahiye
    await WatchHistory.findOneAndDelete({
      userId: req.user._id,
      movieId,
    });

    // Naya entry add karo
    const history = await WatchHistory.create({
      userId: req.user._id,
      movieId,
      title,
      poster,
      mediaType,
      rating,
    });

    res.status(201).json(history);
  } catch (error) {
    res.status(500).json({ message: 'History add nahi hui!' });
  }
});

// DELETE /api/history/:movieId — ek entry hatao
router.delete('/:movieId', protect, async (req, res) => {
  try {
    await WatchHistory.findOneAndDelete({
      userId: req.user._id,
      movieId: req.params.movieId,
    });
    res.json({ message: 'History remove ho gayi!' });
  } catch (error) {
    res.status(500).json({ message: 'History remove nahi hui!' });
  }
});

// DELETE /api/history — poori history clear karo
router.delete('/', protect, async (req, res) => {
  try {
    await WatchHistory.deleteMany({ userId: req.user._id });
    res.json({ message: 'Poori history clear ho gayi!' });
  } catch (error) {
    res.status(500).json({ message: 'History clear nahi hui!' });
  }
});

module.exports = router;