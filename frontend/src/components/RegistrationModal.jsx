import React, { useState } from 'react';
import { X, CheckCircle2, QrCode, Download, Calendar, MapPin, Users, ArrowRight, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function RegistrationModal({ event, isOpen, onClose, onSuccess, onNavigate }) {
  const { user, isAuthenticated } = useAuth();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [registrationResult, setRegistrationResult] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    student_id: user?.student_id || '',
    college: user?.college || 'Zeal Institute of Technology & Management',
    department: user?.department || 'Computer Science & Engineering',
    year: user?.year || '3rd Year',
    team_name: '',
    team_member_2: '',
    team_member_3: '',
    team_member_4: '',
    tshirt_size: 'L',
    dietary: 'Vegetarian',
    prior_experience: 'Intermediate'
  });

  if (!isOpen || !event) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phone || !formData.student_id) {
        setError('Please fill in all required personal identification fields.');
        return;
      }
      setError('');
      setStep(2);
    }
  };

  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const teamMembers = [];
      if (formData.team_member_2) teamMembers.push({ name: formData.team_member_2 });
      if (formData.team_member_3) teamMembers.push({ name: formData.team_member_3 });
      if (formData.team_member_4) teamMembers.push({ name: formData.team_member_4 });

      const payload = {
        event_id: event.id,
        phone: formData.phone,
        department: formData.department,
        year: formData.year,
        team_name: formData.team_name || null,
        team_members: teamMembers,
        custom_fields: {
          tshirt_size: formData.tshirt_size,
          dietary: formData.dietary,
          prior_experience: formData.prior_experience
        }
      };

      const res = await api.registerForEvent(payload);
      setRegistrationResult(res.registration);
      setStep(3);
      triggerConfetti();
      if (onSuccess) onSuccess(res.registration);
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.data?.error || err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl glass-dropdown border border-slate-700/60 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="relative px-6 py-5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">
              OFFICIAL REGISTRATION FLOW
            </span>
            <h2 className="text-lg font-bold text-white truncate max-w-md">
              {event.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step Progress Indicator */}
        <div className="px-6 py-3 bg-slate-950/40 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
              step >= 1 ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              1
            </span>
            <span className={step >= 1 ? 'text-white font-medium' : 'text-slate-500'}>Personal Info</span>
          </div>
          <div className="w-12 h-0.5 bg-slate-800" />
          <div className="flex items-center space-x-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
              step >= 2 ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              2
            </span>
            <span className={step >= 2 ? 'text-white font-medium' : 'text-slate-500'}>Event Specifics</span>
          </div>
          <div className="w-12 h-0.5 bg-slate-800" />
          <div className="flex items-center space-x-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
              step === 3 ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              3
            </span>
            <span className={step === 3 ? 'text-emerald-400 font-medium' : 'text-slate-500'}>Confirmation</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">College Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                    placeholder="student@zeals.edu"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                    placeholder="+91 98765 00000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Student Roll / PRN ID *</label>
                  <input
                    type="text"
                    required
                    value={formData.student_id}
                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                    placeholder="ZEAL-2024-CS-000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                  >
                    <option>Computer Science & Engineering</option>
                    <option>Information Technology</option>
                    <option>Artificial Intelligence & Data Science</option>
                    <option>Electronics & Telecommunication</option>
                    <option>Mechanical Engineering</option>
                    <option>Civil Engineering</option>
                    <option>Business Administration / MBA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Academic Year</label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                  >
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>Final Year</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-glow-purple flex items-center space-x-2 transition-all"
                >
                  <span>Continue to Step 2</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Event-Specific Information */}
          {step === 2 && (
            <form onSubmit={handleSubmitRegistration} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-purple-200">
                <span className="font-bold">Team Requirement:</span> {event.team_size || 'Individual'} • <span className="font-bold">Entry Fee:</span> {event.entry_fee || 'Free'}
              </div>

              {event.team_size && !event.team_size.toLowerCase().includes('individual') && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Team Name</label>
                    <input
                      type="text"
                      value={formData.team_name}
                      onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                      placeholder="e.g. Code Ninjas"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Teammate 2 Name</label>
                      <input
                        type="text"
                        value={formData.team_member_2}
                        onChange={(e) => setFormData({ ...formData, team_member_2: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
                        placeholder="Member 2 Name"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Teammate 3 Name</label>
                      <input
                        type="text"
                        value={formData.team_member_3}
                        onChange={(e) => setFormData({ ...formData, team_member_3: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
                        placeholder="Member 3 Name"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Teammate 4 Name</label>
                      <input
                        type="text"
                        value={formData.team_member_4}
                        onChange={(e) => setFormData({ ...formData, team_member_4: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
                        placeholder="Member 4 Name"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">T-Shirt / Kit Size</label>
                  <select
                    value={formData.tshirt_size}
                    onChange={(e) => setFormData({ ...formData, tshirt_size: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                  >
                    <option>S</option>
                    <option>M</option>
                    <option>L</option>
                    <option>XL</option>
                    <option>XXL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Dietary Preference</label>
                  <select
                    value={formData.dietary}
                    onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                  >
                    <option>Vegetarian</option>
                    <option>Non-Vegetarian</option>
                    <option>Vegan</option>
                    <option>Jain</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Experience Level</label>
                  <select
                    value={formData.prior_experience}
                    onChange={(e) => setFormData({ ...formData, prior_experience: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                  >
                    <option>Beginner (First time)</option>
                    <option>Intermediate</option>
                    <option>Advanced / Competitive</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white flex items-center space-x-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-pink-500 shadow-glow-purple flex items-center space-x-2 transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating Pass...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Confirm & Generate Pass</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Confirmation Pass with QR Code */}
          {step === 3 && registrationResult && (
            <div className="text-center py-4 space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow-glow-blue animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">You're Registered!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Your official festival pass has been verified and saved to your dashboard.
                </p>
              </div>

              {/* Pass Card Preview */}
              <div className="max-w-md mx-auto p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-purple-500/40 text-left shadow-2xl relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-purple-400 uppercase">
                      OFFICIAL ADMIT PASS
                    </span>
                    <h4 className="text-base font-bold text-white mt-0.5">{registrationResult.event_title}</h4>
                    <p className="text-xs text-slate-400 mt-1">{registrationResult.student_name}</p>
                    <p className="text-[11px] font-mono text-purple-300 mt-0.5">ID: {registrationResult.student_id}</p>
                  </div>

                  {registrationResult.qr_code && (
                    <div className="p-1.5 bg-white rounded-xl shadow-md">
                      <img src={registrationResult.qr_code} alt="QR Pass" className="w-20 h-20" />
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    <span>{registrationResult.event_date}</span>
                  </span>
                  <span className="font-mono text-xs font-bold text-pink-400">
                    {registrationResult.registration_id}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-glow-purple transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download / Print Pass</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onNavigate('dashboard');
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
                >
                  View in My Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
