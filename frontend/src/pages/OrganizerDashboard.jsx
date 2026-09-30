import React, { useState, useEffect } from 'react';
import {
  Sparkles, Calendar, Users, QrCode, Plus, CheckCircle2,
  XCircle, Award, Download, Search, Edit3, Trash2, ArrowRight,
  Camera, Check, AlertCircle, RefreshCw, Loader2
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function OrganizerDashboard({ onNavigate }) {
  const { user, isOrganizer } = useAuth();
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [venues, setVenues] = useState([]);
  const [clubs, setClubs] = useState([]);

  // Attendance states
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [scanLoading, setScanLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  // Create Event Form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    category: 'Technical',
    club_id: 1,
    banner: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1400',
    event_date: '2026-11-05',
    start_time: '10:00 AM',
    end_time: '05:00 PM',
    venue_id: 1,
    registration_deadline: '2026-11-04 23:59:00',
    max_participants: 150,
    entry_fee: 'Free',
    prize_pool: '₹30,000',
    eligibility: 'All college students',
    team_size: 'Individual or Team (1 - 3)'
  });
  const [createSubmitting, setCreateSubmitting] = useState(false);

  // Load organizer events
  const loadOrganizerData = async () => {
    try {
      const [evRes, venRes, clRes] = await Promise.all([
        api.getEvents({ status: 'all' }),
        api.getVenues(),
        api.getClubs()
      ]);
      setEvents(evRes.events || []);
      setVenues(venRes.venues || []);
      setClubs(clRes.clubs || []);

      if (evRes.events?.length > 0 && !selectedEventId) {
        setSelectedEventId(evRes.events[0].id);
      }
    } catch (err) {
      console.error('Failed to load organizer data:', err);
    }
  };

  useEffect(() => {
    loadOrganizerData();
  }, []);

  // Load participants when selected event changes
  useEffect(() => {
    if (selectedEventId) {
      loadParticipants(selectedEventId);
    }
  }, [selectedEventId]);

  const loadParticipants = async (eventId) => {
    try {
      const res = await api.getEventParticipants(eventId);
      setParticipants(res.participants || []);
    } catch (err) {
      console.error('Failed to load participants:', err);
    }
  };

  // QR Code Attendance check-in submit
  const handleCheckInSubmit = async (e) => {
    e?.preventDefault();
    if (!scanInput.trim()) return;

    setScanLoading(true);
    setScanResult(null);
    try {
      const res = await api.scanAttendance(scanInput.trim(), selectedEventId);
      setScanResult({
        success: true,
        message: res.message,
        details: res.registration
      });
      setScanInput('');
      if (selectedEventId) loadParticipants(selectedEventId);
    } catch (err) {
      setScanResult({
        success: false,
        message: err.data?.error || err.message || 'Check-in failed'
      });
    } finally {
      setScanLoading(false);
    }
  };

  // Issue Certificate
  const handleIssueCertificate = async (participant) => {
    try {
      const res = await api.issueCertificate({
        user_id: participant.user_id,
        event_id: selectedEventId
      });
      alert(`Certificate issued: ${res.certificate.certificate_id}`);
      if (selectedEventId) loadParticipants(selectedEventId);
    } catch (err) {
      alert(err.data?.error || err.message || 'Failed to issue certificate.');
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    if (participants.length === 0) {
      alert('No participants to export.');
      return;
    }

    const headers = ['Registration ID', 'Student Name', 'Email', 'Student ID', 'Department', 'Year', 'Status', 'Registered At'];
    const rows = participants.map(p => [
      p.registration_id,
      `"${p.student_name}"`,
      p.student_email,
      p.student_id,
      `"${p.department || ''}"`,
      p.year || '',
      p.status,
      p.registered_at
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `participants_event_${selectedEventId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Create Event Form Submit
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setCreateSubmitting(true);
    try {
      await api.createEvent(newEvent);
      alert('Event successfully created and published!');
      setShowCreateModal(false);
      loadOrganizerData();
    } catch (err) {
      alert(err.data?.error || err.message || 'Failed to create event');
    } finally {
      setCreateSubmitting(false);
    }
  };

  // Delete event
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event? This will remove all associated registrations.')) return;
    try {
      await api.deleteEvent(eventId);
      setEvents(prev => prev.filter(e => e.id !== eventId));
      if (selectedEventId === eventId) setSelectedEventId(null);
    } catch (err) {
      alert(err.message || 'Failed to delete event');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            EVENT COORDINATOR & ORGANIZER STUDIO
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            ORGANIZER WORKSPACE
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage registrations, run the live QR check-in gate, export participant rosters, and issue verified certificates.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center space-x-2 shadow-glow-purple self-start sm:self-center transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'events', label: `My Managed Events (${events.length})` },
          { id: 'attendance', label: 'Live QR Attendance Scanner' },
          { id: 'participants', label: `Participant Directory (${participants.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-amber-500 text-slate-950 font-black shadow-glow-orange'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Events Management */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="p-5 rounded-3xl glass-panel border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4 bg-slate-900/60"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-950 text-purple-300 border border-purple-500/30">
                      {ev.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{ev.event_date}</span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug">{ev.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{ev.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Total Registered:</span>
                    <span className="font-bold text-white">{ev.registration_count || 0} / {ev.max_participants || '∞'}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      onClick={() => {
                        setSelectedEventId(ev.id);
                        setActiveTab('attendance');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white text-xs font-semibold flex items-center space-x-1 transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Scan Gate</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedEventId(ev.id);
                        setActiveTab('participants');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      Roster ({ev.registration_count || 0})
                    </button>

                    <button
                      onClick={() => handleDeleteEvent(ev.id)}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors ml-auto"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Live QR Attendance Gate */}
      {activeTab === 'attendance' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Scanner & Manual Entry Input */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-6 bg-slate-950">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                  REAL-TIME ATTENDANCE DESK
                </span>
                <h3 className="text-xl font-bold text-white">Event Entry Gate Scanner</h3>
              </div>
              <QrCode className="w-8 h-8 text-amber-400" />
            </div>

            {/* Select Target Event */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Event Admitting For:
              </label>
              <select
                value={selectedEventId || ''}
                onChange={(e) => setSelectedEventId(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:border-amber-500 focus:outline-none"
              >
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} ({ev.event_date})
                  </option>
                ))}
              </select>
            </div>

            {/* Simulated / Optical Scanner Input */}
            <form onSubmit={handleCheckInSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Scan QR Pass or Enter Registration ID (e.g. ZCOE-26-000184)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    placeholder="Scan barcode/QR code or paste pass number..."
                    className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm font-mono focus:border-amber-400 focus:outline-none"
                    autoFocus
                  />
                  {scanInput && (
                    <button
                      type="button"
                      onClick={() => setScanInput('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Sample QR Codes quick-test buttons for testing check-in */}
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  QUICK TEST DEMO BARCODES (Click to simulate scan):
                </span>
                <div className="flex flex-wrap gap-2">
                  {participants.slice(0, 4).map(p => (
                    <button
                      key={p.registration_id}
                      type="button"
                      onClick={() => setScanInput(p.registration_id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700 text-[11px] font-mono"
                    >
                      {p.registration_id} ({p.student_name?.split(' ')[0]})
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={scanLoading || !scanInput.trim()}
                  className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-glow-orange flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                >
                  {scanLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Verify Pass & Check In</span>
                </button>
              </div>
            </form>

            {/* Scan Feedback Banner */}
            {scanResult && (
              <div className={`p-4 rounded-2xl border animate-in fade-in ${
                scanResult.success
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
              }`}>
                <div className="flex items-start space-x-3">
                  {scanResult.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm font-bold">{scanResult.message}</p>
                    {scanResult.details && (
                      <p className="text-xs text-slate-300 mt-1">
                        Attendee: {scanResult.details.student_name} ({scanResult.details.student_id}) • Pass: {scanResult.details.registration_id}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Live Attendance Feed */}
          <div className="lg:col-span-5 p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Live Check-in Roster ({participants.filter(p => p.status === 'attended').length} Attended)
              </h4>
              <button
                onClick={() => selectedEventId && loadParticipants(selectedEventId)}
                className="text-xs text-slate-400 hover:text-white"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {participants.length > 0 ? (
                participants.map(p => (
                  <div
                    key={p.registration_id}
                    className="p-3 rounded-2xl bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-white">{p.student_name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{p.registration_id}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      p.status === 'attended' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-500">
                  No participants registered yet for this event.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Participant Directory & Certificate Issuance */}
      {activeTab === 'participants' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <label className="text-xs font-bold text-slate-400">Event:</label>
              <select
                value={selectedEventId || ''}
                onChange={(e) => setSelectedEventId(Number(e.target.value))}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none"
              >
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>{ev.title}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleExportCsv}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center space-x-2 transition-colors self-start sm:self-auto"
            >
              <Download className="w-4 h-4 text-purple-400" />
              <span>Export Participants CSV</span>
            </button>
          </div>

          {/* Table */}
          <div className="rounded-3xl glass-panel border border-slate-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Pass ID</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Student ID / Dept</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions / Certificate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {participants.map((p) => (
                    <tr key={p.registration_id} className="hover:bg-slate-900/40">
                      <td className="py-3 px-4 font-mono font-bold text-purple-400">
                        {p.registration_id}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-white">{p.student_name}</p>
                        <p className="text-[11px] text-slate-400">{p.student_email}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p>{p.student_id}</p>
                        <p className="text-[11px] text-slate-400">{p.department} ({p.year})</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          p.status === 'attended' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          p.status === 'checked_in' ? 'bg-cyan-500/20 text-cyan-300' :
                          'bg-purple-500/20 text-purple-300'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {p.certificate_id ? (
                          <span className="text-xs font-bold text-amber-400 flex items-center justify-end space-x-1">
                            <Award className="w-3.5 h-3.5" />
                            <span>Issued ({p.certificate_id})</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleIssueCertificate(p)}
                            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-[11px] border border-amber-500/30 transition-all inline-flex items-center space-x-1"
                          >
                            <Award className="w-3 h-3" />
                            <span>Issue Certificate</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CREATE EVENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl glass-dropdown border border-slate-700/80 shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Create New College Event</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                ×
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="e.g. ROBOFEST 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description *</label>
                <textarea
                  required
                  rows="3"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Detailed event information, rules, and overview..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
                  >
                    {['Technical', 'Cultural', 'Sports', 'Music', 'Dance', 'Competitions', 'Workshops', 'Entrepreneurship'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Host Club</label>
                  <select
                    value={newEvent.club_id}
                    onChange={(e) => setNewEvent({ ...newEvent, club_id: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
                  >
                    {clubs.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Campus Venue</label>
                  <select
                    value={newEvent.venue_id}
                    onChange={(e) => setNewEvent({ ...newEvent, venue_id: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
                  >
                    {venues.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Event Date *</label>
                  <input
                    type="date"
                    required
                    value={newEvent.event_date}
                    onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Start Time</label>
                  <input
                    type="text"
                    value={newEvent.start_time}
                    onChange={(e) => setNewEvent({ ...newEvent, start_time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">End Time</label>
                  <input
                    type="text"
                    value={newEvent.end_time}
                    onChange={(e) => setNewEvent({ ...newEvent, end_time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Max Participants</label>
                  <input
                    type="number"
                    value={newEvent.max_participants}
                    onChange={(e) => setNewEvent({ ...newEvent, max_participants: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Entry Fee</label>
                  <input
                    type="text"
                    value={newEvent.entry_fee}
                    onChange={(e) => setNewEvent({ ...newEvent, entry_fee: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Prize Pool</label>
                  <input
                    type="text"
                    value={newEvent.prize_pool}
                    onChange={(e) => setNewEvent({ ...newEvent, prize_pool: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createSubmitting}
                  className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-glow-purple disabled:opacity-50"
                >
                  {createSubmitting ? 'Publishing...' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
