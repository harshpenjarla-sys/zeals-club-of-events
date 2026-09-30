import React from 'react';
import { Compass, ArrowRight } from 'lucide-react';

export default function NotFoundPage({ onNavigate }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-purple-600/20 text-purple-400 mx-auto flex items-center justify-center border border-purple-500/40 shadow-glow-purple">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white">404 - Not Found</h1>
          <p className="text-xs text-slate-400">
            The event, club, or page you were looking for doesn't exist or has moved.
          </p>
        </div>
        <button
          onClick={() => onNavigate('home')}
          className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-glow-purple inline-flex items-center space-x-2"
        >
          <span>Return to Homepage</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
