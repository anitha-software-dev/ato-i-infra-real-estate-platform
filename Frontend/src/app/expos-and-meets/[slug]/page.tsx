import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fetchEvents } from '@/lib/api';
import EventDetailClient from './EventDetailClient';

// ─── generateStaticParams ──────────────────────────────────────────────────────
export async function generateStaticParams() {
  const res = await fetchEvents();
  const eventsData = res.data || res || [];
  return eventsData.map((e: any) => ({ slug: e.slug }));
}

// ─── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const res = await fetchEvents();
  const eventsData = res.data || res || [];
  const event = eventsData.find((e: any) => e.slug === slug);
  if (!event) return {};
  return {
    title: `${event.title} | Events at A to I Infra`,
    description: event.tagline,
    openGraph: {
      title: event.title,
      description: event.tagline,
      images: [{ url: event.coverImage }],
    },
  };
}

// ─── Page (Server Component) ───────────────────────────────────────────────────
export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await fetchEvents();
  const eventsData = res.data || res || [];
  const event = eventsData.find((e: any) => e.slug === slug);
  if (!event) notFound();

  const relatedEvents = eventsData
    .filter((e: any) => e.slug !== event.slug)
    .slice(0, 2);

  return <EventDetailClient event={event} related={relatedEvents} />;
}
