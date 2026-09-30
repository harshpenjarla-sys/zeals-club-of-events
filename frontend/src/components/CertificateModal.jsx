import React from 'react';
import { X, Download, Award, ShieldCheck, Printer, ExternalLink } from 'lucide-react';

export default function CertificateModal({ certificate, isOpen, onClose }) {
  if (!isOpen || !certificate) return null;

  const handleDownloadPdf = () => {
    window.open(`/api/certificates/${certificate.certificate_id}/pdf`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl glass-dropdown border border-amber-500/40 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95">
        {/* Certificate Top Actions */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between no-print">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              VERIFIED INSTITUTIONAL CERTIFICATE
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadPdf}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-glow-purple transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Print Certificate"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600/30 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas Container */}
        <div className="p-8 sm:p-12 bg-[#090d16] text-slate-900 relative selection:bg-none">
          {/* Ornate Double Border */}
          <div className="border-4 border-amber-500/60 p-6 sm:p-8 rounded-2xl relative bg-gradient-to-b from-[#0e1526] to-[#070b13] text-white">
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-400" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-400" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-amber-400" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-amber-400" />

            {/* Header Branding */}
            <div className="text-center space-y-1">
              <span className="text-2xl sm:text-3xl font-black tracking-wider gradient-text-zeal uppercase">
                ZEAL'S CLUB OF EVENTS
              </span>
              <p className="text-[11px] font-bold tracking-[0.3em] text-purple-400 uppercase">
                CREATE • CONNECT • CELEBRATE
              </p>
            </div>

            {/* Certificate Title */}
            <div className="mt-8 text-center">
              <h2 className="text-xl sm:text-2xl font-black text-amber-300 tracking-wide uppercase">
                CERTIFICATE OF PARTICIPATION
              </h2>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-2" />
            </div>

            {/* Recipient Notice */}
            <div className="mt-6 text-center space-y-3">
              <p className="text-xs sm:text-sm text-slate-400 font-serif italic">
                This certificate is proudly and officially presented to
              </p>
              <p className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider font-display">
                {certificate.student_name}
              </p>
              <p className="text-xs text-slate-400 font-serif italic max-w-lg mx-auto leading-relaxed">
                for active participation, commendable dedication, and exceptional contribution during the collegiate event
              </p>
              <p className="text-lg sm:text-xl font-bold text-purple-300 px-4">
                "{certificate.event_name}"
              </p>
            </div>

            {/* Signatures & Seal Section */}
            <div className="mt-12 pt-6 border-t border-slate-800 grid grid-cols-3 items-center text-center gap-4">
              {/* Coordinator signature */}
              <div>
                <div className="w-32 border-b border-slate-600 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-slate-200">Event Coordinator</p>
                <p className="text-[10px] text-slate-400">Zeal's Club of Events</p>
              </div>

              {/* Gold Seal */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-700 p-0.5 shadow-glow-orange flex items-center justify-center">
                  <div className="w-full h-full bg-[#0a0f1d] rounded-full flex flex-col items-center justify-center text-amber-300">
                    <ShieldCheck className="w-6 h-6" />
                    <span className="text-[8px] font-black tracking-widest uppercase">VERIFIED</span>
                  </div>
                </div>
              </div>

              {/* Dean signature */}
              <div>
                <div className="w-32 border-b border-slate-600 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-slate-200">Dean, Student Affairs</p>
                <p className="text-[10px] text-slate-400">Zeal Institute of Tech</p>
              </div>
            </div>

            {/* Certificate Metadata Bar */}
            <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
              <span>Date: <strong className="text-slate-300">{certificate.issue_date}</strong></span>
              <span className="font-mono text-amber-400/90 font-semibold">
                ID: {certificate.certificate_id}
              </span>
              <a
                href={`#verify/${certificate.certificate_id}`}
                onClick={onClose}
                className="text-purple-400 hover:text-purple-300 flex items-center space-x-1"
              >
                <span>Verify Online</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
