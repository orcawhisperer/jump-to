import { useState } from 'react';
import { HotKey } from '@/types';
import { StorageService } from '@/services/storage';
import { useShortcuts } from '@/hooks/useShortcuts';

const HotKeySettings = () => {
  const [hotkeys, setHotkeys] = useState<HotKey[]>([]);
  const { shortcuts } = useShortcuts();

  const updateHotkey = (index: number, key: string) => {
    const updated = [...hotkeys];
    updated[index].key = key;
    setHotkeys(updated);
    StorageService.setHotKeys(updated);
  };

  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <select onChange={() => updateHotkey(i, `hotkey-${i + 1}`)}>
            <option>Select shortcut</option>
            {Object.entries(shortcuts).map(([key, data]) => (
              <option key={key} value={key}>
                {key} - {data.url}
              </option>
            ))}
          </select>
          <div>
            <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt + {i + 1}</kbd>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HotKeySettings;
