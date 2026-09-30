const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { requireAuth, optionalAuth, requireRole } = require('../middleware/auth');

// Get all categories with event counts
router.get('/categories', (req, res) => {
  try {
    const categories = [
      'Technical', 'Cultural', 'Sports', 'Arts', 'Music', 'Dance',
      'Literary', 'Entrepreneurship', 'Workshops', 'Seminars', 'Competitions', 'Social Events'
    ];

    const counts = db.prepare(`
      SELECT category, COUNT(*) as count
      FROM events
      WHERE status = 'published'
      GROUP BY category
    `).all();

    const countMap = {};
    counts.forEach(c => { countMap[c.category] = c.count; });

    const result = categories.map(cat => ({
      name: cat,
      count: countMap[cat] || 0
    }));

    return res.json({ categories: result });
  } catch (err) {
    console.error('Categories error:', err);
    return res.status(500).json({ error: 'Failed to fetch categories.' });
  }
});

// Get featured events
router.get('/featured', (req, res) => {
  try {
    const featured = db.prepare(`
      SELECT e.*, c.name as club_name, c.logo as club_logo, v.name as venue_name, v.location as venue_location,
        (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id AND r.status != 'cancelled') as registration_count
      FROM events e
      LEFT JOIN clubs c ON e.club_id = c.id
      LEFT JOIN venues v ON e.venue_id = v.id
      WHERE e.status = 'published' AND e.is_featured = 1
      ORDER BY e.event_date ASC
      LIMIT 6
    `).all();
    return res.json({ events: featured });
  } catch (err) {
    console.error('Featured events error:', err);
    return res.status(500).json({ error: 'Failed to fetch featured events.' });
  }
});

// Get events list with filters, search, sorting
router.get('/', optionalAuth, (req, res) => {
  try {
    const { category, search, timeframe, club_id, venue_id, sort, status = 'published' } = req.query;

    let query = `
      SELECT e.*, c.name as club_name, c.logo as club_logo, c.slug as club_slug,
             v.name as venue_name, v.location as venue_location,
             (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id AND r.status != 'cancelled') as registration_count
      FROM events e
      LEFT JOIN clubs c ON e.club_id = c.id
      LEFT JOIN venues v ON e.venue_id = v.id
      WHERE 1=1
    `;
    const params = [];

    // Filter by status (unless admin viewing all)
    if (status && status !== 'all') {
      query += ` AND e.status = ?`;
      params.push(status);
    }

    if (category && category !== 'All') {
      query += ` AND e.category = ?`;
      params.push(category);
    }

    if (club_id) {
      query += ` AND e.club_id = ?`;
      params.push(club_id);
    }

    if (venue_id) {
      query += ` AND e.venue_id = ?`;
      params.push(venue_id);
    }

    if (search) {
      query += ` AND (e.title LIKE ? OR e.description LIKE ? OR c.name LIKE ? OR e.category LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    // Timeframe filters
    const today = new Date().toISOString().split('T')[0];
    if (timeframe === 'today') {
      query += ` AND e.event_date = ?`;
      params.push(today);
    } else if (timeframe === 'this-week') {
      // 7 days window
      query += ` AND date(e.event_date) >= date(?) AND date(e.event_date) <= date(?, '+7 days')`;
      params.push(today, today);
    } else if (timeframe === 'this-month') {
      // 30 days window
      query += ` AND date(e.event_date) >= date(?) AND date(e.event_date) <= date(?, '+30 days')`;
      params.push(today, today);
    }

    // Sorting
    if (sort === 'popularity') {
      query += ` ORDER BY registration_count DESC, e.event_date ASC`;
    } else if (sort === 'deadline') {
      query += ` ORDER BY e.registration_deadline ASC`;
    } else if (sort === 'category') {
      query += ` ORDER BY e.category ASC, e.event_date ASC`;
    } else {
      // default: soonest date first
      query += ` ORDER BY e.event_date ASC, e.start_time ASC`;
    }

    const events = db.prepare(query).all(...params);

    // If user is authenticated, check which events are saved or registered
    if (req.user) {
      const userRegs = db.prepare('SELECT event_id, status FROM registrations WHERE user_id = ?').all(req.user.id);
      const userSaves = db.prepare('SELECT event_id FROM saved_events WHERE user_id = ?').all(req.user.id);

      const regMap = {};
      userRegs.forEach(r => { regMap[r.event_id] = r.status; });
      const saveSet = new Set(userSaves.map(s => s.event_id));

      events.forEach(e => {
        e.user_registered = regMap[e.id] || null;
        e.user_saved = saveSet.has(e.id);
      });
    }

    return res.json({ events, count: events.length });
  } catch (err) {
    console.error('Events list error:', err);
    return res.status(500).json({ error: 'Failed to fetch events.' });
  }
});

// Get single event by slug or ID
router.get('/:slugOrId', optionalAuth, (req, res) => {
  try {
    const { slugOrId } = req.params;
    let event = null;

    if (!isNaN(slugOrId)) {
      event = db.prepare(`
        SELECT e.*, c.name as club_name, c.logo as club_logo, c.slug as club_slug, c.contact_email as club_email,
               v.name as venue_name, v.code as venue_code, v.location as venue_location, v.capacity as venue_capacity, v.map_x, v.map_y,
               u.name as organizer_name, u.email as organizer_email, u.phone as organizer_phone,
               (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id AND r.status != 'cancelled') as registration_count
        FROM events e
        LEFT JOIN clubs c ON e.club_id = c.id
        LEFT JOIN venues v ON e.venue_id = v.id
        LEFT JOIN users u ON e.organizer_id = u.id
        WHERE e.id = ?
      `).get(slugOrId);
    } else {
      event = db.prepare(`
        SELECT e.*, c.name as club_name, c.logo as club_logo, c.slug as club_slug, c.contact_email as club_email,
               v.name as venue_name, v.code as venue_code, v.location as venue_location, v.capacity as venue_capacity, v.map_x, v.map_y,
               u.name as organizer_name, u.email as organizer_email, u.phone as organizer_phone,
               (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id AND r.status != 'cancelled') as registration_count
        FROM events e
        LEFT JOIN clubs c ON e.club_id = c.id
        LEFT JOIN venues v ON e.venue_id = v.id
        LEFT JOIN users u ON e.organizer_id = u.id
        WHERE e.slug = ?
      `).get(slugOrId);
    }

    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    // Parse JSON fields
    try { event.rules = JSON.parse(event.rules || '[]'); } catch (e) { event.rules = []; }
    try { event.schedule = JSON.parse(event.schedule || '[]'); } catch (e) { event.schedule = []; }
    try { event.faqs = JSON.parse(event.faqs || '[]'); } catch (e) { event.faqs = []; }
    try { event.contact_info = JSON.parse(event.contact_info || '{}'); } catch (e) { event.contact_info = {}; }

    // User context
    if (req.user) {
      const reg = db.prepare('SELECT * FROM registrations WHERE user_id = ? AND event_id = ?').get(req.user.id, event.id);
      event.user_registration = reg || null;
      const saved = db.prepare('SELECT id FROM saved_events WHERE user_id = ? AND event_id = ?').get(req.user.id, event.id);
      event.user_saved = !!saved;
    }

    return res.json({ event });
  } catch (err) {
    console.error('Single event error:', err);
    return res.status(500).json({ error: 'Failed to fetch event details.' });
  }
});

// Create event (Organizer or Admin)
router.post('/', requireAuth, requireRole(['organizer', 'admin']), (req, res) => {
  try {
    const {
      title, description, category, club_id, banner, event_date, start_time, end_time,
      venue_id, registration_deadline, max_participants, entry_fee, prize_pool,
      eligibility, team_size, rules, schedule, faqs, contact_info, status = 'published', is_featured = 0
    } = req.body;

    if (!title || !description || !category || !event_date || !start_time || !end_time || !venue_id) {
      return res.status(400).json({ error: 'Missing required event fields.' });
    }

    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let slug = baseSlug;
    let counter = 1;
    while (db.prepare('SELECT id FROM events WHERE slug = ?').get(slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    const result = db.prepare(`
      INSERT INTO events (
        title, slug, description, category, club_id, organizer_id, banner, event_date,
        start_time, end_time, venue_id, registration_deadline, max_participants, entry_fee,
        prize_pool, eligibility, team_size, rules, schedule, faqs, contact_info, status, is_featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title,
      slug,
      description,
      category,
      club_id || null,
      req.user.id,
      banner || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&auto=format&fit=crop&q=80',
      event_date,
      start_time,
      end_time,
      venue_id,
      registration_deadline || `${event_date} 23:59:00`,
      max_participants || 100,
      entry_fee || 'Free',
      prize_pool || null,
      eligibility || 'Open to all college students',
      team_size || 'Individual (1)',
      typeof rules === 'string' ? rules : JSON.stringify(rules || []),
      typeof schedule === 'string' ? schedule : JSON.stringify(schedule || []),
      typeof faqs === 'string' ? faqs : JSON.stringify(faqs || []),
      typeof contact_info === 'string' ? contact_info : JSON.stringify(contact_info || {}),
      status,
      is_featured ? 1 : 0
    );

    const created = db.prepare('SELECT * FROM events WHERE id = ?').get(result.lastInsertRowid);

    // Create an announcement automatically if published
    if (status === 'published') {
      db.prepare(`
        INSERT INTO announcements (title, content, event_id, club_id, priority, category)
        VALUES (?, ?, ?, ?, 'medium', ?)
      `).run(
        `Registrations Open: ${title}`,
        `Registrations are now open for ${title}. Discover rules, prizes, and register on the portal!`,
        created.id,
        club_id || null,
        category
      );
    }

    return res.status(201).json({ message: 'Event created successfully!', event: created });
  } catch (err) {
    console.error('Create event error:', err);
    return res.status(500).json({ error: 'Failed to create event.' });
  }
});

// Update event
router.put('/:id', requireAuth, requireRole(['organizer', 'admin']), (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    if (req.user.role !== 'admin' && existing.organizer_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to edit this event.' });
    }

    const {
      title, description, category, club_id, banner, event_date, start_time, end_time,
      venue_id, registration_deadline, max_participants, entry_fee, prize_pool,
      eligibility, team_size, rules, schedule, faqs, contact_info, status, is_featured
    } = req.body;

    db.prepare(`
      UPDATE events
      SET title = COALESCE(?, title),
          description = COALESCE(?, description),
          category = COALESCE(?, category),
          club_id = COALESCE(?, club_id),
          banner = COALESCE(?, banner),
          event_date = COALESCE(?, event_date),
          start_time = COALESCE(?, start_time),
          end_time = COALESCE(?, end_time),
          venue_id = COALESCE(?, venue_id),
          registration_deadline = COALESCE(?, registration_deadline),
          max_participants = COALESCE(?, max_participants),
          entry_fee = COALESCE(?, entry_fee),
          prize_pool = COALESCE(?, prize_pool),
          eligibility = COALESCE(?, eligibility),
          team_size = COALESCE(?, team_size),
          rules = COALESCE(?, rules),
          schedule = COALESCE(?, schedule),
          faqs = COALESCE(?, faqs),
          contact_info = COALESCE(?, contact_info),
          status = COALESCE(?, status),
          is_featured = COALESCE(?, is_featured)
      WHERE id = ?
    `).run(
      title,
      description,
      category,
      club_id,
      banner,
      event_date,
      start_time,
      end_time,
      venue_id,
      registration_deadline,
      max_participants,
      entry_fee,
      prize_pool,
      eligibility,
      team_size,
      typeof rules === 'object' ? JSON.stringify(rules) : rules,
      typeof schedule === 'object' ? JSON.stringify(schedule) : schedule,
      typeof faqs === 'object' ? JSON.stringify(faqs) : faqs,
      typeof contact_info === 'object' ? JSON.stringify(contact_info) : contact_info,
      status,
      is_featured !== undefined ? (is_featured ? 1 : 0) : null,
      id
    );

    const updated = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
    return res.json({ message: 'Event updated successfully!', event: updated });
  } catch (err) {
    console.error('Update event error:', err);
    return res.status(500).json({ error: 'Failed to update event.' });
  }
});

// Delete event
router.delete('/:id', requireAuth, requireRole(['organizer', 'admin']), (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    if (req.user.role !== 'admin' && existing.organizer_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to delete this event.' });
    }

    db.prepare('DELETE FROM events WHERE id = ?').run(id);
    return res.json({ message: 'Event deleted successfully.' });
  } catch (err) {
    console.error('Delete event error:', err);
    return res.status(500).json({ error: 'Failed to delete event.' });
  }
});

// Bookmark / Save event
router.post('/:id/save', requireAuth, (req, res) => {
  try {
    const eventId = req.params.id;
    const existing = db.prepare('SELECT id FROM saved_events WHERE user_id = ? AND event_id = ?').get(req.user.id, eventId);
    if (existing) {
      db.prepare('DELETE FROM saved_events WHERE id = ?').run(existing.id);
      return res.json({ saved: false, message: 'Event removed from bookmarks.' });
    } else {
      db.prepare('INSERT INTO saved_events (user_id, event_id) VALUES (?, ?)').run(req.user.id, eventId);
      return res.json({ saved: true, message: 'Event saved to your bookmarks!' });
    }
  } catch (err) {
    console.error('Save event error:', err);
    return res.status(500).json({ error: 'Failed to update bookmark.' });
  }
});

module.exports = router;
