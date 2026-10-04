import React from 'react';
import { Sparkles, Heart, ArrowUpRight, Mail, Phone, MapPin } from 'lucide-react';
import { InstagramIcon, LinkedinIcon, YoutubeIcon, GithubIcon } from './SocialIcons';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-[#05070a] border-t border-slate-800/80 pt-16 pb-12 text-slate-400 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-3 cursor-pointer select-none inline-flex"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500 p-0.5 flex items-center justify-center shadow-glow-purple">
                <div className="w-full h-full bg-[#07090e] rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <div>
                <span className="text-xl font-black tracking-wider text-white">ZEAL'S</span>
                <span className="text-[10px] font-bold tracking-[0.25em] text-purple-400 uppercase block -mt-1">
                  CLUB OF EVENTS
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              The premier centralized college student activity and festival management ecosystem. Empowering campus clubs, connecting passionate student organizers, and celebrating exceptional collegiate talent.
            </p>

            <div className="pt-2 text-xs text-purple-300 font-semibold tracking-wider uppercase flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Create • Connect • Celebrate</span>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('events')} className="hover:text-purple-400 transition-colors">
                  All Events
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('clubs')} className="hover:text-purple-400 transition-colors">
                  Student Clubs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('calendar')} className="hover:text-purple-400 transition-colors">
                  Event Calendar
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('map')} className="hover:text-purple-400 transition-colors">
                  Campus Venue Map
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gallery')} className="hover:text-purple-400 transition-colors">
                  Festival Gallery
                </button>
              </li>
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Community</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('blog')} className="hover:text-purple-400 transition-colors">
                  Campus Pulse (Blog)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('announcements')} className="hover:text-purple-400 transition-colors">
                  Campus News & Notices
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-purple-400 transition-colors">
                  About Zeal's
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('register')} className="hover:text-purple-400 transition-colors">
                  Join Zeal Network
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-purple-400 transition-colors">
                  Volunteer & Propose Event
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('verify')} className="hover:text-purple-400 transition-colors flex items-center space-x-1">
                  <span>Verify Certificate</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </li>
            </ul>
          </div>

          {/* Contact / Social */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">ZCOER Campus Connect</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs">Zeal College of Engineering & Research, S.No. 39, Narhe, Pune - 411041</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span className="text-xs">zcoer@zealeducation.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span className="text-xs">+91 7558666663 / 64</span>
              </li>
            </ul>

            <div className="pt-3">
              <a
                href="https://zcoer.in/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 text-xs text-purple-400 hover:text-purple-300 font-semibold"
              >
                <span>Official Portal: zcoer.in</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex items-center space-x-3 pt-3">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-purple-600/30 text-slate-300 hover:text-white flex items-center justify-center border border-slate-800 transition-colors" title="Instagram">
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-blue-600/30 text-slate-300 hover:text-white flex items-center justify-center border border-slate-800 transition-colors" title="LinkedIn">
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-rose-600/30 text-slate-300 hover:text-white flex items-center justify-center border border-slate-800 transition-colors" title="YouTube">
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-indigo-600/30 text-slate-300 hover:text-white flex items-center justify-center border border-slate-800 transition-colors" title="GitHub">
                <GithubIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Zeal Education Society's Zeal College of Engineering and Research (ZCOER, Pune). Autonomous • NAAC 'A+' Grade • DTE Code: EN-6298.</p>
          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Code of Conduct</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
