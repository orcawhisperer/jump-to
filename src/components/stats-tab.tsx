import React from 'react';
import { Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { UsageStats } from '@/types';

interface StatsTabProps {
  stats: UsageStats | null;
  loading?: boolean;
}

export const StatsTab: React.FC<StatsTabProps> = ({ stats, loading = false }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-muted-foreground">Loading stats...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <Activity className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium">No stats available</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Start using shortcuts to see usage statistics
        </p>
      </div>
    );
  }

  const chartData =
    stats.dailyUsage?.map(item => ({
      date: new Date(item.date).toLocaleDateString(),
      usage: Object.values(item.shortcuts).reduce((a, b) => a + b, 0)
    })) || [];

  const topShortcuts = Object.entries(stats.usageCounts || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([shortcut, count]) => ({
      shortcut,
      count
    }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Total Shortcuts</div>
            <div className="text-2xl font-bold mt-2">{stats.totalShortcuts || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Most Used</div>
            <div className="text-2xl font-bold mt-2">{stats.mostUsed || 'N/A'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Total Uses</div>
            <div className="text-2xl font-bold mt-2">
              {Object.values(stats.usageCounts || {}).reduce((a, b) => a + b, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Usage Over Time</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="usage" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Top Shortcuts</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topShortcuts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="shortcut" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
