const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { requireAuth, requireRole } = require('../middleware/auth');

// Get all announcements
router.get('/', (req, res) => {
  try {
    const { priority, category, search } = req.query;

    let query = `
      SELECT a.*, e.title as event_title, e.slug as event_slug, c.name as club_name, c.logo as club_logo
      FROM announcements a
      LEFT JOIN events e ON a.event_id = e.id
      LEFT JOIN clubs c ON a.club_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (priority && priority !== 'all') {
      query += ` AND a.priority = ?`;
      params.push(priority);
    }

    if (category && category !== 'All') {
      query += ` AND a.category = ?`;
      params.push(category);
    }

    if (search) {
      query += ` AND (a.title LIKE ? OR a.content LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term);
    }

    query += ` ORDER BY CASE a.priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END, a.created_at DESC`;
    const list = db.prepare(query).all(...params);

    return res.json({ announcements: list });
  } catch (err) {
    console.error('Announcements error:', err);
    return res.status(500).json({ error: 'Failed to fetch announcements.' });
  }
});

// Create announcement (Organizer or Admin)
router.post('/', requireAuth, requireRole(['organizer', 'admin']), (req, res) => {
  try {
    const { title, content, event_id, club_id, priority = 'normal', category = 'General' } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required.' });
    }

    const result = db.prepare(`
      INSERT INTO announcements (title, content, event_id, club_id, priority, category)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(title, content, event_id || null, club_id || null, priority, category);

    const created = db.prepare('SELECT * FROM announcements WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json({ message: 'Announcement published successfully!', announcement: created });
  } catch (err) {
    console.error('Create announcement error:', err);
    return res.status(500).json({ error: 'Failed to create announcement.' });
  }
});

// Delete announcement
router.delete('/:id', requireAuth, requireRole(['organizer', 'admin']), (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM announcements WHERE id = ?').run(id);
    return res.json({ message: 'Announcement removed.' });
  } catch (err) {
    console.error('Delete announcement error:', err);
    return res.status(500).json({ error: 'Failed to delete announcement.' });
  }
});

module.exports = router;
