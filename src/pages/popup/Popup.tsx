import React, { useState } from 'react';
import { Container, Header } from '@/components/layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ShortcutsTab } from '@/components/shortcuts-tab';
import { RecentTab } from '@/components/recent-tab';
import { StatsTab } from '@/components/stats-tab';
import { SettingsTab } from '@/components/settings-tab';
import { useSettings } from '@/hooks/useSettings';
import { useStats } from '@/hooks/useStats';

export const Popup: React.FC = () => {
  const [activeTab, setActiveTab] = useState('shortcuts');
  const { settings, updateSettings } = useSettings();
  const { stats, loading: statsLoading } = useStats();

  return (
    <div className={settings?.darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-background text-foreground">
        <Container>
          <Header onSettingsClick={() => setActiveTab('settings')} />

          <main className="mt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start">
                <TabsTrigger value="shortcuts">Shortcuts</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="shortcuts">
                <ShortcutsTab />
              </TabsContent>

              <TabsContent value="recent">
                <RecentTab />
              </TabsContent>

              <TabsContent value="stats">
                <StatsTab stats={stats} loading={statsLoading} />
              </TabsContent>

              <TabsContent value="settings">
                <SettingsTab settings={settings} onUpdate={updateSettings} />
              </TabsContent>
            </Tabs>
          </main>
        </Container>
      </div>
    </div>
  );
};

export default Popup;
