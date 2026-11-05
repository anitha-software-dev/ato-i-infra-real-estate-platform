const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1').replace(/\/+$/, '');

async function safeFetch(url: string, init?: RequestInit, fallback: any = { data: [] }): Promise<any> {
  try {
    const res = await fetch(url, init);
    if (!res.ok) {
      console.warn(`[API] Failed to fetch ${url} (status: ${res.status})`);
      return fallback;
    }
    return await res.json();
  } catch (error: any) {
    // When backend is unreachable (e.g., during build time or cold start)
    console.warn(`[API] Network error fetching ${url}: ${error?.message || error}. Falling back to default data.`);
    return fallback;
  }
}

export async function fetchProperties(params?: Record<string, string>): Promise<any> {
  const url = new URL(`${API_URL}/properties`);
  if (params) {
    Object.keys(params).forEach(key => {
      if (params[key]) url.searchParams.append(key, params[key]);
    });
  }
  return safeFetch(url.toString(), { next: { revalidate: 30 } }, { data: [] });
}

export async function fetchPropertyById(id: string): Promise<any> {
  return safeFetch(`${API_URL}/properties/${id}`, { next: { revalidate: 30 } }, { data: null });
}

export async function fetchDevelopers(params?: Record<string, string>): Promise<any> {
  const url = new URL(`${API_URL}/developers`);
  if (params) {
    Object.keys(params).forEach(key => {
      if (params[key]) url.searchParams.append(key, params[key]);
    });
  }
  return safeFetch(url.toString(), { next: { revalidate: 30 } }, { data: [] });
}

export async function fetchEvents(params?: Record<string, string>): Promise<any> {
  const url = new URL(`${API_URL}/events`);
  if (params) {
    Object.keys(params).forEach(key => {
      if (params[key]) url.searchParams.append(key, params[key]);
    });
  }
  return safeFetch(url.toString(), { next: { revalidate: 30 } }, { data: [] });
}

export async function fetchCareers(params?: Record<string, string>): Promise<any> {
  const url = new URL(`${API_URL}/careers`);
  if (params) {
    Object.keys(params).forEach(key => {
      if (params[key]) url.searchParams.append(key, params[key]);
    });
  }
  return safeFetch(url.toString(), { next: { revalidate: 30 } }, { data: [] });
}

export async function fetchContent(params?: Record<string, string>): Promise<any> {
  const url = new URL(`${API_URL}/content`);
  if (params) {
    Object.keys(params).forEach(key => {
      if (params[key]) url.searchParams.append(key, params[key]);
    });
  }
  return safeFetch(url.toString(), { next: { revalidate: 30 } }, { data: [] });
}

export async function fetchTestimonials(params?: Record<string, string>): Promise<any> {
  const url = new URL(`${API_URL}/testimonials`);
  if (params) {
    Object.keys(params).forEach(key => {
      if (params[key]) url.searchParams.append(key, params[key]);
    });
  }
  return safeFetch(url.toString(), { next: { revalidate: 30 } }, { data: [] });
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
}): Promise<any> {
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
