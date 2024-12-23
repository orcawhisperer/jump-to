// // src/pages/popup/Popup.tsx
// import React, { useState, useEffect } from 'react';
// import {
//   AlertCircle,
//   Plus,
//   Trash2,
//   ExternalLink,
//   Search,
//   Moon,
//   Sun,
//   Settings,
//   Download,
//   Upload,
//   BarChart2,
//   Command,
//   Clock,
//   Archive
// } from 'lucide-react';
// import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Switch } from '@/components/ui/switch';
// import { useShortcuts } from '@/hooks/useShortcuts';
// import { useSettings } from '@/hooks/useSettings';
// import { useStats } from '@/hooks/useStats';
// import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
// import { StorageService } from '@/services/storage';
// import { UrlService } from '@/services/url';

// export const Popup: React.FC = () => {
//   const [activeTab, setActiveTab] = useState('shortcuts');
//   const [search, setSearch] = useState('');
//   const [shortcut, setShortcut] = useState('');
//   const [url, setUrl] = useState('');
//   const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
//   const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

//   const { shortcuts, loading: shortcutsLoading, addShortcut, deleteShortcut } = useShortcuts();
//   const { settings, updateSettings } = useSettings();
//   const { stats } = useStats();

//   // Keyboard shortcuts
//   useKeyboardShortcut('k', () => {
//     const searchInput = document.querySelector('input[type="search"]');
//     if (searchInput instanceof HTMLElement) {
//       searchInput.focus();
//     }
//   });

//   useKeyboardShortcut('n', () => {
//     const shortcutInput = document.querySelector('input[id="shortcut"]');
//     if (shortcutInput instanceof HTMLElement) {
//       shortcutInput.focus();
//     }
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const success = await addShortcut(shortcut, url);
//       if (success) {
//         setShortcut('');
//         setUrl('');
//         setMessage({ text: 'Shortcut added successfully!', type: 'success' });
//       }
//     } catch (error) {
//       setMessage({
//         text: error instanceof Error ? error.message : 'Failed to add shortcut',
//         type: 'error'
//       });
//     }
//   };

//   const handleDelete = async (key: string) => {
//     if (deleteConfirm === key) {
//       const success = await deleteShortcut(key);
//       if (success) {
//         setMessage({ text: 'Shortcut deleted', type: 'success' });
//       } else {
//         setMessage({ text: 'Failed to delete shortcut', type: 'error' });
//       }
//       setDeleteConfirm(null);
//     } else {
//       setDeleteConfirm(key);
//       setTimeout(() => setDeleteConfirm(null), 3000);
//     }
//   };

//   const handleExport = async () => {
//     try {
//       const data = await StorageService.export();
//       const blob = new Blob([data], { type: 'application/json' });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = 'jumpto-shortcuts.json';
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       URL.revokeObjectURL(url);
//       setMessage({ text: 'Shortcuts exported successfully!', type: 'success' });
//     } catch (error) {
//       setMessage({ text: 'Failed to export shortcuts', type: 'error' });
//     }
//   };

//   const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     try {
//       const text = await file.text();
//       await StorageService.import(text);
//       setMessage({ text: 'Shortcuts imported successfully!', type: 'success' });
//     } catch (error) {
//       setMessage({ text: 'Failed to import shortcuts', type: 'error' });
//     }
//   };

//   return (
//     <div className={`p-6 w-[800px] ${settings?.darkMode ? 'dark' : ''}`}>
//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
//         <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
//           <div className="flex items-center space-x-4">
//             <img src="/api/placeholder/48/48" alt="JumpTo" className="w-12 h-12 rounded" />
//             <div>
//               <h1 className="text-2xl font-bold dark:text-white">JumpTo</h1>
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 Quick access to your favorite sites
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={() => updateSettings({ darkMode: !settings?.darkMode })}
//               className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
//             >
//               {settings?.darkMode ? <Sun size={20} /> : <Moon size={20} />}
//             </button>
//             <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
//               <Settings size={20} />
//             </button>
//           </div>
//         </div>

//         {message && (
//           <Alert
//             className={`m-6 ${message.type === 'error' ? 'bg-red-50 dark:bg-red-900' : 'bg-green-50 dark:bg-green-900'}`}
//           >
//             <AlertCircle className={message.type === 'error' ? 'text-red-500' : 'text-green-500'} />
//             <AlertDescription className="ml-2">{message.text}</AlertDescription>
//           </Alert>
//         )}

//         <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
//           <TabsList className="mb-6">
//             <TabsTrigger value="shortcuts">Shortcuts</TabsTrigger>
//             <TabsTrigger value="recent">Recent</TabsTrigger>
//             <TabsTrigger value="stats">Statistics</TabsTrigger>
//             <TabsTrigger value="settings">Settings</TabsTrigger>
//           </TabsList>

//           <TabsContent value="shortcuts">
//             <div className="grid grid-cols-2 gap-6">
//               <div>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Shortcut</label>
//                     <input
//                       id="shortcut"
//                       type="text"
//                       value={shortcut}
//                       onChange={e => setShortcut(e.target.value)}
//                       className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
//                       placeholder="e.g., gh"
//                       pattern="[a-zA-Z0-9-]+"
//                       title="Only letters, numbers, and hyphens allowed"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">URL</label>
//                     <input
//                       type="text"
//                       value={url}
//                       onChange={e => setUrl(e.target.value)}
//                       className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
//                       placeholder="e.g., github.com"
//                       required
//                     />
//                   </div>
//                   <button
//                     type="submit"
//                     className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//                   >
//                     <Plus size={16} /> Add Shortcut
//                   </button>
//                 </form>

//                 <div className="flex gap-2 mt-6">
//                   <button
//                     onClick={handleExport}
//                     className="flex-1 flex items-center justify-center gap-2 p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-700"
//                   >
//                     <Download size={16} /> Export
//                   </button>
//                   <label className="flex-1 flex items-center justify-center gap-2 p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
//                     <Upload size={16} /> Import
//                     <input type="file" accept=".json" onChange={handleImport} className="hidden" />
//                   </label>
//                 </div>
//               </div>

//               <div>
//                 <div className="relative mb-4">
//                   <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
//                   <input
//                     type="search"
//                     placeholder="Search shortcuts..."
//                     value={search}
//                     onChange={e => setSearch(e.target.value)}
//                     className="w-full pl-10 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
//                   />
//                 </div>

//                 <div className="space-y-2 max-h-96 overflow-y-auto">
//                   {Object.entries(shortcuts)
//                     .filter(
//                       ([key, data]) =>
//                         key.toLowerCase().includes(search.toLowerCase()) ||
//                         data.url.toLowerCase().includes(search.toLowerCase())
//                     )
//                     .map(([key, data]) => (
//                       <div
//                         key={key}
//                         className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded border dark:border-gray-600"
//                       >
//                         <div>
//                           <div className="font-medium dark:text-white">go/{key}</div>
//                           <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
//                             {data.url}
//                             <a
//                               href={UrlService.sanitizeUrl(data.url)}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-blue-500 hover:text-blue-600"
//                             >
//                               <ExternalLink size={14} />
//                             </a>
//                           </div>
//                         </div>
//                         <button
//                           onClick={() => handleDelete(key)}
//                           className={`p-2 rounded ${
//                             deleteConfirm === key
//                               ? 'bg-red-500 text-white'
//                               : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900'
//                           }`}
//                           title={
//                             deleteConfirm === key ? 'Click again to confirm' : 'Delete shortcut'
//                           }
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             </div>
//           </TabsContent>

//           <TabsContent value="recent">{/* Recent content here */}</TabsContent>

//           <TabsContent value="stats">{/* Stats content here */}</TabsContent>

//           <TabsContent value="settings">{/* Settings content here */}</TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// };

// export default Popup;

// src/pages/popup/Popup.tsx
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
