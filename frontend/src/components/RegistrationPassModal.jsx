import React from 'react';
import { X, Download, Printer, Calendar, Clock, MapPin, CheckCircle2, User, Building, QrCode } from 'lucide-react';

export default function RegistrationPassModal({ registration, isOpen, onClose }) {
  if (!isOpen || !registration) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl glass-dropdown border border-purple-500/40 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95">
        {/* Pass Actions Header */}
        <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between no-print">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-bold text-slate-200 tracking-wider uppercase">ZEAL'S DIGITAL PASS</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-slate-800 hover:bg-purple-600/30 text-slate-300 hover:text-white transition-colors"
              title="Print Pass"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-rose-600/30 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Pass Ticket Container */}
        <div id="printable-pass" className="p-6 bg-gradient-to-b from-slate-900 via-[#0d121f] to-slate-950 text-white">
          {/* Top Branding */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xl font-black tracking-wider text-white">ZEAL'S</span>
              <span className="text-[9px] font-bold tracking-[0.25em] text-purple-400 uppercase block">
                CLUB OF EVENTS
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">STATUS</span>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                registration.status === 'attended' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                registration.status === 'checked_in' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              }`}>
                {registration.status}
              </span>
            </div>
          </div>

          {/* Event Title Banner */}
          <div className="mt-4">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-950/80 text-purple-300 border border-purple-800">
              {registration.category || "CAMPUS EVENT"}
            </span>
            <h3 className="text-xl font-bold text-white mt-1.5 leading-snug">
              {registration.event_title}
            </h3>
          </div>

          {/* Event Details */}
          <div className="mt-4 grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400">Date</p>
                <p className="font-semibold text-white">{registration.event_date}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400">Time</p>
                <p className="font-semibold text-white">{registration.start_time || "Morning"}</p>
              </div>
            </div>
            <div className="col-span-2 flex items-center space-x-2 pt-2 border-t border-slate-800/80">
              <MapPin className="w-4 h-4 text-pink-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400">Venue</p>
                <p className="font-semibold text-white">{registration.venue_name || "Main Campus Hall"} ({registration.venue_location || "Central Campus"})</p>
              </div>
            </div>
          </div>

          {/* Student & QR Section */}
          <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-purple-950/30 to-blue-950/30 border border-purple-500/30 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-purple-300 tracking-wider block">ATTENDEE</span>
              <p className="text-sm font-bold text-white">{registration.student_name || "Devika Nair"}</p>
              <p className="text-xs text-slate-300 font-mono">Roll: {registration.student_id || "ZEAL-2024-CS-112"}</p>
              <p className="text-[11px] text-slate-400">{registration.department || "Computer Engineering"}</p>
              {registration.team_name && (
                <p className="text-xs font-semibold text-amber-300 mt-1">Team: {registration.team_name}</p>
              )}
            </div>

            {registration.qr_code && (
              <div className="p-2 bg-white rounded-xl shadow-lg flex-shrink-0">
                <img src={registration.qr_code} alt="QR Code" className="w-24 h-24" />
              </div>
            )}
          </div>

          {/* Ticket Barcode Strip & Verification ID */}
          <div className="mt-5 pt-4 border-t border-dashed border-slate-800 flex items-center justify-between text-xs">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Pass Number</p>
              <p className="font-mono font-bold text-purple-400 text-sm tracking-wider">
                {registration.registration_id}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400">Issued On</p>
              <p className="text-[11px] text-slate-300">
                {new Date(registration.registered_at || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-center no-print">
          <p className="text-xs text-slate-400">
            Please present this digital pass or printed QR at the entry desk for instant check-in.
          </p>
        </div>
      </div>
    </div>
  );
}
