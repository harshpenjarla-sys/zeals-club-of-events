import React from 'react';
import { Calendar, Clock, MapPin, Users, Bookmark, ArrowRight, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function EventCard({ event, onSelect, onRegisterClick, onSaveToggle }) {
  const { isAuthenticated } = useAuth();

  const isFull = event.max_participants && (event.registration_count >= event.max_participants);
  const fillPercent = event.max_participants
    ? Math.min(100, Math.round((event.registration_count / event.max_participants) * 100))
    : 0;

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please log in to save events to your bookmarks.');
      return;
    }
    try {
      await api.saveEvent(event.id);
      if (onSaveToggle) onSaveToggle(event.id);
    } catch (err) {
      console.error('Failed to toggle save:', err);
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'technical': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'cultural': return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      case 'sports': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'music': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'dance': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'entrepreneurship': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'workshops': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'competitions': return 'bg-violet-500/20 text-violet-300 border-violet-500/30';
      default: return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }
  };

  return (
    <div
      onClick={() => onSelect(event.slug || event.id)}
      className="group rounded-2xl glass-panel overflow-hidden border border-slate-800/80 hover:border-purple-500/50 hover:shadow-glow-purple transition-all duration-300 flex flex-col cursor-pointer bg-slate-900/60 dark:bg-slate-900/80"
    >
      {/* Event Poster Header */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
        <img
          src={event.banner || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200"}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border backdrop-blur-md ${getCategoryColor(event.category)}`}>
            {event.category}
          </span>
          {event.entry_fee && event.entry_fee.toLowerCase() === 'free' && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
              FREE
            </span>
          )}
        </div>

        {/* Save / Bookmark Button */}
        <button
          onClick={handleSave}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md border transition-all ${
            event.user_saved
              ? 'bg-purple-600 text-white border-purple-400'
              : 'bg-black/50 text-slate-300 hover:text-white border-white/10 hover:bg-black/70'
          }`}
          title={event.user_saved ? "Saved" : "Save event"}
        >
          <Bookmark className="w-4 h-4" />
        </button>

        {/* Date overlay badge */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
          <Calendar className="w-3.5 h-3.5 text-purple-400" />
          <span>{event.event_date}</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Organizer Club info */}
          <div className="flex items-center space-x-2 mb-2">
            {event.club_logo && (
              <img src={event.club_logo} alt="" className="w-4 h-4 rounded-full object-cover" />
            )}
            <span className="text-xs font-semibold text-purple-400 truncate">
              {event.club_name || "Zeal Council"}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
            {event.title}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Metadata info */}
        <div className="mt-4 pt-3.5 border-t border-slate-800/80 space-y-2.5 text-xs text-slate-400">
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5 truncate">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{event.start_time}</span>
            </span>
            <span className="flex items-center space-x-1.5 truncate max-w-[50%]">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span className="truncate">{event.venue_name || "Campus Venue"}</span>
            </span>
          </div>

          {/* Participants bar */}
          <div>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="flex items-center space-x-1 text-slate-400">
                <Users className="w-3 h-3 text-purple-400" />
                <span>{event.registration_count || 0} registered</span>
              </span>
              {event.max_participants && (
                <span className="text-slate-500">Max: {event.max_participants}</span>
              )}
            </div>
            {event.max_participants && (
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    fillPercent > 85 ? 'bg-rose-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
                  }`}
                  style={{ width: `${fillPercent}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-3 flex items-center justify-between gap-2">
          {event.user_registered ? (
            <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-semibold py-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span className="capitalize">{event.user_registered}</span>
            </div>
          ) : isFull ? (
            <span className="text-xs font-semibold text-rose-400 py-1.5">Registration Full</span>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRegisterClick(event);
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-glow-purple transition-all"
            >
              Register Now
            </button>
          )}

          <button
            onClick={() => onSelect(event.slug || event.id)}
            className="flex items-center space-x-1 text-xs font-semibold text-slate-300 hover:text-purple-400 transition-colors ml-auto group-hover:translate-x-0.5 duration-200"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
