'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  publishedAt: string;
  readTime: number;
  isTrending: boolean;
  isFeatured: boolean;
  tags: string[];
}

// ─── Category config ───────────────────────────────────────────────────────────
type Category = 'All' | 'Market' | 'Policy' | 'Investment' | 'Luxury' | 'Commercial' | 'Residential';

const CATEGORIES: Category[] = ['All', 'Market', 'Policy', 'Investment', 'Luxury', 'Commercial', 'Residential'];

const CATEGORY_COLORS: Record<string, string> = {
  Market:      'bg-blue-600/90 text-white border-blue-400/50',
  Policy:      'bg-purple-600/90 text-white border-purple-400/50',
  Investment:  'bg-emerald-600/90 text-white border-emerald-400/50',
  Luxury:      'bg-amber-500/90 text-white border-amber-300/50',
  Commercial:  'bg-cyan-600/90 text-white border-cyan-400/50',
  Residential: 'bg-rose-600/90 text-white border-rose-400/50',
};

const ARTICLES_PER_PAGE = 6;

// ─── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function CategoryPill({ category }: { category: string }) {
  const colorClass = CATEGORY_COLORS[category] ?? 'bg-gray-600/90 text-white border-gray-400/50';
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-md shadow-sm ${colorClass} w-fit`}>
      {category}
    </span>
  );
}

function NewsCard({ article, index }: { article: NewsArticle; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group relative flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden
                 hover:border-blue-300 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
    >
      <Link href={`/latest-updates/${article.slug}`} className="absolute inset-0 z-10" aria-label={article.title} />

      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={article.coverImage || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&auto=format&fit=crop&q=80"}
          alt={article.title}
          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&auto=format&fit=crop&q=80'; }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <CategoryPill category={article.category} />
        </div>
        {article.isTrending && (
          <div className="absolute top-3 right-3 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shadow-sm">
            🔥 Trending
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="text-slate-900 font-bold text-lg leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
          {article.title}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-100">
          <img
            src={article.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(article.author || 'Admin')}`}
            alt={article.author}
            onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(article.author || 'Admin')}`; }}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
          />
          <div className="flex-1 min-w-0">
            <p className="text-slate-800 text-xs font-semibold truncate">{article.author}</p>
          </div>
          <span className="text-slate-500 text-xs whitespace-nowrap">{formatDate(article.publishedAt)}</span>
          <span className="text-blue-600 font-semibold text-xs whitespace-nowrap">{article.readTime} min read</span>
        </div>
      </div>
    </motion.div>
  );
}

function FeaturedCard({ article }: { article: NewsArticle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="group relative grid md:grid-cols-2 bg-white border border-gray-100 rounded-3xl overflow-hidden
                 hover:shadow-2xl hover:scale-[1.01] transition-all duration-400"
    >
      <Link href={`/latest-updates/${article.slug}`} className="absolute inset-0 z-10" aria-label={article.title} />

      {/* Left – image */}
      <div className="relative h-72 md:h-auto overflow-hidden">
        <img
          src={article.coverImage || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&auto=format&fit=crop&q=80"}
          alt={article.title}
          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&auto=format&fit=crop&q=80'; }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/90 md:block hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/90 md:hidden" />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            ⭐ Featured
          </span>
          <CategoryPill category={article.category} />
        </div>
      </div>

      {/* Right – content */}
      <div className="flex flex-col justify-center p-8 lg:p-12 gap-5 relative z-20">
        <h2 className="text-slate-900 font-bold text-2xl md:text-3xl leading-tight group-hover:text-blue-600 transition-colors">
          {article.title}
        </h2>
        <p className="text-slate-600 text-base leading-relaxed line-clamp-3">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
          <img
            src={article.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(article.author || 'Admin')}`}
            alt={article.author}
            onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(article.author || 'Admin')}`; }}
            className="w-12 h-12 rounded-full object-cover ring-4 ring-slate-50"
          />
          <div>
            <p className="text-slate-900 font-bold text-sm">{article.author}</p>
            <p className="text-slate-500 text-xs">{article.authorRole}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-slate-500 text-xs font-medium">{formatDate(article.publishedAt)}</p>
            <p className="text-blue-600 font-bold text-xs">{article.readTime} min read</p>
          </div>
        </div>
        <div className="relative z-20 mt-2">
          <Link href={`/latest-updates/${article.slug}`} className="inline-flex items-center gap-2 text-blue-600 text-sm font-bold group-hover:gap-3 transition-all">
            Read Full Article
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function TrendingCard({ article, index }: { article: NewsArticle; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex-shrink-0 w-72 md:w-auto md:flex-1 bg-white/5 border border-white/10 rounded-2xl overflow-hidden
                 hover:border-emerald-500/40 hover:shadow-[0_8px_32px_rgba(212,175,55,0.12)]
                 hover:scale-[1.02] transition-all duration-300"
    >
      <Link href={`/latest-updates/${article.slug}`} className="absolute inset-0 z-10" aria-label={article.title} />

      <div className="relative h-36 overflow-hidden">
        <img
          src={article.coverImage || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&auto=format&fit=crop&q=80"}
          alt={article.title}
          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&auto=format&fit=crop&q=80'; }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent" />
        <div className="absolute top-3 left-3 bg-amber-500 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-sm">
          #{index + 1} Trending
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2">
        <CategoryPill category={article.category} />
        <h4 className="text-white text-sm font-semibold line-clamp-2 group-hover:text-blue-500 transition-colors leading-snug">
          {article.title}
        </h4>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-white/40 text-xs">{formatDate(article.publishedAt)}</span>
          <span className="text-white/20 text-xs">·</span>
          <span className="text-emerald-500 text-xs">{article.readTime} min</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Animated Section Wrapper ──────────────────────────────────────────────────
function SectionInView({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function NewsClient({ newsData }: { newsData: NewsArticle[] }) {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [currentPage, setCurrentPage] = useState(1);

  const featuredArticle = useMemo(() => newsData.find((a) => a.isFeatured) ?? newsData[0], []);
  const trendingArticles = useMemo(() => newsData.filter((a) => a.isTrending).slice(0, 3), []);

  const filteredArticles = useMemo(() => {
    let list = newsData.filter((a) => !a.isFeatured);
    if (activeCategory !== 'All') list = list.filter((a) => a.category === activeCategory);
    return list;
  }, [activeCategory]);

  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  );

  const handleCategoryChange = (cat: Category) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-48 md:pt-56 pb-20 px-4 bg-[#0F172A] text-white">
        {/* Background layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(212,175,55,0.12)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(30,58,138,0.3)_0%,_transparent_60%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-blue-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            <span className="text-amber-500 text-xs font-semibold uppercase tracking-widest">
              Real Estate Intelligence
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-4"
          >
            Market Insights &amp;{' '}
            <br className="hidden md:block" />Real Estate News
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/60 text-lg max-w-2xl mx-auto mb-10"
          >
            Expert analysis, policy updates, and investment intelligence from India's
            fastest-growing real estate markets — curated by A to I Infra.
          </motion.p>

        </div>
      </section>

      {/* ── Featured Article ─────────────────────────────────────────────── */}
      {featuredArticle && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <SectionInView>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-blue-500 rounded-full" />
                <h2 className="text-4xl lg:text-5xl font-serif font-bold text-slate-900">Featured Story</h2>
              </div>
              <FeaturedCard article={featuredArticle} />
            </SectionInView>
          </div>
        </section>
      )}

        {/* ── Trending ─────────────────────────────────────────────────────── */}
        {trendingArticles.length > 0 && (
          <section className="py-12 bg-[#0F172A]">
            <div className="max-w-7xl mx-auto px-4">
              <SectionInView>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                  <h2 className="text-4xl lg:text-5xl font-serif font-bold text-white">🔥 Trending Now</h2>
                </div>
                <div className="flex md:grid md:grid-cols-3 gap-5 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
                  {trendingArticles.map((article, i) => (
                    <TrendingCard key={article.id} article={article} index={i} />
                  ))}
                </div>
              </SectionInView>
            </div>
          </section>
        )}

        {/* ── Category Filter + Grid ────────────────────────────────────────── */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionInView>
            {/* Filters row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-amber-500 rounded-full" />
                <h2 className="text-4xl lg:text-5xl font-serif font-bold text-slate-900">All Articles</h2>
              </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  id={`filter-${cat.toLowerCase()}`}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200
                    ${activeCategory === cat
                      ? 'bg-rose-500 text-white border-amber-500 shadow-[0_0_16px_rgba(212,175,55,0.4)]'
                      : 'bg-white text-slate-600 border-gray-200 hover:border-rose-500/40 hover:text-blue-600 shadow-sm'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            {paginatedArticles.length > 0 ? (
              <motion.div
                key={`${activeCategory}-${currentPage}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {paginatedArticles.map((article, i) => (
                  <NewsCard key={article.id} article={article} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-slate-600 text-lg">No articles found in this category.</p>
                <button
                  onClick={() => { setActiveCategory('All'); }}
                  className="mt-4 text-rose-500 text-sm underline underline-offset-2"
                >
                  Clear filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                id="pagination-prev"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-slate-600 text-sm shadow-sm
                           hover:border-blue-300 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  id={`pagination-page-${page}`}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold border transition-all duration-200
                    ${currentPage === page
                      ? 'bg-blue-500 text-white border-rose-500 shadow-[0_0_12px_rgba(212,175,55,0.35)]'
                      : 'bg-white text-slate-600 border-gray-200 hover:border-blue-500/40 hover:text-blue-600 shadow-sm'
                    }`}
                >
                  {page}
                </button>
              ))}
              <button
                id="pagination-next"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-slate-600 text-sm shadow-sm
                           hover:border-blue-300 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next →
              </button>
            </div>
          )}

          {filteredArticles.length > 0 && (
            <p className="text-center text-slate-500 text-xs mt-8">
              Showing {Math.min(currentPage * ARTICLES_PER_PAGE, filteredArticles.length)} of {filteredArticles.length} articles
            </p>
          )}
          </SectionInView>
        </div>
      </section>

      {/* ── Newsletter CTA ────────────────────────────────────────────────── */}
      <SectionInView className="bg-white border-t border-gray-200 py-20 relative overflow-hidden mt-16 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.08)_0%,_transparent_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-4xl mb-4">📰</div>
          <h3 className="text-4xl lg:text-5xl font-serif font-bold text-slate-900 mb-2">Stay Ahead of the Market</h3>
          <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
            Get weekly real estate intelligence reports, investment alerts, and market analysis
            delivered straight to your inbox.
          </p>
          <Link
            href="/contact"
            id="news-cta-consultation"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-[#c49b2e] text-white
                       font-bold px-8 py-3 rounded-xl transition-all duration-200 hover:shadow-[0_0_24px_rgba(212,175,55,0.4)]"
          >
            Book Free Consultation
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </SectionInView>
    </div>
  );
}
