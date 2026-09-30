import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Layers, SlidersHorizontal, ArrowUpDown, X, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import EventCard from '../components/EventCard';

export default function EventsPage({ onNavigate, onRegisterEvent }) {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [timeframe, setTimeframe] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.getCategories();
        setCategories(res.categories || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    }
    loadCategories();
  }, []);

  // Fetch filtered events
  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory !== 'All') params.category = selectedCategory;
        if (timeframe !== 'all') params.timeframe = timeframe;
        if (search.trim()) params.search = search.trim();
        if (sortBy) params.sort = sortBy;

        const data = await api.getEvents(params);
        setEvents(data.events || []);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [selectedCategory, timeframe, sortBy, search]);

  const clearFilters = () => {
    setSelectedCategory('All');
    setTimeframe('all');
    setSortBy('date');
    setSearch('');
  };

  const isFiltered = selectedCategory !== 'All' || timeframe !== 'all' || sortBy !== 'date' || search.trim() !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="space-y-3">
        <span className="text-xs font-bold tracking-widest text-purple-400 uppercase">
          CAMPUS DISCOVERY PORTAL
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          DISCOVER ALL EVENTS
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Browse upcoming institute hackathons, cultural showdowns, sporting tournaments, and academic summits. Register online to generate admission QR passes.
        </p>
      </div>

      {/* Control Filters Bar */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-6">
        {/* Search & Sort Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by event title, description, or host club..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:border-purple-500 focus:outline-none placeholder-slate-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="sm:col-span-4 flex items-center space-x-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700/80 text-white text-xs font-semibold focus:border-purple-500 focus:outline-none"
            >
              <option value="date">Sort by: Date (Earliest First)</option>
              <option value="popularity">Sort by: Popularity (Most Registered)</option>
              <option value="deadline">Sort by: Registration Deadline</option>
              <option value="category">Sort by: Category</option>
            </select>
          </div>
        </div>

        {/* Date Timeframe Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
          <span className="text-xs font-bold text-slate-400 mr-2 flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            <span>Timeframe:</span>
          </span>
          {[
            { id: 'all', label: 'All Dates' },
            { id: 'today', label: 'Today' },
            { id: 'this-week', label: 'This Week' },
            { id: 'this-month', label: 'This Month' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTimeframe(t.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                timeframe === t.id
                  ? 'bg-purple-600 text-white shadow-glow-purple'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}

          {isFiltered && (
            <button
              onClick={clearFilters}
              className="ml-auto text-xs font-bold text-pink-400 hover:text-pink-300 flex items-center space-x-1"
            >
              <X className="w-3 h-3" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'All'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-glow-purple'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedCategory(c.name)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === c.name
                  ? 'bg-purple-600 text-white shadow-glow-purple'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {c.name} <span className="text-[10px] text-slate-500">({c.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Events Results Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Showing <span className="text-white">{events.length}</span> active events
          </p>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400">Loading events catalog...</p>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
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
          <div className="py-24 text-center glass-panel rounded-3xl border border-dashed border-slate-800">
            <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No events match your criteria</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              We couldn't find any events matching the active filter selections. Try searching with different keywords or reset your filters.
            </p>
            <button
              onClick={clearFilters}
              className="mt-5 px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-glow-purple"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
