// src/components/layout/container.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container = ({ children, className }: ContainerProps) => {
  return <div className={cn('p-6 w-[800px] min-h-[600px]', className)}>{children}</div>;
};
