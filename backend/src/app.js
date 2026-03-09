const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const favoriteRoutes = require('./routes/favorites.routes');
const watchHistoryRoutes = require('./routes/watchHistory.routes');

const app = express();

app.use(cors({
  origin: 'https://movie-plateform.vercel.app',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/history', watchHistoryRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Server chal raha hai! ' });
});

module.exports = app;