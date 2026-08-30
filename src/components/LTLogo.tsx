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
        className="w-full h-full select-none drop-shadow-[0_0_12px_rgba(194,31,47,0.4)]"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="ltCrimson" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E03A3E" />
            <stop offset="100%" stopColor="#8B0000" />
          </linearGradient>
          <linearGradient id="ltGold" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E8CD92" />
            <stop offset="100%" stopColor="#C7A96B" />
          </linearGradient>
          <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Orbital Outer Ring */}
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          stroke="url(#ltGold)" 
          strokeWidth="1.5" 
          strokeDasharray="4 2" 
          opacity="0.4"
        />

        {/* L Shape - Crimson Gradient */}
        <path 
          d="M22 22 L40 22 L40 62 L64 62 L64 78 L22 78 Z" 
          fill="url(#ltCrimson)" 
          filter="url(#logoGlow)"
        />
        
        {/* T Shape - Gold Accent Gradient */}
        <path 
          d="M44 22 L90 22 L90 38 L76 38 L76 78 L60 78 L60 38 L44 38 Z" 
          fill="url(#ltGold)" 
          className="opacity-95"
        />
        
        {/* Smoked Glass Highlight Overlay */}
        <path 
          d="M22 22 L90 22 L90 30 L22 30 Z" 
          fill="#FFFFFF" 
          opacity="0.2" 
        />
      </svg>
    </div>
  );
};
