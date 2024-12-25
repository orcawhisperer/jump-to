import React, { useState } from 'react';
import { Plus, Search, Trash2, ExternalLink, Download, Upload, Pencil, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel
} from '@/components/ui/alert';
import { useShortcuts } from '@/hooks/useShortcuts';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { UrlService } from '@/services/url';

export const ShortcutsTab: React.FC = () => {
  const [search, setSearch] = useState('');
  const [shortcut, setShortcut] = useState('');
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  // const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [urlProtocol, setUrlProtocol] = useState('https');
  const [editShortcut, setEditShortcut] = useState<{ key: string; url: string }>({
    key: '',
    url: ''
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  console.log('deleteDialog', deleteDialog);

  const {
    shortcuts,
    loading,
    addShortcut,
    deleteShortcut,
    importShortcuts,
    updateShortcut,
    exportShortcuts
  } = useShortcuts();

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

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (newValue.startsWith('http://') || newValue.startsWith('https://')) {
      const protocol = newValue.startsWith('https://') ? 'https' : 'http';
      setUrlProtocol(protocol);
      setUrl(newValue.replace(/^(https?:\/\/)/, ''));
    } else {
      setUrl(newValue);
    }
  };

  const handleProtocolChange = (protocol: 'http' | 'https') => {
    setUrlProtocol(protocol);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      finalUrl = `${urlProtocol}://${url}`;
    }
    try {
      if (isEditMode) {
        await updateShortcut(editShortcut.key, { url: finalUrl });
        setMessage({ type: 'success', text: 'Shortcut updated successfully!' });
        setIsEditMode(false);
      } else {
        await addShortcut(shortcut, finalUrl);
        setMessage({ type: 'success', text: 'Shortcut added successfully!' });
      }
      setShortcut('');
      setUrl('');
      setUrlProtocol('https');
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to process shortcut'
      });
    }
  };

  const handleDelete = async (key: string) => {
    try {
      await deleteShortcut(key);
      setMessage({ type: 'success', text: 'Shortcut deleted' });
      setDeleteDialog(null);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete shortcut' });
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

  const toggleEdit = (key: string, url: string) => {
    setIsEditMode(true);
    // Remove protocol from URL when setting the form
    const urlWithoutProtocol = url.replace(/^(https?:\/\/)/, '');

    // Determine and set the protocol
    const protocol = url.startsWith('https://') ? 'https' : 'http';
    setUrlProtocol(protocol);

    setShortcut(key);
    setUrl(urlWithoutProtocol);
    setEditShortcut({ key, url });
  };

  const cancelEdit = () => {
    setIsEditMode(false);
    setShortcut('');
    setUrl('');
    setUrlProtocol('https');
    setEditShortcut({ key: '', url: '' });
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
                disabled={isEditMode}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">URL</label>
              <Input
                type="text"
                value={url}
                onChange={handleUrlChange}
                placeholder="e.g., github.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">URL Protocol</label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={urlProtocol === 'http' ? 'default' : 'outline'}
                  onClick={() => handleProtocolChange('http')}
                >
                  HTTP
                </Button>
                <Button
                  type="button"
                  variant={urlProtocol === 'https' ? 'default' : 'outline'}
                  onClick={() => handleProtocolChange('https')}
                >
                  HTTPS
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {isEditMode ? (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Update Shortcut
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" /> Add Shortcut
                  </>
                )}
              </Button>
              {isEditMode && (
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
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
                      <div className="flex-1">
                        <div className="font-medium">go/{key}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <span className="text-muted-foreground">{data.url}</span>
                          <a
                            href={UrlService.sanitizeUrl(data.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 flex items-center"
                          >
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleEdit(key, data.url)}
                          disabled={isEditMode}
                        >
                          <Pencil size={16} />
                        </Button>
                        <AlertDialog
                          open={deleteDialog === key}
                          onOpenChange={(open) => setDeleteDialog(open ? key : null)}
                        >
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isEditMode}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Shortcut</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &apos;go/{key}&apos;? This action
                                cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(key)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
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
