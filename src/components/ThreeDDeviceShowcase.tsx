import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { RotateCw, Sparkles, Smartphone, Eye, RefreshCw, Zap, ShieldCheck, Layers } from 'lucide-react';

interface ThreeDDeviceShowcaseProps {
  imageSrc?: string;
  language?: 'hi' | 'en';
}

export const ThreeDDeviceShowcase: React.FC<ThreeDDeviceShowcaseProps> = ({
  imageSrc = '/Screenshot.jpg',
  language = 'hi'
}) => {
  const phoneRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  const [imgError, setImgError] = useState(false);

  // Rotation angles stored in ref for zero-lag 60fps DOM updates
  const rotXRef = useRef(12);
  const rotYRef = useRef(-18);

  // Update DOM transform directly without triggering React re-renders for buttery 60fps
  const applyTransform = useCallback((rx: number, ry: number) => {
    if (phoneRef.current) {
      phoneRef.current.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    }
    if (shadowRef.current) {
      // Scale and offset floor shadow based on Y yaw rotation
      const shadowScale = 1 + Math.sin((rx * Math.PI) / 180) * 0.2;
      const shadowOffsetX = Math.sin((ry * Math.PI) / 180) * -35;
      shadowRef.current.style.transform = `scaleX(${shadowScale.toFixed(2)}) translateX(${shadowOffsetX.toFixed(2)}px)`;
    }
  }, []);

  // High-performance RAF animation loop for smooth auto-rotation
  useEffect(() => {
    let animFrameId: number;
    let lastTime = performance.now();

    const renderLoop = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1); // Cap delta to avoid jumps
      lastTime = now;

      // Continuous 360° rotation speed (20 deg/sec)
      rotYRef.current = (rotYRef.current + delta * 22) % 360;
      // Breathing pitch oscillation
      rotXRef.current = 10 + Math.sin(now / 1000) * 5;

      applyTransform(rotXRef.current, rotYRef.current);

      animFrameId = requestAnimationFrame(renderLoop);
    };

    animFrameId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animFrameId);
  }, [applyTransform]);

  return (
    <div className="relative w-full py-6 sm:py-10 flex flex-col items-center justify-center select-none overflow-visible">
      
      {/* 1. HOLOGRAPHIC BACKGROUND & AMBIENT NEON LIGHTING */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 overflow-hidden">
        {/* Radial Holographic Glow Core */}
        <div className="w-[300px] h-[300px] sm:w-[480px] sm:h-[480px] rounded-full bg-gradient-to-tr from-[#C21F2F]/40 via-[#E03A3E]/30 to-[#D8BD82]/20 blur-[80px] sm:blur-[100px] opacity-80" />

        {/* Orbiting Laser Rings */}
        <div className="absolute w-[280px] h-[280px] sm:w-[480px] sm:h-[480px] rounded-full border border-dashed border-[#C21F2F]/30 dark:border-[#E03A3E]/30 opacity-50 animate-[spin_25s_linear_infinite]" />
        <div className="absolute w-[340px] h-[340px] sm:w-[580px] sm:h-[580px] rounded-full border border-dotted border-[#D8BD82]/20 opacity-35 animate-[spin_35s_linear_infinite_reverse]" />
      </div>

      {/* 2. MAIN 3D INTERACTIVE STAGE */}
      <div
        className="relative pointer-events-none flex flex-col items-center justify-center p-2 sm:p-4"
        style={{ perspective: 1200 }}
      >
        {/* 3D PHONE CHASSIS ROOT */}
        <div
          ref={phoneRef}
          className="relative flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
            willChange: 'transform',
            transform: `rotateX(12deg) rotateY(-18deg)`,
          }}
        >
          {/* SOLID UNIBODY 3D SMARTPHONE CONTAINER */}
          <div
            className="relative w-[190px] h-[390px] sm:w-[220px] sm:h-[450px] lg:w-[240px] lg:h-[490px] rounded-[2.2rem] sm:rounded-[2.6rem] bg-[#1a1a22] p-[6px] sm:p-[8px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] border border-slate-700/50"
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {/* --- SEAMLESS SOLID 3D CHASSIS DEPTH LAYERS (Solid metallic edge from any angle) --- */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 rounded-[2.2rem] sm:rounded-[2.6rem] bg-[#1a1a22] border border-[#353545]/40 pointer-events-none"
                style={{
                  transform: `translateZ(${-i * 1.1}px)`,
                }}
              />
            ))}

            {/* Back Cover Plate (Solid 3D Glass/Titanium back) */}
            <div 
              className="absolute inset-0 rounded-[2.2rem] sm:rounded-[2.6rem] bg-gradient-to-b from-[#1c1c26] via-[#12121a] to-[#0a0a10] border border-white/10 flex flex-col items-center justify-between p-4 sm:p-5 text-center text-slate-400"
              style={{
                transform: 'translateZ(-9px) rotateY(180deg)',
                backfaceVisibility: 'hidden',
              }}
            >
              {/* Rear Camera Island */}
              <div className="absolute top-4 left-4 w-12 h-20 rounded-xl bg-black/90 border border-white/20 p-1.5 flex flex-col items-center justify-around shadow-xl">
                <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-blue-900/90 border border-blue-400/50" />
                </div>
                <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-900/90 border border-blue-400/50" />
                </div>
              </div>

              {/* Back Brand Logo */}
              <div className="opacity-40 flex flex-col items-center gap-1.5 my-auto">
                <img src="/app_logo_512x512-3.png" alt="Logo" className="w-8 h-8 rounded-lg object-cover shadow-md" />
                <span className="text-[8px] font-black tracking-[0.2em] text-white uppercase">LESS LEGAL</span>
              </div>
            </div>

            {/* Side Hardware Buttons */}
            <div className="absolute -right-[4px] top-24 w-[3px] h-8 rounded-r-sm bg-slate-500 border-l border-black shadow-md z-30" />
            <div className="absolute -left-[4px] top-20 w-[3px] h-7 rounded-l-sm bg-slate-500 border-r border-black shadow-md z-30" />
            <div className="absolute -left-[4px] top-29 w-[3px] h-7 rounded-l-sm bg-slate-500 border-r border-black shadow-md z-30" />

            {/* INNER DISPLAY SCREEN (FRONT FACE) */}
            <div className="relative w-full h-full rounded-[1.8rem] sm:rounded-[2.2rem] overflow-hidden bg-black border border-slate-900 shadow-inner flex flex-col z-20">
              
              {/* Camera Notch Punchhole */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center w-3.5 h-3.5 rounded-full bg-black border border-slate-800">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-950 border border-blue-800" />
              </div>

              {/* SCREENSHOT DISPLAY */}
              <div className="relative w-full h-full overflow-hidden bg-slate-950">
                {!imgError ? (
                  <img
                    src={imageSrc}
                    alt="Less Legal App Screenshot"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover object-top select-none pointer-events-none"
                  />
                ) : (
                  <div className="w-full h-full p-4 pt-10 flex flex-col justify-between bg-gradient-to-b from-[#0F0F13] to-[#050507] text-white text-left">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-white/10">
                        <Smartphone className="w-5 h-5 text-red-500" />
                        <span className="text-xs font-bold">Less Legal Mobile App</span>
                      </div>
                      <div className="h-24 rounded-2xl bg-gradient-to-r from-red-600/30 to-amber-600/30 border border-white/10 p-3 flex flex-col justify-end">
                        <div className="text-xs font-black">Case Diary & Utilities</div>
                        <div className="text-[10px] opacity-80">24+ Legal Tools Ready</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Subtle Glass Beam Reflection */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 40%, transparent 60%)',
                  }}
                />
              </div>

              {/* Bottom Gesture Indicator Pill */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-30 w-16 h-1 rounded-full bg-white/30" />
            </div>
          </div>
        </div>

        {/* 3D DYNAMIC FLOOR SHADOW */}
        <div
          ref={shadowRef}
          className="mt-3 w-[160px] h-[20px] sm:w-[190px] sm:h-[24px] rounded-[50%] bg-black/80 border border-red-500/10 blur-xl pointer-events-none transition-transform duration-75"
        />
      </div>
    </div>
  );
};
