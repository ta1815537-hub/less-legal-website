import React from 'react';

interface LTLogoProps {
  className?: string;
  size?: number;
}

export const LTLogo: React.FC<LTLogoProps> = ({ className = 'w-8 h-8', size }) => {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-[#070B12] border border-white/10 flex items-center justify-center shrink-0 ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      <img
        src="/images/lg.png"
        alt="Less Creation"
        className="w-full h-full object-contain scale-[1.42] translate-y-[12%] select-none pointer-events-none"
        loading="eager"
      />
    </div>
  );
};
