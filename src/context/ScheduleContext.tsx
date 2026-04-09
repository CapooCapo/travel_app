import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../api/client';
import { useAuth } from '@clerk/clerk-expo';
import { TravelScheduleDTO, CreateTravelScheduleRequest } from '../dto/schedule/schedule.DTO';
import { LocalNotificationService } from '../services/LocalNotification.Service';

interface ScheduleContextType {
  schedules: TravelScheduleDTO[];
  isLoading: boolean;
  error: string | null;
  fetchSchedules: () => Promise<void>;
  addSchedule: (req: CreateTravelScheduleRequest) => Promise<void>;
  updateSchedule: (id: number, req: CreateTravelScheduleRequest) => Promise<void>;
  deleteSchedule: (id: number) => Promise<void>;
  calendarEvents: any[];
  fetchCalendar: () => Promise<void>;
}

const ScheduleContext = createContext<ScheduleContextType>({} as ScheduleContextType);

export const ScheduleProvider = ({ children }: { children: React.ReactNode }) => {
  const [schedules, setSchedules] = useState<TravelScheduleDTO[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiRequest.getSchedules();
      const resData = response?.data;
      if (resData?.status === 200) {
        setSchedules(resData?.data || []);
      } else {
        setError(resData?.message || 'Failed to fetch schedules');
      }
    } catch (err: any) {
      console.error('[ScheduleContext] fetchSchedules error:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred while fetching schedules');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCalendar = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiRequest.getCalendar();
      const resData = response?.data;
      if (resData?.status === 200) {
        setCalendarEvents(resData?.data || []);
      } else {
        setError(resData?.message || 'Failed to fetch calendar');
      }
    } catch (err: any) {
      console.error('[ScheduleContext] fetchCalendar error:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred while fetching calendar');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addSchedule = async (req: CreateTravelScheduleRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiRequest.createSchedule(req);
      const resData = response?.data;
      if (resData?.status === 201 || resData?.status === 200) {
        const newSchedule = resData?.data;
        if (newSchedule) {
          setSchedules(prev => [...prev, newSchedule]);
          LocalNotificationService.scheduleTravelReminder(newSchedule);
        }
      } else {
        setError(resData?.message || 'Failed to add schedule');
      }
    } catch (err: any) {
      console.error('[ScheduleContext] addSchedule error:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred while adding schedule');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSchedule = async (id: number, req: CreateTravelScheduleRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiRequest.updateSchedule(id, req);
      const resData = response?.data;
      if (resData?.status === 200) {
        await fetchSchedules();
      } else {
        setError(resData?.message || 'Failed to update schedule');
      }
    } catch (err: any) {
      console.error('[ScheduleContext] updateSchedule error:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred while updating schedule');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSchedule = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiRequest.deleteSchedule(id);
      const resData = response?.data;
      if (resData?.status === 200) {
        setSchedules(prev => prev.filter(s => s.id !== id));
      } else {
        setError(resData?.message || 'Failed to delete schedule');
      }
    } catch (err: any) {
      console.error('[ScheduleContext] deleteSchedule error:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred while deleting schedule');
    } finally {
      setIsLoading(false);
    }
  };

  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchSchedules();
    }
  }, [isLoaded, isSignedIn, fetchSchedules]);

  return (
    <ScheduleContext.Provider
      value={{
        schedules,
        isLoading,
        error,
        fetchSchedules,
        addSchedule,
        updateSchedule,
        deleteSchedule,
        calendarEvents,
        fetchCalendar,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};
