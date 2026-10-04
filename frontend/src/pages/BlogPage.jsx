import React, { useState, useEffect } from 'react';
import {
  BookOpen, Search, Clock, Calendar, User, Eye,
  ArrowRight, Tag, Sparkles, TrendingUp, Filter, Share2
} from 'lucide-react';
import { api } from '../services/api';

export default function BlogPage({ onNavigate }) {
  const [blogs, setBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = [
    'All',
    'Tech & AI',
    'Digital Marketing',
    'Event Guides',
    'Cultural Highlights',
    'Sports & Fitness'
  ];

  useEffect(() => {
    async function loadBlogs() {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory !== 'All') params.category = selectedCategory;
        if (searchQuery.trim()) params.search = searchQuery.trim();
        const data = await api.getBlogs(params);
        setBlogs(data.blogs || []);
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, [selectedCategory, searchQuery]);

  const featuredBlog = blogs[0];
  const regularBlogs = blogs.slice(1);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background glowing ambience */}
      <div className="max-w-7xl mx-auto relative">
        <div className="absolute top-10 left-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-4 tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Campus Pulse & Digital Insights</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Stories, Tech & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">Campus Marketing</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            In-depth guides, artificial intelligence in campus life, student club growth strategies, and insider festival coverage from Zeal College of Engineering & Research (ZCOER, Pune).
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="mb-12 space-y-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, keywords, tags..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-inner"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                      : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Article Card */}
        {featuredBlog && selectedCategory === 'All' && !searchQuery && (
          <div className="mb-16 relative z-10">
            <div
              onClick={() => onNavigate(`blog/${featuredBlog.slug}`)}
              className="group relative rounded-3xl overflow-hidden bg-slate-900/40 border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 shadow-2xl hover:shadow-purple-900/20 cursor-pointer grid grid-cols-1 lg:grid-cols-12"
            >
              <div className="lg:col-span-7 h-64 sm:h-80 lg:h-auto overflow-hidden relative">
                <img
                  src={featuredBlog.banner}
                  alt={featuredBlog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-transparent lg:hidden" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-600/90 text-white backdrop-blur-md shadow-md uppercase tracking-wider">
                    Featured Article
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-3 text-xs text-purple-400 font-semibold mb-3">
                    <span>{featuredBlog.category}</span>
                    <span>•</span>
                    <span className="text-slate-400 flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {featuredBlog.read_time}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-purple-300 transition-colors mb-4 line-clamp-2 leading-tight">
                    {featuredBlog.title}
                  </h2>

                  <p className="text-slate-300 text-sm leading-relaxed mb-6 line-clamp-3">
                    {featuredBlog.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {featuredBlog.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-md bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                  <div className="flex items-center space-x-3">
                    <img
                      src={featuredBlog.author?.avatar}
                      alt={featuredBlog.author?.name}
                      className="w-10 h-10 rounded-full object-cover border border-purple-500/40"
                    />
                    <div>
                      <p className="text-xs font-semibold text-white">{featuredBlog.author?.name}</p>
                      <p className="text-[11px] text-slate-400">{featuredBlog.published_at}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-purple-400 text-xs font-semibold group-hover:translate-x-1 transition-transform">
                    <span>Read Full Guide</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Articles Grid */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-purple-400" />
              {selectedCategory === 'All' ? 'Latest Publications' : `${selectedCategory} Articles`}
              <span className="ml-2.5 text-xs font-normal text-slate-400 bg-slate-800/60 px-2.5 py-0.5 rounded-full border border-slate-700/50">
                {blogs.length} {blogs.length === 1 ? 'article' : 'articles'}
              </span>
            </h3>
          </div>

          {blogs.length === 0 ? (
            <div className="py-20 text-center bg-slate-900/30 rounded-3xl border border-slate-800/80">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-300 font-medium">No articles found matching your criteria</p>
              <p className="text-xs text-slate-500 mt-1">Try searching for other keywords like "SEO", "Hackathon", or "AI"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {(selectedCategory === 'All' && !searchQuery ? regularBlogs : blogs).map((blog) => (
                <article
                  key={blog.id}
                  onClick={() => onNavigate(`blog/${blog.slug}`)}
                  className="group bg-slate-900/40 hover:bg-slate-900/80 rounded-2xl overflow-hidden border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/10 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={blog.banner}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#07090e]/80 text-purple-300 backdrop-blur-md border border-purple-500/20">
                          {blog.category}
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3 flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[11px] text-slate-300">
                        <Eye className="w-3 h-3 text-slate-400" />
                        <span>{blog.views}</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      <div className="flex items-center space-x-3 text-xs text-slate-400 mb-2.5">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1 text-slate-500" />
                          {blog.published_at}
                        </span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1 text-slate-500" />
                          {blog.read_time}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 mb-2 leading-snug">
                        {blog.title}
                      </h4>

                      <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed mb-4">
                        {blog.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {blog.tags?.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-5 pt-0 border-t border-slate-800/60 mt-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2 pt-3">
                      <img
                        src={blog.author?.avatar}
                        alt={blog.author?.name}
                        className="w-7 h-7 rounded-full object-cover border border-purple-500/30"
                      />
                      <span className="text-xs text-slate-300 font-medium truncate max-w-[130px]">
                        {blog.author?.name}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-purple-400 flex items-center group-hover:translate-x-1 transition-transform pt-3">
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Student Call to Write / Contribute */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-purple-900/30 via-slate-900 to-indigo-900/30 border border-purple-500/30 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto relative z-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Write for the Official Zeal Pulse
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Are you a student club lead, hackathon winner, or tech enthusiast at ZCOER? Submit your project write-ups, event recaps, or technical tutorials and get featured on the college portal.
            </p>
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-purple-600/30 transition-all hover:scale-105"
            >
              Submit an Article Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
