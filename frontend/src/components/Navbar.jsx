import React, { useState, useEffect } from 'react';
import {
  Sparkles, Search, Sun, Moon, Menu, X, User,
  LogOut, LayoutDashboard, Shield, Calendar, Award,
  Bookmark, ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import NotificationsDropdown from './NotificationsDropdown';

export default function Navbar({ currentRoute, onNavigate, onOpenSearch }) {
  const { user, isAuthenticated, logout, isAdmin, isOrganizer } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'events', label: 'Events' },
    { id: 'clubs', label: 'Clubs' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'blog', label: 'Blog' },
    { id: 'map', label: 'Campus Map' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'announcements', label: 'Announcements' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-[#07090e]/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl py-3'
          : 'bg-[#07090e]/60 backdrop-blur-md border-b border-white/5 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500 p-0.5 shadow-glow-purple flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#07090e] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-black tracking-wider text-white">ZEAL'S</span>
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping"></span>
                <span className="hidden xl:inline-block ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 tracking-normal">ZCOER PUNE</span>
              </div>
              <span className="text-[10px] font-bold tracking-[0.25em] text-purple-400 uppercase block -mt-1">
                CLUB OF EVENTS
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((item) => {
              const active = currentRoute === item.id || (item.id === 'events' && currentRoute.startsWith('events/')) || (item.id === 'clubs' && currentRoute.startsWith('clubs/'));
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    active
                      ? 'text-white bg-purple-600/20 border border-purple-500/40 shadow-glow-purple'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Header Action Items */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Global Search Button */}
            <button
              onClick={onOpenSearch}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 flex items-center space-x-2 transition-all focus:outline-none"
              title="Search campus events (Ctrl+K)"
            >
              <Search className="w-4 h-4 text-purple-400" />
              <span className="hidden sm:inline-block text-xs text-slate-400">Search...</span>
              <kbd className="hidden md:inline-block text-[10px] text-slate-500 font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                ⌘K
              </kbd>
            </button>

            {/* Notifications Dropdown */}
            <NotificationsDropdown />

            {/* Dark/Light Mode Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 dark:hover:bg-slate-800 transition-colors"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* Authentication Buttons / Profile */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 pr-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-purple-500/30 transition-all focus:outline-none"
                >
                  <img
                    src={user?.profile_image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"}
                    alt={user?.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-purple-500"
                  />
                  <span className="hidden sm:inline-block text-xs font-semibold text-slate-200 max-w-[100px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 rounded-2xl glass-dropdown shadow-2xl z-50 p-2 border border-slate-700/60 animate-in fade-in zoom-in-95">
                    <div className="p-3 border-b border-slate-800/80">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={user?.profile_image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"}
                          alt={user?.name}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-500"
                        />
                        <div className="truncate">
                          <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                          <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            user?.role === 'admin'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : user?.role === 'organizer'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          }`}>
                            {user?.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="py-1 space-y-0.5">
                      <button
                        onClick={() => handleNavClick('dashboard')}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-purple-600/20 rounded-xl transition-colors text-left"
                      >
                        <LayoutDashboard className="w-4 h-4 text-purple-400" />
                        <span>Student Dashboard</span>
                      </button>

                      {isOrganizer && (
                        <button
                          onClick={() => handleNavClick('organizer-dashboard')}
                          className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-amber-300 hover:text-amber-200 hover:bg-amber-600/20 rounded-xl transition-colors text-left"
                        >
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <span>Organizer Studio</span>
                        </button>
                      )}

                      {isAdmin && (
                        <button
                          onClick={() => handleNavClick('admin-dashboard')}
                          className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-rose-300 hover:text-rose-200 hover:bg-rose-600/20 rounded-xl transition-colors text-left"
                        >
                          <Shield className="w-4 h-4 text-rose-400" />
                          <span>Admin Control Panel</span>
                        </button>
                      )}
                    </div>

                    <div className="pt-1 mt-1 border-t border-slate-800">
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                          handleNavClick('home');
                        }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-pink-500 shadow-glow-purple transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 pb-4 border-t border-slate-800/80 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="grid grid-cols-2 gap-1.5">
              {navLinks.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-colors ${
                    currentRoute === item.id
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {isAuthenticated ? (
              <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col space-y-2">
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-purple-600/30 text-purple-200 text-left flex items-center space-x-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Go to Student Dashboard</span>
                </button>
                {isOrganizer && (
                  <button
                    onClick={() => handleNavClick('organizer-dashboard')}
                    className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-amber-500/20 text-amber-200 text-left flex items-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Organizer Studio</span>
                  </button>
                )}
                {isAdmin && (
                  <button
                    onClick={() => handleNavClick('admin-dashboard')}
                    className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-rose-500/20 text-rose-200 text-left flex items-center space-x-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </button>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </header>
  );
}
