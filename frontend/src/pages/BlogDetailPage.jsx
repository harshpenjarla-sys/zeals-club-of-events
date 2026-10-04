import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Clock, Calendar, Eye, Share2,
  Check, Tag, Sparkles, BookOpen, ChevronRight,
  ExternalLink, MessageSquare, ThumbsUp
} from 'lucide-react';
import { api } from '../services/api';

export default function BlogDetailPage({ slug, onNavigate, onRegisterEvent }) {
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [relatedEvent, setRelatedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(48);

  useEffect(() => {
    async function fetchArticle() {
      setLoading(true);
      try {
        const data = await api.getBlog(slug);
        setBlog(data.blog);

        // Fetch related blogs in same category
        const allBlogs = await api.getBlogs();
        const otherBlogs = (allBlogs.blogs || []).filter((b) => b.slug !== slug);
        setRelatedBlogs(otherBlogs.slice(0, 3));

        // Fetch related event if present
        if (data.blog?.related_event_slug) {
          try {
            const evData = await api.getEvent(data.blog.related_event_slug);
            if (evData && evData.event) {
              setRelatedEvent(evData.event);
            }
          } catch (e) {}
        }
      } catch (err) {
        console.error('Failed to load article:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(blog?.title || 'Check out this article on Zeal Pulse');
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading campus article...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#07090e] text-slate-100 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Article Not Found</h2>
          <p className="text-slate-400 text-sm mb-6">
            The article you are searching for does not exist or may have been updated.
          </p>
          <button
            onClick={() => onNavigate('blog')}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-all"
          >
            Back to All Articles
          </button>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-[#07090e] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation & Breadcrumbs */}
        <div className="flex items-center justify-between mb-8 text-xs text-slate-400">
          <button
            onClick={() => onNavigate('blog')}
            className="inline-flex items-center space-x-1.5 text-purple-400 hover:text-purple-300 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Articles</span>
          </button>

          <div className="hidden sm:flex items-center space-x-2">
            <span
              onClick={() => onNavigate('home')}
              className="hover:text-white cursor-pointer"
            >
              Home
            </span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span
              onClick={() => onNavigate('blog')}
              className="hover:text-white cursor-pointer"
            >
              Blog
            </span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-slate-300 truncate max-w-[200px]">
              {blog.category}
            </span>
          </div>
        </div>

        {/* Article Meta Header */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-600/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
              {blog.category}
            </span>
            <span className="text-slate-400 text-xs flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" />
              {blog.published_at}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 text-xs flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />
              {blog.read_time}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 text-xs flex items-center">
              <Eye className="w-3.5 h-3.5 mr-1 text-slate-500" />
              {blog.views} Reads
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
            {blog.title}
          </h1>

          {/* Author Card & Social Share Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center space-x-3.5">
              <img
                src={blog.author?.avatar}
                alt={blog.author?.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/40"
              />
              <div>
                <p className="text-sm font-bold text-white">{blog.author?.name}</p>
                <p className="text-xs text-purple-400">{blog.author?.role}</p>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center space-x-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
              <button
                onClick={() => handleShare('whatsapp')}
                className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800/40 text-emerald-400 text-xs font-medium transition-all"
                title="Share on WhatsApp"
              >
                WhatsApp
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="px-3 py-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/80 border border-blue-800/40 text-blue-400 text-xs font-medium transition-all"
                title="Share on LinkedIn"
              >
                LinkedIn
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
                title="Share on X"
              >
                Twitter / X
              </button>
              <button
                onClick={handleCopyLink}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all relative"
                title="Copy Article Link"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Hero Banner Image */}
        <div className="rounded-3xl overflow-hidden mb-12 border border-slate-800 shadow-2xl relative">
          <img
            src={blog.banner}
            alt={blog.title}
            className="w-full h-72 sm:h-96 object-cover"
          />
        </div>

        {/* Formatted Article Content */}
        <div
          className="prose prose-invert prose-purple max-w-none mb-14 text-slate-300 leading-relaxed font-normal"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-6 pb-8 border-t border-slate-800 mb-10">
          <span className="text-xs text-slate-500 flex items-center mr-1">
            <Tag className="w-3.5 h-3.5 mr-1" />
            Article Tags:
          </span>
          {blog.tags?.map((t) => (
            <span
              key={t}
              className="px-3 py-1 rounded-lg text-xs bg-slate-800/80 border border-slate-700/60 text-slate-300"
            >
              #{t}
            </span>
          ))}
        </div>

        {/* Interaction bar: Like & Share */}
        <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-900/40 border border-slate-800 mb-14">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                if (!liked) {
                  setLikesCount((prev) => prev + 1);
                  setLiked(true);
                } else {
                  setLikesCount((prev) => prev - 1);
                  setLiked(false);
                }
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                liked
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{liked ? 'Liked' : 'Helpful'} ({likesCount})</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span>Written for Zeal Education Society (ZCOER, Pune)</span>
          </div>
        </div>

        {/* Related Event Call-to-Action Card (Conversion Funnel) */}
        {relatedEvent && (
          <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <img
                src={relatedEvent.banner}
                alt={relatedEvent.title}
                className="w-20 h-20 rounded-2xl object-cover border border-purple-500/30"
              />
              <div>
                <span className="text-[11px] font-bold text-purple-400 tracking-wider uppercase">
                  Featured Event
                </span>
                <h4 className="text-lg font-bold text-white leading-snug">
                  {relatedEvent.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  📅 {relatedEvent.event_date} • 📍 {relatedEvent.venue_name || 'ZCOER Narhe Campus'}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate(`events/${relatedEvent.slug}`)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 whitespace-nowrap transition-all"
            >
              Register for Event →
            </button>
          </div>
        )}

        {/* Author Bio Box */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 mb-16 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
          <img
            src={blog.author?.avatar}
            alt={blog.author?.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-purple-500/40"
          />
          <div>
            <h4 className="text-base font-bold text-white mb-1">
              About the Author: {blog.author?.name}
            </h4>
            <p className="text-xs font-semibold text-purple-400 mb-2">
              {blog.author?.role}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Engineering scholar and digital content strategist at Zeal College of Engineering and Research (ZCOER, Pune). Dedicated to applying Artificial Intelligence, modern web architectures, and data-driven marketing to empower student organizations.
            </p>
          </div>
        </div>

        {/* Related Articles Carousel / List */}
        {relatedBlogs.length > 0 && (
          <div className="pt-8 border-t border-slate-800">
            <h3 className="text-xl font-bold text-white mb-6">
              More from Zeal Campus Pulse
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedBlogs.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigate(`blog/${item.slug}`)}
                  className="group bg-slate-900/40 hover:bg-slate-900/90 rounded-2xl overflow-hidden border border-slate-800 hover:border-purple-500/40 transition-all p-4 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <img
                      src={item.banner}
                      alt={item.title}
                      className="w-full h-28 object-cover rounded-xl mb-3 group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="text-[10px] font-bold text-purple-400 uppercase">
                      {item.category}
                    </span>
                    <h5 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 mt-1 leading-snug">
                      {item.title}
                    </h5>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-3 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {item.read_time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
