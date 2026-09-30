const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Global search across Events, Clubs, Announcements, Venues
router.get('/', (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length === 0) {
      return res.json({ events: [], clubs: [], announcements: [], venues: [] });
    }

    const term = `%${q.trim()}%`;

    const events = db.prepare(`
      SELECT id, title, slug, category, event_date, banner, entry_fee
      FROM events
      WHERE status = 'published' AND (title LIKE ? OR description LIKE ? OR category LIKE ?)
      ORDER BY event_date ASC
      LIMIT 6
    `).all(term, term, term);

    const clubs = db.prepare(`
      SELECT id, name, slug, category, logo, members_count
      FROM clubs
      WHERE name LIKE ? OR description LIKE ? OR category LIKE ?
      LIMIT 6
    `).all(term, term, term);

    const announcements = db.prepare(`
      SELECT id, title, priority, category, created_at
      FROM announcements
      WHERE title LIKE ? OR content LIKE ?
      LIMIT 5
    `).all(term, term);

    const venues = db.prepare(`
      SELECT id, name, code, location, capacity, image
      FROM venues
      WHERE name LIKE ? OR location LIKE ? OR description LIKE ?
      LIMIT 4
    `).all(term, term, term);

    return res.json({
      query: q,
      total_results: events.length + clubs.length + announcements.length + venues.length,
      events,
      clubs,
      announcements,
      venues
    });
  } catch (err) {
    console.error('Search error:', err);
    return res.status(500).json({ error: 'Search failed.' });
  }
});

module.exports = router;
