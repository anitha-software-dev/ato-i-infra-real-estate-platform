"use client";

import { useState, useEffect } from 'react';
import { api } from './useData';

export interface DashboardMetrics {
  totalLeads: number;
  totalProperties: number;
  activeEvents: number;
  upcomingEvents: number;
  totalDevelopers: number;
  openJobListings: number;
}

export function useDashboardData() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        let isAdmin = false;
        try {
          const stored = localStorage.getItem('user');
          if (stored) {
            const u = JSON.parse(stored);
            isAdmin = u.role === 'ADMIN';
          }
        } catch (e) {}

        // Fetch leads for dashboard metrics
        const leadsPromise = api.get('/leads').catch((err) => {
          if (err?.response?.status !== 403) {
            console.warn("Could not fetch leads:", err?.message || err);
          }
          return { data: { data: [] } };
        });

        const [leadsRes, propsRes, eventsRes, devRes, careersRes] = await Promise.all([
          leadsPromise,
          api.get('/properties').catch(() => ({ data: { data: [] } })),
          api.get('/events').catch(() => ({ data: { data: [] } })),
          api.get('/developers').catch(() => ({ data: { data: [] } })),
          api.get('/careers').catch(() => ({ data: { data: [] } }))
        ]);
        
        const leads = leadsRes.data?.data || [];
        const properties = propsRes.data?.data || [];
        const events = eventsRes.data?.data || [];
        const developers = devRes.data?.data || [];
        const careers = careersRes.data?.data || [];

        setMetrics({
          totalLeads: leads.length,
          totalProperties: properties.length,
          activeEvents: events.length,
          upcomingEvents: events.filter((e: any) => e.status === 'Upcoming').length || events.length,
          totalDevelopers: developers.length,
          openJobListings: careers.length,
        });

        setRecentLeads(leads.slice(0, 5));
      } catch (error: any) {
        if (error?.response?.status !== 403) {
          console.warn("Failed to load dashboard data", error?.message || error);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return {
    metrics,
    recentLeads,
    isLoading
  };
}
