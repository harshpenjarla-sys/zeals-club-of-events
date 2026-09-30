const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const db = require('../database/db');
const { requireAuth, requireRole } = require('../middleware/auth');

// Generate unique registration ID: ZCOE-26-XXXXXX
function generateRegistrationId() {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `ZCOE-26-${randomNum}`;
}

// Register for an event
router.post('/', requireAuth, async (req, res) => {
  try {
    const { event_id, team_name, team_members, custom_fields, phone, department, year } = req.body;

    if (!event_id) {
      return res.status(400).json({ error: 'Event ID is required.' });
    }

    // Verify event exists and is open
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(event_id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    if (event.status !== 'published') {
      return res.status(400).json({ error: 'This event is not open for registration.' });
    }

    // Check if user is already registered
    const existing = db.prepare('SELECT id, registration_id, status FROM registrations WHERE user_id = ? AND event_id = ?').get(req.user.id, event_id);
    if (existing && existing.status !== 'cancelled') {
      return res.status(400).json({
        error: 'You are already registered for this event.',
        registration_id: existing.registration_id
      });
    }

    // Check max participants capacity
    const currentRegs = db.prepare(`
      SELECT COUNT(*) as count FROM registrations WHERE event_id = ? AND status != 'cancelled'
    `).get(event_id);

    if (event.max_participants && currentRegs.count >= event.max_participants) {
      return res.status(400).json({ error: 'Registration is full for this event.' });
    }

    // Update user contact/academic info if provided
    if (phone || department || year) {
      db.prepare(`
        UPDATE users
        SET phone = COALESCE(?, phone),
            department = COALESCE(?, department),
            year = COALESCE(?, year)
        WHERE id = ?
      `).run(phone, department, year, req.user.id);
    }

    let registrationId = generateRegistrationId();
    while (db.prepare('SELECT id FROM registrations WHERE registration_id = ?').get(registrationId)) {
      registrationId = generateRegistrationId();
    }

    // Generate QR code data URL
    const qrPayload = JSON.stringify({
      regId: registrationId,
      userId: req.user.id,
      eventId: event.id,
      name: req.user.name,
      studentId: req.user.student_id,
      event: event.title
    });
    const qrDataUrl = await QRCode.toDataURL(qrPayload, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 320,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    const parsedTeamMembers = typeof team_members === 'string' ? team_members : JSON.stringify(team_members || []);
    const parsedCustom = typeof custom_fields === 'string' ? custom_fields : JSON.stringify(custom_fields || {});

    // If previously cancelled, update; else insert
    if (existing && existing.status === 'cancelled') {
      db.prepare(`
        UPDATE registrations
        SET registration_id = ?,
            team_name = ?,
            team_members = ?,
            custom_fields = ?,
            status = 'registered',
            registered_at = CURRENT_TIMESTAMP,
            qr_code = ?
        WHERE id = ?
      `).run(registrationId, team_name || null, parsedTeamMembers, parsedCustom, qrDataUrl, existing.id);
    } else {
      db.prepare(`
        INSERT INTO registrations (registration_id, user_id, event_id, team_name, team_members, custom_fields, status, qr_code)
        VALUES (?, ?, ?, ?, ?, ?, 'registered', ?)
      `).run(registrationId, req.user.id, event.id, team_name || null, parsedTeamMembers, parsedCustom, qrDataUrl);
    }

    // Create confirmation in-app notification
    db.prepare(`
      INSERT INTO notifications (user_id, title, message, type, link)
      VALUES (?, ?, ?, 'success', '/dashboard')
    `).run(
      req.user.id,
      `Registration Confirmed: ${event.title}`,
      `Your registration pass #${registrationId} is confirmed. Show the QR pass at ${event.venue_id ? 'the venue' : 'the entrance'} on event day.`
    );

    const fullRegistration = db.prepare(`
      SELECT r.*, e.title as event_title, e.event_date, e.start_time, e.end_time, e.banner,
             v.name as venue_name, v.location as venue_location,
             u.name as student_name, u.email as student_email, u.student_id, u.department, u.year, u.college
      FROM registrations r
      JOIN events e ON r.event_id = e.id
      LEFT JOIN venues v ON e.venue_id = v.id
      JOIN users u ON r.user_id = u.id
      WHERE r.registration_id = ?
    `).get(registrationId);

    return res.status(201).json({
      message: 'Registration successful! Registration pass generated.',
      registration: fullRegistration
    });
  } catch (err) {
    console.error('Registration create error:', err);
    return res.status(500).json({ error: 'Failed to process event registration.' });
  }
});

// Get user's own registrations
router.get('/my', requireAuth, (req, res) => {
  try {
    const list = db.prepare(`
      SELECT r.*, e.title as event_title, e.slug as event_slug, e.event_date, e.start_time, e.end_time, e.banner, e.category,
             c.name as club_name, c.logo as club_logo,
             v.name as venue_name, v.location as venue_location,
             (SELECT a.check_in_time FROM attendance a WHERE a.registration_id = r.registration_id LIMIT 1) as check_in_time,
             (SELECT cert.certificate_id FROM certificates cert WHERE cert.user_id = r.user_id AND cert.event_id = r.event_id LIMIT 1) as certificate_id
      FROM registrations r
      JOIN events e ON r.event_id = e.id
      LEFT JOIN clubs c ON e.club_id = c.id
      LEFT JOIN venues v ON e.venue_id = v.id
      WHERE r.user_id = ?
      ORDER BY r.registered_at DESC
    `).all(req.user.id);

    return res.json({ registrations: list });
  } catch (err) {
    console.error('My registrations error:', err);
    return res.status(500).json({ error: 'Failed to fetch registrations.' });
  }
});

// Get single registration pass details by registration_id
router.get('/:registrationId', requireAuth, (req, res) => {
  try {
    const { registrationId } = req.params;
    const reg = db.prepare(`
      SELECT r.*, e.title as event_title, e.slug as event_slug, e.event_date, e.start_time, e.end_time, e.banner, e.category, e.rules,
             c.name as club_name, c.logo as club_logo,
             v.name as venue_name, v.location as venue_location,
             u.name as student_name, u.email as student_email, u.phone as student_phone, u.student_id, u.department, u.year, u.college
      FROM registrations r
      JOIN events e ON r.event_id = e.id
      LEFT JOIN clubs c ON e.club_id = c.id
      LEFT JOIN venues v ON e.venue_id = v.id
      JOIN users u ON r.user_id = u.id
      WHERE r.registration_id = ?
    `).get(registrationId);

    if (!reg) {
      return res.status(404).json({ error: 'Registration not found.' });
    }

    // Check ownership or admin/organizer
    if (req.user.role === 'student' && reg.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to view this registration pass.' });
    }

    try { reg.team_members = JSON.parse(reg.team_members || '[]'); } catch (e) { reg.team_members = []; }
    try { reg.custom_fields = JSON.parse(reg.custom_fields || '{}'); } catch (e) { reg.custom_fields = {}; }

    return res.json({ registration: reg });
  } catch (err) {
    console.error('Get registration error:', err);
    return res.status(500).json({ error: 'Failed to fetch registration pass.' });
  }
});

// Cancel registration
router.post('/:registrationId/cancel', requireAuth, (req, res) => {
  try {
    const { registrationId } = req.params;
    const reg = db.prepare('SELECT * FROM registrations WHERE registration_id = ?').get(registrationId);
    if (!reg) {
      return res.status(404).json({ error: 'Registration not found.' });
    }

    if (req.user.role === 'student' && reg.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to cancel this registration.' });
    }

    db.prepare(`
      UPDATE registrations
      SET status = 'cancelled'
      WHERE registration_id = ?
    `).run(registrationId);

    // Also remove from attendance if present
    db.prepare('DELETE FROM attendance WHERE registration_id = ?').run(registrationId);

    return res.json({ message: 'Registration has been cancelled.' });
  } catch (err) {
    console.error('Cancel registration error:', err);
    return res.status(500).json({ error: 'Failed to cancel registration.' });
  }
});

// Get participants for a specific event (Organizers & Admins)
router.get('/event/:eventId', requireAuth, requireRole(['organizer', 'admin']), (req, res) => {
  try {
    const { eventId } = req.params;
    const { search, status } = req.query;

    let query = `
      SELECT r.*, u.name as student_name, u.email as student_email, u.phone as student_phone,
             u.student_id, u.department, u.year, u.college,
             a.check_in_time,
             (SELECT c.certificate_id FROM certificates c WHERE c.user_id = r.user_id AND c.event_id = r.event_id LIMIT 1) as certificate_id
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      LEFT JOIN attendance a ON r.registration_id = a.registration_id
      WHERE r.event_id = ?
    `;
    const params = [eventId];

    if (status && status !== 'all') {
      query += ` AND r.status = ?`;
      params.push(status);
    }

    if (search) {
      query += ` AND (u.name LIKE ? OR u.email LIKE ? OR u.student_id LIKE ? OR r.registration_id LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    query += ` ORDER BY r.registered_at DESC`;
    const participants = db.prepare(query).all(...params);

    return res.json({ participants, count: participants.length });
  } catch (err) {
    console.error('Event participants error:', err);
    return res.status(500).json({ error: 'Failed to fetch event participants.' });
  }
});

// Update participant registration status (approve/reject/attended)
router.put('/:registrationId/status', requireAuth, requireRole(['organizer', 'admin']), (req, res) => {
  try {
    const { registrationId } = req.params;
    const { status } = req.body;

    if (!['registered', 'checked_in', 'attended', 'cancelled', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }

    db.prepare('UPDATE registrations SET status = ? WHERE registration_id = ?').run(status, registrationId);
    return res.json({ message: `Registration status updated to ${status}.` });
  } catch (err) {
    console.error('Update status error:', err);
    return res.status(500).json({ error: 'Failed to update participant status.' });
  }
});

module.exports = router;
