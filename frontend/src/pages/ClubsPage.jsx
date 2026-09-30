import React, { useState, useEffect } from 'react';
import { Users, Search, Sparkles, ArrowRight, UserPlus, Check, Calendar } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ClubsPage({ onNavigate }) {
  const { isAuthenticated } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Technical', 'Music', 'Dance', 'Sports', 'Arts', 'Entrepreneurship', 'Literary', 'Cultural', 'Social Events'];

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== 'All') params.category = category;
      if (search.trim()) params.search = search.trim();
      const res = await api.getClubs(params);
      setClubs(res.clubs || []);
    } catch (err) {
      console.error('Failed to load clubs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, [category, search]);

  const handleFollowToggle = async (e, clubId) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please log in to follow campus clubs and receive club bulletins.');
      return;
    }
    try {
      const res = await api.followClub(clubId);
      setClubs(prev => prev.map(c => {
        if (c.id === clubId) {
          return {
            ...c,
            is_following: res.following,
            members_count: res.following ? c.members_count + 1 : Math.max(0, c.members_count - 1)
          };
        }
        return c;
      }));
    } catch (err) {
      console.error('Follow error:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="space-y-3">
        <span className="text-xs font-bold tracking-widest text-purple-400 uppercase">
          STUDENT ORGANIZATIONS & GUILDS
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          EXPLORE OUR CLUBS
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          From algorithmic competitive coding to high-energy rock bands, street dramatics, and venture startup incubators. Find your tribe, collaborate, and make your mark.
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
              placeholder="Search clubs by name or keywords..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  category === cat
                    ? 'bg-purple-600 text-white shadow-glow-purple'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clubs Grid */}
      {loading ? (
        <div className="py-24 text-center text-slate-400 text-sm">
          Loading student clubs...
        </div>
      ) : clubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <div
              key={club.id}
              onClick={() => onNavigate(`clubs/${club.slug}`)}
              className="rounded-3xl glass-panel border border-slate-800/80 hover:border-purple-500/50 hover:shadow-glow-purple transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer bg-slate-900/60"
            >
              {/* Cover Banner */}
              <div className="relative h-36 bg-slate-950 overflow-hidden">
                <img
                  src={club.cover_image || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000"}
                  alt={club.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-purple-300 border border-purple-500/30">
                  {club.category}
                </span>

                {/* Overlapping Club Logo */}
                <div className="absolute -bottom-4 left-6 w-14 h-14 rounded-2xl bg-slate-900 p-1 border-2 border-purple-500 shadow-glow-purple">
                  <img
                    src={club.logo}
                    alt={club.name}
                    className="w-full h-full rounded-xl object-cover"
                  />
                </div>
              </div>

              {/* Club Info */}
              <div className="p-6 pt-7 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                    {club.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {club.description}
                  </p>
                </div>

                {/* Club Stats */}
                <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    <span><strong className="text-white">{club.members_count}</strong> Members</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-pink-400" />
                    <span><strong className="text-white">{club.events_conducted}</strong> Events Hosted</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    onClick={(e) => handleFollowToggle(e, club.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                      club.is_following
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40'
                    }`}
                  >
                    {club.is_following ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onNavigate(`clubs/${club.slug}`)}
                    className="flex items-center space-x-1 text-xs font-bold text-slate-300 group-hover:text-purple-400 transition-colors"
                  >
                    <span>View Club</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center glass-panel rounded-3xl border border-slate-800">
          <p className="text-sm font-semibold text-slate-400">No clubs found matching your search.</p>
        </div>
      )}
    </div>
  );
}
