import React from 'react';
import { Sparkles, Trophy, Users, HeartHandshake, ShieldCheck, Target, Award, ArrowRight } from 'lucide-react';

export default function AboutPage({ onNavigate }) {
  const stats = [
    { number: '1996', label: 'Zeal Society Founded' },
    { number: 'NAAC A+', label: 'Accreditation Grade' },
    { number: '12+', label: 'Active Student Chapters' },
    { number: '9,000+', label: 'Campus Students & Alumni' }
  ];

  const leadershipTeam = [
    {
      name: 'Hon. Shri S. M. Katkar',
      role: 'Founder Director, Zeal Education Society',
      desc: 'Visionary educationist committed to transforming rural and urban students into globally competitive engineers and leaders.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
    },
    {
      name: 'Prof. Jayesh S. Katkar',
      role: 'Executive Director / Secretary, ZES',
      desc: 'Pioneering modern campus infrastructure, tech incubators (ZCEI), sports complexes, and university partnerships.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'
    },
    {
      name: 'Dr. S. A. Deokar',
      role: 'Campus Director & Principal, ZCOER',
      desc: 'Driving academic excellence, autonomous curriculum implementation under SPPU, and student club research initiatives.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'
    },
    {
      name: 'Prof. A. R. Patil',
      role: 'Dean Student Affairs & Fest Coordinator',
      desc: 'Mentoring student councils, steering annual mega-fests ZEAL UDAAN, ZEAL RANANGAN, and TECHZEAL hackathons.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-[11px] font-bold text-purple-300 uppercase tracking-widest">
          <span>ZEAL EDUCATION SOCIETY</span>
          <span>•</span>
          <span>ESTD. 1996</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white">
          ABOUT ZCOER
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-serif italic">
          "Zeal College of Engineering and Research, Pune — An Autonomous Institute Affiliated to Savitribai Phule Pune University (SPPU), Accredited by NAAC with 'A+' Grade."
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-semibold text-slate-400">
          <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-purple-300">DTE Code: EN-6298</span>
          <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300">NBA Accredited Programs</span>
          <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-blue-300">ISO 21001:2018 Certified</span>
        </div>
      </div>

      {/* 4 Animated Stats Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s, idx) => (
          <div key={idx} className="p-8 rounded-3xl glass-panel border border-slate-800 text-center space-y-2 shadow-2xl">
            <p className="text-3xl sm:text-5xl font-black text-white font-display gradient-text-zeal">
              {s.number}
            </p>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Official Vision & Mission (M1, M2, M3, M4 from zcoer.in) */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
            FOUNDATIONAL CHARTER
          </span>
          <h2 className="text-3xl font-black text-white">
            Official Vision & Mission
          </h2>
          <p className="text-xs text-slate-400">
            The guiding principles of Zeal College of Engineering and Research (ZCOER, Pune).
          </p>
        </div>

        {/* Vision Statement Banner */}
        <div className="p-8 rounded-3xl glass-panel border border-purple-500/30 bg-gradient-to-r from-purple-950/30 via-slate-900/60 to-indigo-950/30 text-center space-y-3 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30 mx-auto">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-wider">Institute Vision</h3>
          <p className="text-base text-purple-200 font-serif italic max-w-3xl mx-auto leading-relaxed">
            "To be a premier institute in technical education by imparting academic excellence, research, social and entrepreneurial attitude."
          </p>
        </div>

        {/* 4-Pillar Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-3 bg-slate-900/40 hover:border-purple-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30 font-black text-sm">
              M1
            </div>
            <h4 className="text-sm font-bold text-white">Academic Excellence</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              To achieve academic excellence through innovative teaching and learning process, industry-tailored autonomous curriculum, and practical laboratory depth.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-3 bg-slate-900/40 hover:border-blue-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30 font-black text-sm">
              M2
            </div>
            <h4 className="text-sm font-bold text-white">Research Culture</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              To imbibe the research culture for addressing industry and societal needs through patent grants, faculty-student paper publications, and live capstone projects.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-3 bg-slate-900/40 hover:border-emerald-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 font-black text-sm">
              M3
            </div>
            <h4 className="text-sm font-bold text-white">Social Attitude</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              To inculcate social attitude through active community engagement initiatives led by Zeal NSS, blood donation drives, environmental cleanups, and rural outreach.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-3 bg-slate-900/40 hover:border-amber-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center border border-amber-500/30 font-black text-sm">
              M4
            </div>
            <h4 className="text-sm font-bold text-white">Entrepreneurial Skills</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              To provide a conducive environment for building entrepreneurial skills via Zeal Centre for Excellence and Incubation (ZCEI) and seed investment grants.
            </p>
          </div>
        </div>
      </div>

      {/* Leadership Executive Council */}
      <div className="space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
            INSTITUTE GOVERNANCE
          </span>
          <h2 className="text-3xl font-black text-white">
            Zeal Leadership & Mentorship
          </h2>
          <p className="text-xs text-slate-400">
            The visionary trustees, academic directors, and campus mentors guiding student self-governance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {leadershipTeam.map((m, idx) => (
            <div key={idx} className="p-6 rounded-3xl glass-panel border border-slate-800 text-center space-y-4 hover:border-purple-500/40 transition-all">
              <img
                src={m.image}
                alt={m.name}
                className="w-24 h-24 rounded-2xl object-cover mx-auto ring-2 ring-purple-500 shadow-glow-purple"
              />
              <div>
                <h4 className="text-base font-bold text-white">{m.name}</h4>
                <p className="text-xs font-semibold text-purple-400 mt-0.5">{m.role}</p>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flagship Traditions Section */}
      <div className="p-10 rounded-3xl glass-panel border border-slate-800 space-y-6 bg-slate-900/40">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-pink-400">
            SIGNATURE FESTIVALS & TRADITIONS
          </span>
          <h3 className="text-2xl font-black text-white">The Heartbeat of ZCOER Campus Life</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every academic year, the Narhe campus pulses with high-energy festivals uniting over 15,000 attendees across Maharashtra.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20 space-y-1">
            <h4 className="text-sm font-bold text-white">ZEAL UDAAN</h4>
            <p className="text-[11px] text-slate-400">Annual grand cultural extravaganza, Battle of the Bands, celebrity nights, and dance battles.</p>
          </div>
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/20 space-y-1">
            <h4 className="text-sm font-bold text-white">ZEAL RANANGAN</h4>
            <p className="text-[11px] text-slate-400">State-level inter-collegiate sports championship with floodlit turf cricket, football & athletics.</p>
          </div>
          <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/20 space-y-1">
            <h4 className="text-sm font-bold text-white">TECHZEAL</h4>
            <p className="text-[11px] text-slate-400">National 36-hr AI/Web hackathon, RoboWars, paper presentations, and venture pitch arenas.</p>
          </div>
          <div className="p-4 rounded-2xl bg-orange-950/30 border border-orange-500/20 space-y-1">
            <h4 className="text-sm font-bold text-white">SHIVJAYANTI MAHOTSAV</h4>
            <p className="text-[11px] text-slate-400">Historic Maratha heritage tribute featuring a 100-member Dhol Tasha Pathak and traditional lezim.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="p-10 rounded-3xl glass-panel border border-purple-500/30 text-center space-y-4 bg-gradient-to-r from-purple-950/20 to-blue-950/20">
        <h3 className="text-2xl font-black text-white">Want to organize an event or lead a student chapter?</h3>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          Reach out to the Dean Student Affairs desk at ZCOER Narhe to submit event proposals or join our 12 active chapters.
        </p>
        <button
          onClick={() => onNavigate('contact')}
          className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-glow-purple"
        >
          Contact Student Council & Dean
        </button>
      </div>
    </div>
  );
}
