import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useClassificationHistory } from '@/hooks/use-dashboard-data';
import { toast } from 'sonner';
import { format } from 'date-fns';

function exportToCSV(data: any[], filename: string) {
  if (!data.length) {
    toast.error('No data to export');
    return;
  }
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(h => {
      const val = row[h];
      const str = typeof val === 'object' ? JSON.stringify(val) : String(val ?? '');
      return `"${str.replace(/"/g, '""')}"`;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success(`Exported ${data.length} records to CSV`);
}

export function ReportsPanel() {
  const { data: classifications } = useClassificationHistory();

  const handleExportAll = () => {
    if (!classifications) return;
    const exportData = classifications.map(c => ({
      date: c.created_at,
      category: c.primary_category,
      confidence: c.confidence,
      recyclable: c.is_recyclable ? 'Yes' : 'No',
      biodegradable: c.is_biodegradable ? 'Yes' : 'No',
      disposal_method: c.disposal_method || 'N/A',
    }));
    exportToCSV(exportData, 'classification_history');
  };

  const handleExportSummary = () => {
    if (!classifications) return;
    const summary: Record<string, { count: number; recyclable: number; nonRecyclable: number }> = {};
    classifications.forEach(c => {
      const cat = c.primary_category;
      if (!summary[cat]) summary[cat] = { count: 0, recyclable: 0, nonRecyclable: 0 };
      summary[cat].count++;
      if (c.is_recyclable) summary[cat].recyclable++;
      else summary[cat].nonRecyclable++;
    });
    const exportData = Object.entries(summary).map(([category, data]) => ({
      category,
      total_count: data.count,
      recyclable: data.recyclable,
      non_recyclable: data.nonRecyclable,
      recyclable_percentage: ((data.recyclable / data.count) * 100).toFixed(1) + '%',
    }));
    exportToCSV(exportData, 'classification_summary');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full History Export */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Classification History
              </CardTitle>
              <p className="text-xs text-muted-foreground">Export all prediction records with details</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  Records available: <span className="font-bold text-foreground">{classifications?.length || 0}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Includes: date, category, confidence, recyclability, disposal method
                </p>
              </div>
              <Button onClick={handleExportAll} className="w-full gap-2" disabled={!classifications?.length}>
                <Download className="w-4 h-4" />
                Export Full History (CSV)
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Summary Export */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-success" />
                Category Summary
              </CardTitle>
              <p className="text-xs text-muted-foreground">Aggregated statistics by waste category</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  Categories tracked: <span className="font-bold text-foreground">8</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Includes: category totals, recyclable/non-recyclable breakdown
                </p>
              </div>
              <Button onClick={handleExportSummary} variant="outline" className="w-full gap-2" disabled={!classifications?.length}>
                <Download className="w-4 h-4" />
                Export Summary (CSV)
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Classifications Table */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-base">Recent Classification Records</CardTitle>
          <p className="text-xs text-muted-foreground">Latest 10 predictions</p>
        </CardHeader>
        <CardContent>
          {classifications && classifications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground font-medium">Date</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Category</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Confidence</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Recyclable</th>
                  </tr>
                </thead>
                <tbody>
                  {classifications.slice(0, 10).map((c) => (
                    <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-2 font-mono text-xs">{format(new Date(c.created_at), 'MMM dd, HH:mm')}</td>
                      <td className="py-2">{c.primary_category}</td>
                      <td className="py-2 font-mono">{((c.confidence) * 100).toFixed(0)}%</td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          c.is_recyclable ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                        }`}>
                          {c.is_recyclable ? 'Yes' : 'No'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No classification records yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
