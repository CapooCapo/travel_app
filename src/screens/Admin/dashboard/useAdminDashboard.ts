import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../../../api/client";

export type AdminTab = "events" | "analytics" | "users" | "reports";

interface SectionState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  errorStatus: number | null;
}

export function useAdminDashboard() {
  const [data, setData] = useState({
    events: { data: [] as any[], loading: false, error: null as string | null, errorStatus: null as number | null },
    users: { data: [] as any[], loading: false, error: null as string | null, errorStatus: null as number | null },
    reports: { data: [] as any[], loading: false, error: null as string | null, errorStatus: null as number | null },
    analytics: { data: null as any, loading: false, error: null as string | null, errorStatus: null as number | null },
  });

  const [activeTab, setActiveTab] = useState<AdminTab>("events");
  const [filters, setFilters] = useState({
    events: "PENDING",
    reports: "PENDING",
  });

  const fetchSection = useCallback(async (tab: AdminTab, forceStatus?: string) => {
    setData((prev) => ({
      ...prev,
      [tab]: { ...prev[tab], loading: true, error: null },
    }));

    const executeFetch = async () => {
      let result: any;
      try {
        switch (tab) {
          case "events":
            result = await apiRequest.getEvents(forceStatus || filters.events);
            setData((prev) => ({
              ...prev,
              events: { 
                  data: Array.isArray(result) ? result : (result?.content || []), 
                  loading: false, error: null, errorStatus: null 
              },
            }));
            break;
          case "users":
            result = await apiRequest.getUsers();
            setData((prev) => ({
              ...prev,
              users: { 
                  data: Array.isArray(result) ? result : (result?.content || []), 
                  loading: false, error: null, errorStatus: null 
              },
            }));
            break;
          case "reports":
            result = await apiRequest.getReports(forceStatus || filters.reports);
            setData((prev) => ({
              ...prev,
              reports: { 
                  data: Array.isArray(result) ? result : (result?.content || []), 
                  loading: false, error: null, errorStatus: null 
              },
            }));
            break;
          case "analytics":
            result = await apiRequest.getAnalytics();
            setData((prev) => ({
              ...prev,
              analytics: { data: result || null, loading: false, error: null, errorStatus: null },
            }));
            break;
        }
      } catch (e: any) {
        console.error(`❌ [ADMIN ERROR] ${tab}:`, e);
        const status = e?.response?.status || 500;
        const message = e?.response?.data?.message || e?.message || `Failed to load ${tab}`;
        setData((prev) => ({
          ...prev,
          [tab]: { ...prev[tab], loading: false, error: message, errorStatus: status },
        }));
      }
    };

    executeFetch();
  }, [filters]);

  useEffect(() => {
    fetchSection(activeTab);
  }, [activeTab, fetchSection, filters.events, filters.reports]);

  const handleApprove = async (eventId: number) => {
    try {
      await apiRequest.approveEvent(eventId);
      setData((prev) => ({
        ...prev,
        events: { ...prev.events, data: prev.events.data.filter((e: any) => e.id !== eventId) },
      }));
      // Background refresh analytics to update pending count
      fetchSection("analytics");
    } catch (e: any) {
      throw e;
    }
  };

  const handleReject = async (eventId: number) => {
    try {
        await apiRequest.rejectEvent(eventId);
        setData((prev) => ({
          ...prev,
          events: { ...prev.events, data: prev.events.data.filter((e: any) => e.id !== eventId) },
        }));
        fetchSection("analytics");
      } catch (e: any) {
        throw e;
      }
  };

  const handleResolveReport = async (reportId: number, status: string) => {
    try {
        await apiRequest.resolveReport(reportId, status);
        setData((prev) => ({
          ...prev,
          reports: { ...prev.reports, data: prev.reports.data.filter((r: any) => r.id !== reportId) },
        }));
        fetchSection("analytics");
    } catch (e: any) {
        throw e;
    }
  };

  return {
    sections: data,
    activeTab,
    setActiveTab,
    filters,
    setFilters,
    fetchSection,
    handleApprove,
    handleReject,
    handleResolveReport,
  };
}
