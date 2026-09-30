const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

// Ensure db directory and uploads directory exist
const dbDir = path.join(__dirname);
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'zeals_events.sqlite');
const db = new DatabaseSync(dbPath);

// Enable WAL mode and foreign keys for high performance
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
`);

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      phone TEXT,
      student_id TEXT,
      college TEXT DEFAULT 'Zeal Institute of Technology & Management',
      department TEXT,
      year TEXT,
      role TEXT CHECK(role IN ('student', 'organizer', 'admin')) NOT NULL DEFAULT 'student',
      profile_image TEXT,
      bio TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS clubs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      logo TEXT,
      cover_image TEXT,
      mission TEXT,
      members_count INTEGER DEFAULT 0,
      events_conducted INTEGER DEFAULT 0,
      contact_email TEXT,
      social_links TEXT, -- JSON string
      core_team TEXT,     -- JSON string
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS venues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      location TEXT NOT NULL,
      capacity INTEGER NOT NULL,
      description TEXT,
      image TEXT,
      map_x REAL DEFAULT 50, -- Percentage on campus map
      map_y REAL DEFAULT 50,
      facilities TEXT, -- Comma-separated or JSON
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      club_id INTEGER REFERENCES clubs(id) ON DELETE SET NULL,
      organizer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      banner TEXT,
      event_date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      venue_id INTEGER REFERENCES venues(id) ON DELETE SET NULL,
      registration_deadline TEXT NOT NULL,
      max_participants INTEGER DEFAULT 100,
      entry_fee TEXT DEFAULT 'Free',
      prize_pool TEXT,
      eligibility TEXT DEFAULT 'Open to all college students',
      team_size TEXT DEFAULT 'Individual (1)',
      rules TEXT,      -- JSON or multiline string
      schedule TEXT,   -- JSON string of timeline items
      faqs TEXT,       -- JSON string of question/answer
      contact_info TEXT, -- JSON or string
      status TEXT CHECK(status IN ('published', 'draft', 'pending_approval', 'completed', 'cancelled')) NOT NULL DEFAULT 'published',
      is_featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      registration_id TEXT UNIQUE NOT NULL,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      team_name TEXT,
      team_members TEXT, -- JSON string
      custom_fields TEXT, -- JSON string
      status TEXT CHECK(status IN ('registered', 'checked_in', 'attended', 'cancelled', 'rejected')) NOT NULL DEFAULT 'registered',
      registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      qr_code TEXT
    );

    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      registration_id TEXT NOT NULL REFERENCES registrations(registration_id) ON DELETE CASCADE,
      event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      check_in_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'attended',
      scanned_by INTEGER REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      event_id INTEGER REFERENCES events(id) ON DELETE SET NULL,
      club_id INTEGER REFERENCES clubs(id) ON DELETE SET NULL,
      priority TEXT CHECK(priority IN ('high', 'medium', 'normal')) DEFAULT 'normal',
      category TEXT DEFAULT 'General',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER REFERENCES events(id) ON DELETE SET NULL,
      club_id INTEGER REFERENCES clubs(id) ON DELETE SET NULL,
      image TEXT NOT NULL,
      caption TEXT,
      category TEXT NOT NULL,
      photographer TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS certificates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      certificate_id TEXT UNIQUE NOT NULL,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      student_name TEXT NOT NULL,
      event_name TEXT NOT NULL,
      issue_date TEXT NOT NULL,
      file_path TEXT,
      qr_code TEXT,
      issued_by INTEGER REFERENCES users(id),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'info',
      link TEXT,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS club_followers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      club_id INTEGER NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, club_id)
    );

    CREATE TABLE IF NOT EXISTS saved_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, event_id)
    );
  `);
}

initSchema();

module.exports = db;
