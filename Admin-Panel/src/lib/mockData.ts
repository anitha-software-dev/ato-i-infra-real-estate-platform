export type Developer = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  about: string;
  foundedYear: number;
  hqCity: string;
  operatingCities: string[];
  experienceYears: number;
  completedProjects: number;
  ongoingProjects: number;
  totalUnits: number;
  rating: number;
  reviewCount: number;
  logoUrl: string;
  coverImageUrl: string;
  awards: string[];
  status: 'Active' | 'Inactive';
};

export const MOCK_DEVELOPERS: Developer[] = [
  {
    id: 'dev-1',
    name: 'Prestige Group',
    slug: 'prestige-group',
    tagline: 'Add Prestige to your life',
    about: 'Prestige Group is a property development company in South India...',
    foundedYear: 1986,
    hqCity: 'Bangalore',
    operatingCities: ['Bangalore', 'Chennai', 'Kochi', 'Hyderabad', 'Mumbai'],
    experienceYears: 37,
    completedProjects: 250,
    ongoingProjects: 50,
    totalUnits: 150000,
    rating: 4.8,
    reviewCount: 1205,
    logoUrl: 'https://placehold.co/200x200?text=Prestige',
    coverImageUrl: 'https://placehold.co/800x400?text=Prestige+Cover',
    awards: ['Best Builder 2022', 'Green Building Excellence'],
    status: 'Active',
  },
  {
    id: 'dev-2',
    name: 'Sobha Developers',
    slug: 'sobha-developers',
    tagline: 'Passion at work',
    about: 'One of the largest and only backward integrated real estate players in the country.',
    foundedYear: 1995,
    hqCity: 'Bangalore',
    operatingCities: ['Bangalore', 'Pune', 'Delhi NCR', 'Chennai'],
    experienceYears: 28,
    completedProjects: 170,
    ongoingProjects: 30,
    totalUnits: 95000,
    rating: 4.7,
    reviewCount: 890,
    logoUrl: 'https://placehold.co/200x200?text=Sobha',
    coverImageUrl: 'https://placehold.co/800x400?text=Sobha+Cover',
    awards: ['Luxury Project of the Year 2023'],
    status: 'Active',
  }
];

export type Property = {
  id: string;
  name: string;
  developerId: string;
  type: 'Residential' | 'Commercial' | 'Luxury' | 'Land';
  city: string;
  location: string;
  priceRange: string;
  areaRangeSqFt: string;
  configurations: string[];
  amenities: string[];
  highlights: string[];
  status: 'Ready to Move' | 'Under Construction' | 'New Launch';
  description: string;
  coverImage: string;
  galleryImages: string[];
};

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    name: 'Prestige Falcon City',
    developerId: 'dev-1',
    type: 'Residential',
    city: 'Bangalore',
    location: 'Kanakapura Road',
    priceRange: '₹1.5 Cr - ₹2.5 Cr',
    areaRangeSqFt: '1204 - 2726',
    configurations: ['2 BHK', '3 BHK', '4 BHK'],
    amenities: ['Swimming Pool', 'Gym', 'Clubhouse', 'Tennis Court'],
    highlights: ['Metro station within 500m', 'Premium mall inside the campus'],
    status: 'Ready to Move',
    description: 'A mixed-use development offering luxurious homes and a retail mall.',
    coverImage: 'https://placehold.co/600x400?text=Falcon+City',
    galleryImages: ['https://placehold.co/600x400?text=Gallery+1', 'https://placehold.co/600x400?text=Gallery+2']
  }
];

export type Event = {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  type: 'Expo' | 'Webinar' | 'Seminar' | 'Property Tour';
  status: 'Upcoming' | 'Past' | 'Ongoing';
  startDate: string;
  endDate: string;
  time: string;
  venueName: string;
  address: string;
  city: string;
  mode: 'In-person' | 'Online' | 'Hybrid';
  coverImage: string;
  galleryImages: string[];
  speakers: { name: string; role: string; avatar: string }[];
  highlights: string[];
  registrationLink: string;
};

export const MOCK_EVENTS: Event[] = [
  {
    id: 'evt-1',
    title: 'A to I Mega Property Expo 2024',
    slug: 'mega-property-expo-2024',
    tagline: 'Discover your dream home',
    description: 'Join us for the biggest property expo showcasing top builders.',
    type: 'Expo',
    status: 'Upcoming',
    startDate: '2024-11-15',
    endDate: '2024-11-17',
    time: '10:00 AM - 08:00 PM',
    venueName: 'BIEC',
    address: 'Tumkur Road',
    city: 'Bangalore',
    mode: 'In-person',
    coverImage: 'https://placehold.co/600x400?text=Expo+Cover',
    galleryImages: [],
    speakers: [],
    highlights: ['Exclusive spot offers', 'On-spot loan approvals'],
    registrationLink: 'https://example.com/register/expo',
  }
];

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Dropped';
  propertyId?: string;
  property?: { name: string };
  eventId?: string;
  event?: { title: string };
  interest?: string;
  purpose?: string;
  location?: string;
  budget?: string;
  message?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  status: 'Active' | 'Inactive';
  phone?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt?: string;
};

export type ActivityLog = {
  id: string;
  userId?: string;
  userName: string;
  userEmail: string;
  action: string;
  details?: string;
  ipAddress?: string;
  createdAt: string;
};

export type Testimonial = {
  id: string;
  clientName: string;
  clientRole?: string;
  clientAvatar?: string;
  rating: number;
  quote: string;
  propertyName?: string;
  location?: string;
  isFeatured: boolean;
  status: 'Active' | 'Inactive';
  type?: 'CLIENT' | 'EMPLOYEE';
  createdAt?: string;
  updatedAt?: string;
};

export type PropertySubmission = {
  id: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  propertyType: string;
  purpose: string;
  city?: string;
  location: string;
  expectedPrice?: string;
  areaSqFt?: string;
  description?: string;
  status: 'Pending_Review' | 'Verified' | 'Listed' | 'Rejected';
  notes?: string;
  assignedTo?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const MOCK_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Rahul Sharma',
    email: 'rahul.s@example.com',
    phone: '+91-9876543210',
    source: 'Property Enquiry',
    status: 'New',
    propertyId: 'prop-1',
    message: 'I am interested in a 3 BHK at Prestige Falcon City.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'lead-2',
    name: 'Priya Patel',
    email: 'priya.p@example.com',
    phone: '+91-8765432109',
    source: 'Free Consultation',
    status: 'Contacted',
    message: 'Looking to invest in commercial real estate.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  }
];

export type DashboardMetrics = {
  totalActiveProperties: number;
  totalDevelopers: number;
  upcomingEvents: number;
  openJobListings: number;
};

export const MOCK_METRICS: DashboardMetrics = {
  totalActiveProperties: 124,
  totalDevelopers: 45,
  upcomingEvents: 3,
  openJobListings: 12,
};
export type Career = {
  id: string;
  title: string;
  slug?: string;
  department: string;
  location: string;
  type: string;
  experienceLevel: string;
  salaryRange?: string | null;
  isUrgent?: boolean;
  status: 'Open' | 'Closed' | 'Draft' | string;
  postedDate: string;
};

export const MOCK_CAREERS: Career[] = [
  {
    id: 'job-1',
    title: 'Senior Sales Manager',
    department: 'Sales',
    location: 'Bangalore',
    type: 'Full-time',
    experienceLevel: '5-7 Years',
    status: 'Open',
    postedDate: '2024-05-15',
  },
  {
    id: 'job-2',
    title: 'Real Estate Consultant',
    department: 'Consulting',
    location: 'Mumbai',
    type: 'Full-time',
    experienceLevel: '2-4 Years',
    status: 'Open',
    postedDate: '2024-06-01',
  }
];

export type JobApplication = {
  id: string;
  name: string;
  email: string;
  phone: string;
  linkedin?: string | null;
  coverNote?: string | null;
  resumeUrl: string;
  careerId: string;
  status: 'Pending' | 'Reviewing' | 'Shortlisted' | 'Rejected' | 'Hired';
  createdAt?: string;
  appliedAt?: string;
  career?: {
    id: string;
    title: string;
    department: string;
    location: string;
  };
};

export type Content = {
  id: string;
  title: string;
  type: 'Blog' | 'News' | 'Press Release' | 'Guide';
  author: string;
  status: 'Published' | 'Draft' | 'Archived';
  publishDate: string;
  views: number;
};

export const MOCK_CONTENT: Content[] = [
  {
    id: 'post-1',
    title: 'Top 10 Emerging Real Estate Markets in India for 2024',
    type: 'Blog',
    author: 'A to I Infra Team',
    status: 'Published',
    publishDate: '2024-06-10',
    views: 1250,
  },
  {
    id: 'post-2',
    title: 'How to Choose the Right Commercial Property',
    type: 'Guide',
    author: 'Expert Consultant',
    status: 'Published',
    publishDate: '2024-05-22',
    views: 890,
  }
];
