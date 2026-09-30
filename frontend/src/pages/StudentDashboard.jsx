import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Calendar, QrCode, Award, Bell, Bookmark,
  Download, Clock, MapPin, CheckCircle2, XCircle, ArrowRight,
  Printer, Trash2, ExternalLink, Loader2
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';

export default function StudentDashboard({ onNavigate, onOpenPass, onOpenCert }) {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('registrations');
  const [registrations, setRegistrations] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [regRes, certRes, recRes] = await Promise.all([
        api.getMyRegistrations(),
        api.getMyCertificates(),
        api.getEvents({ limit: 4 })
      ]);
      setRegistrations(regRes.registrations || []);
      setCertificates(certRes.certificates || []);
      setRecommended(recRes.events?.slice(0, 3) || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-28 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Login Required</h2>
        <p className="text-xs text-slate-400">Please sign in to access your student passes and verified certificates.</p>
        <button
          onClick={() => onNavigate('login')}
          className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-glow-purple"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const handleCancelRegistration = async (regId) => {
    if (!window.confirm('Are you sure you want to cancel this event registration?')) return;
    try {
      await api.cancelRegistration(regId);
      setRegistrations(prev => prev.map(r => r.registration_id === regId ? { ...r, status: 'cancelled' } : r));
    } catch (err) {
      alert(err.message || 'Failed to cancel registration.');
    }
  };

  const activeRegistrations = registrations.filter(r => r.status !== 'cancelled');
  const attendedCount = registrations.filter(r => r.status === 'attended' || r.status === 'checked_in').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl glass-panel border border-slate-800 bg-gradient-to-r from-purple-950/30 via-slate-900 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center space-x-4">
          <img
            src={user.profile_image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-500 shadow-glow-purple"
          />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">
              STUDENT PROFILE
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Welcome back, {user.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {user.student_id || "ZEAL-CS-112"} • {user.department || "Computer Science"} • {user.year || "3rd Year"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('events')}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-glow-purple transition-all"
          >
            Find New Events
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 text-left space-y-1">
          <p className="text-xs text-slate-400 font-medium">Registered Events</p>
          <p className="text-2xl font-black text-white">{activeRegistrations.length}</p>
          <span className="text-[10px] text-purple-400">Active passes</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 text-left space-y-1">
          <p className="text-xs text-slate-400 font-medium">Events Attended</p>
          <p className="text-2xl font-black text-cyan-400">{attendedCount}</p>
          <span className="text-[10px] text-cyan-500">Verified QR check-ins</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 text-left space-y-1">
          <p className="text-xs text-slate-400 font-medium">Certificates Earned</p>
          <p className="text-2xl font-black text-amber-400">{certificates.length}</p>
          <span className="text-[10px] text-amber-500">Verified credentials</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 text-left space-y-1">
          <p className="text-xs text-slate-400 font-medium">Campus Points</p>
          <p className="text-2xl font-black text-pink-400">{attendedCount * 50 + activeRegistrations.length * 10}</p>
          <span className="text-[10px] text-pink-500">Activity score</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'registrations', label: `My Registrations (${activeRegistrations.length})` },
          { id: 'certificates', label: `My Certificates (${certificates.length})` },
          { id: 'recommended', label: 'Recommended Events' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-glow-purple'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: My Registrations */}
      {activeTab === 'registrations' && (
        <div className="space-y-4">
          {loading ? (
            <div className="py-20 text-center text-xs text-slate-400">Loading registrations...</div>
          ) : registrations.length > 0 ? (
            <div className="space-y-4">
              {registrations.map(reg => {
                const isCancelled = reg.status === 'cancelled';
                return (
                  <div
                    key={reg.id}
                    className={`p-6 rounded-3xl glass-panel border transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                      isCancelled ? 'opacity-50 border-slate-900 bg-slate-950/40' : 'border-slate-800 hover:border-purple-500/40 bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Event Banner Thumb */}
                      <img
                        src={reg.banner || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300"}
                        alt=""
                        className="w-20 h-20 rounded-2xl object-cover hidden sm:block flex-shrink-0"
                      />
                      <div className="space-y-1.5">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            reg.status === 'attended' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                            reg.status === 'checked_in' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                            reg.status === 'cancelled' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                            'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          }`}>
                            {reg.status}
                          </span>
                          <span className="font-mono text-xs text-purple-400 font-semibold">
                            #{reg.registration_id}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white hover:text-purple-300 cursor-pointer" onClick={() => onNavigate(`events/${reg.event_slug}`)}>
                          {reg.event_title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3.5 h-3.5 text-purple-400" />
                            <span>{reg.event_date} ({reg.start_time})</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3.5 h-3.5 text-pink-400" />
                            <span>{reg.venue_name || "Campus Hall"}</span>
                          </span>
                          {reg.team_name && (
                            <span className="text-amber-300 font-medium">Team: {reg.team_name}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
                      {!isCancelled && (
                        <>
                          <button
                            onClick={() => onOpenPass(reg)}
                            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-glow-purple transition-all"
                          >
                            <QrCode className="w-4 h-4" />
                            <span>Admit Pass (QR)</span>
                          </button>

                          <button
                            onClick={() => handleCancelRegistration(reg.registration_id)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors"
                            title="Cancel Registration"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => onNavigate(`events/${reg.event_slug}`)}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                      >
                        Event Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center glass-panel rounded-3xl border border-dashed border-slate-800">
              <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-white">No registrations found</p>
              <p className="text-xs text-slate-400 mt-1">Discover upcoming events and register for free admittance passes.</p>
              <button
                onClick={() => onNavigate('events')}
                className="mt-4 px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
              >
                Browse Events
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Certificates */}
      {activeTab === 'certificates' && (
        <div className="space-y-4">
          {certificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map(cert => (
                <div
                  key={cert.id}
                  className="p-6 rounded-3xl glass-panel border border-amber-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 space-y-4 shadow-xl"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block">
                        VERIFIED CREDENTIAL
                      </span>
                      <h4 className="text-base font-bold text-white mt-1">{cert.event_name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Presented to: {cert.student_name}</p>
                    </div>
                    <Award className="w-8 h-8 text-amber-400" />
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span>Issue Date: <strong className="text-slate-200">{cert.issue_date}</strong></span>
                    <span className="font-mono text-purple-300 font-semibold">{cert.certificate_id}</span>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => onOpenCert(cert)}
                      className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-glow-purple transition-all"
                    >
                      View Certificate
                    </button>
                    <a
                      href={`/api/certificates/${cert.certificate_id}/pdf`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center glass-panel rounded-3xl border border-dashed border-slate-800">
              <Award className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-white">No certificates issued yet</p>
              <p className="text-xs text-slate-400 mt-1">Attend collegiate challenges and workshops to earn verified certificates of participation.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Recommended Events */}
      {activeTab === 'recommended' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommended.map(ev => (
            <EventCard
              key={ev.id}
              event={ev}
              onSelect={(slug) => onNavigate(`events/${slug}`)}
              onRegisterClick={() => onNavigate(`events/${ev.slug}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
