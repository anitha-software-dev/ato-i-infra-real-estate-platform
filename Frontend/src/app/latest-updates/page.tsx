import { fetchContent } from '@/lib/api';
import NewsClient from './NewsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Latest Updates | A to I Infra',
  description: 'Market insights & real estate news.',
};

export default async function NewsPage() {
  const res = await fetchContent();
  const rawData = Array.isArray(res) ? res : (res?.data || []);
  
  const newsData = rawData.map((item: any, index: number) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    excerpt: item.summary || 'Click to read full article details and market insights.',
    content: item.content || '',
    coverImage: item.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    category: item.category || 'Real Estate',
    author: item.author || 'Admin',
    authorRole: 'Property Expert',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (item.author || 'admin'),
    publishedAt: item.createdAt || new Date().toISOString(),
    readTime: parseInt(item.readTime) || 5,
    isTrending: index < 3,
    isFeatured: index === 0,
    tags: []
  }));

  return <NewsClient newsData={newsData} />;
}
