import React, { useState, useEffect } from 'react';
import {
  Sparkles, Calendar, Users, MapPin, Trophy, ArrowRight,
  ChevronLeft, ChevronRight, Search, CheckCircle2, Flame,
  Compass, Layers, Clock, Award, ShieldCheck, HeartHandshake,
  Play, Video, Film, ExternalLink, Music, Activity, Cpu, Flag
} from 'lucide-react';
import { api } from '../services/api';
import EventCard from '../components/EventCard';
import CampusMap from '../components/CampusMap';

export default function HomePage({ onNavigate, onRegisterEvent }) {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categories, setCategories] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [timeframe, setTimeframe] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [galleryHighlights, setGalleryHighlights] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [activeVideoTab, setActiveVideoTab] = useState('campus');

  // Official ZCOER Video Library
  const videoLibrary = [
    {
      id: 'campus',
      title: 'ZCOER Campus Tour & Life at Narhe',
      subtitle: 'Experience our 15-acre lush campus, computing labs, and academic atmosphere.',
      embedUrl: 'https://www.youtube-nocookie.com/embed/MsyFh-CAIKI?autoplay=0&rel=0',
      badge: 'Official Campus Tour',
      tag: 'Campus Life'
    },
    {
      id: 'udaan',
      title: 'ZEAL UDAAN: Grand Cultural & Star Concert Night',
      subtitle: 'Electrifying stage performances, Battle of Bands, and celebrity DJ concerts at the Open Air Amphitheatre.',
      embedUrl: 'https://www.youtube-nocookie.com/embed/hjk9_D958Pc?autoplay=0&rel=0',
      badge: 'Annual Mega Fest',
      tag: 'Cultural Festival'
    }
  ];

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        const [featRes, catRes, annRes, galRes] = await Promise.all([
          api.getFeaturedEvents(),
          api.getCategories(),
          api.getAnnouncements({ priority: 'high' }),
          api.getGallery()
        ]);
        setFeaturedEvents(featRes.events || []);
        setCategories(catRes.categories || []);
        setRecentAnnouncements(annRes.announcements?.slice(0, 3) || []);
        setGalleryHighlights(galRes.gallery?.slice(0, 4) || []);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      }
    }
    loadData();
  }, []);

  // Load filtered upcoming events
  useEffect(() => {
    async function loadUpcoming() {
      setLoadingEvents(true);
      try {
        const params = {};
        if (activeCategory !== 'All') params.category = activeCategory;
        if (timeframe !== 'all') params.timeframe = timeframe;
        if (searchQuery.trim()) params.search = searchQuery.trim();

        const res = await api.getEvents(params);
        setUpcomingEvents(res.events || []);
      } catch (err) {
        console.error('Failed to load upcoming events:', err);
      } finally {
        setLoadingEvents(false);
      }
    }
    loadUpcoming();
  }, [activeCategory, timeframe, searchQuery]);

  // Featured carousel auto slide
  useEffect(() => {
    if (featuredEvents.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredEvents]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length);
  };

  const selectedVideo = videoLibrary.find(v => v.id === activeVideoTab) || videoLibrary[0];

  return (
    <div className="space-y-24 pb-20">
      {/* 0. INSTITUTIONAL HEADER BAR WITH OFFICIAL LOGO & ACCREDITATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="rounded-2xl p-4 sm:p-5 glass-panel border border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-indigo-950/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src="https://zcoer.in/wp-content/uploads/2025/02/ZCOER-Logo-1-scaled.jpg"
              alt="Zeal College of Engineering & Research Logo"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-contain bg-white p-1 shadow-md border border-slate-700/60 flex-shrink-0"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-purple-400">
                  Zeal Education Society's
                </span>
                <span className="text-slate-500 hidden sm:inline">•</span>
                <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">Estd. 1996</span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-white leading-tight">
                Zeal College of Engineering and Research, Pune
              </h2>
              <p className="text-[11px] text-slate-300 font-medium">
                Autonomous Institute Affiliated to SPPU • Narhe, Pune - 411041
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>NAAC 'A+' Grade</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-black uppercase tracking-wider">
              Autonomous SPPU
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[10px] font-black uppercase tracking-wider">
              NBA Accredited
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase tracking-wider">
              DTE Code: EN-6298
            </div>
          </div>
        </div>
      </section>

      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[80vh] flex items-center justify-center pt-2 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 -right-20 w-[450px] h-[450px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-pink-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            {/* Live Indicator Badge */}
            <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-purple-500/30 text-purple-300 text-xs font-semibold backdrop-blur-xl shadow-glow-purple">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>COLLEGIATE FESTIVAL & CLUB ENGAGEMENT HUB</span>
              <span className="text-slate-500">•</span>
              <span className="text-pink-400 font-bold">ZCOER PUNE</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.08]">
                ZEAL'S CLUB OF EVENTS <br />
                <span className="gradient-text-zeal">CREATE. CONNECT. CELEBRATE.</span>
              </h1>
              <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
                The centralized portal for Zeal College of Engineering and Research. Discover upcoming national hackathons, cultural rock fests, state sports tournaments, and student club chapters.
              </p>
            </div>

            {/* Quick Filter Tag Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 max-w-3xl mx-auto">
              <button
                onClick={() => { setActiveCategory('Cultural'); }}
                className="px-3.5 py-1.5 rounded-full bg-purple-950/60 hover:bg-purple-600 border border-purple-500/30 text-white text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
              >
                <span>🎭</span>
                <span>ZEAL UDAAN</span>
              </button>
              <button
                onClick={() => { setActiveCategory('Sports'); }}
                className="px-3.5 py-1.5 rounded-full bg-amber-950/60 hover:bg-amber-600 border border-amber-500/30 text-white text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
              >
                <span>🏆</span>
                <span>ZEAL RANANGAN</span>
              </button>
              <button
                onClick={() => { setActiveCategory('Technical'); }}
                className="px-3.5 py-1.5 rounded-full bg-blue-950/60 hover:bg-blue-600 border border-blue-500/30 text-white text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
              >
                <span>💻</span>
                <span>TECHZEAL</span>
              </button>
              <button
                onClick={() => { setActiveCategory('Cultural'); }}
                className="px-3.5 py-1.5 rounded-full bg-orange-950/60 hover:bg-orange-600 border border-orange-500/30 text-white text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
              >
                <span>🚩</span>
                <span>SHIVJAYANTI</span>
              </button>
              <button
                onClick={() => { setActiveCategory('Technical'); }}
                className="px-3.5 py-1.5 rounded-full bg-red-950/60 hover:bg-red-600 border border-red-500/30 text-white text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
              >
                <span>🤖</span>
                <span>ROBOWARS</span>
              </button>
              <button
                onClick={() => { setActiveCategory('Entrepreneurship'); }}
                className="px-3.5 py-1.5 rounded-full bg-emerald-950/60 hover:bg-emerald-600 border border-emerald-500/30 text-white text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
              >
                <span>🚀</span>
                <span>ZCEI PITCH</span>
              </button>
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
              <button
                onClick={() => onNavigate('events')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-pink-500 shadow-glow-purple flex items-center justify-center space-x-2.5 transition-all transform hover:scale-[1.02]"
              >
                <span>Explore All Events</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('clubs')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold text-slate-200 hover:text-white glass-panel hover:bg-white/10 border border-slate-700/80 flex items-center justify-center space-x-2 transition-all"
              >
                <Users className="w-4 h-4 text-purple-400" />
                <span>Student Clubs & Chapters</span>
              </button>
            </div>

            {/* Institutional Stat Counters */}
            <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 border-t border-slate-800/80">
              <div className="p-4 rounded-2xl glass-panel text-center">
                <p className="text-2xl sm:text-3xl font-black text-white font-display">1996</p>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Zeal Legacy</p>
              </div>
              <div className="p-4 rounded-2xl glass-panel text-center">
                <p className="text-2xl sm:text-3xl font-black text-purple-400 font-display">12</p>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Student Chapters</p>
              </div>
              <div className="p-4 rounded-2xl glass-panel text-center">
                <p className="text-2xl sm:text-3xl font-black text-pink-400 font-display">9,000+</p>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Campus Scholars</p>
              </div>
              <div className="p-4 rounded-2xl glass-panel text-center">
                <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-display">₹5.5L+</p>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Prize Pools & Grants</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ZEAL IN MOTION: OFFICIAL VIDEO ARCHIVES & CAMPUS LIFE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl glass-panel p-6 sm:p-10 border border-purple-500/30 bg-gradient-to-b from-purple-950/20 via-slate-950 to-blue-950/20 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div>
              <span className="text-xs font-bold tracking-widest text-pink-400 uppercase flex items-center space-x-1.5">
                <Film className="w-4 h-4 text-pink-400" />
                <span>OFFICIAL VIDEO BROADCAST</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">
                ZEAL IN MOTION: CAMPUS & FEST LIFE
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                Watch high-energy highlights from ZEAL UDAAN concerts, RANANGAN athletics, and 15-acre Narhe campus walk-throughs directly from the official Zeal YouTube channel.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <a
                href="https://www.youtube.com/user/zealedusoc"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 text-xs font-bold flex items-center space-x-2 transition-all shadow-md"
              >
                <span>Zeal YouTube Channel</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Video Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {videoLibrary.map(v => (
              <button
                key={v.id}
                onClick={() => setActiveVideoTab(v.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                  activeVideoTab === v.id
                    ? 'bg-purple-600 text-white shadow-glow-purple'
                    : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>{v.title}</span>
              </button>
            ))}
          </div>

          {/* Responsive Embedded Video Player */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-purple-500/40 shadow-2xl bg-black aspect-video relative group">
              <iframe
                src={selectedVideo.embedUrl}
                title={selectedVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <div className="lg:col-span-4 space-y-5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="space-y-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {selectedVideo.badge}
                </span>
                <h3 className="text-lg font-black text-white">{selectedVideo.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedVideo.subtitle}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <span>Narhe Campus, Pune - 411041</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-pink-400" />
                  <span>100-Dhol Tasha Troupe & Rock Bands</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>State Championship Sports Turf</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('events')}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-glow-purple transition-all flex items-center justify-center space-x-1.5"
              >
                <span>Browse Fest Passes & Fixtures</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED EVENTS CAROUSEL WITH ORIGINAL ZCOER PHOTOS */}
      {featuredEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold tracking-widest text-purple-400 uppercase flex items-center space-x-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>OFFICIAL FLAGSHIP HIGHLIGHTS</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                FEATURED FESTIVALS & CHALLENGES
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={prevSlide}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Previous event"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Next event"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Carousel Slide Card */}
          <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800/80 shadow-2xl bg-slate-950">
            {featuredEvents.map((event, idx) => {
              if (idx !== currentSlide) return null;
              return (
                <div key={event.id} className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] animate-in fade-in duration-300">
                  {/* Left Event Info */}
                  <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {event.category}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-500/20 text-pink-300 border border-pink-500/30">
                          Prize: {event.prize_pool || "Recognition"}
                        </span>
                        {event.club_name && (
                          <span className="text-xs text-slate-400">by {event.club_name}</span>
                        )}
                      </div>

                      <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                        {event.title}
                      </h3>

                      <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                        {event.description}
                      </p>

                      <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-300">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-purple-400" />
                          <span>{event.event_date} ({event.start_time})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-pink-400" />
                          <span className="truncate">{event.venue_name || "Campus Venue"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-4">
                      <button
                        onClick={() => onRegisterEvent(event)}
                        className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-glow-purple transition-all"
                      >
                        Register Digital Pass
                      </button>
                      <button
                        onClick={() => onNavigate(`events/${event.slug}`)}
                        className="px-5 py-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 hover:bg-white/5 transition-colors"
                      >
                        View Full Itinerary & Rules →
                      </button>
                    </div>
                  </div>

                  {/* Right Image Banner (Authentic ZCOER Photo) */}
                  <div className="lg:col-span-6 relative bg-slate-950 overflow-hidden min-h-[300px]">
                    <img
                      src={event.banner}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs text-slate-300">
                      Registration Deadline: {event.registration_deadline?.split(' ')[0]}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Carousel Indicators */}
            <div className="absolute bottom-4 left-8 sm:left-12 flex items-center space-x-2">
              {featuredEvents.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentSlide ? 'w-8 bg-purple-500 shadow-glow-purple' : 'w-2 bg-slate-700'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. EVENT CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest text-purple-400 uppercase">
            EXPLORE DIVERSE INTERESTS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            CAMPUS EVENT DOMAINS
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Filter activities across tech hackathons, UDAAN performing arts, RANANGAN athletics, robotics battles, and startup summits.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => {
                  setActiveCategory(isSelected ? 'All' : cat.name);
                }}
                className={`p-4 rounded-2xl glass-panel text-left flex flex-col justify-between h-28 border transition-all duration-200 group ${
                  isSelected
                    ? 'bg-purple-600/30 border-purple-500 shadow-glow-purple'
                    : 'border-slate-800/80 hover:border-purple-500/40 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-purple-500 text-white' : 'bg-slate-800 text-purple-400 group-hover:bg-purple-600 group-hover:text-white'
                  }`}>
                    <Layers className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {cat.count} {cat.count === 1 ? 'event' : 'events'}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                    {cat.name}
                  </h4>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. "WHAT'S HAPPENING?" UPCOMING DISCOVERY GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold tracking-widest text-purple-400 uppercase">
              LIVE SCHEDULE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              WHAT'S HAPPENING?
            </h2>
          </div>

          {/* Timeframe Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Dates' },
              { id: 'today', label: 'Today' },
              { id: 'this-week', label: 'This Week' },
              { id: 'this-month', label: 'This Month' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setTimeframe(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  timeframe === tab.id
                    ? 'bg-purple-600 text-white shadow-glow-purple'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search bar & Active filter badge */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search upcoming events..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-xs focus:border-purple-500 focus:outline-none"
            />
          </div>

          {activeCategory !== 'All' && (
            <div className="flex items-center space-x-2 text-xs text-purple-300">
              <span>Filtering by: <strong>{activeCategory}</strong></span>
              <button
                onClick={() => setActiveCategory('All')}
                className="text-pink-400 hover:underline text-[11px]"
              >
                (Clear Filter)
              </button>
            </div>
          )}
        </div>

        {/* Events Grid */}
        {loadingEvents ? (
          <div className="py-20 text-center text-slate-500 text-sm">
            Loading upcoming campus events...
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onSelect={(slug) => onNavigate(`events/${slug}`)}
                onRegisterClick={(ev) => onRegisterEvent(ev)}
                onSaveToggle={() => {}}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center glass-panel rounded-3xl border border-dashed border-slate-800">
            <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-base font-bold text-white">No events match your selected criteria</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting the category filter or timeframe search.</p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setTimeframe('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 text-white shadow-glow-purple"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* 6. INTERACTIVE CAMPUS VENUES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold tracking-widest text-purple-400 uppercase">
            GEOLOCATION & INFRASTRUCTURE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            CAMPUS VENUES DIRECTORY
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Explore Chhatrapati Shivaji Auditorium, Olympic Sports Turf, Turing Computing Facility, and Kalam Hall.
          </p>
        </div>

        <CampusMap onSelectEvent={(slug) => onNavigate(`events/${slug}`)} />
      </section>

      {/* 7. MOMENTS THAT MATTER - GALLERY HIGHLIGHTS WITH ORIGINAL PHOTOS */}
      {galleryHighlights.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold tracking-widest text-purple-400 uppercase">
                AUTHENTIC PHOTO ARCHIVES
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                MOMENTS THAT MATTER AT ZCOER
              </h2>
            </div>
            <button
              onClick={() => onNavigate('gallery')}
              className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center space-x-1"
            >
              <span>View Full Gallery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryHighlights.map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigate('gallery')}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden glass-panel border border-slate-800 cursor-pointer shadow-lg"
              >
                <img
                  src={item.image}
                  alt={item.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">
                    {item.category}
                  </span>
                  <p className="text-xs font-medium text-white line-clamp-1 group-hover:text-purple-200">
                    {item.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. LATEST ANNOUNCEMENTS BANNER */}
      {recentAnnouncements.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl glass-panel p-8 border border-purple-500/30 bg-gradient-to-r from-purple-950/20 via-slate-950 to-blue-950/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-pink-400">
                  INSTITUTIONAL BULLETINS
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  Latest Campus Announcements
                </h3>
              </div>
              <button
                onClick={() => onNavigate('announcements')}
                className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center space-x-1"
              >
                <span>Read All Circulars</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  onClick={() => onNavigate('announcements')}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 cursor-pointer transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-pink-500/20 text-pink-300 border border-pink-500/30">
                      {ann.priority}
                    </span>
                    <span className="text-[10px] text-slate-500">{ann.category}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{ann.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. CALL TO ACTION - JOIN ZEAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl glass-panel p-10 sm:p-14 text-center relative overflow-hidden border border-purple-500/30 bg-gradient-to-b from-[#0e1424] to-[#07090e]">
          <div className="max-w-2xl mx-auto space-y-5 relative z-10">
            <span className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-500/40 text-purple-400 mx-auto flex items-center justify-center shadow-glow-purple">
              <Sparkles className="w-6 h-6" />
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Ready to Shape ZCOER Campus Culture?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Create an account with your institutional credentials to register for technical challenges, join our 12 active student chapters, and earn verified participation credentials.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('register')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-pink-500 shadow-glow-purple transition-all"
              >
                Create Student Account
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white glass-panel border border-slate-700 hover:bg-white/10 transition-colors"
              >
                Learn About Zeal Council
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
