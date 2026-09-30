import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, Layers, Filter } from 'lucide-react';
import { api } from '../services/api';

export default function CalendarPage({ onNavigate }) {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)); // Oct 2026 default
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [selectedDateStr, setSelectedDateStr] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await api.getEvents();
        setEvents(res.events || []);
      } catch (err) {
        console.error('Failed to load events for calendar:', err);
      }
    }
    loadEvents();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calendar calculations
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Map events to date strings "YYYY-MM-DD"
  const eventsByDate = {};
  events.forEach(e => {
    if (categoryFilter === 'All' || e.category === categoryFilter) {
      if (!eventsByDate[e.event_date]) {
        eventsByDate[e.event_date] = [];
      }
      eventsByDate[e.event_date].push(e);
    }
  });

  const handleDayClick = (day) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDateStr(formattedDate);
    setSelectedDayEvents(eventsByDate[formattedDate] || []);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <span className="text-xs font-bold tracking-widest text-purple-400 uppercase">
            CHRONOLOGICAL SCHEDULE
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            CAMPUS EVENT CALENDAR
          </h1>
          <p className="text-sm text-slate-400">
            Interactive month and daily view of all college tournaments, workshops, and fests.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-purple-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Technical">Technical</option>
            <option value="Cultural">Cultural</option>
            <option value="Sports">Sports</option>
            <option value="Music">Music</option>
            <option value="Competitions">Competitions</option>
            <option value="Workshops">Workshops</option>
          </select>
        </div>
      </div>

      {/* Main Calendar Card */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 shadow-2xl bg-slate-950/70">
        {/* Month Navigator */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <CalendarIcon className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {monthNames[month]} {year}
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date(2026, 9, 1))}
              className="px-3 py-1.5 rounded-xl bg-slate-900 text-xs font-semibold text-purple-400 hover:bg-slate-800 border border-slate-800"
            >
              Festival Month (Oct '26)
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 pt-6 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar Grid Cells */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mt-3">
          {/* Blank spaces for preceding month days */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[90px] sm:min-h-[110px] rounded-2xl bg-slate-950/30 border border-transparent" />
          ))}

          {/* Days of current month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dayEvents = eventsByDate[dateStr] || [];
            const isSelected = selectedDateStr === dateStr;

            return (
              <div
                key={dayNum}
                onClick={() => handleDayClick(dayNum)}
                className={`min-h-[90px] sm:min-h-[110px] p-2 sm:p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-purple-900/30 border-purple-500 shadow-glow-purple'
                    : dayEvents.length > 0
                    ? 'bg-slate-900/80 border-slate-800 hover:border-purple-500/50'
                    : 'bg-slate-950/50 border-slate-900 text-slate-600 hover:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${
                    isSelected ? 'text-purple-300 font-extrabold' : dayEvents.length > 0 ? 'text-white' : 'text-slate-500'
                  }`}>
                    {dayNum}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                  )}
                </div>

                {/* Event Pills inside Day Cell */}
                <div className="space-y-1 mt-1 overflow-hidden">
                  {dayEvents.slice(0, 2).map((ev) => (
                    <div
                      key={ev.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(`events/${ev.slug}`);
                      }}
                      className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white bg-purple-600/40 border border-purple-500/40 truncate hover:bg-purple-600 transition-colors"
                      title={ev.title}
                    >
                      {ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <span className="text-[9px] font-bold text-slate-400 block text-right">
                      +{dayEvents.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda Drawer / Schedule View */}
      {selectedDateStr && (
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-purple-500/40 bg-slate-950/80 animate-in fade-in duration-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <CalendarIcon className="w-4 h-4 text-purple-400" />
              <span>Events on {selectedDateStr} ({selectedDayEvents.length})</span>
            </h3>
            <button
              onClick={() => setSelectedDateStr('')}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>

          {selectedDayEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedDayEvents.map(ev => (
                <div
                  key={ev.id}
                  onClick={() => onNavigate(`events/${ev.slug}`)}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="truncate">
                    <span className="text-[10px] font-bold uppercase text-purple-400 block">{ev.category}</span>
                    <h4 className="text-sm font-bold text-white truncate">{ev.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 flex items-center space-x-2">
                      <span>{ev.start_time} - {ev.end_time}</span>
                      <span>•</span>
                      <span>{ev.venue_name || 'Campus Venue'}</span>
                    </p>
                  </div>
                  <button className="px-3 py-1.5 rounded-xl bg-purple-600/30 text-purple-300 text-xs font-semibold hover:bg-purple-600 hover:text-white transition-colors ml-4 flex-shrink-0">
                    Details →
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">
              No events scheduled on this date.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
