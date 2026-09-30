const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { requireAuth, requireRole } = require('../middleware/auth');

// Get all venues
router.get('/', (req, res) => {
  try {
    const venues = db.prepare(`
      SELECT v.*,
             (SELECT COUNT(*) FROM events e WHERE e.venue_id = v.id AND e.status = 'published') as event_count
      FROM venues v
      ORDER BY v.name ASC
    `).all();

    return res.json({ venues });
  } catch (err) {
    console.error('Venues error:', err);
    return res.status(500).json({ error: 'Failed to fetch venues.' });
  }
});

// Get single venue with its events
router.get('/:idOrCode', (req, res) => {
  try {
    const { idOrCode } = req.params;
    let venue = null;

    if (!isNaN(idOrCode)) {
      venue = db.prepare('SELECT * FROM venues WHERE id = ?').get(idOrCode);
    } else {
      venue = db.prepare('SELECT * FROM venues WHERE code = ?').get(idOrCode);
    }

    if (!venue) {
      return res.status(404).json({ error: 'Venue not found.' });
    }

    const today = new Date().toISOString().split('T')[0];
    const scheduledEvents = db.prepare(`
      SELECT e.*, c.name as club_name, c.logo as club_logo,
             (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id AND r.status != 'cancelled') as registration_count
      FROM events e
      LEFT JOIN clubs c ON e.club_id = c.id
      WHERE e.venue_id = ? AND e.status = 'published' AND e.event_date >= ?
      ORDER BY e.event_date ASC, e.start_time ASC
    `).all(venue.id, today);

    return res.json({
      venue: {
        ...venue,
        scheduled_events: scheduledEvents
      }
    });
  } catch (err) {
    console.error('Single venue error:', err);
    return res.status(500).json({ error: 'Failed to fetch venue details.' });
  }
});

// Add venue (Admin only)
router.post('/', requireAuth, requireRole(['admin']), (req, res) => {
  try {
    const { name, code, location, capacity, description, image, map_x, map_y, facilities } = req.body;
    if (!name || !code || !location || !capacity) {
      return res.status(400).json({ error: 'Name, code, location, and capacity are required.' });
    }

    const result = db.prepare(`
      INSERT INTO venues (name, code, location, capacity, description, image, map_x, map_y, facilities)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, code.toUpperCase(), location, capacity, description || '', image || '', map_x || 50, map_y || 50, facilities || '');

    const created = db.prepare('SELECT * FROM venues WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json({ message: 'Venue created successfully!', venue: created });
  } catch (err) {
    console.error('Create venue error:', err);
    return res.status(500).json({ error: 'Failed to create venue.' });
  }
});

// Update venue
router.put('/:id', requireAuth, requireRole(['admin']), (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, capacity, description, image, map_x, map_y, facilities } = req.body;

    db.prepare(`
      UPDATE venues
      SET name = COALESCE(?, name),
          location = COALESCE(?, location),
          capacity = COALESCE(?, capacity),
          description = COALESCE(?, description),
          image = COALESCE(?, image),
          map_x = COALESCE(?, map_x),
          map_y = COALESCE(?, map_y),
          facilities = COALESCE(?, facilities)
      WHERE id = ?
    `).run(name, location, capacity, description, image, map_x, map_y, facilities, id);

    const updated = db.prepare('SELECT * FROM venues WHERE id = ?').get(id);
    return res.json({ message: 'Venue updated successfully!', venue: updated });
  } catch (err) {
    console.error('Update venue error:', err);
    return res.status(500).json({ error: 'Failed to update venue.' });
  }
});

module.exports = router;
