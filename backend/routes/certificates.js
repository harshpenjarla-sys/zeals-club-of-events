const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const db = require('../database/db');
const { requireAuth, requireRole } = require('../middleware/auth');

function generateCertId() {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ZCOE-CERT-${year}-${rand}`;
}

// Issue Certificate (Organizer or Admin)
router.post('/issue', requireAuth, requireRole(['organizer', 'admin']), async (req, res) => {
  try {
    const { user_id, event_id } = req.body;
    if (!user_id || !event_id) {
      return res.status(400).json({ error: 'User ID and Event ID are required.' });
    }

    const user = db.prepare('SELECT id, name, email, student_id FROM users WHERE id = ?').get(user_id);
    const event = db.prepare('SELECT id, title, event_date FROM events WHERE id = ?').get(event_id);

    if (!user || !event) {
      return res.status(404).json({ error: 'User or Event not found.' });
    }

    // Check if certificate already exists
    const existing = db.prepare('SELECT * FROM certificates WHERE user_id = ? AND event_id = ?').get(user_id, event_id);
    if (existing) {
      return res.json({
        message: 'Certificate already issued for this participant.',
        certificate: existing
      });
    }

    let certId = generateCertId();
    while (db.prepare('SELECT id FROM certificates WHERE certificate_id = ?').get(certId)) {
      certId = generateCertId();
    }

    const verifyUrl = `https://zeals-events.edu/verify/${certId}`;
    const qrData = await QRCode.toDataURL(verifyUrl, { width: 250, margin: 1 });
    const today = new Date().toISOString().split('T')[0];

    const result = db.prepare(`
      INSERT INTO certificates (certificate_id, user_id, event_id, student_name, event_name, issue_date, file_path, qr_code, issued_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      certId,
      user_id,
      event_id,
      user.name,
      event.title,
      today,
      `/certificates/${certId}.pdf`,
      qrData,
      req.user.id
    );

    // Also mark registration and attendance as attended if not already
    db.prepare(`
      UPDATE registrations SET status = 'attended' WHERE user_id = ? AND event_id = ?
    `).run(user_id, event_id);

    // Send in-app notification to the student
    db.prepare(`
      INSERT INTO notifications (user_id, title, message, type, link)
      VALUES (?, ?, ?, 'info', '/dashboard')
    `).run(
      user_id,
      `Certificate Issued: ${event.title}`,
      `Congratulations! Your verified certificate of participation for ${event.title} is now ready to view and download.`
    );

    const certificate = db.prepare('SELECT * FROM certificates WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json({ message: 'Certificate issued successfully!', certificate });
  } catch (err) {
    console.error('Issue certificate error:', err);
    return res.status(500).json({ error: 'Failed to issue certificate.' });
  }
});

// Get logged in student's certificates
router.get('/my', requireAuth, (req, res) => {
  try {
    const certs = db.prepare(`
      SELECT c.*, e.banner as event_banner, e.category as event_category, e.event_date
      FROM certificates c
      JOIN events e ON c.event_id = e.id
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC
    `).all(req.user.id);

    return res.json({ certificates: certs });
  } catch (err) {
    console.error('My certificates error:', err);
    return res.status(500).json({ error: 'Failed to fetch certificates.' });
  }
});

// Public certificate verification route
router.get('/verify/:certificateId', (req, res) => {
  try {
    const { certificateId } = req.params;
    const cert = db.prepare(`
      SELECT c.*, u.student_id, u.department, u.college,
             e.description as event_description, e.category as event_category,
             issuer.name as issuer_name, issuer.role as issuer_role
      FROM certificates c
      JOIN users u ON c.user_id = u.id
      JOIN events e ON c.event_id = e.id
      LEFT JOIN users issuer ON c.issued_by = issuer.id
      WHERE c.certificate_id = ?
    `).get(certificateId);

    if (!cert) {
      return res.status(404).json({ valid: false, error: 'Certificate ID not found or invalid.' });
    }

    return res.json({
      valid: true,
      certificate: cert
    });
  } catch (err) {
    console.error('Verify certificate error:', err);
    return res.status(500).json({ error: 'Verification failed.' });
  }
});

// Server-side PDF certificate generation and download
router.get('/:certificateId/pdf', async (req, res) => {
  try {
    const { certificateId } = req.params;
    const cert = db.prepare(`
      SELECT c.*, u.student_id, u.department, u.college,
             e.category as event_category
      FROM certificates c
      JOIN users u ON c.user_id = u.id
      JOIN events e ON c.event_id = e.id
      WHERE c.certificate_id = ?
    `).get(certificateId);

    if (!cert) {
      return res.status(404).json({ error: 'Certificate not found.' });
    }

    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4',
      margins: { top: 30, bottom: 30, left: 40, right: 40 }
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${certificateId}.pdf"`);

    doc.pipe(res);

    // Draw luxury certificate background & border
    doc.rect(20, 20, 782, 555).lineWidth(4).strokeColor('#8b5cf6').stroke();
    doc.rect(26, 26, 770, 543).lineWidth(1).strokeColor('#3b82f6').stroke();

    // Corner decorative accents
    doc.rect(20, 20, 30, 30).fillColor('#6366f1').fill();
    doc.rect(772, 20, 30, 30).fillColor('#6366f1').fill();
    doc.rect(20, 545, 30, 30).fillColor('#6366f1').fill();
    doc.rect(772, 545, 30, 30).fillColor('#6366f1').fill();

    // Header Branding
    doc.fontSize(24).font('Helvetica-Bold').fillColor('#4338ca').text('ZEAL\'S CLUB OF EVENTS', 0, 70, { align: 'center' });
    doc.fontSize(10).font('Helvetica-Oblique').fillColor('#64748b').text('CREATE. CONNECT. CELEBRATE.', 0, 102, { align: 'center' });
    doc.moveDown(0.5);

    // Title
    doc.fontSize(28).font('Helvetica-Bold').fillColor('#0f172a').text('CERTIFICATE OF PARTICIPATION', 0, 135, { align: 'center' });

    // Subtext
    doc.fontSize(12).font('Helvetica').fillColor('#475569').text('This certificate is proudly presented to', 0, 190, { align: 'center' });

    // Student Name
    doc.fontSize(26).font('Helvetica-Bold').fillColor('#7c3aed').text(cert.student_name.toUpperCase(), 0, 220, { align: 'center' });
    doc.fontSize(11).font('Helvetica').fillColor('#64748b').text(`(Student ID: ${cert.student_id || 'N/A'} - ${cert.department || 'Zeal Student'})`, 0, 255, { align: 'center' });

    // Event Text
    doc.fontSize(12).font('Helvetica').fillColor('#475569').text('for active and successful participation in the institutional event', 0, 290, { align: 'center' });

    doc.fontSize(20).font('Helvetica-Bold').fillColor('#1e293b').text(cert.event_name, 0, 318, { align: 'center' });

    doc.fontSize(11).font('Helvetica').fillColor('#64748b').text(`Category: ${cert.event_category} | Conducted at Zeal Institute of Technology`, 0, 348, { align: 'center' });

    // Signatures & QR Section
    const signY = 430;

    // Left Signature
    doc.moveTo(100, signY).lineTo(260, signY).strokeColor('#94a3b8').stroke();
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#1e293b').text('Event Coordinator', 100, signY + 8, { width: 160, align: 'center' });
    doc.fontSize(9).font('Helvetica').fillColor('#64748b').text('Zeal\'s Club of Events', 100, signY + 24, { width: 160, align: 'center' });

    // Center Seal
    doc.circle(411, signY - 10, 38).lineWidth(2).strokeColor('#eab308').stroke();
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#b45309').text('OFFICIAL\nSEAL', 380, signY - 22, { align: 'center', width: 62 });

    // Right Signature
    doc.moveTo(560, signY).lineTo(720, signY).strokeColor('#94a3b8').stroke();
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#1e293b').text('Dean of Student Affairs', 560, signY + 8, { width: 160, align: 'center' });
    doc.fontSize(9).font('Helvetica').fillColor('#64748b').text('Zeal Institute', 560, signY + 24, { width: 160, align: 'center' });

    // Footer with Certificate ID & Verification
    doc.fontSize(9).font('Helvetica').fillColor('#94a3b8').text(`Certificate ID: ${cert.certificate_id}  |  Issue Date: ${cert.issue_date}  |  Verify online at zeals-events.edu/verify/${cert.certificate_id}`, 0, 520, { align: 'center' });

    doc.end();
  } catch (err) {
    console.error('PDF certificate generation error:', err);
    return res.status(500).json({ error: 'Failed to generate PDF certificate.' });
  }
});

module.exports = router;
