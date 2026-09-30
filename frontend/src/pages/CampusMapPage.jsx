import React from 'react';
import { Compass, MapPin } from 'lucide-react';
import CampusMap from '../components/CampusMap';

export default function CampusMapPage({ onNavigate }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="space-y-3">
        <span className="text-xs font-bold tracking-widest text-purple-400 uppercase">
          CAMPUS NAVIGATION & VENUES
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          INTERACTIVE CAMPUS MAP
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Explore all 10 major institutional halls, innovation labs, sports stadium, and outdoor amphitheatre. Click on any landmark marker to view capacity, technical facilities, and scheduled events.
        </p>
      </div>

      <CampusMap onSelectEvent={(slug) => onNavigate(`events/${slug}`)} />
    </div>
  );
}
