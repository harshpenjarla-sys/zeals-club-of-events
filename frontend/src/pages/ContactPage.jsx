import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { InstagramIcon, LinkedinIcon, YoutubeIcon } from '../components/SocialIcons';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="space-y-3">
        <span className="text-xs font-bold tracking-widest text-purple-400 uppercase">
          COMMUNICATIONS & INQUIRIES
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          GET IN TOUCH
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Have an event idea, sponsorship proposal, or volunteering inquiry? The Zeal Council desk is here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 p-8 rounded-3xl glass-panel border border-slate-800 shadow-2xl space-y-6">
          <h3 className="text-lg font-bold text-white">Send Us a Direct Message</h3>

          {sent ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto" />
              <p className="text-sm font-bold">Message Dispatched!</p>
              <p className="text-xs text-slate-400">Our student event coordinator will respond within 24 business hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
                    placeholder="Student or Sponsor Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
                    placeholder="contact@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject / Event Track *</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
                  placeholder="e.g. Volunteer for TECHFEST 2026 or Propose Workshop"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Message *</label>
                <textarea
                  required
                  rows="4"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
                  placeholder="Provide your query, idea, or department details..."
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-glow-purple flex items-center space-x-2 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>

        {/* Contact Info & Map placeholder */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Council Office & Directions
            </h3>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white text-sm">Zeal College of Engineering & Research (ZCOER)</p>
                  <p className="text-slate-400 mt-0.5">Survey No. 39, Narhe-Dhayari Road, Narhe, Pune - 411041, Maharashtra, India</p>
                  <p className="text-[11px] text-purple-400 mt-0.5 font-medium">Student Activity Center (SAC) & Dean Student Affairs Office</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-pink-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white text-sm">Official Inquiries</p>
                  <p className="text-slate-400">zcoer@zealeducation.com • events@zcoer.in</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white text-sm">Campus Helplines</p>
                  <p className="text-slate-400">+91 7558666663 / 64 • 020-67206000</p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://zcoer.in/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs text-purple-400 hover:text-purple-300 font-semibold underline decoration-purple-500/40"
                >
                  <span>Visit Official Institute Website: https://zcoer.in/</span>
                </a>
              </div>
            </div>

            {/* Stylized Campus Map Coordinates graphic */}
            <div className="pt-4 border-t border-slate-800">
              <div className="aspect-[16/9] rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-center p-4">
                <div>
                  <MapPin className="w-6 h-6 text-purple-400 mx-auto mb-1 animate-bounce" />
                  <p className="text-xs font-bold text-white">ZCOER Narhe Campus Grounds</p>
                  <p className="text-[10px] text-slate-500 font-mono">18.4529° N, 73.8340° E • SPPU Autonomous</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
