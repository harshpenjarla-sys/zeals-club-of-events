import React, { useState, useEffect } from 'react';
import { MapPin, Users, Calendar, ArrowRight, Compass, Sparkles, Check } from 'lucide-react';
import { api } from '../services/api';

export default function CampusMap({ onSelectEvent }) {
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [venueDetails, setVenueDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    async function loadVenues() {
      try {
        const res = await api.getVenues();
        setVenues(res.venues || []);
        if (res.venues?.length > 0) {
          handleSelectVenue(res.venues[0]);
        }
      } catch (err) {
        console.error('Failed to load campus venues:', err);
      }
    }
    loadVenues();
  }, []);

  const handleSelectVenue = async (venue) => {
    setSelectedVenue(venue);
    setLoadingDetails(true);
    try {
      const res = await api.getVenue(venue.id);
      setVenueDetails(res.venue);
    } catch (err) {
      console.error('Failed to load venue details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Visual Stylized Vector Interactive Campus Map Canvas */}
      <div className="lg:col-span-7 rounded-3xl glass-panel p-6 border border-slate-800/80 bg-slate-950/70 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-purple-400 animate-spin-slow" />
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              INTERACTIVE CAMPUS VENUES MAP
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">10 Key Landmarks</span>
        </div>

        {/* The Visual Campus Blueprint / Aerial Grid */}
        <div className="relative w-full aspect-[4/3] rounded-2xl bg-[#090d16] border border-slate-800/80 overflow-hidden shadow-inner flex items-center justify-center select-none">
          {/* Grid pattern background */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #8b5cf6 1px, transparent 0)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* Stylized Pathways / Campus Roads */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-800/80" strokeWidth="6" fill="none">
            <line x1="10%" y1="50%" x2="90%" y2="50%" strokeDasharray="6 6" />
            <line x1="50%" y1="10%" x2="50%" y2="90%" strokeDasharray="6 6" />
            <circle cx="50%" cy="50%" r="90" stroke="#3b82f6" strokeWidth="2" strokeOpacity="0.3" strokeDasharray="4 4" />
            <circle cx="50%" cy="50%" r="160" stroke="#8b5cf6" strokeWidth="2" strokeOpacity="0.2" strokeDasharray="6 6" />
          </svg>

          {/* Central Plaza Label */}
          <div className="absolute top-[48%] left-[46%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none opacity-40">
            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              CAMPUS QUAD
            </span>
          </div>

          {/* Venue Markers */}
          {venues.map((v) => {
            const isSelected = selectedVenue?.id === v.id;
            return (
              <button
                key={v.id}
                onClick={() => handleSelectVenue(v)}
                style={{
                  top: `${v.map_y || 50}%`,
                  left: `${v.map_x || 50}%`
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 focus:outline-none z-20 ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                }`}
                title={`${v.name} (${v.code}) - Capacity: ${v.capacity}`}
              >
                <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                  isSelected
                    ? 'bg-purple-600 border-white text-white shadow-glow-purple ring-4 ring-purple-500/30'
                    : 'bg-slate-900 border-purple-500/60 text-purple-400 hover:border-purple-400'
                }`}>
                  <MapPin className="w-4 h-4" />
                  {v.event_count > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-pink-500 text-[9px] font-bold text-white flex items-center justify-center">
                      {v.event_count}
                    </span>
                  )}
                </div>

                {/* Floating Tooltip Label */}
                <div className={`absolute top-full mt-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide pointer-events-none transition-opacity ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-md opacity-100'
                    : 'bg-black/80 text-slate-300 opacity-0 group-hover:opacity-100 border border-slate-700'
                }`}>
                  {v.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Venue Pills Navigator */}
        <div className="mt-4 flex flex-wrap gap-2">
          {venues.map(v => (
            <button
              key={v.id}
              onClick={() => handleSelectVenue(v)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                selectedVenue?.id === v.id
                  ? 'bg-purple-600 text-white shadow-glow-purple'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {v.code}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Venue Details & Scheduled Events Panel */}
      <div className="lg:col-span-5 rounded-3xl glass-panel p-6 border border-slate-800/80 bg-slate-950/70">
        {selectedVenue ? (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Venue Image */}
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-900">
              <img
                src={selectedVenue.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"}
                alt={selectedVenue.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">
                    CODE: {selectedVenue.code}
                  </span>
                  <h4 className="text-lg font-bold text-white leading-tight">
                    {selectedVenue.name}
                  </h4>
                </div>
                <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-xs font-semibold text-slate-200">
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  <span>{selectedVenue.capacity} seats</span>
                </div>
              </div>
            </div>

            {/* Description & Location */}
            <div className="space-y-2 text-xs">
              <p className="text-slate-300 leading-relaxed">
                {selectedVenue.description}
              </p>
              <div className="flex items-center space-x-2 text-slate-400 pt-1">
                <MapPin className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                <span>{selectedVenue.location}</span>
              </div>
              {selectedVenue.facilities && (
                <div className="pt-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">FACILITIES</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedVenue.facilities.split(',').map((fac, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-purple-950/40 text-purple-300 border border-purple-500/20 text-[10px]">
                        {fac.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Scheduled Events at this venue */}
            <div className="pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-white flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  <span>Upcoming at this Venue</span>
                </h5>
                <span className="text-[11px] text-purple-400 font-semibold">
                  {venueDetails?.scheduled_events?.length || 0} Events
                </span>
              </div>

              {loadingDetails ? (
                <div className="py-6 text-center text-xs text-slate-500">Loading events...</div>
              ) : venueDetails?.scheduled_events?.length > 0 ? (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {venueDetails.scheduled_events.map((ev) => (
                    <div
                      key={ev.id}
                      onClick={() => onSelectEvent(ev.slug)}
                      className="p-3 rounded-xl bg-slate-900/80 hover:bg-purple-950/30 border border-slate-800 hover:border-purple-500/40 cursor-pointer transition-all flex items-center justify-between group"
                    >
                      <div className="truncate">
                        <p className="text-xs font-bold text-white group-hover:text-purple-300 truncate">
                          {ev.title}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {ev.event_date} • {ev.start_time}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-slate-500 bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
                  No upcoming events currently scheduled at this venue.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-16 text-center text-slate-400 text-sm">
            Click on any campus pin to inspect venue capacity and events.
          </div>
        )}
      </div>
    </div>
  );
}
