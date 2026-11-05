import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fetchCareers } from '@/lib/api';
import JobDetailClient from './JobDetailClient';
import { JobListing, normalizeJob } from '@/lib/careers';

// ─── Static params ─────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  try {
    const res = await fetchCareers();
    const rawData = Array.isArray(res) ? res : (res?.data || []);
    const careersData: JobListing[] = rawData.map(normalizeJob);
    return careersData
      .filter((job) => job && typeof job.slug === 'string' && job.slug.trim() !== '')
      .map((job) => ({ slug: job.slug }));
  } catch {
    return [];
  }
}

// ─── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const res = await fetchCareers();
  const rawData = Array.isArray(res) ? res : (res?.data || []);
  const careersData: JobListing[] = rawData.map(normalizeJob);
  const job = careersData.find((j) => j.slug === slug);
  if (!job) return {};
  return {
    title: `${job.title} | Careers at A to I Infra`,
    description: job.description,
  };
}

// ─── Page (Server Component) ───────────────────────────────────────────────────
export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await fetchCareers();
  const rawData = Array.isArray(res) ? res : (res?.data || []);
  const careersData: JobListing[] = rawData.map(normalizeJob);
  const job = careersData.find((j) => j.slug === slug);
  if (!job) notFound();

  // Find related jobs in the same department
  const related: JobListing[] = careersData
    .filter((j) => j.department === job.department && j.slug !== job.slug)
    .slice(0, 3);

  return <JobDetailClient job={job} related={related} />;
}
