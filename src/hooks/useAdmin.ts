import { useState, useCallback } from "react";
import { adminApi } from "../api/admin.api";
import { Alert } from "react-native";

export const useAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  const fetchUsers = useCallback(async (page?: number) => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers(page);
      setUsers(res.data.content);
    } catch (error) {
      console.error("Fetch users error", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEvents = useCallback(async (status?: string, page?: number) => {
    setLoading(true);
    try {
      const res = await adminApi.getEvents(status, page);
      setEvents(res.data.content);
    } catch (error) {
      console.error("Fetch events error", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReports = useCallback(async (status?: string, page?: number) => {
    setLoading(true);
    try {
      const res = await adminApi.getReports(status, page);
      setReports(res.data.content);
    } catch (error) {
      console.error("Fetch reports error", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAnalytics();
      setStats(res.data);
    } catch (error) {
      console.error("Fetch stats error", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const approveEvent = async (id: number) => {
    try {
      await adminApi.approveEvent(id);
      Alert.alert("Success", "Event approved");
      fetchEvents("PENDING");
    } catch (error) {
      Alert.alert("Error", "Could not approve event");
    }
  };

  const rejectEvent = async (id: number) => {
    try {
      await adminApi.rejectEvent(id);
      Alert.alert("Success", "Event rejected");
      fetchEvents("PENDING");
    } catch (error) {
      Alert.alert("Error", "Could not reject event");
    }
  };

  const resolveReport = async (id: number, status: string) => {
    try {
      await adminApi.resolveReport(id, status);
      Alert.alert("Success", `Report ${status.toLowerCase()}`);
      fetchReports("PENDING");
    } catch (error) {
      Alert.alert("Error", "Could not resolve report");
    }
  };

  return {
    loading,
    users,
    events,
    reports,
    stats,
    fetchUsers,
    fetchEvents,
    fetchReports,
    fetchStats,
    approveEvent,
    rejectEvent,
    resolveReport,
  };
};
