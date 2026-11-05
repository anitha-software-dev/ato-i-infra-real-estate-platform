import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Lead, Property, Developer, Event, Career, Content, JobApplication, AdminUser, ActivityLog, Testimonial, PropertySubmission } from '@/lib/mockData';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({ baseURL: API_URL });
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Dynamic dual-backend port fallback (ports 8000 & 5000)
    const originalRequest = error.config;
    if (!error.response && originalRequest && !originalRequest._retryPort) {
      originalRequest._retryPort = true;
      const currentBase = originalRequest.baseURL || api.defaults.baseURL || API_URL;

      let alternateBase = '';
      if (currentBase.includes(':5000')) {
        alternateBase = currentBase.replace(':5000', ':8000');
      } else if (currentBase.includes(':8000')) {
        alternateBase = currentBase.replace(':8000', ':5000');
      }

      if (alternateBase) {
        api.defaults.baseURL = alternateBase;
        originalRequest.baseURL = alternateBase;
        try {
          return await api(originalRequest);
        } catch (retryErr) {
          return Promise.reject(retryErr);
        }
      }
    }

    return Promise.reject(error);
  }
);

function createCrudHook<T>(endpoint: string) {
  return function useCrud(enabled: boolean = true) {
    const [data, setData] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(enabled);

    const fetchAll = useCallback(async () => {
      if (!enabled) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const res = await api.get(endpoint);
        setData(res.data.data);
      } catch (err: any) {
        if (err?.response?.status !== 403) {
          console.error(`Error fetching ${endpoint}:`, err);
        }
      } finally {
        setIsLoading(false);
      }
    }, [enabled]);

    useEffect(() => {
      if (enabled) {
        fetchAll();
      } else {
        setIsLoading(false);
        setData([]);
      }
    }, [fetchAll, enabled]);

    const createItem = async (payload: any) => {
      const res = await api.post(endpoint, payload);
      await fetchAll();
      return res.data;
    };

    const updateItem = async (id: string, payload: any) => {
      const res = await api.put(`${endpoint}/${id}`, payload);
      await fetchAll();
      return res.data;
    };

    const deleteItem = async (id: string) => {
      const res = await api.delete(`${endpoint}/${id}`);
      await fetchAll();
      return res.data;
    };

    return { data, isLoading, refetch: fetchAll, createItem, updateItem, deleteItem };
  };
}

export const useLeads = createCrudHook<Lead>('/leads');
export const useProperties = createCrudHook<Property>('/properties');
export const useDevelopers = createCrudHook<Developer>('/developers');
export const useEvents = createCrudHook<Event>('/events');
export const useCareers = createCrudHook<Career>('/careers');
export const useContent = createCrudHook<Content>('/content');
export const useJobApplications = createCrudHook<JobApplication>('/job-applications');
export const useUsers = createCrudHook<AdminUser>('/users');
export const useTestimonials = createCrudHook<Testimonial>('/testimonials');
export const usePropertySubmissions = createCrudHook<PropertySubmission>('/property-submissions');

export function useActivityLogs() {
  const [data, setData] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/users/activities');
      setData(res.data.data || []);
    } catch (err) {
      console.error('Error fetching activities:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { data, isLoading, refetch: fetchLogs };
}

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoadingRole, setIsLoadingRole] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    let isCurrent = true;

    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        setRole(JSON.parse(stored).role || null);
      }
    } catch (e) {}

    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          if (isCurrent) setIsLoadingRole(false);
          return;
        }
        const res = await api.get('/auth/me');
        if (res.data?.success && res.data?.data && isCurrent) {
          setRole(res.data.data.role);
          localStorage.setItem('user', JSON.stringify(res.data.data));
        }
      } catch (err) {
      } finally {
        if (isCurrent) setIsLoadingRole(false);
      }
    };
    fetchUserRole();
    return () => {
      isCurrent = false;
    };
  }, []);

  const isAdmin = isMounted && role === 'ADMIN';

  return { role, isAdmin, isLoadingRole, isMounted };
}


