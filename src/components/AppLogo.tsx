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
      className={`relative flex items-center justify-center shrink-0 rounded-2xl ${showShadow ? 'shadow-lg shadow-[#C21F2F]/20' : ''} ${className}`}
      style={style}
    >
      <svg 
        viewBox="0 0 512 512" 
        className="w-full h-full rounded-2xl select-none"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main Crimson to Dark Red Gradient */}
          <linearGradient id="logoPrimaryGrad" x1="60" y1="60" x2="450" y2="450" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E03A3E" />
            <stop offset="35%" stopColor="#C21F2F" />
            <stop offset="70%" stopColor="#8B0000" />
            <stop offset="100%" stopColor="#4A0000" />
          </linearGradient>

          {/* Gold Droplet Accent Gradient */}
          <linearGradient id="logoDropletGrad" x1="330" y1="80" x2="430" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F3E5C8" />
            <stop offset="50%" stopColor="#D8BD82" />
            <stop offset="100%" stopColor="#9E7D3B" />
          </linearGradient>

          {/* Gold Center Dot Gradient */}
          <linearGradient id="logoCenterGrad" x1="200" y1="210" x2="310" y2="310" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F5F2EE" />
            <stop offset="50%" stopColor="#D8BD82" />
            <stop offset="100%" stopColor="#C21F2F" />
          </linearGradient>

          {/* Bottom Loop Crimson Gold Blend */}
          <linearGradient id="logoLoopGrad" x1="220" y1="340" x2="420" y2="320" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C21F2F" />
            <stop offset="50%" stopColor="#D8BD82" />
            <stop offset="100%" stopColor="#8B0000" />
          </linearGradient>

          {/* Dark Glass Tile Bevel */}
          <linearGradient id="tileBorderGrad" x1="0" y1="0" x2="0" y2="512" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D8BD82" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#C21F2F" stopOpacity="0.2" />
          </linearGradient>

          {/* Inner Groove Shadow */}
          <filter id="innerBevel" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Dark Squircle Tile Base */}
        <rect 
          x="12" 
          y="12" 
          width="488" 
          height="488" 
          rx="115" 
          fill="#0D0D0F" 
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
          strokeWidth="2"
          opacity="0.12"
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

        {/* Inner Curved Hook / Bottom Crimson Loop */}
        <path 
          d="M 226 348 C 226 332 238 322 254 322 C 320 322 378 312 402 242 C 418 296 386 394 286 400 C 248 402 226 380 226 348 Z" 
          fill="url(#logoLoopGrad)" 
          filter="url(#innerBevel)"
        />

        {/* Smooth Inner Glow Reflections on Colored Shapes */}
        <path 
          d="M 124 250 C 124 176 186 126 270 120 C 204 136 148 186 142 254 C 132 252 124 251 124 250 Z" 
          fill="#FFFFFF" 
          opacity="0.2"
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
          opacity="0.3"
        />
      </svg>
    </div>
  );
};
