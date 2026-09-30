const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { requireAuth, requireRole } = require('../middleware/auth');

// QR Code Scanner check-in endpoint
router.post('/scan', requireAuth, requireRole(['organizer', 'admin']), (req, res) => {
  try {
    const { qr_string, event_id } = req.body;
    if (!qr_string) {
      return res.status(400).json({ error: 'QR data string or Registration ID is required.' });
    }

    let regId = qr_string.trim();

    // Parse JSON payload if full QR payload was scanned
    if (qr_string.startsWith('{') && qr_string.endsWith('}')) {
      try {
        const parsed = JSON.parse(qr_string);
        if (parsed.regId) regId = parsed.regId;
      } catch (e) {}
    } else if (qr_string.includes('ZEAL_EVENT_REG:')) {
      // Legacy format: ZEAL_EVENT_REG:ZCOE-26-000184:USER_7:EVENT_1
      const parts = qr_string.split(':');
      if (parts[1]) regId = parts[1];
    }

    // Lookup registration
    const reg = db.prepare(`
      SELECT r.*, u.name as student_name, u.email as student_email, u.student_id, u.department, u.year,
             e.title as event_title, e.id as event_id
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      JOIN events e ON r.event_id = e.id
      WHERE r.registration_id = ?
    `).get(regId);

    if (!reg) {
      return res.status(404).json({ error: `No registration found matching ID: ${regId}` });
    }

    if (event_id && Number(reg.event_id) !== Number(event_id)) {
      return res.status(400).json({
        error: `Invalid Event! This pass is for "${reg.event_title}", not the selected event.`,
        registration: reg
      });
    }

    if (reg.status === 'cancelled' || reg.status === 'rejected') {
      return res.status(400).json({
        error: `Cannot check in: Registration is marked as ${reg.status}.`,
        registration: reg
      });
    }

    // Check if already checked in
    const existingAtt = db.prepare('SELECT * FROM attendance WHERE registration_id = ?').get(reg.registration_id);
    if (existingAtt) {
      return res.status(200).json({
        already_checked_in: true,
        message: `Already checked in at ${existingAtt.check_in_time}`,
        attendance: existingAtt,
        registration: reg
      });
    }

    // Insert attendance record
    const result = db.prepare(`
      INSERT INTO attendance (registration_id, event_id, user_id, check_in_time, status, scanned_by)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP, 'attended', ?)
    `).run(reg.registration_id, reg.event_id, reg.user_id, req.user.id);

    // Update registration status to attended
    db.prepare(`
      UPDATE registrations
      SET status = 'attended'
      WHERE registration_id = ?
    `).run(reg.registration_id);

    // Send notification to student
    db.prepare(`
      INSERT INTO notifications (user_id, title, message, type, link)
      VALUES (?, ?, ?, 'success', '/dashboard')
    `).run(
      reg.user_id,
      `Attendance Marked: ${reg.event_title}`,
      `You were successfully checked in for ${reg.event_title}. Enjoy the event!`
    );

    const attRecord = db.prepare('SELECT * FROM attendance WHERE id = ?').get(result.lastInsertRowid);

    return res.json({
      success: true,
      message: `Success! Checked in ${reg.student_name} (${reg.student_id})`,
      attendance: attRecord,
      registration: reg
    });
  } catch (err) {
    console.error('Scan attendance error:', err);
    return res.status(500).json({ error: 'Failed to process QR check-in.' });
  }
});

// Manual attendance toggle (Organizer or Admin)
router.post('/manual', requireAuth, requireRole(['organizer', 'admin']), (req, res) => {
  try {
    const { registration_id, status = 'attended' } = req.body;
    if (!registration_id) {
      return res.status(400).json({ error: 'Registration ID required.' });
    }

    const reg = db.prepare('SELECT * FROM registrations WHERE registration_id = ?').get(registration_id);
    if (!reg) {
      return res.status(404).json({ error: 'Registration not found.' });
    }

    if (status === 'attended') {
      const existing = db.prepare('SELECT id FROM attendance WHERE registration_id = ?').get(registration_id);
      if (!existing) {
        db.prepare(`
          INSERT INTO attendance (registration_id, event_id, user_id, check_in_time, status, scanned_by)
          VALUES (?, ?, ?, CURRENT_TIMESTAMP, 'attended', ?)
        `).run(registration_id, reg.event_id, reg.user_id, req.user.id);
      }
      db.prepare('UPDATE registrations SET status = \'attended\' WHERE registration_id = ?').run(registration_id);
    } else {
      db.prepare('DELETE FROM attendance WHERE registration_id = ?').run(registration_id);
      db.prepare('UPDATE registrations SET status = ? WHERE registration_id = ?').run(status, registration_id);
    }

    return res.json({ message: `Attendance updated for registration ${registration_id}.` });
  } catch (err) {
    console.error('Manual attendance error:', err);
    return res.status(500).json({ error: 'Failed to update attendance.' });
  }
});

// Get attendance stats for an event
router.get('/stats/:eventId', requireAuth, requireRole(['organizer', 'admin']), (req, res) => {
  try {
    const { eventId } = req.params;

    const regStats = db.prepare(`
      SELECT
        COUNT(*) as total_registered,
        SUM(CASE WHEN status = 'attended' THEN 1 ELSE 0 END) as total_attended,
        SUM(CASE WHEN status = 'checked_in' THEN 1 ELSE 0 END) as total_checked_in,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as total_cancelled
      FROM registrations
      WHERE event_id = ?
    `).get(eventId);

    const recentCheckins = db.prepare(`
      SELECT a.*, u.name as student_name, u.student_id, u.department, u.profile_image
      FROM attendance a
      JOIN users u ON a.user_id = u.id
      WHERE a.event_id = ?
      ORDER BY a.check_in_time DESC
      LIMIT 10
    `).all(eventId);

    const total = regStats.total_registered || 0;
    const attended = (regStats.total_attended || 0) + (regStats.total_checked_in || 0);
    const rate = total > 0 ? Math.round((attended / total) * 100) : 0;

    return res.json({
      stats: {
        total_registered: total,
        total_attended: attended,
        total_cancelled: regStats.total_cancelled || 0,
        attendance_rate: rate
      },
      recent_checkins: recentCheckins
    });
  } catch (err) {
    console.error('Attendance stats error:', err);
    return res.status(500).json({ error: 'Failed to fetch attendance stats.' });
  }
});

module.exports = router;
