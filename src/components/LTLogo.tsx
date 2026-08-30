import React from 'react';

interface LTLogoProps {
  className?: string;
  size?: number | string;
}

export const LTLogo: React.FC<LTLogoProps> = ({ 
  className = "w-10 h-10", 
  size 
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <div 
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={style}
    >
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full select-none drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="ltGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
          <linearGradient id="ltGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#9333EA" />
          </linearGradient>
        </defs>
        
        {/* L */}
        <path 
          d="M20 20 L40 20 L40 60 L60 60 L60 80 L20 80 Z" 
          fill="url(#ltGrad1)" 
        />
        
        {/* T */}
        <path 
          d="M45 20 L95 20 L95 40 L80 40 L80 80 L60 80 L60 40 L45 40 Z" 
          fill="url(#ltGrad2)" 
          className="opacity-90"
        />
        
        {/* Glass reflection */}
        <path 
          d="M20 20 L95 20 L95 30 L20 30 Z" 
          fill="#FFFFFF" 
          opacity="0.15" 
        />
      </svg>
    </div>
  );
};
