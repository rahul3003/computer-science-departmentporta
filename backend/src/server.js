const path = require('path');
// Load .env before other modules
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "http://54.172.233.144:3000",
  credentials: true
}));
app.use(express.json());

// Import routes
const facultyRoutes = require('./routes/facultyRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const feedRoutes = require('./routes/feedRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

// Mount routes
app.use('/api/faculty', facultyRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/attendance', attendanceRoutes);


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`🚀 Backend server is running in dev mode on http://localhost:${PORT}`);
});

module.exports = app;
