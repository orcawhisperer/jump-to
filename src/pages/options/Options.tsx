import React from 'react';
import { Moon, Sun, Command, BellRing, CloudUpload, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSettings } from '@/hooks/useSettings';

export const Options: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  if (!settings) {
    return (
      <div className="text-center p-8">
        <Shield className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium">Loading Settings</h3>
      </div>
    );
  }

  const handleToggle = (key: keyof typeof settings) => {
    updateSettings({ [key]: !settings[key] });
  };

  return (
    <div className={`p-6 ${settings.darkMode ? 'dark' : ''}`}>
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold mb-6">JumpTo Settings</h1>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Dark Mode</div>
                  <div className="text-sm text-muted-foreground">Toggle dark mode theme</div>
                </div>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={() => handleToggle('darkMode')}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Command className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Keyboard Shortcuts</div>
                  <div className="text-sm text-muted-foreground">
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">⌘/Ctrl</kbd> +{' '}
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">K</kbd> to search
                  </div>
                </div>
              </div>
              <Switch
                checked={settings.keyboardShortcutsEnabled}
                onCheckedChange={() => handleToggle('keyboardShortcutsEnabled')}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CloudUpload className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Auto Backup</div>
                  <div className="text-sm text-muted-foreground">
                    Automatically backup shortcuts weekly
                  </div>
                </div>
              </div>
              <Switch
                checked={settings.autoBackupEnabled}
                onCheckedChange={() => handleToggle('autoBackupEnabled')}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BellRing className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Analytics</div>
                  <div className="text-sm text-muted-foreground">
                    Help improve JumpTo by sharing anonymous usage data
                  </div>
                </div>
              </div>
              <Switch
                checked={settings.analyticsEnabled}
                onCheckedChange={() => handleToggle('analyticsEnabled')}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
