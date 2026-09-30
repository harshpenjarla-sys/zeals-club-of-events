const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow all during development
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure upload folders exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
['events', 'clubs', 'gallery', 'certificates'].forEach(dir => {
  const p = path.join(uploadsDir, dir);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});
app.use('/uploads', express.static(uploadsDir));

// Route Mounts
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const clubRoutes = require('./routes/clubs');
const registrationRoutes = require('./routes/registrations');
const attendanceRoutes = require('./routes/attendance');
const venueRoutes = require('./routes/venues');
const announcementRoutes = require('./routes/announcements');
const galleryRoutes = require('./routes/gallery');
const certificateRoutes = require('./routes/certificates');
const notificationRoutes = require('./routes/notifications');
const searchRoutes = require('./routes/search');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);

// Root and Health check
app.get(['/', '/api', '/api/health'], (req, res) => {
  res.json({
    status: 'online',
    platform: 'Zeal\'s Club of Events API',
    tagline: 'Create. Connect. Celebrate.',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});


// Global 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found.` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error occurred.' });
});

app.listen(PORT, () => {
  console.log(`🚀 Zeal's Club of Events backend running on http://localhost:${PORT}`);
});
