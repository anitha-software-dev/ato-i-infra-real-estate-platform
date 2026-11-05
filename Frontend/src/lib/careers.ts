export interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience?: string;
  experienceLevel?: string;
  salaryRange?: string;
  isUrgent?: boolean;
  slug: string;
  description: string;
  responsibilities?: string[];
  requirements?: string[];
  niceToHave?: string[];
  benefits?: string[];
  postedAt?: string;
  postedDate?: string;
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return 'Recently';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function normalizeJob(raw: any): JobListing {
  const exp = raw.experience || raw.experienceLevel || 'Not specified';
  const posted = raw.postedAt || (raw.postedDate ? formatDate(raw.postedDate) : 'Recently');
  return {
    id: raw.id || '',
    title: raw.title || '',
    department: raw.department || '',
    location: raw.location || '',
    type: raw.type || 'Full_time',
    experience: exp,
    experienceLevel: raw.experienceLevel || exp,
    salaryRange: raw.salaryRange || 'Competitive',
    isUrgent: Boolean(raw.isUrgent),
    slug: raw.slug || '',
    description: raw.description || '',
    responsibilities: Array.isArray(raw.responsibilities) ? raw.responsibilities : [],
    requirements: Array.isArray(raw.requirements) ? raw.requirements : [],
    niceToHave: Array.isArray(raw.niceToHave) ? raw.niceToHave : [],
    benefits: Array.isArray(raw.benefits) ? raw.benefits : [],
    postedAt: posted,
    postedDate: raw.postedDate || raw.postedAt || '',
  };
}
