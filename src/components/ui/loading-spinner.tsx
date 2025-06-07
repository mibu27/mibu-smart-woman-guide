
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

const LoadingSpinner = ({ 
  size = 'md', 
  text, 
  className,
  fullScreen = false 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className={cn("animate-spin text-mibu-purple", sizeClasses[size])} />
          {text && (
            <p className={cn("text-gray-600 font-medium", textSizeClasses[size])}>
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <div className="flex flex-col items-center gap-2">
        <Loader2 className={cn("animate-spin text-mibu-purple", sizeClasses[size])} />
        {text && (
          <p className={cn("text-gray-600", textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
