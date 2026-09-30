const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { requireAuth, optionalAuth, requireRole } = require('../middleware/auth');

// Get all clubs
router.get('/', optionalAuth, (req, res) => {
  try {
    const { category, search } = req.query;

    let query = `
      SELECT c.*,
             (SELECT COUNT(*) FROM events e WHERE e.club_id = c.id AND e.status = 'published') as live_events_count
      FROM clubs c
      WHERE 1=1
    `;
    const params = [];

    if (category && category !== 'All') {
      query += ` AND c.category = ?`;
      params.push(category);
    }

    if (search) {
      query += ` AND (c.name LIKE ? OR c.description LIKE ? OR c.category LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    query += ` ORDER BY c.members_count DESC, c.name ASC`;
    const clubs = db.prepare(query).all(...params);

    // If user logged in, check follow state
    if (req.user) {
      const userFollows = db.prepare('SELECT club_id FROM club_followers WHERE user_id = ?').all(req.user.id);
      const followSet = new Set(userFollows.map(f => f.club_id));
      clubs.forEach(c => {
        c.is_following = followSet.has(c.id);
      });
    }

    return res.json({ clubs });
  } catch (err) {
    console.error('Clubs list error:', err);
    return res.status(500).json({ error: 'Failed to fetch clubs.' });
  }
});

// Get single club profile
router.get('/:slugOrId', optionalAuth, (req, res) => {
  try {
    const { slugOrId } = req.params;
    let club = null;

    if (!isNaN(slugOrId)) {
      club = db.prepare('SELECT * FROM clubs WHERE id = ?').get(slugOrId);
    } else {
      club = db.prepare('SELECT * FROM clubs WHERE slug = ?').get(slugOrId);
    }

    if (!club) {
      return res.status(404).json({ error: 'Club not found.' });
    }

    try { club.social_links = JSON.parse(club.social_links || '{}'); } catch (e) { club.social_links = {}; }
    try { club.core_team = JSON.parse(club.core_team || '[]'); } catch (e) { club.core_team = []; }

    // Upcoming events for this club
    const today = new Date().toISOString().split('T')[0];
    const upcomingEvents = db.prepare(`
      SELECT e.*, v.name as venue_name, v.location as venue_location,
             (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id AND r.status != 'cancelled') as registration_count
      FROM events e
      LEFT JOIN venues v ON e.venue_id = v.id
      WHERE e.club_id = ? AND e.status = 'published' AND e.event_date >= ?
      ORDER BY e.event_date ASC
    `).all(club.id, today);

    // Past events for this club
    const pastEvents = db.prepare(`
      SELECT e.*, v.name as venue_name, v.location as venue_location
      FROM events e
      LEFT JOIN venues v ON e.venue_id = v.id
      WHERE e.club_id = ? AND e.status = 'published' AND e.event_date < ?
      ORDER BY e.event_date DESC
      LIMIT 6
    `).all(club.id, today);

    // Club gallery photos
    const gallery = db.prepare(`
      SELECT * FROM gallery WHERE club_id = ? ORDER BY created_at DESC LIMIT 8
    `).all(club.id);

    // Follower state
    let isFollowing = false;
    if (req.user) {
      const follow = db.prepare('SELECT id FROM club_followers WHERE user_id = ? AND club_id = ?').get(req.user.id, club.id);
      isFollowing = !!follow;
    }

    return res.json({
      club: {
        ...club,
        is_following: isFollowing,
        upcoming_events: upcomingEvents,
        past_events: pastEvents,
        gallery
      }
    });
  } catch (err) {
    console.error('Single club error:', err);
    return res.status(500).json({ error: 'Failed to fetch club profile.' });
  }
});

// Follow / Unfollow club
router.post('/:id/follow', requireAuth, (req, res) => {
  try {
    const clubId = req.params.id;
    const club = db.prepare('SELECT id, name, members_count FROM clubs WHERE id = ?').get(clubId);
    if (!club) {
      return res.status(404).json({ error: 'Club not found.' });
    }

    const existing = db.prepare('SELECT id FROM club_followers WHERE user_id = ? AND club_id = ?').get(req.user.id, clubId);

    if (existing) {
      db.prepare('DELETE FROM club_followers WHERE id = ?').run(existing.id);
      db.prepare('UPDATE clubs SET members_count = MAX(0, members_count - 1) WHERE id = ?').run(clubId);
      return res.json({ following: false, message: `Unfollowed ${club.name}.` });
    } else {
      db.prepare('INSERT INTO club_followers (user_id, club_id) VALUES (?, ?)').run(req.user.id, clubId);
      db.prepare('UPDATE clubs SET members_count = members_count + 1 WHERE id = ?').run(clubId);
      return res.json({ following: true, message: `You are now following ${club.name}!` });
    }
  } catch (err) {
    console.error('Follow club error:', err);
    return res.status(500).json({ error: 'Failed to update follow state.' });
  }
});

// Create club (Admin only)
router.post('/', requireAuth, requireRole(['admin']), (req, res) => {
  try {
    const { name, description, category, logo, cover_image, mission, contact_email, social_links, core_team } = req.body;
    if (!name || !description || !category) {
      return res.status(400).json({ error: 'Club name, description, and category are required.' });
    }

    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let slug = baseSlug;
    let counter = 1;
    while (db.prepare('SELECT id FROM clubs WHERE slug = ?').get(slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    const result = db.prepare(`
      INSERT INTO clubs (name, slug, description, category, logo, cover_image, mission, contact_email, social_links, core_team)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name,
      slug,
      description,
      category,
      logo || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
      cover_image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1400',
      mission || 'Inspiring student creativity and active campus engagement.',
      contact_email || 'club@zeals.edu',
      typeof social_links === 'string' ? social_links : JSON.stringify(social_links || {}),
      typeof core_team === 'string' ? core_team : JSON.stringify(core_team || [])
    );

    const created = db.prepare('SELECT * FROM clubs WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json({ message: 'Club created successfully!', club: created });
  } catch (err) {
    console.error('Create club error:', err);
    return res.status(500).json({ error: 'Failed to create club.' });
  }
});

// Update club (Admin or Organizer)
router.put('/:id', requireAuth, requireRole(['organizer', 'admin']), (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, logo, cover_image, mission, contact_email, social_links, core_team } = req.body;

    db.prepare(`
      UPDATE clubs
      SET name = COALESCE(?, name),
          description = COALESCE(?, description),
          category = COALESCE(?, category),
          logo = COALESCE(?, logo),
          cover_image = COALESCE(?, cover_image),
          mission = COALESCE(?, mission),
          contact_email = COALESCE(?, contact_email),
          social_links = COALESCE(?, social_links),
          core_team = COALESCE(?, core_team)
      WHERE id = ?
    `).run(
      name,
      description,
      category,
      logo,
      cover_image,
      mission,
      contact_email,
      typeof social_links === 'object' ? JSON.stringify(social_links) : social_links,
      typeof core_team === 'object' ? JSON.stringify(core_team) : core_team,
      id
    );

    const updated = db.prepare('SELECT * FROM clubs WHERE id = ?').get(id);
    return res.json({ message: 'Club profile updated successfully!', club: updated });
  } catch (err) {
    console.error('Update club error:', err);
    return res.status(500).json({ error: 'Failed to update club.' });
  }
});

module.exports = router;
