const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { requireAuth, requireRole } = require('../middleware/auth');

// Get gallery items
router.get('/', (req, res) => {
  try {
    const { category, club_id, event_id } = req.query;

    let query = `
      SELECT g.*, e.title as event_title, c.name as club_name
      FROM gallery g
      LEFT JOIN events e ON g.event_id = e.id
      LEFT JOIN clubs c ON g.club_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (category && category !== 'All') {
      query += ` AND g.category = ?`;
      params.push(category);
    }

    if (club_id) {
      query += ` AND g.club_id = ?`;
      params.push(club_id);
    }

    if (event_id) {
      query += ` AND g.event_id = ?`;
      params.push(event_id);
    }

    query += ` ORDER BY g.created_at DESC`;
    const photos = db.prepare(query).all(...params);

    return res.json({ gallery: photos });
  } catch (err) {
    console.error('Gallery error:', err);
    return res.status(500).json({ error: 'Failed to fetch gallery.' });
  }
});

// Add photo to gallery (Organizer or Admin)
router.post('/', requireAuth, requireRole(['organizer', 'admin']), (req, res) => {
  try {
    const { image, caption, category = 'General', photographer, event_id, club_id } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Image URL is required.' });
    }

    const result = db.prepare(`
      INSERT INTO gallery (image, caption, category, photographer, event_id, club_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      image,
      caption || '',
      category,
      photographer || req.user.name,
      event_id || null,
      club_id || null
    );

    const created = db.prepare('SELECT * FROM gallery WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json({ message: 'Photo added to gallery!', item: created });
  } catch (err) {
    console.error('Add gallery error:', err);
    return res.status(500).json({ error: 'Failed to add photo.' });
  }
});

// Delete photo
router.delete('/:id', requireAuth, requireRole(['organizer', 'admin']), (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM gallery WHERE id = ?').run(id);
    return res.json({ message: 'Photo deleted from gallery.' });
  } catch (err) {
    console.error('Delete gallery error:', err);
    return res.status(500).json({ error: 'Failed to delete photo.' });
  }
});

module.exports = router;
