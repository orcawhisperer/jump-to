import { Moon, Sun, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/hooks/useSettings';
import { Logo } from '@/components/logo';

interface HeaderProps {
  onSettingsClick: () => void;
}

export const Header = ({ onSettingsClick }: HeaderProps) => {
  //   const { settings, updateSettings } = useSettings();

  //   const handleThemeToggle = async () => {
  //     await updateSettings({ darkMode: !settings?.darkMode });
  //   };

  return (
    <div className="flex items-center justify-between pb-6 border-b dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <Logo size={48} />
        <div>
          <h1 className="text-2xl font-bold dark:text-white">JumpTo</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Quick access to your favorite sites. Type{' '}
            <i className="text-gray-700 dark:text-gray-300">'go' + tab on chrome</i> or use{' '}
            <i className="text-gray-700 dark:text-gray-300">'go/shortcut'</i> to quickly jump to
            your favorite sites.
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* <Button
          variant="ghost"
          size="icon"
          onClick={handleThemeToggle}
          title={settings?.darkMode ? 'Light mode' : 'Dark mode'}
        >
          {settings?.darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button> */}

        <Button variant="ghost" size="icon" onClick={onSettingsClick} title="Settings">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
