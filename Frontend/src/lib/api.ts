const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function fetchProperties(params?: Record<string, string>) {
  const url = new URL(`${API_URL}/properties`);
  if (params) {
    Object.keys(params).forEach(key => {
      if (params[key]) url.searchParams.append(key, params[key]);
    });
  }
  const res = await fetch(url.toString(), { next: { revalidate: 30 } });
  if (!res.ok) throw new Error('Failed to fetch properties');
  return res.json();
}

export async function fetchPropertyById(id: string) {
  const res = await fetch(`${API_URL}/properties/${id}`, { next: { revalidate: 30 } });
  if (!res.ok) throw new Error('Failed to fetch property');
  return res.json();
}

export async function fetchDevelopers(params?: Record<string, string>) {
  const url = new URL(`${API_URL}/developers`);
  if (params) {
    Object.keys(params).forEach(key => {
      if (params[key]) url.searchParams.append(key, params[key]);
    });
  }
  const res = await fetch(url.toString(), { next: { revalidate: 30 } });
  if (!res.ok) throw new Error('Failed to fetch developers');
  return res.json();
}

export async function fetchEvents(params?: Record<string, string>) {
  const url = new URL(`${API_URL}/events`);
  if (params) {
    Object.keys(params).forEach(key => {
      if (params[key]) url.searchParams.append(key, params[key]);
    });
  }
  const res = await fetch(url.toString(), { next: { revalidate: 30 } });
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

export async function fetchCareers(params?: Record<string, string>) {
  const url = new URL(`${API_URL}/careers`);
  if (params) {
    Object.keys(params).forEach(key => {
      if (params[key]) url.searchParams.append(key, params[key]);
    });
  }
  const res = await fetch(url.toString(), { next: { revalidate: 30 } });
  if (!res.ok) throw new Error('Failed to fetch careers');
  return res.json();
}

export async function fetchContent(params?: Record<string, string>) {
  const url = new URL(`${API_URL}/content`);
  if (params) {
    Object.keys(params).forEach(key => {
      if (params[key]) url.searchParams.append(key, params[key]);
    });
  }
  const res = await fetch(url.toString(), { next: { revalidate: 30 } });
  if (!res.ok) throw new Error('Failed to fetch content');
  return res.json();
}

export async function fetchTestimonials(params?: Record<string, string>) {
  const url = new URL(`${API_URL}/testimonials`);
  if (params) {
    Object.keys(params).forEach(key => {
      if (params[key]) url.searchParams.append(key, params[key]);
    });
  }
  const res = await fetch(url.toString(), { next: { revalidate: 30 } });
  if (!res.ok) throw new Error('Failed to fetch testimonials');
  return res.json();
}

export async function submitLead(data: {
  name: string;
  phone: string;
  email?: string;
  propertyId?: string;
  source?: string;
  message?: string;
  interest?: string;
  location?: string;
  budget?: string;
}) {
  const res = await fetch(`${API_URL}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || 'Failed to submit inquiry');
  }
  return json;
}
