// src/components/tabs/recent-tab.tsx
import React, { useState } from 'react';
import { Clock, ExternalLink, Trash2, Search, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UrlService } from '@/services/url';
import { useShortcuts } from '@/hooks/useShortcuts';

export const RecentTab: React.FC = () => {
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { recentlyUsed, shortcuts, clearRecent, removeFromRecent } = useShortcuts();

  const handleClearHistory = async () => {
    try {
      await clearRecent();
      setMessage({ type: 'success', text: 'History cleared successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to clear history' });
    }
  };

  const handleRemoveItem = async (index: number) => {
    try {
      await removeFromRecent(index);
      setMessage({ type: 'success', text: 'Item removed from history' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to remove item' });
    }
  };

  const filteredItems = recentlyUsed.filter(item => {
    const shortcut = shortcuts[item.shortcut];
    if (!shortcut) return false;

    const searchLower = search.toLowerCase();
    return (
      item.shortcut.toLowerCase().includes(searchLower) ||
      shortcut.url.toLowerCase().includes(searchLower)
    );
  });

  if (recentlyUsed.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium">No recent activity</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Your recently used shortcuts will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Recent Activity</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearHistory}
            className="text-muted-foreground hover:text-destructive"
          >
            Clear History
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search recent shortcuts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {filteredItems.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">No matching shortcuts found</div>
        ) : (
          filteredItems.map((item, index) => {
            const shortcut = shortcuts[item.shortcut];
            if (!shortcut) return null;

            return (
              <Card key={`${item.shortcut}-${item.timestamp}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">go/{item.shortcut}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          {shortcut.url}
                          <a
                            href={UrlService.sanitizeUrl(shortcut.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80"
                          >
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground">
                        {formatTimestamp(item.timestamp)}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(index)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

function formatTimestamp(timestamp: number): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  // For dates older than a week, show the full date
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  return date.toLocaleDateString(undefined, options);
}
