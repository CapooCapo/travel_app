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

  const fetchSection = useCallback(async (tab: AdminTab) => {
    setData((prev) => ({
      ...prev,
      [tab]: { ...prev[tab], loading: true, error: null },
    }));

    const executeFetch = async () => {
      let result: any;
      try {
        switch (tab) {
          case "events":
            result = await apiRequest.getEvents("PENDING");
            console.log("[ADMIN DEBUG] Events result:", JSON.stringify(result, null, 2));
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
            console.log("[ADMIN DEBUG] Users result:", JSON.stringify(result, null, 2));
            setData((prev) => ({
              ...prev,
              users: { 
                  data: Array.isArray(result) ? result : (result?.content || []), 
                  loading: false, error: null, errorStatus: null 
              },
            }));
            break;
          case "reports":
            result = await apiRequest.getReports("PENDING");
            console.log("[ADMIN DEBUG] Reports result:", JSON.stringify(result, null, 2));
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
            console.log("[ADMIN DEBUG] Analytics result:", JSON.stringify(result, null, 2));
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
          [tab]: { 
              ...prev[tab], 
              loading: false, 
              error: message,
              errorStatus: status
          },
        }));
      }
    };

    executeFetch();
  }, []);

  useEffect(() => {
    // Only fetch if we don't have data yet
    if (activeTab === "analytics" && !data.analytics.data) {
        fetchSection("analytics");
    } else if (activeTab === "events" && data.events.data.length === 0) {
        fetchSection("events");
    } else if (activeTab === "users" && data.users.data.length === 0) {
        fetchSection("users");
    } else if (activeTab === "reports" && data.reports.data.length === 0) {
        fetchSection("reports");
    }
  }, [activeTab, fetchSection]);

  const handleApprove = async (eventId: number) => {
    try {
      await apiRequest.approveEvent(eventId);
      setData((prev) => ({
        ...prev,
        events: { ...prev.events, data: prev.events.data.filter((e: any) => e.id !== eventId) },
      }));
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
    } catch (e: any) {
        throw e;
    }
  };

  return {
    sections: data,
    activeTab,
    setActiveTab,
    fetchSection,
    handleApprove,
    handleReject,
    handleResolveReport,
  };
}
