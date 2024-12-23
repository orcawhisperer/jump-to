import React from 'react';
import { Waypoints } from 'lucide-react';

export const Logo: React.FC<{ size?: number; className?: string }> = ({
  size = 48,
  className = ''
}) => {
  return (
    <div className={`p-2 bg-blue-500 rounded-xl ${className}`}>
      <Waypoints size={size} className="text-white" strokeWidth={1.5} />
    </div>
  );
};
