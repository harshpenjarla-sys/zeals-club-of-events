const bcrypt = require('bcryptjs');
const QRCode = require('qrcode');
const db = require('./db');

async function seed() {
  console.log('🌱 Starting Official Zeal College of Engineering & Research (ZCOER, Pune) Seeding...');

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('Zeal@123', salt);
  const adminHash = bcrypt.hashSync('Admin@123', salt);
  const organizerHash = bcrypt.hashSync('Organizer@123', salt);
  const studentHash = bcrypt.hashSync('Student@123', salt);

  // 1. Venues (Official ZCOER Campus Locations at Survey No. 39, Narhe, Pune)
  const venues = [
    {
      name: 'Chhatrapati Shivaji Maharaj Auditorium',
      code: 'AUD-SHIVAJI',
      location: 'Central Campus Block A, Ground Floor, ZCOER',
      capacity: 1200,
      description: 'Acoustically engineered grand state-of-the-art auditorium with 4K laser projection, Dolby surround sound, green rooms, and motorized stage rigging for UDAAN mega shows and conferences.',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
      map_x: 48,
      map_y: 42,
      facilities: 'Laser Projector, Dolby Atmos, Central AC, VIP Lounge, 2 Green Rooms, Professional Stage Lighting'
    },
    {
      name: 'Dr. APJ Abdul Kalam Seminar Hall',
      code: 'SEM-KALAM',
      location: 'Academic Block B, 2nd Floor, ZCOER',
      capacity: 350,
      description: 'Tiered executive auditorium for national research symposiums, expert guest lectures, IEEE summits, and EDC startup pitches.',
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&auto=format&fit=crop&q=80',
      map_x: 35,
      map_y: 30,
      facilities: 'Dual HD Laser Projectors, Podiums, Wireless Mic Array, Live Webcast Studio, Air Conditioned'
    },
    {
      name: 'Turing Central Computing Facility (CCF)',
      code: 'CCF-TURING',
      location: 'Computer & IT Engineering Wing, 3rd Floor, ZCOER',
      capacity: 260,
      description: 'High-speed gigabit networked workstations, dual monitors, Nvidia GPU acceleration clusters for TechZeal hackathons, CodeCraft, and AI agent training.',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
      map_x: 22,
      map_y: 55,
      facilities: '1Gbps Dedicated Leased Line, Dual Monitors, Central UPS Backup, Air Conditioned, Cloud Server Access'
    },
    {
      name: 'Zeal Olympic Athletic Grounds & Turf Stadium',
      code: 'STAD-RANANGAN',
      location: 'West Campus Athletic Zone, ZCOER',
      capacity: 3500,
      description: 'Floodlit Olympic-standard turf, 400m synthetic running track, and spectator pavilion. Home ground for the annual Zeal Ranangan Inter-Collegiate Championship.',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80',
      map_x: 75,
      map_y: 25,
      facilities: 'High-Mast Floodlights, Commentary Box, Changing Rooms, First Aid Station, Pure Water Dispensers'
    },
    {
      name: 'Zeal Indoor Badminton & Sports Arena',
      code: 'INDR-SPORTS',
      location: 'Gymnasium & Sports Complex, ZCOER',
      capacity: 850,
      description: 'Maple hardwood multi-sport court with digital scoreboards, referee consoles, and tiered gallery seating for badminton, table tennis, and chess championships.',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&auto=format&fit=crop&q=80',
      map_x: 82,
      map_y: 45,
      facilities: 'Maple Hardwood Floor, Electronic Scoreboards, Shower Rooms, Sound PA System'
    },
    {
      name: 'Swami Vivekananda Open Air Amphitheatre',
      code: 'AMPHI-OAT',
      location: 'Lakeside Cultural Concourse, ZCOER',
      capacity: 1600,
      description: 'Open air amphitheatre under the stars for UDAAN Battle of the Bands, Nukkad Natak street theatre, and celebrity concert nights.',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
      map_x: 60,
      map_y: 72,
      facilities: 'Concert Lighting Rig, Stage Foggers, Open Tiered Seating, Concourse Food Stalls'
    },
    {
      name: 'Center for Innovation, Incubation & Robotics Lab (ZCEI)',
      code: 'ZCEI-ROBO',
      location: 'R&D Center of Excellence, 1st Floor, ZCOER',
      capacity: 150,
      description: 'Maker space equipped with 3D printers, CNC laser cutters, autonomous robotics arenas (RoboCon), IoT testbeds, and agile startup incubation pods.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=80',
      map_x: 28,
      map_y: 78,
      facilities: '3D Printers, Soldering Benches, Drone Fly Zone, Polycarbonate Combat Arena, High-Speed Wi-Fi 6'
    },
    {
      name: 'Mechanical Engineering Workshop Annex',
      code: 'WRK-MECH',
      location: 'Mechanical Sciences Complex, Ground Floor, ZCOER',
      capacity: 250,
      description: 'Advanced manufacturing lab, welding bays, SAE BAJA vehicle fabrication testbeds, and engineering design masterclass hall.',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80',
      map_x: 42,
      map_y: 65,
      facilities: 'Lathe Machines, CNC Milling, TIG/MIG Welding, Auto CAD Simulation Displays, Heavy Power Units'
    },
    {
      name: 'Central Campus Quad & UDAAN Festival Plaza',
      code: 'PLZ-UDAAN',
      location: 'Heart of ZCOER Narhe Campus',
      capacity: 4000,
      description: 'Sprawling central festival plaza hosting Shivjayanti Dhol Tasha processions, food truck concourses, flea markets, and flash mobs.',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop&q=80',
      map_x: 52,
      map_y: 52,
      facilities: 'Festoon Ambient Lights, Audio Grid, Event Stalls Electrical Distribution, Paved Open Walkway'
    },
    {
      name: 'Student Activity Center (SAC) & NSS Cell',
      code: 'SAC-ZCOER',
      location: 'Student Council Building, 1st Floor, ZCOER',
      capacity: 500,
      description: 'Command center for all 12 student associations, Udaan rehearsals, NSS blood donation drives, acoustic jams, and debate prep.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
      map_x: 65,
      map_y: 35,
      facilities: 'Club Cubicles, Mirror Dance Rehearsal Studio, Council Boardroom, First Aid & Storage'
    }
  ];

  const insertVenue = db.prepare(`
    INSERT INTO venues (name, code, location, capacity, description, image, map_x, map_y, facilities)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  venues.forEach(v => {
    insertVenue.run(v.name, v.code, v.location, v.capacity, v.description, v.image, v.map_x, v.map_y, v.facilities);
  });
  console.log('✅ 10 Real ZCOER Campus Venues inserted.');

  // 2. Users (Official Leadership from zcoer.in + Student Council)
  const insertUser = db.prepare(`
    INSERT INTO users (name, email, password_hash, phone, student_id, college, department, year, role, profile_image, bio)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Admin 1: Dr. S. A. Deokar - Principal, ZCOER
  insertUser.run(
    'Dr. S. A. Deokar',
    'admin@zcoer.in',
    adminHash,
    '+91 7558666663',
    'ZCOER-DIR-001',
    'Zeal College of Engineering & Research (ZCOER), Pune',
    'Campus Director & Principal',
    'Faculty',
    'admin',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    'Campus Director & Principal, Zeal College of Engineering and Research, Pune. Committed to nurturing academic excellence, cutting-edge research, and industry-ready engineering professionals.'
  );

  // Admin alias for demo: admin@zeals.edu
  insertUser.run(
    'Dr. S. A. Deokar (Admin Demo)',
    'admin@zeals.edu',
    adminHash,
    '+91 7558666664',
    'ZCOER-ADM-002',
    'Zeal College of Engineering & Research (ZCOER), Pune',
    'Principal & Head of Governance',
    'Faculty',
    'admin',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    'Chief Administrator & Mentor for Zeal Club of Events, ZCOER.'
  );

  // 5 Organizers (Faculty coordinators & student presidents)
  const organizers = [
    {
      name: 'Aarav Mehta',
      email: 'organizer@zcoer.in',
      phone: '+91 7558666665',
      student_id: 'ZCOE-2023-CS-042',
      department: 'Computer Engineering',
      year: 'Final Year B.Tech',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
      bio: 'President of ACES (Association of Computer Engineering Students) & Chief Student Coordinator for TechZeal 2026 at ZCOER.'
    },
    {
      name: 'Aarav Mehta (Organizer Demo)',
      email: 'organizer@zeals.edu',
      phone: '+91 7558666665',
      student_id: 'ZCOE-2023-CS-042',
      department: 'Computer Engineering',
      year: 'Final Year B.Tech',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
      bio: 'ACES President & Tech Coordinator for ZCOER Hackathons.'
    },
    {
      name: 'Ananya Deshmukh',
      email: 'ananya.cultural@zcoer.in',
      phone: '+91 7558666666',
      student_id: 'ZCOE-2023-ETC-089',
      department: 'Electronics & Telecommunication',
      year: '3rd Year B.Tech',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
      bio: 'Head of Zeal Cultural Club & Main Stage Manager for ZEAL UDAAN Fest 2026.'
    },
    {
      name: 'Rohan Kulkarni',
      email: 'rohan.sports@zcoer.in',
      phone: '+91 7558666667',
      student_id: 'ZCOE-2023-ME-104',
      department: 'Mechanical Engineering',
      year: 'Final Year B.Tech',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      bio: 'Sports Secretary & Tournament Convener for ZEAL RANANGAN State-Level Championship.'
    },
    {
      name: 'Sneha Rao',
      email: 'sneha.edc@zcoer.in',
      phone: '+91 7558666668',
      student_id: 'ZCOE-2024-IT-018',
      department: 'Information Technology',
      year: '3rd Year B.Tech',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
      bio: 'Convener of Zeal Center for Entrepreneurship & Innovation (ZCEI / EDC ZCOER).'
    }
  ];

  organizers.forEach(o => {
    insertUser.run(
      o.name,
      o.email,
      organizerHash,
      o.phone,
      o.student_id,
      'Zeal College of Engineering & Research (ZCOER), Pune',
      o.department,
      o.year,
      'organizer',
      o.image,
      o.bio
    );
  });

  // Main Demo Student: student@zcoer.in and student@zeals.edu
  insertUser.run(
    'Devika Nair',
    'student@zcoer.in',
    studentHash,
    '+91 7558666669',
    'ZCOE-2024-CS-112',
    'Zeal College of Engineering & Research (ZCOER), Pune',
    'Computer Engineering',
    '3rd Year B.Tech',
    'student',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    'Computer Engineering undergraduate at ZCOER, Pune. Competitive programmer, active participant in TechZeal, Udaan, and ZCOER open-source sprints.'
  );

  insertUser.run(
    'Devika Nair (Student Demo)',
    'student@zeals.edu',
    studentHash,
    '+91 7558666669',
    'ZCOE-2024-CS-112',
    'Zeal College of Engineering & Research (ZCOER), Pune',
    'Computer Engineering',
    '3rd Year B.Tech',
    'student',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    'ZCOER student exploring hackathons and campus culture.'
  );

  // 30 More Real ZCOER Student Profiles across actual ZCOER departments
  const zcoerDepartments = [
    'Computer Engineering',
    'Artificial Intelligence & Data Science',
    'Information Technology',
    'Electronics & Telecommunication',
    'Robotics & Automation Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Master of Business Administration (MBA)'
  ];
  const years = ['1st Year B.Tech', '2nd Year B.Tech', '3rd Year B.Tech', 'Final Year B.Tech'];
  const studentNames = [
    'Kabir Verma', 'Diya Patel', 'Ishaan Malhotra', 'Kavya Singhania', 'Aditya Roy',
    'Tanvi Sharma', 'Aryan Nair', 'Pooja Iyer', 'Arjun Kapoor', 'Meera Bhatt',
    'Nikhil Chawla', 'Sanya Saxena', 'Varun Reddy', 'Rhea Sengupta', 'Harsh Vardhan',
    'Priyanka Chopra', 'Kunal Shah', 'Bhavna Joshi', 'Tushar More', 'Ankita Das',
    'Gaurav Rao', 'Shruti Sen', 'Mihir Agarwal', 'Simran Kaur', 'Yash Khandelwal',
    'Ritika Vora', 'Manish Pandey', 'Neha Goel', 'Pranav Menon', 'Tara Pillai'
  ];

  studentNames.forEach((name, idx) => {
    const emailName = name.toLowerCase().replace(/[^a-z]/g, '.');
    const dept = zcoerDepartments[idx % zcoerDepartments.length];
    const yr = years[idx % years.length];
    const sId = `ZCOE-2024-${dept.substring(0, 2).toUpperCase()}-${String(100 + idx).padStart(3, '0')}`;
    insertUser.run(
      name,
      `${emailName}@zcoer.in`,
      passwordHash,
      `+91 7558666${String(100 + idx)}`,
      sId,
      'Zeal College of Engineering & Research (ZCOER), Pune',
      dept,
      yr,
      'student',
      `https://images.unsplash.com/photo-${1500000000000 + (idx * 12345678) % 100000000}?w=400&auto=format&fit=crop&q=80`,
      `Passionate engineering student at ZCOER Narhe Campus in ${dept}.`
    );
  });

  console.log('✅ ZCOER Principal Dr. Deokar, Faculty Organizers, and Students inserted.');

  // 3. Official Clubs & Student Associations at ZCOER
  const clubs = [
    {
      name: 'ACES (Association of Computer Engineering Students)',
      slug: 'aces-zcoer',
      description: 'The premier departmental student body of Computer Engineering at ZCOER. Organizers of TechZeal, CodeCraft, Google Developer Student Club (GDSC) sprints, open-source cohorts, and Web3/Cloud workshops.',
      category: 'Technical',
      logo: 'https://zcoer.in/wp-content/uploads/2021/01/comp.jpg',
      cover_image: 'https://zcoer.in/wp-content/uploads/2021/01/it1.jpg',
      mission: 'To impart technical excellence, software development rigor, and competitive problem-solving among engineering scholars at ZCOER.',
      members_count: 520,
      events_conducted: 28,
      contact_email: 'aces@zcoer.in',
      social_links: JSON.stringify({ website: 'https://zcoer.in', instagram: 'https://instagram.com/aces_zcoer', linkedin: 'https://linkedin.com/school/zcoer' }),
      core_team: JSON.stringify([
        { name: 'Aarav Mehta', role: 'President (ACES)', year: 'Final Year B.Tech' },
        { name: 'Devika Nair', role: 'Technical Lead', year: '3rd Year B.Tech' },
        { name: 'Arjun Kapoor', role: 'Coding Coordinator', year: '3rd Year B.Tech' }
      ])
    },
    {
      name: 'Zeal Cultural Club (UDAAN Troupe)',
      slug: 'zeal-cultural-club',
      description: 'The vibrant beating heart of ZCOER campus arts. Producers of ZEAL UDAAN (उडाण), Battle of Bands, Kathak/Bharatnatyam classical fusion, street plays, and celebrity star nights.',
      category: 'Cultural',
      logo: 'https://zcoer.in/wp-content/uploads/2023/03/08.jpg',
      cover_image: 'https://zcoer.in/wp-content/uploads/2023/03/07.jpg',
      mission: 'Nurturing student artistic creativity, performing arts discipline, and celebrating Maharashtrian & Indian cultural heritage on national stages.',
      members_count: 450,
      events_conducted: 22,
      contact_email: 'cultural@zcoer.in',
      social_links: JSON.stringify({ instagram: 'https://instagram.com/zeal_udaan', youtube: 'https://www.youtube.com/channel/UCu7Vjo655uN7IZqwKpBW1Hg' }),
      core_team: JSON.stringify([
        { name: 'Ananya Deshmukh', role: 'General Secretary', year: '3rd Year E&TC' },
        { name: 'Aditya Roy', role: 'Theatre Lead', year: 'Final Year ME' }
      ])
    },
    {
      name: 'Zeal Sports Council (RANANGAN Committee)',
      slug: 'zeal-sports-council',
      description: 'Host committee of ZEAL RANANGAN (रणांगण) – State-Level Inter-Collegiate Sports Fest. Managing Olympic-size turf, cricket ground, volleyball, badminton, and chess championships.',
      category: 'Sports',
      logo: 'https://zcoer.in/wp-content/uploads/2023/03/ra1.jpg',
      cover_image: 'https://zcoer.in/wp-content/uploads/2023/03/ra26.jpg',
      mission: 'Instilling true sportsmanship, fitness resilience, team bonding, and athletic distinction across SPPU and inter-university tournaments.',
      members_count: 680,
      events_conducted: 35,
      contact_email: 'sports@zcoer.in',
      social_links: JSON.stringify({ instagram: 'https://instagram.com/zeal_ranangan' }),
      core_team: JSON.stringify([
        { name: 'Rohan Kulkarni', role: 'Sports Secretary', year: 'Final Year ME' },
        { name: 'Varun Reddy', role: 'Athletics Convener', year: '3rd Year Civil' }
      ])
    },
    {
      name: 'Robotics & Automation Club (Team Red Ants)',
      slug: 'team-red-ants-robotics',
      description: 'Building national award-winning combat robots, RoboCon automated rovers, pneumatic lifters, and autonomous drones. Representing ZCOER at national engineering robotics battles.',
      category: 'Technical',
      logo: 'https://zcoer.in/wp-content/uploads/2021/04/ro.jpg',
      cover_image: 'https://zcoer.in/wp-content/uploads/2026/04/1st-prize.jpg',
      mission: 'Integrating mechanical fabrication, embedded firmware, computer vision, and ROS into industrial robotic solutions.',
      members_count: 310,
      events_conducted: 18,
      contact_email: 'robotics@zcoer.in',
      social_links: JSON.stringify({ instagram: 'https://instagram.com/team_red_ants_zcoer' }),
      core_team: JSON.stringify([
        { name: 'Vikram Joshi', role: 'Captain (RoboCon)', year: 'Final Year AI&DS' },
        { name: 'Rohan Kulkarni', role: 'Mechanical Lead', year: 'Final Year ME' }
      ])
    },
    {
      name: 'Zeal Center for Entrepreneurship & Innovation (ZCEI / EDC)',
      slug: 'edc-zcoer',
      description: 'Official startup incubator & Entrepreneurship Development Cell at ZCOER. Facilitating ₹2,50,000 equity-free seed grants, patent filing legal support, and startup incubation pods.',
      category: 'Workshops',
      logo: 'https://zcoer.in/wp-content/uploads/2023/06/rd1.jpg',
      cover_image: 'https://zcoer.in/wp-content/uploads/2025/03/autonomous.jpg',
      mission: 'Empowering engineering students to become job creators, venture founders, and intellectual property innovators.',
      members_count: 260,
      events_conducted: 16,
      contact_email: 'edc@zcoer.in',
      social_links: JSON.stringify({ website: 'https://zcoer.in', linkedin: 'https://linkedin.com/company/zcei-zcoer' }),
      core_team: JSON.stringify([
        { name: 'Sneha Rao', role: 'EDC Student Convener', year: '3rd Year IT' },
        { name: 'Kunal Patil', role: 'Incubation Associate', year: 'Final Year CS' }
      ])
    },
    {
      name: 'Zeal NSS Unit (National Service Scheme)',
      slug: 'zeal-nss',
      description: 'Premier youth community service wing. Leading annual rural development winter camps, mega blood donation drives, tree plantation marathons, and environmental cleanups.',
      category: 'Social Events',
      logo: 'https://zcoer.in/wp-content/uploads/2021/04/NSS-Zeal-Photo-002.jpg',
      cover_image: 'https://zcoer.in/wp-content/uploads/2021/04/NSS-Zeal-Photo-001.jpg',
      mission: 'Not Me, But You — Developing social consciousness, rural empathy, and community nation-building among technocrats.',
      members_count: 380,
      events_conducted: 24,
      contact_email: 'nss@zcoer.in',
      social_links: JSON.stringify({ website: 'https://zcoer.in' }),
      core_team: JSON.stringify([
        { name: 'Harsh Vardhan', role: 'NSS Lead Volunteer', year: 'Final Year Civil' },
        { name: 'Pooja Gaikwad', role: 'Outreach Head', year: '3rd Year E&TC' }
      ])
    },
    {
      name: 'MESA & SAE India Collegiate Club (BAJA Racing)',
      slug: 'mesa-sae-zcoer',
      description: 'Mechanical Engineering Students Association & SAE India collegiate team. Designing and fabricating all-terrain vehicles (ATVs), go-karts, and competing at SAE BAJA India.',
      category: 'Competitions',
      logo: 'https://zcoer.in/wp-content/uploads/2021/01/mech.jpg',
      cover_image: 'https://zcoer.in/wp-content/uploads/2021/01/mech.jpg',
      mission: 'Applying automotive physics, chassis design, and FEA simulation to build race-winning collegiate buggies.',
      members_count: 290,
      events_conducted: 14,
      contact_email: 'mesa@zcoer.in',
      social_links: JSON.stringify({ instagram: 'https://instagram.com/baja_zcoer' }),
      core_team: JSON.stringify([
        { name: 'Tushar More', role: 'Team Captain (BAJA)', year: 'Final Year ME' },
        { name: 'Rohan Kulkarni', role: 'Chassis Engineer', year: 'Final Year ME' }
      ])
    },
    {
      name: 'IEEE & CSI Student Branch ZCOER',
      slug: 'ieee-csi-zcoer',
      description: 'Global technical societies chapter at ZCOER. Hosting IEEE international research symposiums, AI workshops, published paper reviews, and faculty-student hackathons.',
      category: 'Technical',
      logo: 'https://zcoer.in/wp-content/uploads/2021/04/ai1-1.jpg',
      cover_image: 'https://zcoer.in/wp-content/uploads/2021/01/comp.jpg',
      mission: 'Fostering technological innovation, IEEE scientific research publications, and global professional networking.',
      members_count: 340,
      events_conducted: 19,
      contact_email: 'ieee@zcoer.in',
      social_links: JSON.stringify({ website: 'https://zcoer.in', linkedin: 'https://linkedin.com' }),
      core_team: JSON.stringify([
        { name: 'Devika Nair', role: 'IEEE Branch Chair', year: '3rd Year CS' },
        { name: 'Nikhil Chawla', role: 'CSI Student Representative', year: 'Final Year IT' }
      ])
    },
    {
      name: 'Pixel Club ZCOER (Photography & Film Guild)',
      slug: 'pixel-club-zcoer',
      description: 'Official media and visual chroniclers of ZCOER. Capturing UDAAN concerts, Ranangan athletic sprints, drone videography, and festival cinema.',
      category: 'Arts',
      logo: 'https://zcoer.in/wp-content/uploads/2023/03/01.jpg',
      cover_image: 'https://zcoer.in/wp-content/uploads/2023/03/12.jpg',
      mission: 'Freezing timeless college moments and storytelling through creative camera craft and cinematic editing.',
      members_count: 220,
      events_conducted: 16,
      contact_email: 'pixel@zcoer.in',
      social_links: JSON.stringify({ instagram: 'https://instagram.com/pixel_zcoer' }),
      core_team: JSON.stringify([
        { name: 'Tanvi Sharma', role: 'Lead Photographer', year: '3rd Year E&TC' },
        { name: 'Aryan Nair', role: 'Cinematographer', year: '2nd Year CS' }
      ])
    },
    {
      name: 'ETSA & EESA (Electronics & Electrical Students Association)',
      slug: 'etsa-eesa-zcoer',
      description: 'Departmental guild for Electronics, Telecommunication, and Electrical engineering. Robotics sensor circuits, IoT drones, PCB etching workshops, and industrial power plant visits.',
      category: 'Workshops',
      logo: 'https://zcoer.in/wp-content/uploads/2021/01/electronics.jpg',
      cover_image: 'https://zcoer.in/wp-content/uploads/2021/01/elect.jpg',
      mission: 'Empowering students in embedded microcontrollers, VLSI, smart grid technologies, and clean energy solutions.',
      members_count: 310,
      events_conducted: 17,
      contact_email: 'etsa@zcoer.in',
      social_links: JSON.stringify({ website: 'https://zcoer.in' }),
      core_team: JSON.stringify([
        { name: 'Ananya Deshmukh', role: 'ETSA Secretary', year: '3rd Year E&TC' },
        { name: 'Gaurav Rao', role: 'Hardware Lead', year: '3rd Year Electrical' }
      ])
    },
    {
      name: 'CESA (Civil Engineering Students Association)',
      slug: 'cesa-zcoer',
      description: 'Civil Engineering student body. Bridge building competitions, Total Station surveying challenges, AutoCAD/Revit design workshops, and sustainable infrastructure symposiums.',
      category: 'Workshops',
      logo: 'https://zcoer.in/wp-content/uploads/2021/01/civil.jpg',
      cover_image: 'https://zcoer.in/wp-content/uploads/2021/01/civil.jpg',
      mission: 'Advancing sustainable structural design, green building standards, and geotechnical excellence.',
      members_count: 240,
      events_conducted: 13,
      contact_email: 'cesa@zcoer.in',
      social_links: JSON.stringify({ website: 'https://zcoer.in' }),
      core_team: JSON.stringify([
        { name: 'Varun Reddy', role: 'CESA President', year: '3rd Year Civil' },
        { name: 'Harsh Vardhan', role: 'Surveying Lead', year: 'Final Year Civil' }
      ])
    },
    {
      name: 'Zeal Orators & Literary Club',
      slug: 'zeal-orators-club',
      description: 'Parliamentary debating, Model United Nations (MUN), elocution, creative writing, and bilingual Maharashtrian poetry slams.',
      category: 'Literary',
      logo: 'https://zcoer.in/wp-content/uploads/2023/03/10.jpg',
      cover_image: 'https://zcoer.in/wp-content/uploads/2023/03/07.jpg',
      mission: 'Polishing articulate oratory, critical debate reasoning, and expressive linguistic elegance.',
      members_count: 195,
      events_conducted: 15,
      contact_email: 'orators@zcoer.in',
      social_links: JSON.stringify({ instagram: 'https://instagram.com/zeal_orators' }),
      core_team: JSON.stringify([
        { name: 'Kavya Singhania', role: 'Debate Captain', year: '3rd Year CS' },
        { name: 'Ishaan Malhotra', role: 'Editorial Head', year: '3rd Year IT' }
      ])
    }
  ];

  const insertClub = db.prepare(`
    INSERT INTO clubs (name, slug, description, category, logo, cover_image, mission, members_count, events_conducted, contact_email, social_links, core_team)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  clubs.forEach(c => {
    insertClub.run(c.name, c.slug, c.description, c.category, c.logo, c.cover_image, c.mission, c.members_count, c.events_conducted, c.contact_email, c.social_links, c.core_team);
  });
  console.log('✅ 12 Real ZCOER Student Associations & Clubs inserted.');

  // 4. Real Annual Events at ZCOER (UDAAN, RANANGAN, TECHZEAL, SHIVJAYANTI, etc.)
  const events = [
    {
      title: 'ZEAL UDAAN 2026: Annual National Cultural Festival & Battle of Bands',
      slug: 'zeal-udaan-2026-cultural-fest',
      description: 'The crowning annual cultural festival of Zeal College of Engineering & Research (ZCOER, Pune)! Featuring 3 days of electrifying stage performances, Battle of Bands at the Open Air Amphitheatre, classical/western dance troupes, fashion pageant, and a headline celebrity DJ concert under the stars. Free admission pass with ZCOER Student ID.',
      category: 'Cultural',
      club_id: 2, // Zeal Cultural Club
      organizer_id: 4, // Ananya Deshmukh
      banner: 'https://zcoer.in/wp-content/uploads/2023/03/07.jpg',
      event_date: '2026-10-24',
      start_time: '05:00 PM',
      end_time: '11:00 PM',
      venue_id: 6, // Amphitheatre
      registration_deadline: '2026-10-22 23:59:00',
      max_participants: 1600,
      entry_fee: 'Free Pass (College ID Mandatory)',
      prize_pool: '₹1,00,000 + Trophy',
      eligibility: 'Open to all college students across Pune and Maharashtra',
      team_size: 'Audience (Pass) or Band (3 - 7 Members)',
      rules: JSON.stringify([
        'Entry strictly through digital QR Admit Pass generated on the portal.',
        'College ID card is mandatory at the security gates.',
        'Bands must submit original track credentials during stage check-in.'
      ]),
      schedule: JSON.stringify([
        { time: '04:30 PM', title: 'Security Gates Open & Pass Scanning' },
        { time: '05:30 PM', title: 'Inauguration & Classical Fusion Troupe' },
        { time: '07:00 PM', title: 'Inter-Collegiate Battle of Bands (Top 6 Finalists)' },
        { time: '09:30 PM', title: 'Grand Celebrity DJ Headline Show & Prize Distribution' }
      ]),
      faqs: JSON.stringify([
        { q: 'Is entry free for ZCOER students?', a: 'Yes! ZCOER students get free priority access by registering their digital pass.' },
        { q: 'Where will it be held?', a: 'Swami Vivekananda Open Air Amphitheatre at ZCOER Narhe campus.' }
      ]),
      contact_info: JSON.stringify({ email: 'udaan@zcoer.in', phone: '+91 7558666663', lead: 'Prof. Cultural Coordinator & Ananya Deshmukh' }),
      status: 'published',
      is_featured: 1
    },
    {
      title: 'ZEAL RANANGAN 2026: State-Level Inter-Collegiate Sports Tournament',
      slug: 'zeal-ranangan-2026-sports-tournament',
      description: 'The monumental sports showdown of ZCOER! Over 40 engineering and university colleges battle across Football, Box Cricket, Basketball, Volleyball, Badminton, Chess, and Track & Field for the prestigious Zeal Ranangan State Championship Trophy.',
      category: 'Sports',
      club_id: 3, // Zeal Sports Council
      organizer_id: 5, // Rohan Kulkarni
      banner: 'https://zcoer.in/wp-content/uploads/2023/03/ra26.jpg',
      event_date: '2026-10-12',
      start_time: '08:00 AM',
      end_time: '07:30 PM',
      venue_id: 4, // Sports Ground
      registration_deadline: '2026-10-09 20:00:00',
      max_participants: 800,
      entry_fee: 'Free Pass (Nominated Teams)',
      prize_pool: 'State Championship Trophy + ₹1,50,000 Cash',
      eligibility: 'All undergraduate and postgraduate college students with valid identity proof',
      team_size: 'Squad (7 to 15 Players depending on sport)',
      rules: JSON.stringify([
        'Standard SPPU & AIU tournament rules apply across all disciplines.',
        'Proper sports kit and non-marking indoor shoes for badminton arena are mandatory.',
        'Referees and umpire decisions are final.'
      ]),
      schedule: JSON.stringify([
        { time: '08:00 AM', title: 'Grand March Past & Torch Relay by ZCOER Athletes' },
        { time: '09:00 AM', title: 'Knockout Stages: Football, Box Cricket & Volleyball' },
        { time: '02:00 PM', title: 'Indoor Badminton & Chess Finals' },
        { time: '05:30 PM', title: 'Grand Football Final & Ranangan Trophy Presentation' }
      ]),
      faqs: JSON.stringify([
        { q: 'Will outstation teams get resting rooms?', a: 'Yes, sports hostel facilities are provided on prior request to the council.' }
      ]),
      contact_info: JSON.stringify({ email: 'ranangan@zcoer.in', phone: '+91 7558666667', lead: 'Rohan Kulkarni' }),
      status: 'published',
      is_featured: 1
    },
    {
      title: 'TECHZEAL 2026: National 36-Hour Hackathon & Innovation Challenge',
      slug: 'techzeal-2026-national-hackathon',
      description: 'Flagship 36-hour continuous hackathon organized by ACES, CSI & IEEE Student Branch at ZCOER Turing Central Computing Facility. Build cutting-edge solutions in Generative AI, Web3, Smart Cities, HealthTech, and Agri-Tech with mentorship from industry leaders at Google, Microsoft, and Nvidia.',
      category: 'Technical',
      club_id: 1, // ACES
      organizer_id: 2, // Aarav Mehta
      banner: 'https://zcoer.in/wp-content/uploads/2021/01/comp.jpg',
      event_date: '2026-10-18',
      start_time: '09:00 AM',
      end_time: '09:00 PM (Next Day)',
      venue_id: 3, // Turing CCF
      registration_deadline: '2026-10-15 23:59:00',
      max_participants: 260,
      entry_fee: 'Free',
      prize_pool: '₹1,75,000 + Cloud Credits & Incubation',
      eligibility: 'Engineering, BCA, MCA, and Science students across India',
      team_size: 'Team of 2 - 4 Members',
      rules: JSON.stringify([
        'All code repositories must be initiated during the 36-hour hackathon window on GitHub.',
        'Pre-built projects or code cloning will lead to immediate disqualification.',
        'High-speed 1Gbps Wi-Fi, midnight energy refreshments, and resting lounges provided.'
      ]),
      schedule: JSON.stringify([
        { time: '09:00 AM', title: 'Check-in, Hackathon Kit Distribution & Welcome' },
        { time: '10:30 AM', title: 'Opening Address by Principal Dr. S. A. Deokar & Sponsor Briefing' },
        { time: '11:00 AM', title: 'Hacking Commences!' },
        { time: '08:00 PM', title: 'Mentorship Checkpoint 1' },
        { time: '00:00 AM', title: 'Midnight Pizza & Acoustic Session' },
        { time: '05:00 PM (Day 2)', title: 'Code Freeze & Jury Pitching' },
        { time: '08:00 PM (Day 2)', title: 'Awards Ceremony & Cash Prize Distribution' }
      ]),
      faqs: JSON.stringify([
        { q: 'Is food provided?', a: 'Yes, full meals, midnight snacks, and coffee are completely complimentary.' }
      ]),
      contact_info: JSON.stringify({ email: 'techzeal@zcoer.in', phone: '+91 7558666665', lead: 'Aarav Mehta & Devika Nair' }),
      status: 'published',
      is_featured: 1
    },
    {
      title: 'SHIVJAYANTI MAHOTSAV 2026: Chhatrapati Shivaji Maharaj Heritage Fest',
      slug: 'shivjayanti-mahotsav-2026-zcoer',
      description: 'The most revered traditional celebration at ZCOER! Witness the thunderous 100-member student Dhol Tasha troupe, traditional Shivcharitra powada recitals, historical weapon display, Palkhi procession across Narhe campus, and cultural stage drama.',
      category: 'Cultural',
      club_id: 2, // Cultural Club
      organizer_id: 4,
      banner: 'https://zcoer.in/wp-content/uploads/2023/03/09.jpg',
      event_date: '2026-10-06',
      start_time: '08:30 AM',
      end_time: '02:00 PM',
      venue_id: 9, // Central Quad Plaza
      registration_deadline: '2026-10-05 20:00:00',
      max_participants: 2500,
      entry_fee: 'Free Pass',
      prize_pool: 'Traditional Honors & Certificates',
      eligibility: 'Open to all students, faculty, staff, and alumni of Zeal Education Society',
      team_size: 'Open to all',
      rules: JSON.stringify([
        'Traditional Maharashtrian attire (Kurta/Saree/Pheta) is warmly encouraged.',
        'Maintain solemn respect and decorum throughout the Palkhi procession.'
      ]),
      schedule: JSON.stringify([
        { time: '08:30 AM', title: 'Shiv Vandana & Pratima Pujan by Founder Director Shri S. M. Katkar' },
        { time: '09:30 AM', title: 'Grand 100-Dhol Tasha Vadak Pathak Performance at Central Plaza' },
        { time: '11:00 AM', title: 'Powada & Historic Shahiri Presentation by Student Artists' },
        { time: '12:30 PM', title: 'Maha-Prasad Distribution for all attendees' }
      ]),
      faqs: JSON.stringify([
        { q: 'Can outstation students attend?', a: 'Yes, everyone is welcome with digital registration pass.' }
      ]),
      contact_info: JSON.stringify({ email: 'events@zcoer.in', phone: '+91 7558666663', lead: 'Student Welfare Cell' }),
      status: 'published',
      is_featured: 1
    },
    {
      title: 'CODECRAFT 2026: ICPC-Style Algorithmic Programming Contest',
      slug: 'codecraft-algorithmic-contest-2026',
      description: 'Competitive programming contest hosted by ACES in collaboration with CodeChef and HackerRank. Solve 7 complex algorithmic problems under tight time and memory constraints.',
      category: 'Competitions',
      club_id: 1, // ACES
      organizer_id: 2,
      banner: 'https://zcoer.in/wp-content/uploads/2021/01/it1.jpg',
      event_date: '2026-10-04',
      start_time: '02:00 PM',
      end_time: '05:30 PM',
      venue_id: 3, // Turing CCF
      registration_deadline: '2026-10-03 18:00:00',
      max_participants: 140,
      entry_fee: 'Free',
      prize_pool: '₹50,000 + Mechanical Keyboards',
      eligibility: 'All Engineering & Technology students',
      team_size: 'Individual (1)',
      rules: JSON.stringify([
        'Standard ACM-ICPC penalty scoring applies.',
        'Languages permitted: C++, Java 21, Python 3.12, Rust.',
        'Internet access is limited strictly to official documentation.'
      ]),
      schedule: JSON.stringify([
        { time: '01:30 PM', title: 'Terminal Allotment & Integrity Briefing' },
        { time: '02:00 PM', title: 'Contest Commences (7 Problems)' },
        { time: '05:00 PM', title: 'Contest Freeze' },
        { time: '05:15 PM', title: 'Editorial & Winner Felicitation' }
      ]),
      faqs: JSON.stringify([
        { q: 'Will certificates be provided?', a: 'Yes, verified digital participation certificates for all who solve at least 1 problem.' }
      ]),
      contact_info: JSON.stringify({ email: 'aces@zcoer.in', phone: '+91 7558666665', lead: 'Devika Nair' }),
      status: 'published',
      is_featured: 1
    },
    {
      title: 'ROBOWARS ZCOER: Combat Robot Deathmatch Championship',
      slug: 'robowars-combat-championship-2026',
      description: 'Engineered by Team Red Ants (RoboCon ZCOER)! 15kg and 30kg custom combat robots featuring titanium vertical spinners, pneumatic flippers, and drum crushers battle inside a bulletproof arena.',
      category: 'Technical',
      club_id: 4, // Team Red Ants
      organizer_id: 2,
      banner: 'https://zcoer.in/wp-content/uploads/2021/04/ro.jpg',
      event_date: '2026-10-28',
      start_time: '11:00 AM',
      end_time: '06:00 PM',
      venue_id: 7, // ZCEI Robo Lab
      registration_deadline: '2026-10-25 18:00:00',
      max_participants: 350,
      entry_fee: 'Free Audience Pass / ₹800 Bot Team',
      prize_pool: '₹80,000 + Professional Toolkits',
      eligibility: 'Robotics teams meeting weight specifications',
      team_size: 'Squad of 2 - 5 Engineers',
      rules: JSON.stringify([
        'Bots must pass safety failsafe checks before arena entry.',
        'Arena protected by 12mm certified polycarbonate shielding.'
      ]),
      schedule: JSON.stringify([
        { time: '10:00 AM', title: 'Weigh-in & Radio Failsafe Scrutiny' },
        { time: '11:30 AM', title: 'Preliminary Knockout Duels' },
        { time: '04:30 PM', title: 'Semi-Finals & Grand Finale' }
      ]),
      faqs: JSON.stringify([
        { q: 'Can non-participating students watch?', a: 'Yes, register audience admit pass for free gallery seating.' }
      ]),
      contact_info: JSON.stringify({ email: 'robotics@zcoer.in', phone: '+91 7558666663', lead: 'Vikram Joshi' }),
      status: 'published',
      is_featured: 0
    },
    {
      title: 'ZCEI STARTUP SUMMIT & ANGEL INVESTOR PITCH 2026',
      slug: 'zcei-startup-pitch-summit-2026',
      description: 'Organized by the Zeal Center for Entrepreneurship & Innovation (ZCEI / EDC ZCOER). Pitch early-stage prototypes directly to venture capitalists, angel networks, and alumni founders for equity-free seed grants and incubation support.',
      category: 'Entrepreneurship',
      club_id: 5, // EDC ZCOER
      organizer_id: 6, // Sneha Rao
      banner: 'https://zcoer.in/wp-content/uploads/2023/06/rd1.jpg',
      event_date: '2026-10-21',
      start_time: '10:30 AM',
      end_time: '04:30 PM',
      venue_id: 2, // Kalam Seminar Hall
      registration_deadline: '2026-10-18 20:00:00',
      max_participants: 200,
      entry_fee: 'Free',
      prize_pool: '₹2,50,000 Equity-Free Incubation Grant',
      eligibility: 'Student founders with working prototype or validated business model',
      team_size: 'Team of 1 - 4 Founders',
      rules: JSON.stringify([
        '5-minute pitch followed by 5-minute Q&A with investor jury.',
        'Pitch decks in PDF format must be submitted 48 hours prior.'
      ]),
      schedule: JSON.stringify([
        { time: '10:30 AM', title: 'Keynote by Successful ZCOER Alumni Founder' },
        { time: '11:30 AM', title: 'Top 10 Shortlisted Startup Pitches' },
        { time: '02:00 PM', title: 'Investor Speed-Networking & Mentoring' },
        { time: '03:45 PM', title: 'Seed Grant Award Announcements' }
      ]),
      faqs: JSON.stringify([
        { q: 'Is incubation space provided at ZCOER?', a: 'Yes, winners receive dedicated office space in the ZCEI Innovation Hub.' }
      ]),
      contact_info: JSON.stringify({ email: 'edc@zcoer.in', phone: '+91 7558666668', lead: 'Sneha Rao' }),
      status: 'published',
      is_featured: 1
    },
    {
      title: 'ZEAL FRESHERS\' CARNIVAL 2026: Welcome Fiesta',
      slug: 'zeal-freshers-carnival-2026',
      description: 'The ultimate welcome celebration for First Year Engineering (FE) and MBA scholars at ZCOER! Live acoustic performances by seniors, club recruitment expos, talent hunt, interactive fun games, and high-energy music.',
      category: 'Social Events',
      club_id: 2, // Cultural
      organizer_id: 4,
      banner: 'https://zcoer.in/wp-content/uploads/2023/03/11.jpg',
      event_date: '2026-10-02',
      start_time: '04:00 PM',
      end_time: '08:30 PM',
      venue_id: 1, // Shivaji Auditorium
      registration_deadline: '2026-10-01 23:59:00',
      max_participants: 1100,
      entry_fee: 'Free Pass (FE & MBA Students)',
      prize_pool: 'Mr. & Ms. Fresher ZCOER Crowns + Gift Hampers',
      eligibility: 'Exclusively for ZCOER First Year Engineering & MBA students',
      team_size: 'Individual (1)',
      rules: JSON.stringify([
        'First year admission fee receipt or temporary college ID required for badge pickup.',
        'Talent round participants get 3 minutes on stage.'
      ]),
      schedule: JSON.stringify([
        { time: '03:30 PM', title: 'Auditorium Entry & Welcome Kit Handover' },
        { time: '04:30 PM', title: 'Senior Band Acoustic Welcome & Dance Performance' },
        { time: '06:00 PM', title: 'Mr. & Ms. Fresher Runway & Q&A Round' },
        { time: '07:45 PM', title: 'Crowning & Freshers DJ Celebration' }
      ]),
      faqs: JSON.stringify([
        { q: 'Where do I collect passes?', a: 'Download the digital QR pass from this portal.' }
      ]),
      contact_info: JSON.stringify({ email: 'freshers@zcoer.in', phone: '+91 7558666663', lead: 'Student Council' }),
      status: 'published',
      is_featured: 1
    },
    {
      title: 'ZEAL GENERATIVE AI & LLM AGENT BOOTCAMP',
      slug: 'generative-ai-bootcamp-zcoer',
      description: 'Hands-on intensive masterclass by IEEE ZCOER Student Branch. Learn LangChain, Retrieval Augmented Generation (RAG) with local Llama-3 models, and autonomous agent swarms in the Turing CCF Lab.',
      category: 'Workshops',
      club_id: 8, // IEEE
      organizer_id: 2,
      banner: 'https://zcoer.in/wp-content/uploads/2021/04/ai1-1.jpg',
      event_date: '2026-09-30',
      start_time: '10:00 AM',
      end_time: '04:30 PM',
      venue_id: 3, // Turing CCF
      registration_deadline: '2026-09-29 23:59:00',
      max_participants: 120,
      entry_fee: 'Free',
      prize_pool: 'Verified IEEE Certificate + AI Swag',
      eligibility: 'Basic Python knowledge recommended',
      team_size: 'Individual (1)',
      rules: JSON.stringify([
        'Workstations in Turing Lab provided. Personal laptops with Chrome also permitted.',
        'Hands-on coding assignment required for certificate eligibility.'
      ]),
      schedule: JSON.stringify([
        { time: '10:00 AM', title: 'Foundations of Modern LLMs & Prompt Engineering' },
        { time: '11:45 AM', title: 'Building Production RAG Pipelines with Vector DBs' },
        { time: '02:00 PM', title: 'Autonomous Multi-Agent Swarms with LangGraph' },
        { time: '03:45 PM', title: 'Project Demo & Digital Certificate Issuance' }
      ]),
      faqs: JSON.stringify([
        { q: 'Will certificates be provided?', a: 'Yes, verified participation certificates issued to all completing the sprint.' }
      ]),
      contact_info: JSON.stringify({ email: 'ieee@zcoer.in', phone: '+91 7558666665', lead: 'Devika Nair' }),
      status: 'published',
      is_featured: 0
    },
    {
      title: 'SAE INDIA BAJA: Off-Road Buggy Design & Dynamics Expo',
      slug: 'sae-baja-offroad-expo-zcoer',
      description: 'Organized by MESA & SAE ZCOER. Unveiling of the custom-fabricated 2026 all-terrain buggy with Briggs & Stratton engine, custom suspension, and live obstacle demonstration on West Campus grounds.',
      category: 'Competitions',
      club_id: 7, // MESA
      organizer_id: 5,
      banner: 'https://zcoer.in/wp-content/uploads/2021/01/mech.jpg',
      event_date: '2026-10-15',
      start_time: '11:00 AM',
      end_time: '04:00 PM',
      venue_id: 8, // Mech Workshop Annex
      registration_deadline: '2026-10-14 18:00:00',
      max_participants: 200,
      entry_fee: 'Free Pass',
      prize_pool: 'SAE Certificate + Internship Credits',
      eligibility: 'All engineering students interested in automotive design',
      team_size: 'Individual (1)',
      rules: JSON.stringify([
        'Spectators must remain behind safety barricades during dynamic test drives.'
      ]),
      schedule: JSON.stringify([
        { time: '11:00 AM', title: 'Chassis & Roll-Cage Technical Walkthrough' },
        { time: '01:30 PM', title: 'Live Suspension & Acceleration Test on Dirt Track' },
        { time: '03:00 PM', title: 'Recruitment Drive for 2027 SAE BAJA Racing Team' }
      ]),
      faqs: JSON.stringify([
        { q: 'Can non-mechanical students join the BAJA team?', a: 'Yes! Electronics and CS students are needed for telemetry, sensors, and DAQ.' }
      ]),
      contact_info: JSON.stringify({ email: 'mesa@zcoer.in', phone: '+91 7558666667', lead: 'Tushar More' }),
      status: 'published',
      is_featured: 0
    },
    {
      title: 'ZEAL NSS MEGA BLOOD DONATION & HEALTH CHECKUP CAMP',
      slug: 'zeal-nss-blood-donation-2026',
      description: 'Annual social outreach initiative by the Zeal NSS Unit in partnership with Sassoon General Hospital & AFMC Blood Bank. All student and faculty donors receive donor cards, health checks, and refreshments.',
      category: 'Social Events',
      club_id: 6, // NSS
      organizer_id: 4,
      banner: 'https://zcoer.in/wp-content/uploads/2021/04/NSS-Zeal-Photo-001.jpg',
      event_date: '2026-10-09',
      start_time: '09:30 AM',
      end_time: '04:30 PM',
      venue_id: 10, // SAC
      registration_deadline: '2026-10-08 22:00:00',
      max_participants: 500,
      entry_fee: 'Free',
      prize_pool: 'Govt. Blood Donor Certificate & Health Card',
      eligibility: 'Healthy individuals above 18 years of age (Weight >= 45 kg)',
      team_size: 'Individual (1)',
      rules: JSON.stringify([
        'Eat a light breakfast before donating.',
        'Doctors on site will perform Hb testing and blood pressure screening.'
      ]),
      schedule: JSON.stringify([
        { time: '09:30 AM', title: 'Inauguration by Dean Dr. Deokar' },
        { time: '10:00 AM', title: 'Donor Registration & Health Vitals Check' },
        { time: '04:00 PM', title: 'Collection Summary & Hospital Recognition' }
      ]),
      faqs: JSON.stringify([
        { q: 'Will I get an NSS certificate?', a: 'Yes, official state blood donor recognition certificates are issued immediately.' }
      ]),
      contact_info: JSON.stringify({ email: 'nss@zcoer.in', phone: '+91 7558666663', lead: 'Harsh Vardhan' }),
      status: 'published',
      is_featured: 0
    },
    {
      title: 'PIXEL PERFECT 2026: Campus Photo Walk & Lightroom Masterclass',
      slug: 'pixel-perfect-photography-zcoer',
      description: 'Capture the stunning architectural arches, golden hour lakeside reflections, and vibrant student life across the 15-acre ZCOER Narhe campus. 3-hour themed photo hunt followed by Lightroom color grading critique.',
      category: 'Arts',
      club_id: 9, // Pixel Club
      organizer_id: 2,
      banner: 'https://zcoer.in/wp-content/uploads/2023/03/01.jpg',
      event_date: '2026-10-11',
      start_time: '07:30 AM',
      end_time: '01:30 PM',
      venue_id: 8, // Workshop Annex
      registration_deadline: '2026-10-10 20:00:00',
      max_participants: 90,
      entry_fee: 'Free',
      prize_pool: '₹25,000 + Godox Speedlite Kits',
      eligibility: 'DSLR, Mirrorless, and Smartphone photography categories',
      team_size: 'Individual (1)',
      rules: JSON.stringify([
        'Photographs must be taken inside ZCOER campus premises on contest day.',
        'No AI generation or composite cloning.'
      ]),
      schedule: JSON.stringify([
        { time: '07:30 AM', title: 'Theme Announcement at Workshop Annex' },
        { time: '08:00 AM', title: 'Campus Photo Walk Sprint' },
        { time: '11:30 AM', title: 'Photo Submission & Jury Review' }
      ]),
      faqs: JSON.stringify([
        { q: 'Can I shoot on mobile?', a: 'Yes, there is a dedicated mobile photography winner category.' }
      ]),
      contact_info: JSON.stringify({ email: 'pixel@zcoer.in', phone: '+91 7558666663', lead: 'Tanvi Sharma' }),
      status: 'published',
      is_featured: 0
    }
  ];

  const insertEvent = db.prepare(`
    INSERT INTO events (
      title, slug, description, category, club_id, organizer_id, banner, event_date,
      start_time, end_time, venue_id, registration_deadline, max_participants, entry_fee,
      prize_pool, eligibility, team_size, rules, schedule, faqs, contact_info, status, is_featured
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  events.forEach(e => {
    insertEvent.run(
      e.title, e.slug, e.description, e.category, e.club_id, e.organizer_id, e.banner,
      e.event_date, e.start_time, e.end_time, e.venue_id, e.registration_deadline,
      e.max_participants, e.entry_fee, e.prize_pool, e.eligibility, e.team_size,
      e.rules, e.schedule, typeof e.faqs === 'string' ? e.faqs : JSON.stringify(e.faqs),
      e.contact_info, e.status, e.is_featured
    );
  });
  console.log('✅ Real ZCOER Flagship Events (UDAAN, RANANGAN, TECHZEAL, SHIVJAYANTI) inserted.');

  // Helper for QR code
  async function makeQR(text) {
    try {
      return await QRCode.toDataURL(text, { width: 300, margin: 2 });
    } catch (err) {
      return text;
    }
  }

  // 5. Registrations & Attendance for Devika (student user_id = 7)
  const insertReg = db.prepare(`
    INSERT INTO registrations (registration_id, user_id, event_id, team_name, team_members, custom_fields, status, registered_at, qr_code)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertAtt = db.prepare(`
    INSERT INTO attendance (registration_id, event_id, user_id, check_in_time, status, scanned_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertCert = db.prepare(`
    INSERT INTO certificates (certificate_id, user_id, event_id, student_name, event_name, issue_date, file_path, qr_code, issued_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const devikaEvents = [
    { eventId: 1, regId: 'ZCOE-26-000184', status: 'registered', team: 'Udaan Western Fusion' },
    { eventId: 3, regId: 'ZCOE-26-000215', status: 'registered', team: 'ZCOER Code Ninjas' },
    { eventId: 2, regId: 'ZCOE-26-000302', status: 'checked_in', team: 'CS Dept Football Squad' },
    { eventId: 9, regId: 'ZCOE-26-000088', status: 'attended', team: null } // Generative AI Bootcamp Attended -> Certificate!
  ];

  for (const reg of devikaEvents) {
    const qrData = await makeQR(`ZEAL_EVENT_REG:${reg.regId}:USER_7:EVENT_${reg.eventId}`);
    insertReg.run(
      reg.regId,
      7,
      reg.eventId,
      reg.team,
      reg.team ? JSON.stringify([{ name: 'Devika Nair', email: 'student@zcoer.in' }, { name: 'Kabir Verma', email: 'kabir.verma@zcoer.in' }]) : null,
      JSON.stringify({ tshirt_size: 'M', dietary: 'Vegetarian' }),
      reg.status,
      '2026-09-20 14:30:00',
      qrData
    );

    if (reg.status === 'checked_in' || reg.status === 'attended') {
      insertAtt.run(reg.regId, reg.eventId, 7, '2026-09-22 09:45:00', 'attended', 2);
    }

    if (reg.status === 'attended') {
      const certId = 'ZCOE-CERT-2026-0089';
      const certQr = await makeQR(`ZEAL_VERIFY_CERT:${certId}:USER_7`);
      insertCert.run(
        certId,
        7,
        reg.eventId,
        'Devika Nair',
        'ZEAL GENERATIVE AI & LLM AGENT BOOTCAMP',
        '2026-09-25',
        `/certificates/${certId}.pdf`,
        certQr,
        2
      );
    }
  }

  // Registrations for other students
  for (let sId = 9; sId <= 28; sId++) {
    const targetEvent = ((sId % 6) + 1);
    const regCode = `ZCOE-26-000${String(300 + sId)}`;
    const qrCode = await makeQR(`ZEAL_EVENT_REG:${regCode}:USER_${sId}:EVENT_${targetEvent}`);
    const regStatus = (sId % 3 === 0) ? 'attended' : ((sId % 2 === 0) ? 'checked_in' : 'registered');

    insertReg.run(
      regCode,
      sId,
      targetEvent,
      null,
      null,
      JSON.stringify({ studentVerified: true }),
      regStatus,
      '2026-09-22 10:15:00',
      qrCode
    );

    if (regStatus === 'checked_in' || regStatus === 'attended') {
      insertAtt.run(regCode, targetEvent, sId, '2026-09-23 10:00:00', 'attended', 2);
    }

    if (regStatus === 'attended') {
      const certId = `ZCOE-CERT-2026-0${String(100 + sId)}`;
      const certQr = await makeQR(`ZEAL_VERIFY_CERT:${certId}:USER_${sId}`);
      insertCert.run(
        certId,
        sId,
        targetEvent,
        studentNames[sId - 9] || 'ZCOER Student',
        events[targetEvent - 1].title,
        '2026-09-26',
        `/certificates/${certId}.pdf`,
        certQr,
        2
      );
    }
  }
  console.log('✅ Registrations, Attendance records, and Verified Certificates inserted.');

  // 6. Announcements matching real ZCOER circulars
  const announcements = [
    {
      title: 'ZEAL UDAAN 2026: Official Rulebook & Stage Rehearsal Schedules',
      content: 'The official cultural rulebook, stage audition timings for the Amphitheatre, and sound check slots for Battle of Bands are now live on the portal.',
      event_id: 1,
      club_id: 2,
      priority: 'high',
      category: 'Cultural'
    },
    {
      title: 'ZEAL RANANGAN 2026: Inter-Collegiate Fixtures & Turf Allotments Released',
      content: 'Tournament draws for Football, Box Cricket, and Volleyball have been finalized by the Sports Council. Department captains must collect jersey kits from SAC Room 102.',
      event_id: 2,
      club_id: 3,
      priority: 'high',
      category: 'Sports'
    },
    {
      title: 'TECHZEAL 2026: Problem Statements for AI & Web3 Tracks Live',
      content: 'ACES & CSI Student Branch have released sponsor track problem statements for the 36-hour hackathon. Turing CCF Lab passes have been dispatched to registered teams.',
      event_id: 3,
      club_id: 1,
      priority: 'high',
      category: 'Hackathon'
    },
    {
      title: 'Shivjayanti Mahotsav: 100-Dhol Tasha Pathak Practice Schedule at Quad Plaza',
      content: 'ZCOER Vadak Pathak practice begins daily at 5:00 PM at Central Plaza. All registered volunteers must report to the cultural committee.',
      event_id: 4,
      club_id: 2,
      priority: 'medium',
      category: 'Heritage'
    },
    {
      title: 'ZCOER Autonomous Curriculum & Academic Council Updates',
      content: 'Under autonomous SPPU status, industry micro-credential credits are now applicable for students completing technical hackathons and ZCEI entrepreneurship programs.',
      event_id: null,
      club_id: null,
      priority: 'normal',
      category: 'Academic Notice'
    },
    {
      title: 'ZCEI Startup Seed Grants: Application Window Open for ₹2,50,000 Equity-Free Funding',
      content: 'Student innovators can submit business pitch decks through the EDC portal to pitch before angel investors at Kalam Seminar Hall on October 21st.',
      event_id: 7,
      club_id: 5,
      priority: 'medium',
      category: 'Incubation'
    },
    {
      title: 'NSS Blood Donation Camp on October 9th: Certificate of Honor for Donors',
      content: 'ZCOER NSS Unit invites students and faculty to join hands with Sassoon Hospital for the mega blood collection drive at SAC Room 104.',
      event_id: 11,
      club_id: 6,
      priority: 'medium',
      category: 'Social Outreach'
    },
    {
      title: 'Bus Route Schedule for Festival Days from Pune Station, Swargate & Katraj',
      content: 'Special college bus shuttles will operate at 30-minute intervals between Katraj, Swargate, Chandani Chowk and ZCOER Narhe Campus during festival days.',
      event_id: null,
      club_id: null,
      priority: 'normal',
      category: 'Logistics'
    }
  ];

  const insertAnn = db.prepare(`
    INSERT INTO announcements (title, content, event_id, club_id, priority, category)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  announcements.forEach(a => {
    insertAnn.run(a.title, a.content, a.event_id, a.club_id, a.priority, a.category);
  });

  // 7. Real Gallery Items (Moments from Udaan, Ranangan, TechZeal, Shivjayanti)
  const galleryItems = [
    {
      event_id: 1,
      club_id: 2,
      image: 'https://zcoer.in/wp-content/uploads/2023/03/07.jpg',
      caption: 'The electric crowd cheering under the spotlights during ZEAL UDAAN Battle of the Bands at ZCOER Amphitheatre.',
      category: 'Festivals',
      photographer: 'Tanvi Sharma (Pixel Club ZCOER)'
    },
    {
      event_id: 4,
      club_id: 2,
      image: 'https://zcoer.in/wp-content/uploads/2023/03/09.jpg',
      caption: '100-member student Dhol Tasha troupe performing with thunderous rhythm during Shivjayanti Mahotsav at Central Plaza.',
      category: 'Cultural',
      photographer: 'Aryan Nair (Pixel Club ZCOER)'
    },
    {
      event_id: 3,
      club_id: 1,
      image: 'https://zcoer.in/wp-content/uploads/2021/01/comp.jpg',
      caption: 'Midnight code debugging during the 36-hour TechZeal Hackathon at Turing Central Computing Facility.',
      category: 'Technical',
      photographer: 'Nikhil Chawla'
    },
    {
      event_id: 2,
      club_id: 3,
      image: 'https://zcoer.in/wp-content/uploads/2023/03/ra26.jpg',
      caption: 'Spectacular goal celebration in the finals of Zeal Ranangan State Tournament on West Campus Turf.',
      category: 'Sports',
      photographer: 'Rohan Kulkarni'
    },
    {
      event_id: 6,
      club_id: 4,
      image: 'https://zcoer.in/wp-content/uploads/2021/04/ro.jpg',
      caption: 'Sparks flying inside the polycarbonate combat arena during RoboWars showdown by Team Red Ants.',
      category: 'Competitions',
      photographer: 'Tanvi Sharma'
    },
    {
      event_id: 7,
      club_id: 5,
      image: 'https://zcoer.in/wp-content/uploads/2023/06/rd1.jpg',
      caption: 'Student founders fielding questions from venture capital judges at the ZCEI Innovation Summit.',
      category: 'Competitions',
      photographer: 'Aryan Nair'
    },
    {
      event_id: 1,
      club_id: 2,
      image: 'https://zcoer.in/wp-content/uploads/2023/03/01.jpg',
      caption: 'Classical Bharatnatyam & Kathak jugalbandi at ZEAL UDAAN Main Stage.',
      category: 'Cultural',
      photographer: 'Tanvi Sharma'
    },
    {
      event_id: 2,
      club_id: 3,
      image: 'https://zcoer.in/wp-content/uploads/2023/03/ra1.jpg',
      caption: 'Opening ceremony march past of 40 collegiate athletic squads at ZEAL RANANGAN.',
      category: 'Sports',
      photographer: 'Rohan Kulkarni'
    },
    {
      event_id: 11,
      club_id: 6,
      image: 'https://zcoer.in/wp-content/uploads/2021/04/NSS-Zeal-Photo-001.jpg',
      caption: 'ZCOER NSS youth volunteers coordinating the Sassoon mega blood donation drive.',
      category: 'Social Events',
      photographer: 'Harsh Vardhan'
    },
    {
      event_id: 1,
      club_id: 2,
      image: 'https://zcoer.in/wp-content/uploads/2023/03/14.jpg',
      caption: 'Celebrity guest concert night illuminations under the Narhe campus skies.',
      category: 'Festivals',
      photographer: 'Aryan Nair'
    }
  ];

  const insertGal = db.prepare(`
    INSERT INTO gallery (event_id, club_id, image, caption, category, photographer)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  galleryItems.forEach(g => {
    insertGal.run(g.event_id, g.club_id, g.image, g.caption, g.category, g.photographer);
  });

  // 8. Initial Notifications for Devika (user_id = 7)
  const notifs = [
    {
      user_id: 7,
      title: 'Registration Confirmed: ZEAL UDAAN 2026',
      message: 'Your admit pass #ZCOE-26-000184 for ZEAL UDAAN 2026 is confirmed. Present the QR code at the Amphitheatre security desk on event day.',
      type: 'success',
      link: '/dashboard',
      is_read: 0
    },
    {
      user_id: 7,
      title: 'Ranangan Fixtures Published',
      message: 'Football and Box Cricket knockout schedules for Computer Engineering are live.',
      type: 'info',
      link: '/events/zeal-ranangan-2026-sports-tournament',
      is_read: 0
    },
    {
      user_id: 7,
      title: 'Verified Certificate Issued!',
      message: 'Your certificate for the Zeal Generative AI Bootcamp is now ready to download from your dashboard.',
      type: 'success',
      link: '/dashboard',
      is_read: 0
    }
  ];

  const insertNotif = db.prepare(`
    INSERT INTO notifications (user_id, title, message, type, link, is_read)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  notifs.forEach(n => {
    insertNotif.run(n.user_id, n.title, n.message, n.type, n.link, n.is_read);
  });

  // Club followers for Devika
  const insertFollow = db.prepare(`
    INSERT INTO club_followers (user_id, club_id) VALUES (?, ?)
  `);
  [1, 2, 3, 4, 8].forEach(cId => {
    insertFollow.run(7, cId);
  });

  console.log('🎉 Zeal College of Engineering & Research (ZCOER, Pune) data successfully loaded!');
}

if (require.main === module) {
  seed().catch(err => {
    console.error('Error during seeding:', err);
  });
}

module.exports = seed;
