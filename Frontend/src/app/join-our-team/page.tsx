import { fetchCareers } from '@/lib/api';
import { normalizeJob } from '@/lib/careers';
import CareersClient from './CareersClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join Our Team | A to I Infra',
  description: 'Explore open roles at A to I Infra.',
};

export default async function CareersPage() {
  const res = await fetchCareers();
  const rawData = Array.isArray(res) ? res : (res?.data || []);
  const careersData = rawData.map(normalizeJob);
  
  return <CareersClient careersData={careersData} />;
}
