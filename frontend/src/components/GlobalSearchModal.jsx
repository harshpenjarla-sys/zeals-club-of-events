import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Calendar, Users, Megaphone, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export default function GlobalSearchModal({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await api.searchGlobal(query);
        setResults(data);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (route) => {
    onNavigate(route);
    onClose();
  };

  const hasResults = results && (
    (results.events?.length || 0) +
    (results.clubs?.length || 0) +
    (results.announcements?.length || 0) +
    (results.venues?.length || 0) > 0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-md transition-opacity">
      <div className="w-full max-w-2xl rounded-2xl glass-dropdown border border-slate-700/60 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-700/60 bg-slate-900/50">
          <Search className="w-5 h-5 text-purple-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, clubs, announcements, venues... (e.g. 'hack', 'dance', 'turing')"
            className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-base focus:outline-none"
          />
          {loading ? (
            <Loader2 className="w-5 h-5 text-purple-400 animate-spin mr-2" />
          ) : query ? (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-white mr-2">
              <X className="w-4 h-4" />
            </button>
          ) : null}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5">
          {!query.trim() && (
            <div className="py-8 text-center">
              <p className="text-sm text-slate-400">Type a keyword to discover events, student clubs, or campus venues.</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {['Hackathon', 'Coding Club', 'Rhythm', 'Auditorium', 'Badminton', 'AI Bootcamp'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1 rounded-full text-xs bg-slate-800/80 hover:bg-purple-600/20 text-slate-300 hover:text-purple-300 border border-slate-700 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query.trim() && !loading && !hasResults && (
            <div className="py-10 text-center">
              <p className="text-slate-400 text-sm">No campus matches found for <span className="text-white font-semibold">"{query}"</span></p>
              <p className="text-xs text-slate-500 mt-1">Try searching by category, event title, or club name.</p>
            </div>
          )}

          {/* Events Results */}
          {results?.events?.length > 0 && (
            <div>
              <div className="flex items-center text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                Events ({results.events.length})
              </div>
              <div className="space-y-1.5">
                {results.events.map(ev => (
                  <div
                    key={ev.id}
                    onClick={() => handleSelect(`events/${ev.slug}`)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-900/20 hover:border-purple-500/30 border border-transparent cursor-pointer transition-all group"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      <div className="truncate">
                        <p className="text-sm font-medium text-white group-hover:text-purple-300 truncate">{ev.title}</p>
                        <p className="text-xs text-slate-400">{ev.event_date} • <span className="text-slate-300">{ev.category}</span></p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-transform group-hover:translate-x-1" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clubs Results */}
          {results?.clubs?.length > 0 && (
            <div>
              <div className="flex items-center text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
                <Users className="w-3.5 h-3.5 mr-1.5" />
                Clubs ({results.clubs.length})
              </div>
              <div className="space-y-1.5">
                {results.clubs.map(c => (
                  <div
                    key={c.id}
                    onClick={() => handleSelect(`clubs/${c.slug}`)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-900/20 hover:border-blue-500/30 border border-transparent cursor-pointer transition-all group"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <img src={c.logo} alt="" className="w-7 h-7 rounded-lg object-cover" />
                      <div className="truncate">
                        <p className="text-sm font-medium text-white group-hover:text-blue-300 truncate">{c.name}</p>
                        <p className="text-xs text-slate-400">{c.category} • {c.members_count} members</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-transform group-hover:translate-x-1" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Venues Results */}
          {results?.venues?.length > 0 && (
            <div>
              <div className="flex items-center text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                <MapPin className="w-3.5 h-3.5 mr-1.5" />
                Venues ({results.venues.length})
              </div>
              <div className="space-y-1.5">
                {results.venues.map(v => (
                  <div
                    key={v.id}
                    onClick={() => handleSelect(`map`)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-900/20 hover:border-emerald-500/30 border border-transparent cursor-pointer transition-all group"
                  >
                    <div>
                      <p className="text-sm font-medium text-white group-hover:text-emerald-300">{v.name} ({v.code})</p>
                      <p className="text-xs text-slate-400">{v.location} • Capacity: {v.capacity}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-transform group-hover:translate-x-1" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Announcements Results */}
          {results?.announcements?.length > 0 && (
            <div>
              <div className="flex items-center text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                <Megaphone className="w-3.5 h-3.5 mr-1.5" />
                Announcements ({results.announcements.length})
              </div>
              <div className="space-y-1.5">
                {results.announcements.map(a => (
                  <div
                    key={a.id}
                    onClick={() => handleSelect(`announcements`)}
                    className="p-2.5 rounded-xl hover:bg-amber-900/20 border border-transparent cursor-pointer transition-all"
                  >
                    <p className="text-sm font-medium text-white truncate">{a.title}</p>
                    <p className="text-xs text-slate-400">{a.category} • Priority: {a.priority}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="px-4 py-2.5 bg-slate-950/70 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Navigate with mouse or click item to view</span>
          <span className="text-[11px] text-slate-500">Zeal Search Engine</span>
        </div>
      </div>
    </div>
  );
}
