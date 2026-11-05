'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { NewsArticle } from "../NewsClient";

// ─── Category pill colors ──────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  Market:      'bg-blue-600/90 text-white border-blue-400/50',
  Policy:      'bg-purple-600/90 text-white border-purple-400/50',
  Investment:  'bg-emerald-600/90 text-white border-emerald-400/50',
  Luxury:      'bg-amber-500/90 text-white border-amber-300/50',
  Commercial:  'bg-cyan-600/90 text-white border-cyan-400/50',
  Residential: 'bg-rose-600/90 text-white border-rose-400/50',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

function CategoryPill({ category }: { category: string }) {
  const colorClass = CATEGORY_COLORS[category] ?? 'bg-gray-600/90 text-white border-gray-400/50';
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md shadow-sm ${colorClass}`}>
      {category}
    </span>
  );
}

function SectionInView({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function RelatedCard({ article, index = 0 }: { article: NewsArticle, index?: number }) {
  const hoverBorders = ["hover:border-blue-500/40", "hover:border-emerald-500/40", "hover:border-amber-500/40", "hover:border-rose-500/40"];
  const titleHovers = ["group-hover:text-blue-600", "group-hover:text-emerald-600", "group-hover:text-amber-600", "group-hover:text-rose-600"];
  return (
    <Link href={`/latest-updates/${article.slug}`} className="group block">
      <div className={`bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm
                      ${hoverBorders[index % 4]} hover:shadow-[0_8px_32px_rgba(0,0,0,0.05)]
                      hover:scale-[1.02] transition-all duration-300`}>
        <div className="relative h-40 overflow-hidden">
          <img
            src={article.coverImage || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&auto=format&fit=crop&q=80"}
            alt={article.title}
            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&auto=format&fit=crop&q=80'; }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
          <div className="absolute top-3 left-3">
            <CategoryPill category={article.category} />
          </div>
        </div>
        <div className="p-4">
          <h4 className={`text-slate-900 text-sm font-semibold leading-snug line-clamp-2 ${titleHovers[index % 4]} transition-colors mb-2`}>
            {article.title}
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-xs">{formatDate(article.publishedAt)}</span>
            <span className="text-slate-300 text-xs">·</span>
            <span className="text-emerald-600 text-xs">{article.readTime} min read</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Social Share Buttons ──────────────────────────────────────────────────────
function ShareButtons({ article }: { article: NewsArticle }) {
  const url = `https://atoiinfra.com/latest-updates/${article.slug}`;
  const text = encodeURIComponent(article.title);
  const encodedUrl = encodeURIComponent(url);

  const shares = [
    {
      label: 'Twitter / X',
      href: `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      color: 'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600',
    },
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      color: 'hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600',
    },
    {
      label: 'WhatsApp',
      href: `https://wa.me/?text=${text}%20${encodedUrl}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      color: 'hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600',
    },
  ];

  return (
    <div className="flex items-center gap-3">
      <span className="text-slate-500 text-sm">Share:</span>
      {shares.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${s.label}`}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200
                      text-slate-500 text-xs font-medium transition-all duration-200 ${s.color}`}
        >
          {s.icon}
          <span className="hidden sm:inline">{s.label}</span>
        </a>
      ))}
    </div>
  );
}

// ─── Main Client Component ─────────────────────────────────────────────────────
export default function NewsDetailClient({
  article,
  related,
}: {
  article: NewsArticle;
  related: NewsArticle[];
}) {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Hero / Cover ─────────────────────────────────────────────────── */}
      <section className="relative h-[70vh] min-h-[480px] overflow-hidden">
        <img
          src={article.coverImage || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&auto=format&fit=crop&q=80"}
          alt={article.title}
          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&auto=format&fit=crop&q=80'; }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent" />

        <div className="relative z-10 h-full flex flex-col justify-end px-4 pb-12 max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-slate-500 text-xs mb-6 pt-28"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-amber-500 transition-colors">Home</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/latest-updates" className="hover:text-rose-500 transition-colors">News</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-600 truncate max-w-48">{article.title}</span>
          </motion.nav>

          {/* Category + read time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-3 mb-4"
          >
            <CategoryPill category={article.category} />
            <span className="flex items-center gap-1.5 text-slate-600 text-xs">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2m4-2a8 8 0 11-16 0 8 8 0 0116 0z" />
              </svg>
              {article.readTime} min read
            </span>
            <span className="text-slate-500 text-xs">{formatDate(article.publishedAt)}</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-slate-900 font-bold text-2xl md:text-4xl leading-tight max-w-4xl"
          >
            {article.title}
          </motion.h1>
        </div>
      </section>

      {/* ── Content Area ─────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-14 space-y-14">

        <div className="grid lg:grid-cols-[1fr_300px] gap-10">

          {/* ── Left: Article Body ──────────────────────────────────────── */}
          <div className="space-y-10">

            {/* Author Card */}
            <SectionInView>
              <div className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-2xl shadow-sm">
                <img
                  src={article.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(article.author || 'Admin')}`}
                  alt={article.author}
                  onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(article.author || 'Admin')}`; }}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-500/40"
                />
                <div>
                  <p className="text-slate-900 font-semibold text-base">{article.author}</p>
                  <p className="text-blue-600 text-xs font-medium">{article.authorRole}</p>
                  <p className="text-slate-500 text-xs mt-0.5">A to I Infra</p>
                </div>
                <div className="ml-auto hidden sm:flex flex-col items-end gap-1">
                  <span className="text-slate-500 text-xs">{formatDate(article.publishedAt)}</span>
                  <span className="text-emerald-600 text-xs">{article.readTime} min read</span>
                </div>
              </div>
            </SectionInView>

            {/* Article Content */}
            <SectionInView>
              <article
                className="prose max-w-none
                           prose-headings:text-slate-900 prose-headings:font-bold
                           prose-p:text-slate-600 prose-p:leading-relaxed
                           prose-strong:text-slate-900 prose-strong:font-semibold
                           prose-li:text-slate-600
                           prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
              >
                <div
                  className="text-slate-600 leading-relaxed text-base whitespace-pre-wrap [&>*]:mb-4"
                  style={{ fontFamily: 'inherit' }}
                >
                  {article.content.split('\n').map((line, i) => {
                    // Render bold markdown **text** inline
                    if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
                      const text = line.slice(2, -2);
                      return (
                        <h3 key={i} className="text-slate-900 font-bold text-lg mt-8 mb-2">
                          {text}
                        </h3>
                      );
                    }
                    if (line.trim() === '') return <div key={i} className="h-2" />;
                    // Render lines with inline **bold**
                    const parts = line.split(/(\*\*[^*]+\*\*)/g);
                    return (
                      <p key={i} className="text-slate-600 leading-relaxed mb-1">
                        {parts.map((part, j) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={j} className="text-slate-900 font-semibold">{part.slice(2, -2)}</strong>;
                          }
                          return <span key={j}>{part}</span>;
                        })}
                      </p>
                    );
                  })}
                </div>
              </article>
            </SectionInView>

            {/* Tags */}
            <SectionInView>
              <div>
                <p className="text-slate-500 text-xs uppercase tracking-widest mb-3 font-semibold">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, i) => {
                    const tagColors = [
                      "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200",
                      "hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200",
                      "hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200",
                      "hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                    ];
                    return (
                    <span
                      key={tag}
                      className={`px-3 py-1 rounded-full bg-slate-50 border border-gray-200 text-slate-600 text-xs transition-colors ${tagColors[i % 4]}`}
                    >
                      #{tag}
                    </span>
                    );
                  })}
                </div>
              </div>
            </SectionInView>

            {/* Social Share */}
            <SectionInView className="pt-4 border-t border-gray-200">
              <ShareButtons article={article} />
            </SectionInView>

            {/* Back button */}
            <SectionInView>
              <Link
                href="/latest-updates"
                id="back-to-news"
                className="inline-flex items-center gap-2 text-rose-600 text-sm font-semibold
                           hover:gap-3 transition-all duration-200"
              >
                <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Back to All News
              </Link>
            </SectionInView>
          </div>

          {/* ── Right: Sidebar ──────────────────────────────────────────── */}
          <aside className="space-y-8">

            {/* CTA Card */}
            <SectionInView>
              <div className="sticky top-24 space-y-6">
                <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-200 p-6 text-center shadow-sm">
                  <div className="absolute inset-0 bg-slate-50/50" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-600">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-slate-900 font-bold text-base mb-2">Book Free Consultation</h3>
                    <p className="text-slate-600 text-xs leading-relaxed mb-4">
                      Speak to our experts and get personalized investment advice based on your goals.
                    </p>
                    <Link
                      href="/contact"
                      id="article-cta-consultation"
                      className="block w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold
                                 text-sm py-2.5 rounded-xl transition-all duration-200 shadow-sm"
                    >
                      Get Expert Advice →
                    </Link>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 space-y-3">
                  <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold mb-3">Article Info</p>
                  {[
                    { label: 'Category', value: article.category },
                    { label: 'Read Time', value: `${article.readTime} min` },
                    { label: 'Published', value: formatDate(article.publishedAt) },
                    { label: 'Author', value: article.author },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-slate-500 text-xs">{label}</span>
                      <span className="text-slate-900 text-xs font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </SectionInView>
          </aside>
        </div>

        {/* ── Related Articles ──────────────────────────────────────────── */}
        {related.length > 0 && (
          <SectionInView>
            <div className="border-t border-gray-200 pt-14">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-6 bg-blue-600 rounded-full" />
                <h2 className="text-slate-900 font-bold text-xl">Related Articles</h2>
                <span className="text-slate-500 text-sm">in {article.category}</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {related.map((a, i) => (
                  <RelatedCard key={a.id} article={a} index={i} />
                ))}
              </div>
            </div>
          </SectionInView>
        )}

        {/* ── CTA Banner ───────────────────────────────────────────────── */}
        <SectionInView>
          <div className="relative rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-sm p-10 md:p-14">
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-50 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <p className="text-emerald-600 text-xs font-semibold uppercase tracking-widest mb-2">
                  A to I Infra
                </p>
                <h3 className="text-slate-900 font-bold text-2xl md:text-3xl leading-tight max-w-lg">
                  Ready to Turn Market Intelligence into Smart Investments?
                </h3>
                <p className="text-slate-600 text-sm mt-3 max-w-md">
                  Our experts are available for free consultations. Get personalized guidance tailored to your investment goals.
                </p>
              </div>
              <div className="flex flex-col gap-3 shrink-0">
                <Link
                  href="/contact"
                  id="footer-cta-consultation"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700
                             text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-sm whitespace-nowrap"
                >
                  Book Free Consultation
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/latest-updates"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50
                             border border-gray-200 text-slate-900 font-medium px-8 py-3.5 rounded-xl
                             transition-all duration-200 shadow-sm whitespace-nowrap text-sm"
                >
                  ← More Articles
                </Link>
              </div>
            </div>
          </div>
        </SectionInView>
      </div>
    </div>
  );
}
