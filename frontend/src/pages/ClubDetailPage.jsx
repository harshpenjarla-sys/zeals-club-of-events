import React, { useState, useEffect } from 'react';
import {
  Users, Calendar, Sparkles, ArrowLeft, Check, UserPlus,
  Mail, ExternalLink, Award, Trophy, Compass, ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';

export default function ClubDetailPage({ slugOrId, onNavigate, onRegisterEvent }) {
  const { isAuthenticated } = useAuth();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClub() {
      setLoading(true);
      try {
        const res = await api.getClub(slugOrId);
        setClub(res.club);
      } catch (err) {
        console.error('Failed to load club details:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchClub();
  }, [slugOrId]);

  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      alert('Please log in to follow campus clubs.');
      return;
    }
    try {
      const res = await api.followClub(club.id);
      setClub(prev => ({
        ...prev,
        is_following: res.following,
        members_count: res.following ? prev.members_count + 1 : Math.max(0, prev.members_count - 1)
      }));
    } catch (err) {
      console.error('Failed to toggle follow:', err);
    }
  };

  if (loading) {
    return <div className="py-32 text-center text-slate-400 text-sm">Loading club profile...</div>;
  }

  if (!club) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Club Not Found</h2>
        <button
          onClick={() => onNavigate('clubs')}
          className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs"
        >
          Back to Clubs
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back button */}
      <button
        onClick={() => onNavigate('clubs')}
        className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Clubs</span>
      </button>

      {/* Club Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800 shadow-2xl bg-slate-950">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src={club.cover_image}
            alt={club.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/60 to-transparent" />
        </div>

        {/* Club Profile Info Bar */}
        <div className="relative px-6 sm:px-10 pb-8 -mt-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex items-end space-x-4 sm:space-x-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-900 p-1.5 border-4 border-purple-500 shadow-glow-purple flex-shrink-0">
              <img
                src={club.logo}
                alt={club.name}
                className="w-full h-full rounded-2xl object-cover"
              />
            </div>
            <div className="space-y-1.5 pb-1">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-950/80 text-purple-300 border border-purple-600/40">
                {club.category}
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-white">{club.name}</h1>
              <p className="text-xs text-slate-400 flex items-center space-x-4">
                <span><strong className="text-white">{club.members_count}</strong> Active Members</span>
                <span>•</span>
                <span><strong className="text-white">{club.events_conducted}</strong> Events Conducted</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleFollowToggle}
              className={`px-6 py-3 rounded-2xl text-xs font-bold flex items-center space-x-2 transition-all shadow-lg ${
                club.is_following
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-glow-purple'
              }`}
            >
              {club.is_following ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Following Club</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Follow Club</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Mission, Team, Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Mission, About, Team */}
        <div className="lg:col-span-8 space-y-10">
          {/* Mission & About */}
          <div className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400 block mb-1">
                OUR CORE MISSION
              </span>
              <blockquote className="text-base sm:text-lg font-serif italic text-purple-200 border-l-4 border-purple-500 pl-4 py-1 leading-relaxed">
                "{club.mission}"
              </blockquote>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">About the Organization</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {club.description}
              </p>
            </div>
          </div>

          {/* Core Leadership Team */}
          {Array.isArray(club.core_team) && club.core_team.length > 0 && (
            <div className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
              <h3 className="text-base font-bold uppercase tracking-wider text-white flex items-center space-x-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span>Executive Committee & Leads</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {club.core_team.map((lead, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-center">
                    <div className="w-12 h-12 rounded-full bg-purple-600/30 text-purple-300 mx-auto flex items-center justify-center font-bold text-sm">
                      {lead.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{lead.name}</p>
                      <p className="text-[11px] text-purple-400 font-semibold">{lead.role}</p>
                      <p className="text-[10px] text-slate-500">{lead.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Events by this Club */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-white">
              Upcoming Events by {club.name}
            </h3>

            {club.upcoming_events?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {club.upcoming_events.map((ev) => (
                  <EventCard
                    key={ev.id}
                    event={{ ...ev, club_name: club.name, club_logo: club.logo }}
                    onSelect={(slug) => onNavigate(`events/${slug}`)}
                    onRegisterClick={(e) => onRegisterEvent(e)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-3xl glass-panel border border-dashed border-slate-800 text-center text-xs text-slate-400">
                No new upcoming events scheduled right now. Check back soon or follow this club for announcements!
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Contact & Club Gallery */}
        <div className="lg:col-span-4 space-y-6">
          {/* Contact & Social Links */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4 text-xs">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Club Office & Connect
            </h4>
            <div className="space-y-3 text-slate-300">
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>{club.contact_email}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Compass className="w-4 h-4 text-pink-400 flex-shrink-0" />
                <span>Room 102, Student Union Wing</span>
              </div>
            </div>

            {club.social_links && Object.keys(club.social_links).length > 0 && (
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">OFFICIAL HANDLES</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(club.social_links).map(([platform, link]) => (
                    <a
                      key={platform}
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-purple-600/30 border border-slate-800 text-slate-300 hover:text-white text-[11px] font-semibold flex items-center space-x-1.5 transition-colors"
                    >
                      <span className="capitalize">{platform}</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Club Gallery Photos */}
          {club.gallery?.length > 0 && (
            <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Moments From Our Events
              </h4>
              <div className="grid grid-cols-2 gap-2.5">
                {club.gallery.map(g => (
                  <div key={g.id} className="relative aspect-square rounded-xl overflow-hidden bg-slate-900">
                    <img src={g.image} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
