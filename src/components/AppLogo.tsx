import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: number | string;
  showShadow?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({ 
  className = "w-10 h-10", 
  size,
  showShadow = true 
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <div 
      className={`relative flex items-center justify-center shrink-0 rounded-2xl ${showShadow ? 'shadow-md shadow-indigo-900/15' : ''} ${className}`}
      style={style}
    >
      <svg 
        viewBox="0 0 512 512" 
        className="w-full h-full rounded-2xl select-none"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main Vibrant Cyan to Purple Gradient */}
          <linearGradient id="logoPrimaryGrad" x1="60" y1="60" x2="450" y2="450" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00A3FF" />
            <stop offset="35%" stopColor="#0EA5E9" />
            <stop offset="65%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>

          {/* Droplet Accent Gradient */}
          <linearGradient id="logoDropletGrad" x1="330" y1="80" x2="430" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00C2FF" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>

          {/* Center Dot Gradient */}
          <linearGradient id="logoCenterGrad" x1="200" y1="210" x2="310" y2="310" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="50%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#9333EA" />
          </linearGradient>

          {/* Bottom Loop Violet Gradient */}
          <linearGradient id="logoLoopGrad" x1="220" y1="340" x2="420" y2="320" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>

          {/* Tile Bevel / Outer Lighting */}
          <linearGradient id="tileBorderGrad" x1="0" y1="0" x2="0" y2="512" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          {/* Inner Groove Shadow */}
          <filter id="innerBevel" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0F172A" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* Squircle White Tile Base */}
        <rect 
          x="12" 
          y="12" 
          width="488" 
          height="488" 
          rx="115" 
          fill="#F8FAFC" 
          stroke="url(#tileBorderGrad)" 
          strokeWidth="6"
        />

        {/* 3D Inner Lighting highlight on tile */}
        <rect 
          x="20" 
          y="20" 
          width="472" 
          height="472" 
          rx="108" 
          fill="none" 
          stroke="#FFFFFF" 
          strokeWidth="8"
          opacity="0.9"
        />

        {/* Top-Right Droplet / Leaf Element */}
        <path 
          d="M346 172C332 144 340 102 376 76C408 53 430 84 416 122C404 154 372 188 346 172Z" 
          fill="url(#logoDropletGrad)" 
          filter="url(#innerBevel)"
        />

        {/* Outer Swirl C-Shape Arc */}
        <path 
          d="M 306 126 C 210 102 102 170 102 278 C 102 374 196 438 280 422 C 220 404 168 350 168 282 C 168 200 234 154 306 126 Z" 
          fill="url(#logoPrimaryGrad)" 
          filter="url(#innerBevel)"
        />

        {/* Central Circular Node */}
        <circle 
          cx="256" 
          cy="260" 
          r="52" 
          fill="url(#logoCenterGrad)" 
          filter="url(#innerBevel)"
        />

        {/* Inner Curved Hook / Bottom Purple Loop */}
        <path 
          d="M 226 348 C 226 332 238 322 254 322 C 320 322 378 312 402 242 C 418 296 386 394 286 400 C 248 402 226 380 226 348 Z" 
          fill="url(#logoLoopGrad)" 
          filter="url(#innerBevel)"
        />

        {/* Smooth Inner Glow Reflections on Colored Shapes */}
        <path 
          d="M 124 250 C 124 176 186 126 270 120 C 204 136 148 186 142 254 C 132 252 124 251 124 250 Z" 
          fill="#FFFFFF" 
          opacity="0.35"
        />
        <circle 
          cx="242" 
          cy="246" 
          r="20" 
          fill="#FFFFFF" 
          opacity="0.25"
        />
        <path 
          d="M 374 94 C 392 78 408 94 400 118 C 394 102 384 96 374 94 Z" 
          fill="#FFFFFF" 
          opacity="0.4"
        />
      </svg>
    </div>
  );
};
