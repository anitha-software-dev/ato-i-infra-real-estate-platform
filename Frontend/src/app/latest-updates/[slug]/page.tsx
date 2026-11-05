import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fetchContent } from '@/lib/api';
import NewsDetailClient from './NewsDetailClient';
import { NewsArticle } from '../NewsClient';

// ─── Helper for Mapping Backend Data ──────────────────────────────────────────
const mapNewsData = (rawData: any[]): NewsArticle[] => {
  return rawData.map((item: any, index: number) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    excerpt: item.summary || 'Click to read full article details and market insights.',
    content: item.content || '',
    coverImage: item.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    category: 'Market',
    author: item.author || 'Admin',
    authorRole: 'Property Expert',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (item.author || 'admin'),
    publishedAt: item.createdAt || new Date().toISOString(),
    readTime: parseInt(item.readTime) || 5,
    isTrending: index < 3,
    isFeatured: index === 0,
    tags: []
  }));
};

// ─── Static params ─────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  const res = await fetchContent();
  const rawData = Array.isArray(res) ? res : (res?.data || []);
  const newsData = mapNewsData(rawData);
  return newsData.map((article) => ({ slug: article.slug }));
}

// ─── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const res = await fetchContent();
  const rawData = Array.isArray(res) ? res : (res?.data || []);
  const newsData = mapNewsData(rawData);
  const article = newsData.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: `${article.title} | A to I Infra News`,
    description: article.excerpt,
    keywords: article.tags?.join(', ') || '',
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.coverImage }],
    },
  };
}

// ─── Page (Server Component) ───────────────────────────────────────────────────
export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await fetchContent();
  const rawData = Array.isArray(res) ? res : (res?.data || []);
  const newsData = mapNewsData(rawData);
  const article = newsData.find((a) => a.slug === slug);
  if (!article) notFound();

  const related: NewsArticle[] = newsData
    .filter((a) => a.category === article.category && a.slug !== article.slug)
    .slice(0, 3);

  return <NewsDetailClient article={article} related={related} />;
}
