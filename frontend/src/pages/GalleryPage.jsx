import React, { useState, useEffect } from 'react';
import { Camera, X, Download, Filter, Sparkles, User, Calendar } from 'lucide-react';
import { api } from '../services/api';

export default function GalleryPage({ onNavigate }) {
  const [photos, setPhotos] = useState([]);
  const [category, setCategory] = useState('All');
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Festivals', 'Technical', 'Cultural', 'Sports', 'Competitions', 'Workshops', 'Arts'];

  useEffect(() => {
    async function loadGallery() {
      setLoading(true);
      try {
        const params = category !== 'All' ? { category } : {};
        const res = await api.getGallery(params);
        setPhotos(res.gallery || []);
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-bold tracking-widest text-purple-400 uppercase">
          CAMPUS PHOTO ARCHIVES
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          MOMENTS THAT MATTER
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          High-energy concerts, intense hackathon code sprints, heart-stopping sports finishes, and backstage laughter captured through student lenses.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              category === cat
                ? 'bg-purple-600 text-white shadow-glow-purple'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry / Photo Grid */}
      {loading ? (
        <div className="py-24 text-center text-slate-400 text-sm">Loading memories...</div>
      ) : photos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setLightboxPhoto(item)}
              className={`group relative rounded-2xl overflow-hidden glass-panel border border-slate-800 cursor-pointer shadow-lg transition-all duration-300 hover:scale-[1.02] ${
                idx % 5 === 0 ? 'sm:col-span-2 sm:row-span-2 aspect-square sm:aspect-auto' : 'aspect-[4/3]'
              }`}
            >
              <img
                src={item.image}
                alt={item.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                  {item.category}
                </span>
                <p className="text-xs font-semibold text-white mt-0.5 line-clamp-2">
                  {item.caption}
                </p>
                {item.photographer && (
                  <span className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1">
                    <Camera className="w-3 h-3 text-pink-400" />
                    <span>{item.photographer}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center glass-panel rounded-3xl border border-slate-800">
          <Camera className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-400">No photos in this category yet.</p>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <div
          onClick={() => setLightboxPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full rounded-3xl glass-dropdown border border-slate-700/60 overflow-hidden shadow-2xl"
          >
            <div className="relative aspect-[16/10] bg-slate-950 max-h-[70vh]">
              <img
                src={lightboxPhoto.image}
                alt={lightboxPhoto.caption}
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setLightboxPhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-950 text-purple-300 border border-purple-500/30">
                  {lightboxPhoto.category}
                </span>
                <p className="text-sm font-semibold text-white mt-1.5">{lightboxPhoto.caption}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Captured by: <strong className="text-slate-300">{lightboxPhoto.photographer || 'Zeal Media Crew'}</strong>
                </p>
              </div>

              <a
                href={lightboxPhoto.image}
                target="_blank"
                rel="noreferrer"
                download
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-glow-purple transition-all flex-shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Open High-Res</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
