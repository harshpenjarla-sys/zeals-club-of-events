import React, { useState, useEffect } from 'react';
import {
  Shield, Users, Calendar, Award, CheckCircle2, XCircle,
  TrendingUp, BarChart3, AlertTriangle, Search, Trash2,
  RefreshCw, Check, ArrowUpRight
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard({ onNavigate }) {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [dashRes, usersRes] = await Promise.all([
        api.getAdminDashboard(),
        api.getAdminUsers({ search: userSearch, role: userRoleFilter })
      ]);
      setDashboardData(dashRes);
      setUsersList(usersRes.users || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin, userRoleFilter]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.updateUserRole(userId, newRole);
      setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      alert(`User role updated to ${newRole}.`);
    } catch (err) {
      alert(err.message || 'Failed to update user role.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user?')) return;
    try {
      await api.deleteUser(userId);
      setUsersList(prev => prev.filter(u => u.id !== userId));
      alert('User deleted.');
    } catch (err) {
      alert(err.message || 'Failed to delete user.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto py-28 text-center space-y-4">
        <Shield className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Access Denied (403)</h2>
        <p className="text-xs text-slate-400">
          This portal is restricted to college administrators and Deans.
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs"
        >
          Return Home
        </button>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-rose-400">
            CENTRAL ADMINISTRATIVE CONSOLE
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            ADMIN CONTROL PANEL
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Platform governance, institutional audit reports, user role elevation, and live festival analytics.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 self-start sm:self-auto transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 8 Primary Stats Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400">Total Students</p>
          <p className="text-2xl font-black text-white">{stats.total_students || 0}</p>
          <span className="text-[10px] text-purple-400 font-semibold">Active accounts</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400">Total Events</p>
          <p className="text-2xl font-black text-white">{stats.total_events || 0}</p>
          <span className="text-[10px] text-pink-400 font-semibold">{stats.active_events || 0} Published</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400">Total Registrations</p>
          <p className="text-2xl font-black text-cyan-400">{stats.total_registrations || 0}</p>
          <span className="text-[10px] text-cyan-500 font-semibold">Admit passes</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400">Total Clubs</p>
          <p className="text-2xl font-black text-purple-400">{stats.total_clubs || 0}</p>
          <span className="text-[10px] text-purple-300 font-semibold">Institutional Guilds</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400">Today's Events</p>
          <p className="text-2xl font-black text-amber-400">{stats.today_events || 0}</p>
          <span className="text-[10px] text-amber-500 font-semibold">Active halls</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400">Overall Attendance</p>
          <p className="text-2xl font-black text-emerald-400">{stats.attendance_percentage || 0}%</p>
          <span className="text-[10px] text-emerald-500 font-semibold">{stats.total_attended || 0} Check-ins</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400">Certificates Issued</p>
          <p className="text-2xl font-black text-amber-300">{stats.certificates_issued || 0}</p>
          <span className="text-[10px] text-amber-400 font-semibold">Verified badges</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400">Coordinators</p>
          <p className="text-2xl font-black text-white">{stats.total_organizers || 0}</p>
          <span className="text-[10px] text-slate-400 font-semibold">Club leads</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview' ? 'bg-rose-600 text-white shadow-glow-magenta' : 'text-slate-400 hover:text-white'
          }`}
        >
          Analytics & Overview
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'users' ? 'bg-rose-600 text-white shadow-glow-magenta' : 'text-slate-400 hover:text-white'
          }`}
        >
          Manage Users & Roles ({usersList.length})
        </button>
      </div>

      {/* TAB 1: Analytics & Category Visuals */}
      {activeTab === 'overview' && dashboardData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Popular Events Table */}
          <div className="lg:col-span-7 p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Most Popular Events by Turnout
            </h3>

            <div className="space-y-3">
              {dashboardData.popular_events?.map((ev, i) => (
                <div key={ev.id} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="truncate pr-4">
                    <span className="text-[10px] font-mono text-purple-400">#{i + 1}</span>
                    <p className="font-bold text-white truncate">{ev.title}</p>
                    <p className="text-[11px] text-slate-400">{ev.category} • {ev.event_date}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-mono font-bold text-cyan-300">{ev.registrations} Registrations</p>
                    <p className="text-[10px] text-emerald-400">{ev.attended} Attended</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Breakdown */}
          <div className="lg:col-span-5 p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Registrations by Academic Branch
            </h3>

            <div className="space-y-3">
              {dashboardData.department_breakdown?.map(dept => (
                <div key={dept.department} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 truncate max-w-[200px]">{dept.department}</span>
                    <span className="font-bold text-white font-mono">{dept.registrations}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      style={{ width: `${Math.min(100, (dept.registrations / (stats.total_registrations || 1)) * 100 * 3)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Manage Users & Roles */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user by name, email or ID..."
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              {['all', 'student', 'organizer', 'admin'].map(r => (
                <button
                  key={r}
                  onClick={() => setUserRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                    userRoleFilter === r
                      ? 'bg-rose-600 text-white shadow-glow-magenta'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-3xl glass-panel border border-slate-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Student ID / Dept</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Change Role</th>
                    <th className="py-3 px-4 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-900/40">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={u.profile_image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-semibold text-white">{u.name}</p>
                            <p className="text-[11px] text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p>{u.student_id || 'N/A'}</p>
                        <p className="text-[11px] text-slate-400">{u.department || 'General'}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'admin' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                          u.role === 'organizer' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white text-[11px] focus:outline-none"
                        >
                          <option value="student">Student</option>
                          <option value="organizer">Organizer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {u.id !== 1 && (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
    </div>
  );
}
