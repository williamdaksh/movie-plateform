const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const favoriteRoutes = require('./routes/favorites.routes');
const watchHistoryRoutes = require('./routes/watchHistory.routes');

const app = express();

const allowedOrigins = [
  'https://cineverse-ten-ruddy.vercel.app',  // ✅ actual URL
  'https://cineverse-omega-one.vercel.app',  // purana URL
  'https://cineverse.vercel.app',            // clean URL agar mile
  'http://localhost:5173',                   // local dev
];

app.use(cors({
  origin: (origin, callback) => {
    // Postman / server-to-server calls allow karo
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/history', watchHistoryRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Server chal raha hai!' });
});

module.exports = app;