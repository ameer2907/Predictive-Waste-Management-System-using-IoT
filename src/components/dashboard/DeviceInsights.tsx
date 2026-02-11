import { 
  Wifi, WifiOff, Activity, AlertTriangle, Cpu, Clock, BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDeviceStats, useWasteInsights } from '@/hooks/use-device-logs';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function DeviceMonitor() {
  const { data: stats } = useDeviceStats();

  if (!stats) return null;

  const statusColor = stats.connectionStatus === 'online' ? 'text-success' : stats.connectionStatus === 'idle' ? 'text-warning' : 'text-destructive';
  const statusBg = stats.connectionStatus === 'online' ? 'bg-success' : stats.connectionStatus === 'idle' ? 'bg-warning' : 'bg-destructive';
  const StatusIcon = stats.connectionStatus === 'offline' ? WifiOff : Wifi;
  const fillAlert = stats.latestFillLevel !== null && stats.latestFillLevel > 85;

  return (
    <Card className="glass-card border-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Cpu className="w-4 h-4 text-primary" />
          ESP32 Device Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
            <StatusIcon className={`w-5 h-5 ${statusColor}`} />
            <div>
              <p className="text-xs text-muted-foreground">Connection</p>
              <p className={`text-sm font-semibold capitalize ${statusColor}`}>{stats.connectionStatus}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Last Activity</p>
              <p className="text-sm font-semibold">
                {stats.lastLog ? formatDistanceToNow(new Date(stats.lastLog.created_at), { addSuffix: true }) : 'Never'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
            <Activity className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Detections Today</p>
              <p className="text-sm font-semibold">{stats.totalToday}</p>
            </div>
          </div>
          <div className={`flex items-center gap-3 p-3 rounded-lg ${fillAlert ? 'bg-destructive/10 border border-destructive/30' : 'bg-muted/30'}`}>
            {fillAlert ? <AlertTriangle className="w-5 h-5 text-destructive" /> : <BarChart3 className="w-5 h-5 text-muted-foreground" />}
            <div>
              <p className="text-xs text-muted-foreground">Bin Fill Level</p>
              <p className={`text-sm font-semibold ${fillAlert ? 'text-destructive' : ''}`}>
                {stats.latestFillLevel !== null ? `${stats.latestFillLevel}%` : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function InsightsSection() {
  const { data: insights } = useWasteInsights();

  if (!insights || insights.totalEntries === 0) {
    return (
      <Card className="glass-card border-0">
        <CardContent className="py-10 text-center text-muted-foreground">
          <BarChart3 className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No data yet — start classifying to see patterns</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Daily Trend */}
      <Card className="glass-card border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Daily Waste Trend (7 days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={insights.dailyTrend}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
              <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Peak Hours */}
      <Card className="glass-card border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Peak Disposal Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={insights.hourlyDistribution}>
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `${v}h`} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recyclable Ratio */}
      <Card className="glass-card border-0 lg:col-span-2">
        <CardContent className="py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Recyclable Ratio</p>
              <p className="text-2xl font-bold text-primary">{insights.recyclableRatio}%</p>
            </div>
            <div className="w-48 h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${insights.recyclableRatio}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              />
            </div>
            <p className="text-sm text-muted-foreground">{insights.totalEntries} total entries</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
