import { motion } from 'framer-motion';
import { TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, Legend, AreaChart, Area
} from 'recharts';
import { useMemo } from 'react';

// Generate simulated daily waste data
function generateDailyData() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    plastic: Math.floor(30 + Math.random() * 40),
    paper: Math.floor(20 + Math.random() * 30),
    organic: Math.floor(40 + Math.random() * 50),
    glass: Math.floor(10 + Math.random() * 20),
    metal: Math.floor(5 + Math.random() * 15),
  }));
}

function generateWeeklyTrend() {
  const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];
  let base = 200;
  return weeks.map(week => {
    base += Math.floor(Math.random() * 40 - 15);
    return { week, actual: base, predicted: base + Math.floor(Math.random() * 30 - 10) };
  });
}

function generateForecast() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let val = 800;
  return months.map(month => {
    val += Math.floor(Math.random() * 100 - 30);
    return { month, volume: val, forecast: val + Math.floor(Math.random() * 80 + 20) };
  });
}

function generatePeakHours() {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, '0')}:00`,
    volume: Math.floor(
      i >= 7 && i <= 9 ? 60 + Math.random() * 40 :
      i >= 11 && i <= 14 ? 70 + Math.random() * 30 :
      i >= 17 && i <= 20 ? 50 + Math.random() * 40 :
      10 + Math.random() * 25
    )
  }));
}

const tooltipStyle = {
  backgroundColor: 'hsl(216 56% 17%)',
  border: '1px solid hsl(216 45% 25%)',
  borderRadius: '8px',
};

export function PredictiveAnalytics() {
  const dailyData = useMemo(generateDailyData, []);
  const weeklyData = useMemo(generateWeeklyTrend, []);
  const forecastData = useMemo(generateForecast, []);
  const peakData = useMemo(generatePeakHours, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm">
        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
        <span className="text-muted-foreground">Predictive models active</span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 border border-primary/20 bg-primary/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Predicted Next Week</p>
              <p className="text-xl font-bold metric-value">+12.4%</p>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5 border border-warning/20 bg-warning/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Peak Waste Day</p>
              <p className="text-xl font-bold metric-value">Friday</p>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5 border border-info/20 bg-info/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-info/20 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Forecast Accuracy</p>
              <p className="text-xl font-bold metric-value">89.3%</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Waste by Category */}
        <Card className="glass-card border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Daily Waste Trends by Category</CardTitle>
            <p className="text-xs text-muted-foreground">Current week breakdown</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                  <XAxis dataKey="day" stroke="hsl(215 25% 60%)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(215 25% 60%)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Bar dataKey="plastic" stackId="a" fill="hsl(200 98% 50%)" name="Plastic" />
                  <Bar dataKey="paper" stackId="a" fill="hsl(35 95% 55%)" name="Paper" />
                  <Bar dataKey="organic" stackId="a" fill="hsl(142 76% 40%)" name="Organic" />
                  <Bar dataKey="glass" stackId="a" fill="hsl(280 85% 65%)" name="Glass" />
                  <Bar dataKey="metal" stackId="a" fill="hsl(220 15% 55%)" name="Metal" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Actual vs Predicted */}
        <Card className="glass-card border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Weekly: Actual vs Predicted</CardTitle>
            <p className="text-xs text-muted-foreground">Model forecast comparison</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <XAxis dataKey="week" stroke="hsl(215 25% 60%)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(215 25% 60%)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Line type="monotone" dataKey="actual" stroke="hsl(162 100% 39%)" strokeWidth={2} name="Actual" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="predicted" stroke="hsl(200 98% 50%)" strokeWidth={2} strokeDasharray="5 5" name="Predicted" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Forecast */}
        <Card className="glass-card border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Waste Volume Forecast</CardTitle>
            <p className="text-xs text-muted-foreground">12-month projection</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData}>
                  <defs>
                    <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(162 100% 39%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(162 100% 39%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="hsl(215 25% 60%)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(215 25% 60%)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Area type="monotone" dataKey="volume" stroke="hsl(162 100% 39%)" fill="url(#forecastGrad)" strokeWidth={2} name="Current" />
                  <Line type="monotone" dataKey="forecast" stroke="hsl(38 92% 50%)" strokeWidth={2} strokeDasharray="5 5" name="Forecast" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Peak Hours */}
        <Card className="glass-card border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Peak Waste Periods</CardTitle>
            <p className="text-xs text-muted-foreground">Hourly waste generation pattern</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peakData}>
                  <XAxis dataKey="hour" stroke="hsl(215 25% 60%)" fontSize={10} tickLine={false} axisLine={false} interval={2} />
                  <YAxis stroke="hsl(215 25% 60%)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="volume" fill="hsl(162 100% 39%)" radius={[2, 2, 0, 0]} name="Volume (kg)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
