// src/components/tabs/shortcuts-tab.tsx
import React, { useState } from 'react';
import { Plus, Search, Trash2, ExternalLink, Download, Upload } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useShortcuts } from '@/hooks/useShortcuts';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { UrlService } from '@/services/url';

export const ShortcutsTab: React.FC = () => {
  const [search, setSearch] = useState('');
  const [shortcut, setShortcut] = useState('');
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { shortcuts, loading, addShortcut, deleteShortcut, importShortcuts, exportShortcuts } =
    useShortcuts();

  useKeyboardShortcut({ key: 'k', ctrl: true }, () => {
    const searchInput = document.querySelector('input[type="search"]');
    if (searchInput instanceof HTMLElement) {
      searchInput.focus();
    }
  });

  useKeyboardShortcut({ key: 'n', ctrl: true }, () => {
    const shortcutInput = document.querySelector('input#shortcut-input');
    if (shortcutInput instanceof HTMLElement) {
      shortcutInput.focus();
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addShortcut(shortcut, url);
      setMessage({ type: 'success', text: 'Shortcut added successfully!' });
      setShortcut('');
      setUrl('');
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to add shortcut'
      });
    }
  };

  const handleDelete = async (key: string) => {
    if (deleteConfirm === key) {
      try {
        await deleteShortcut(key);
        setMessage({ type: 'success', text: 'Shortcut deleted' });
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to delete shortcut' });
      }
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(key);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await importShortcuts(file);
      setMessage({ type: 'success', text: 'Shortcuts imported successfully!' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to import shortcuts'
      });
    }
  };

  const handleExport = async () => {
    try {
      await exportShortcuts();
      setMessage({ type: 'success', text: 'Shortcuts exported successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to export shortcuts' });
    }
  };

  return (
    <div>
      {message && (
        <Alert className="mb-4" variant={message.type === 'error' ? 'destructive' : 'default'}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Shortcut Name</label>
              <Input
                id="shortcut-input"
                type="text"
                value={shortcut}
                onChange={e => setShortcut(e.target.value)}
                placeholder="e.g., gh"
                pattern="[a-zA-Z0-9-]+"
                title="Only letters, numbers, and hyphens allowed"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">URL</label>
              <Input
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="e.g., github.com"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Shortcut
            </Button>
          </form>

          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <label className="flex-1">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById('import-file')?.click()}
              >
                <Upload className="mr-2 h-4 w-4" /> Import
              </Button>
              <input
                id="import-file"
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
            <Input
              type="search"
              className="pl-10"
              placeholder="Search shortcuts... (Ctrl + K)"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="text-center py-4 text-muted-foreground">Loading...</div>
            ) : (
              Object.entries(shortcuts)
                .filter(
                  ([key, data]) =>
                    key.toLowerCase().includes(search.toLowerCase()) ||
                    data.url.toLowerCase().includes(search.toLowerCase())
                )
                .map(([key, data]) => (
                  <Card key={key}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium">go/{key}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          {data.url}
                          <a
                            href={UrlService.sanitizeUrl(data.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80"
                          >
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(key)}
                        className={deleteConfirm === key ? 'text-destructive' : ''}
                        title={deleteConfirm === key ? 'Click again to confirm' : 'Delete shortcut'}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </CardContent>
                  </Card>
                ))
            )}

            {!loading && Object.keys(shortcuts).length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No shortcuts found. Add your first one!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
