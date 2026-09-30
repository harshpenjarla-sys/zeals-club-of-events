import React, { useState, useEffect } from 'react';
import { Award, ShieldCheck, CheckCircle2, XCircle, Search, Calendar, User, Download } from 'lucide-react';
import { api } from '../services/api';

export default function VerifyCertificatePage({ certIdProp }) {
  const [certId, setCertId] = useState(certIdProp || 'ZCOE-CERT-2026-0089');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (idToVerify) => {
    const id = idToVerify || certId;
    if (!id.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await api.verifyCertificate(id.trim());
      setResult(data.certificate);
    } catch (err) {
      setError(err.data?.error || err.message || 'Certificate ID could not be verified in the institutional registry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (certIdProp) {
      setCertId(certIdProp);
      handleVerify(certIdProp);
    }
  }, [certIdProp]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center border border-amber-500/30 shadow-glow-orange">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          VERIFY CERTIFICATE
        </h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          Authenticate participation credentials and official awards issued by Zeal's Club of Events.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 shadow-2xl bg-slate-950/80 max-w-xl mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify();
          }}
          className="flex items-center space-x-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              placeholder="e.g. ZCOE-CERT-2026-0089"
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-amber-400 focus:outline-none uppercase"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-orange transition-all disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      </div>

      {/* Error state */}
      {error && (
        <div className="max-w-xl mx-auto p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start space-x-3 text-xs">
          <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <div>
            <p className="font-bold">Invalid or Unverified Certificate ID</p>
            <p className="mt-0.5 text-slate-400">{error}</p>
          </div>
        </div>
      )}

      {/* Verified Certificate Display Result */}
      {result && (
        <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-emerald-500/40 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/20 shadow-2xl space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                  OFFICIAL INSTITUTIONAL RECORD VERIFIED
                </span>
                <h3 className="text-lg font-bold text-white">Genuine Certificate of Participation</h3>
              </div>
            </div>

            <a
              href={`/api/certificates/${result.certificate_id}/pdf`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-2 shadow-glow-purple self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Official PDF</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-300">
            <div>
              <p className="text-slate-500 uppercase tracking-wider text-[10px]">Recipient</p>
              <p className="text-base font-bold text-white mt-0.5">{result.student_name}</p>
              <p className="text-slate-400">{result.student_id} • {result.department}</p>
            </div>

            <div>
              <p className="text-slate-500 uppercase tracking-wider text-[10px]">Event Title</p>
              <p className="text-base font-bold text-white mt-0.5">{result.event_name}</p>
              <p className="text-slate-400">Category: {result.event_category}</p>
            </div>

            <div>
              <p className="text-slate-500 uppercase tracking-wider text-[10px]">Certificate Number</p>
              <p className="font-mono text-purple-400 font-bold text-sm mt-0.5">{result.certificate_id}</p>
            </div>

            <div>
              <p className="text-slate-500 uppercase tracking-wider text-[10px]">Date of Issue</p>
              <p className="font-semibold text-white mt-0.5">{result.issue_date}</p>
            </div>

            <div className="sm:col-span-2 pt-2 border-t border-slate-800">
              <p className="text-slate-500 uppercase tracking-wider text-[10px]">Authorizing Authority</p>
              <p className="font-medium text-slate-200 mt-0.5">
                Dean of Student Affairs & Student Council Secretariat, Zeal Institute of Technology & Management
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
