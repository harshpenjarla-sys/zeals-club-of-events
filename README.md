# ZEAL'S CLUB OF EVENTS
> *Create. Connect. Celebrate.*

A modern, production-grade College Event Management & Student Engagement Platform inspired by premier institute student-activity portals, engineered with a premium dark festival aesthetic, responsive design, role-based authorization, live QR code ticketing, attendance scanning, and verified digital certificates.

---

## 🌟 Highlights & Core Features

### 1. Student Experience
* **Cinematic Hero & Discovery**: Live indicator ("18+ Events Happening This Month"), animated counters, featured festival carousel, and multi-category filters.
* **12 Domain Categories**: Technical, Cultural, Sports, Arts, Music, Dance, Literary, Entrepreneurship, Workshops, Seminars, Competitions, Social Events.
* **3-Step Event Registration**:
  * Step 1: Personal Identification (pre-filled from student profile).
  * Step 2: Event Specifics (Team squad names, dietary choices, T-shirt sizing, experience levels).
  * Step 3: Instant Confirmation with unique Registration ID (`ZCOE-26-XXXXXX`), QR code generation, celebratory confetti, and admit pass printing.
* **Interactive Event Pass & QR System**: High-res admits passes with cryptographic QR codes for instant check-in.
* **Student Dashboard**: Real-time counters for registered challenges, upcoming schedules, attendance records, verified participation certificates, and cancellation controls.
* **Verified Participation Certificates**: Luxury certificates with gold seals, faculty signatures, verification QR codes, and server-side PDF generation.
* **Interactive Campus Venues Map**: Stylized interactive campus map locating the Main Auditorium, Kalam Seminar Hall, Turing Computer Lab, Olympic Stadium, and Amphitheatre with scheduled events.
* **Event Calendar**: Monthly, weekly, and daily agendas with category color tags and `.ics` calendar exports.
* **"Moments That Matter" Gallery**: Masonry photo archives with category filtering and high-res lightbox modals.
* **Campus News & Bulletins**: Real-time announcements with High/Medium/Normal priority tags.
* **In-App Notifications**: Real-time bell alerts with unread badge counters.

### 2. Event Organizer Studio
* **Event Lifecycle Management**: Create, edit, publish, and delete events with date, time, venue, eligibility, rules, and itinerary timelines.
* **Registration & Roster Management**: Search attendees, filter by status (`registered`, `checked_in`, `attended`, `cancelled`), and **Export to CSV**.
* **Live QR Code Gate Scanner**: Instant attendance check-in gate using optical QR scanners or registration codes with duplicate protection.
* **1-Click Certificate Issuance**: Issue verified institutional certificates directly to attendees.

### 3. Administrator Console
* **Institutional Analytics**: Real-time metrics for Total Students, Active Events, Clubs, Registrations, Attendance Rates, and Certificates Issued.
* **Turnout & Branch Breakdown**: Popular event ranking and registration distribution across departments.
* **User & Role Governance**: Search all college accounts and change roles (`student` ↔ `organizer` ↔ `admin`).
* **Venue & Schedule Control**: Capacity monitoring and facility tracking across all campus halls.

---

## 🔑 Demo Access Accounts

For instant review, pre-seeded institutional credentials are ready to use with 1-click switcher buttons on the login page:

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Student** | `student@zeals.edu` | `Student@123` | Event registration, Admit QR passes, Student dashboard, Certificates |
| **Organizer** | `organizer@zeals.edu` | `Organizer@123` | Event creator, QR Gate Scanner, Participant roster, CSV export, Certificate issuer |
| **Admin** | `admin@zeals.edu` | `Admin@123` | Full governance, User role management, System analytics, Event approvals |

---

## 🛠️ Technology Stack

* **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Canvas Confetti, jsPDF
* **Backend**: Node.js, Express, `node:sqlite` (zero-config, high-performance embedded relational database)
* **Institutional Relational Schema**: MySQL 8.0+ compatible SQL definitions provided in `database/schema.sql` and `database/seed.sql`
* **Security & Tokens**: JWT (JSON Web Tokens), `bcryptjs` password hashing, Role-Based Access Control (RBAC) middleware
* **Barcodes & Certificates**: Server-side and client-side `qrcode` data generation and `pdfkit` certificate rendering

---

## 🚀 Quick Start Guide

### 1. Start Both Backend and Frontend (One Command)
From the project root:
```bash
npm run dev
```
* **Frontend Application**: `http://localhost:3000`
* **Backend API Server**: `http://localhost:5000`

### 2. Individual Commands (Optional)
* **Start Backend**: `npm run dev:backend`
* **Start Frontend**: `npm run dev:frontend`
* **Build Production Bundle**: `npm run build:frontend`
* **Re-seed Sample Data**: `npm run seed`

---

## 🗄️ Relational Database Schema

The database includes 11 relational tables:
1. `users` (id, name, email, password_hash, phone, student_id, college, department, year, role, profile_image, bio)
2. `clubs` (id, name, slug, description, category, logo, cover_image, mission, members_count, events_conducted, contact_email, social_links, core_team)
3. `venues` (id, name, code, location, capacity, description, image, map_x, map_y, facilities)
4. `events` (id, title, slug, description, category, club_id, organizer_id, banner, event_date, start_time, end_time, venue_id, registration_deadline, max_participants, entry_fee, prize_pool, eligibility, team_size, rules, schedule, faqs, contact_info, status, is_featured)
5. `registrations` (id, registration_id, user_id, event_id, team_name, team_members, custom_fields, status, registered_at, qr_code)
6. `attendance` (id, registration_id, event_id, user_id, check_in_time, status, scanned_by)
7. `announcements` (id, title, content, event_id, club_id, priority, category)
8. `gallery` (id, event_id, club_id, image, caption, category, photographer)
9. `certificates` (id, certificate_id, user_id, event_id, student_name, event_name, issue_date, file_path, qr_code, issued_by)
10. `notifications` (id, user_id, title, message, type, link, is_read)
11. `club_followers` (id, user_id, club_id)

---

## 📡 API Endpoint Reference

| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Create a new student account | Public |
| `POST` | `/api/auth/login` | Sign in with email and password | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Bearer Token |
| `GET` | `/api/events` | List events with category, search & timeframe | Optional |
| `GET` | `/api/events/:slugOrId` | Get detailed event specifications & FAQs | Optional |
| `POST` | `/api/events` | Create a new college event | Organizer / Admin |
| `POST` | `/api/registrations` | Register student & generate QR admit pass | Student |
| `GET` | `/api/registrations/my` | List user's registered passes | Student |
| `POST` | `/api/registrations/:id/cancel` | Cancel an active event registration | Student / Admin |
| `POST` | `/api/attendance/scan` | QR gate check-in & verification | Organizer / Admin |
| `GET` | `/api/clubs` | Explore all 12 student clubs | Optional |
| `POST` | `/api/clubs/:id/follow` | Toggle following a student club | Student |
| `POST` | `/api/certificates/issue` | Issue verified certificate to participant | Organizer / Admin |
| `GET` | `/api/certificates/verify/:id` | Public verification of certificate | Public |
| `GET` | `/api/certificates/:id/pdf` | Download official PDF certificate | Public |
| `GET` | `/api/venues` | List campus venues with map coordinates | Public |
| `GET` | `/api/search?q=` | Global search across all entities | Public |
| `GET` | `/api/admin/dashboard` | Central institutional analytics & stats | Admin |
| `PUT` | `/api/admin/users/:id/role`| Elevate or modify user roles | Admin |

---

## 🎨 Brand Identity

* **Website Name**: ZEAL'S CLUB OF EVENTS
* **Tagline**: *Create. Connect. Celebrate.*
* **Palette**: Dark Obsidian Base (`#07090e`), Electric Purple (`#8b5cf6`), Neon Blue (`#00d2ff`), Vibrant Magenta (`#ec4899`), Warm Orange (`#f97316`)
* **Typography**: Plus Jakarta Sans & Inter
