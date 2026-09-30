import React, { useState, useEffect } from 'react';
import { Megaphone, Search, Calendar, AlertTriangle, ArrowRight, Bell, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function AnnouncementsPage({ onNavigate }) {
  const [announcements, setAnnouncements] = useState([]);
  const [priority, setPriority] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnnouncements() {
      setLoading(true);
      try {
        const params = {};
        if (priority !== 'all') params.priority = priority;
        if (search.trim()) params.search = search.trim();
        const res = await api.getAnnouncements(params);
        setAnnouncements(res.announcements || []);
      } catch (err) {
        console.error('Failed to load announcements:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnnouncements();
  }, [priority, search]);

  const getPriorityStyle = (p) => {
    switch (p?.toLowerCase()) {
      case 'high':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'medium':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-bold tracking-widest text-purple-400 uppercase">
          CAMPUS DISPATCHES & NOTICES
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          OFFICIAL ANNOUNCEMENTS
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Stay updated with timely notices on registrations opening, schedule revisions, venue changes, results announcements, and festival regulations.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search announcements..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'All Priorities' },
              { id: 'high', label: 'Urgent / High' },
              { id: 'medium', label: 'Medium' },
              { id: 'normal', label: 'Normal' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setPriority(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  priority === tab.id
                    ? 'bg-purple-600 text-white shadow-glow-purple'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Announcements List */}
      {loading ? (
        <div className="py-24 text-center text-slate-400 text-sm">Loading dispatches...</div>
      ) : announcements.length > 0 ? (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="p-6 rounded-3xl glass-panel border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getPriorityStyle(ann.priority)}`}>
                    {ann.priority} Priority
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                    {ann.category}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {new Date(ann.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">
                  {ann.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {ann.content}
                </p>
              </div>

              {ann.event_slug && (
                <button
                  onClick={() => onNavigate(`events/${ann.event_slug}`)}
                  className="px-4 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-colors self-start md:self-center flex-shrink-0"
                >
                  <span>Related Event</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center glass-panel rounded-3xl border border-slate-800">
          <Megaphone className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-400">No announcements found matching criteria.</p>
        </div>
      )}
    </div>
  );
}
