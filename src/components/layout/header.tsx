import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { Settings } from 'lucide-react';

interface HeaderProps {
  onSettingsClick: () => void;
}

export const Header = ({ onSettingsClick }: HeaderProps) => {
  return (
    <div className="flex items-center justify-between pb-6 border-b dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <Logo size={48} />
        <div>
          <h1 className="text-2xl font-bold dark:text-white">JumpTo</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Quick access to your favorite sites. Type{' '}
            <i className="text-gray-700 dark:text-gray-300">&#39;go&#39; + tab on chrome</i> or use{' '}
            <i className="text-gray-700 dark:text-gray-300">&#39;go/shortcut&#39;</i> to quickly
            jump to your favorite sites.
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={onSettingsClick} title="Settings">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
