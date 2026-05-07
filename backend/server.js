require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const listingRoutes = require('./routes/listingRoutes');

const app = express();

// Connect to Database
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {
  family: 4 // Force IPv4
})
  .then(() => console.log('MongoDB Connected directly in server.js (IPv4)'))
  .catch(err => console.error('Direct MongoDB Connection Error:', err));

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);

// Health Check / Root Route
app.get('/', (req, res) => {
  res.json({ message: 'BhubaneswarStay API is running...' });
});

const PORT = process.env.PORT || 5000;

// Only start the server if not running on Vercel (serverless)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;

