import React from 'react';
import { LTLogo } from './LTLogo';

interface AppLogoProps {
  className?: string;
  showShadow?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({ className = 'w-16 h-16', showShadow = true }) => {
  return (
    <div className={`relative ${className} ${showShadow ? 'drop-shadow-2xl' : ''}`}>
      <LTLogo className="w-full h-full" />
    </div>
  );
};
