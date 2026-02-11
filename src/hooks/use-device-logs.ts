import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export interface DeviceLog {
  id: string;
  device_id: string;
  category: string;
  confidence: number;
  servo_action: string;
  bin_fill_level: number | null;
  created_at: string;
}

export function useDeviceLogs() {
  const queryClient = useQueryClient();

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('device-logs-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'device_logs' }, () => {
        queryClient.invalidateQueries({ queryKey: ['device-logs'] });
        queryClient.invalidateQueries({ queryKey: ['device-stats'] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  return useQuery({
    queryKey: ['device-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('device_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as DeviceLog[];
    },
  });
}

export function useDeviceStats() {
  return useQuery({
    queryKey: ['device-stats'],
    queryFn: async () => {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('device_logs')
        .select('*')
        .gte('created_at', todayStart.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      const logs = data as DeviceLog[];

      const lastLog = logs[0] || null;
      const totalToday = logs.length;
      const latestFillLevel = logs.find(l => l.bin_fill_level !== null)?.bin_fill_level ?? null;

      let connectionStatus: 'online' | 'idle' | 'offline' = 'offline';
      if (lastLog) {
        const diff = Date.now() - new Date(lastLog.created_at).getTime();
        if (diff < 60_000) connectionStatus = 'online';
        else if (diff < 300_000) connectionStatus = 'idle';
      }

      return { lastLog, totalToday, latestFillLevel, connectionStatus };
    },
    refetchInterval: 10000,
  });
}

export function useWasteInsights() {
  return useQuery({
    queryKey: ['waste-insights'],
    queryFn: async () => {
      const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();

      const { data: deviceData } = await supabase
        .from('device_logs')
        .select('category, confidence, servo_action, created_at')
        .gte('created_at', sevenDaysAgo);

      const { data: classData } = await supabase
        .from('classifications')
        .select('primary_category, is_recyclable, created_at')
        .gte('created_at', sevenDaysAgo);

      const allEntries = [
        ...(deviceData || []).map(d => ({ category: d.category, recyclable: d.servo_action === 'RECYCLABLE', date: d.created_at })),
        ...(classData || []).map(c => ({ category: c.primary_category, recyclable: !!c.is_recyclable, date: c.created_at })),
      ];

      // Daily trend
      const dailyMap: Record<string, number> = {};
      const hourlyMap: Record<number, number> = {};
      let recyclableCount = 0;

      allEntries.forEach(e => {
        const d = new Date(e.date);
        const dayKey = d.toISOString().split('T')[0];
        dailyMap[dayKey] = (dailyMap[dayKey] || 0) + 1;
        hourlyMap[d.getHours()] = (hourlyMap[d.getHours()] || 0) + 1;
        if (e.recyclable) recyclableCount++;
      });

      const dailyTrend = Object.entries(dailyMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({ date, count }));

      const hourlyDistribution = Array.from({ length: 24 }, (_, h) => ({
        hour: h, count: hourlyMap[h] || 0
      }));

      const recyclableRatio = allEntries.length > 0 
        ? Math.round((recyclableCount / allEntries.length) * 100) 
        : 0;

      return { dailyTrend, hourlyDistribution, recyclableRatio, totalEntries: allEntries.length };
    },
  });
}
