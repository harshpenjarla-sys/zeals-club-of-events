const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { requireAuth, requireRole } = require('../middleware/auth');

// All routes require Admin role
router.use(requireAuth, requireRole(['admin']));

// Admin Dashboard statistics and analytics
router.get('/dashboard', (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const totalStudents = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = \'student\'').get().count;
    const totalOrganizers = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = \'organizer\'').get().count;
    const totalEvents = db.prepare('SELECT COUNT(*) as count FROM events').get().count;
    const activeEvents = db.prepare('SELECT COUNT(*) as count FROM events WHERE status = \'published\'').get().count;
    const totalClubs = db.prepare('SELECT COUNT(*) as count FROM clubs').get().count;
    const totalRegistrations = db.prepare('SELECT COUNT(*) as count FROM registrations WHERE status != \'cancelled\'').get().count;
    const todayEvents = db.prepare('SELECT COUNT(*) as count FROM events WHERE event_date = ?').get(today).count;
    const totalAttended = db.prepare('SELECT COUNT(*) as count FROM attendance').get().count;
    const totalCertificates = db.prepare('SELECT COUNT(*) as count FROM certificates').get().count;

    const attendanceRate = totalRegistrations > 0 ? Math.round((totalAttended / totalRegistrations) * 100) : 0;

    // Events by Category
    const categoryStats = db.prepare(`
      SELECT category, COUNT(*) as count
      FROM events
      GROUP BY category
      ORDER BY count DESC
    `).all();

    // Top Popular Events by registration count
    const popularEvents = db.prepare(`
      SELECT e.id, e.title, e.category, e.event_date,
             (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id AND r.status != 'cancelled') as registrations,
             (SELECT COUNT(*) FROM attendance a WHERE a.event_id = e.id) as attended
      FROM events e
      ORDER BY registrations DESC
      LIMIT 6
    `).all();

    // Registrations by Department breakdown
    const departmentStats = db.prepare(`
      SELECT u.department, COUNT(r.id) as registrations
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      WHERE u.department IS NOT NULL
      GROUP BY u.department
      ORDER BY registrations DESC
      LIMIT 8
    `).all();

    // Recent user signups
    const recentUsers = db.prepare(`
      SELECT id, name, email, role, department, year, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 8
    `).all();

    return res.json({
      stats: {
        total_students: totalStudents,
        total_organizers: totalOrganizers,
        total_events: totalEvents,
        active_events: activeEvents,
        total_clubs: totalClubs,
        total_registrations: totalRegistrations,
        today_events: todayEvents,
        total_attended: totalAttended,
        attendance_percentage: attendanceRate,
        certificates_issued: totalCertificates
      },
      category_breakdown: categoryStats,
      popular_events: popularEvents,
      department_breakdown: departmentStats,
      recent_users: recentUsers
    });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    return res.status(500).json({ error: 'Failed to fetch admin stats.' });
  }
});

// List all users
router.get('/users', (req, res) => {
  try {
    const { role, search, page = 1, limit = 50 } = req.query;

    let query = `
      SELECT id, name, email, phone, student_id, college, department, year, role, profile_image, created_at,
             (SELECT COUNT(*) FROM registrations r WHERE r.user_id = users.id) as registrations_count
      FROM users
      WHERE 1=1
    `;
    const params = [];

    if (role && role !== 'all') {
      query += ` AND role = ?`;
      params.push(role);
    }

    if (search) {
      query += ` AND (name LIKE ? OR email LIKE ? OR student_id LIKE ? OR department LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), (Number(page) - 1) * Number(limit));

    const users = db.prepare(query).all(...params);
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;

    return res.json({ users, total: totalUsers });
  } catch (err) {
    console.error('Admin users error:', err);
    return res.status(500).json({ error: 'Failed to fetch users list.' });
  }
});

// Update user role
router.put('/users/:id/role', (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['student', 'organizer', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role.' });
    }

    // Protect super admin id = 1 from accidental demotion
    if (Number(id) === 1 && req.user.id !== 1) {
      return res.status(403).json({ error: 'Cannot modify primary administrator.' });
    }

    db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, id);
    return res.json({ message: `User role successfully updated to ${role}.` });
  } catch (err) {
    console.error('Admin role update error:', err);
    return res.status(500).json({ error: 'Failed to update user role.' });
  }
});

// Delete user
router.delete('/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    if (Number(id) === 1) {
      return res.status(403).json({ error: 'Cannot delete primary administrator.' });
    }

    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    return res.json({ message: 'User account removed.' });
  } catch (err) {
    console.error('Admin delete user error:', err);
    return res.status(500).json({ error: 'Failed to delete user.' });
  }
});

// Approve event
router.put('/events/:id/approve', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('UPDATE events SET status = \'published\' WHERE id = ?').run(id);
    return res.json({ message: 'Event approved and published!' });
  } catch (err) {
    console.error('Approve event error:', err);
    return res.status(500).json({ error: 'Failed to approve event.' });
  }
});

module.exports = router;
