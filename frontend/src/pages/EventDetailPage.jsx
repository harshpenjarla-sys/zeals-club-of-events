import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, MapPin, Users, Trophy, Award,
  Share2, Bookmark, CheckCircle2, ChevronDown, ChevronUp,
  Mail, Phone, ShieldAlert, ArrowLeft, Download, ExternalLink, Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function EventDetailPage({ slugOrId, onNavigate, onRegisterEvent, onViewPass }) {
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchEventDetails() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getEvent(slugOrId);
        setEvent(data.event);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Event not found or has been removed.');
      } finally {
        setLoading(false);
      }
    }
    fetchEventDetails();
  }, [slugOrId]);

  if (loading) {
    return (
      <div className="py-32 text-center text-slate-400 text-sm">
        Loading event details...
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Event Not Found</h2>
        <p className="text-xs text-slate-400">{error || "Could not retrieve the requested event."}</p>
        <button
          onClick={() => onNavigate('events')}
          className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs"
        >
          Back to Events
        </button>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAddToCalendar = () => {
    // Generate .ics calendar file
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Zeal Club of Events//Event Calendar//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description.replace(/\n/g, ' ')}`,
      `LOCATION:${event.venue_name || 'Zeal Institute Campus'}, ${event.venue_location || 'Pune'}`,
      `DTSTART:${event.event_date.replace(/-/g, '')}T100000Z`,
      `DTEND:${event.event_date.replace(/-/g, '')}T180000Z`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.slug}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isFull = event.max_participants && (event.registration_count >= event.max_participants);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back button */}
      <button
        onClick={() => onNavigate('events')}
        className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Events</span>
      </button>

      {/* Hero Banner Section */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800 shadow-2xl bg-slate-950">
        <div className="relative aspect-[21/9] min-h-[340px] max-h-[480px] w-full bg-slate-950">
          <img
            src={event.banner || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600"}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/60 to-transparent" />

          {/* Floating Badges */}
          <div className="absolute top-6 left-6 flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-600/80 text-white backdrop-blur-md border border-purple-400 shadow-glow-purple">
              {event.category}
            </span>
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-600/80 text-white backdrop-blur-md border border-pink-400 shadow-glow-magenta">
              Fee: {event.entry_fee}
            </span>
            {event.prize_pool && (
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/80 text-white backdrop-blur-md border border-amber-300">
                Prize Pool: {event.prize_pool}
              </span>
            )}
          </div>

          {/* Action buttons on banner */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-2">
              {event.club_name && (
                <div
                  onClick={() => onNavigate(`clubs/${event.club_slug}`)}
                  className="inline-flex items-center space-x-2 text-xs font-bold text-purple-300 bg-purple-950/70 border border-purple-500/40 px-3 py-1 rounded-xl cursor-pointer hover:bg-purple-900 transition-colors"
                >
                  {event.club_logo && (
                    <img src={event.club_logo} alt="" className="w-4 h-4 rounded-full object-cover" />
                  )}
                  <span>Organized by {event.club_name}</span>
                </div>
              )}
              <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                {event.title}
              </h1>
            </div>

            {/* Registration CTA on banner */}
            <div className="flex flex-wrap items-center gap-3">
              {event.user_registration ? (
                <button
                  onClick={() => onViewPass(event.user_registration)}
                  className="px-6 py-3.5 rounded-2xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-glow-blue flex items-center space-x-2 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>View My Admit Pass</span>
                </button>
              ) : isFull ? (
                <div className="px-6 py-3.5 rounded-2xl text-xs font-bold text-white bg-rose-600/60 border border-rose-500">
                  Registration Capacity Reached
                </div>
              ) : (
                <button
                  onClick={() => onRegisterEvent(event)}
                  className="px-8 py-3.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-pink-500 shadow-glow-purple transition-all transform hover:scale-[1.02]"
                >
                  Register Now
                </button>
              )}

              <button
                onClick={handleAddToCalendar}
                className="p-3.5 rounded-2xl glass-panel text-slate-300 hover:text-white border border-slate-700 hover:bg-white/10 transition-colors"
                title="Add to Calendar (.ics)"
              >
                <Calendar className="w-4 h-4" />
              </button>

              <button
                onClick={handleShare}
                className="p-3.5 rounded-2xl glass-panel text-slate-300 hover:text-white border border-slate-700 hover:bg-white/10 transition-colors"
                title="Share Event"
              >
                <Share2 className="w-4 h-4" />
              </button>
              {copied && (
                <span className="text-xs text-emerald-400 font-semibold animate-fade">
                  Link copied!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Details & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Description, Rules, Schedule, FAQs */}
        <div className="lg:col-span-8 space-y-10">
          {/* About Event */}
          <div className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">
              About This Event
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Schedule Itinerary Timeline */}
          {Array.isArray(event.schedule) && event.schedule.length > 0 && (
            <div className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Clock className="w-5 h-5 text-purple-400" />
                <span>Event Schedule & Timeline</span>
              </h3>

              <div className="relative pl-6 border-l-2 border-purple-500/40 space-y-6">
                {event.schedule.map((item, idx) => (
                  <div key={idx} className="relative group">
                    <span className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-purple-600 border-2 border-slate-900 group-hover:scale-125 transition-transform" />
                    <span className="text-xs font-mono font-bold text-pink-400 block">{item.time}</span>
                    <p className="text-sm font-semibold text-white mt-0.5">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rules & Guidelines */}
          {Array.isArray(event.rules) && event.rules.length > 0 && (
            <div className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-pink-400" />
                <span>Rules & Regulations</span>
              </h3>
              <ul className="space-y-3">
                {event.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-sm text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 flex-shrink-0 mt-2" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Frequently Asked Questions */}
          {Array.isArray(event.faqs) && event.faqs.length > 0 && (
            <div className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                Frequently Asked Questions
              </h3>
              <div className="space-y-3">
                {event.faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={idx} className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden">
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-white hover:text-purple-300 transition-colors"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-purple-400" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Key Event Specs & Coordinators */}
        <div className="lg:col-span-4 space-y-6">
          {/* Key Facts Card */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-5 bg-slate-900/60">
            <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest">
              EVENT SPECIFICATIONS
            </h4>

            <div className="space-y-4 text-xs">
              <div className="flex items-start space-x-3">
                <Calendar className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-400">Date & Day</p>
                  <p className="font-semibold text-white text-sm">{event.event_date}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-400">Duration</p>
                  <p className="font-semibold text-white text-sm">{event.start_time} - {event.end_time}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-pink-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-400">Venue</p>
                  <p className="font-semibold text-white text-sm">{event.venue_name || "Central Campus"}</p>
                  <p className="text-[11px] text-slate-400">{event.venue_location}</p>
                  <button
                    onClick={() => onNavigate('map')}
                    className="mt-1 text-[11px] text-purple-400 hover:underline flex items-center space-x-1"
                  >
                    <span>View on Campus Map</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Users className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-400">Team Size</p>
                  <p className="font-semibold text-white text-sm">{event.team_size}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Award className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-400">Eligibility</p>
                  <p className="font-semibold text-white text-xs">{event.eligibility}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <p className="text-slate-400">Registration Deadline</p>
                <p className="font-mono text-xs font-semibold text-rose-400 mt-0.5">
                  {event.registration_deadline}
                </p>
              </div>
            </div>

            {/* Register Button in sidebar */}
            <div className="pt-2">
              {event.user_registration ? (
                <button
                  onClick={() => onViewPass(event.user_registration)}
                  className="w-full py-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-glow-blue transition-all"
                >
                  View My Registration Pass
                </button>
              ) : isFull ? (
                <button disabled className="w-full py-3 rounded-xl text-xs font-bold text-slate-400 bg-slate-800 opacity-60">
                  Registration Full
                </button>
              ) : (
                <button
                  onClick={() => onRegisterEvent(event)}
                  className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-glow-purple transition-all"
                >
                  Register for Event
                </button>
              )}
            </div>
          </div>

          {/* Coordinator Contact Card */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4 text-xs">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Event Coordinator Contacts
            </h4>
            <div className="space-y-2 text-slate-300">
              <p className="font-semibold text-purple-300 text-sm">{event.organizer_name || "Aarav Mehta"}</p>
              <div className="flex items-center space-x-2 text-slate-400">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                <span>{event.organizer_email || "events@zeals.edu"}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-400">
                <Phone className="w-3.5 h-3.5 text-purple-400" />
                <span>{event.organizer_phone || "+91 98765 11001"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
