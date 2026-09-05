import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Crown, ChevronRight, ShieldCheck, Zap, Users } from 'lucide-react';

interface ThreeDDeviceShowcaseProps {
  imageSrc?: string;
  language?: 'hi' | 'en';
}

export const ThreeDDeviceShowcase: React.FC<ThreeDDeviceShowcaseProps> = ({
  imageSrc = '/Screenshot.jpg',
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative w-full flex items-center justify-center select-none overflow-visible pt-2 pb-6">
      
      {/* 1. STUDIO ATMOSPHERIC GLOW & BACKLIGHT */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 overflow-hidden">
        {/* Soft Blue / Lavender Core Glow */}
        <div className="w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] rounded-full bg-gradient-to-tr from-[#93C5FD]/40 via-[#DBEAFE]/30 to-[#FEF3C7]/20 dark:from-[#1E3A8A]/30 dark:via-[#1E1B4B]/20 to-transparent blur-[70px] sm:blur-[100px] opacity-90" />
      </div>

      {/* 2. COMPOSITE SHOWCASE CONTAINER */}
      <div className="relative flex flex-col lg:flex-row items-center justify-center gap-6 xl:gap-8 w-full max-w-2xl">
        
        {/* LEFT / CENTER: 3D SMARTPHONE STAGE WITH FLOOR REFLECTION */}
        <div className="relative flex flex-col items-center justify-center">
          
          {/* SMARTPHONE DEVICE FRAME */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [-4, 4, -4] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            className="relative w-[210px] h-[430px] sm:w-[240px] sm:h-[490px] md:w-[260px] md:h-[530px] rounded-[2.8rem] sm:rounded-[3.2rem] bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#020617] p-[6px] sm:p-[7px] shadow-[0_25px_60px_-15px_rgba(30,58,138,0.3),0_15px_35px_-10px_rgba(0,0,0,0.4)] border-2 border-slate-700/60 z-20"
          >
            {/* Outer Blue Metallic Bezel Reflection Rim */}
            <div className="absolute inset-0 rounded-[2.8rem] sm:rounded-[3.2rem] border border-blue-400/30 pointer-events-none" />

            {/* Hardware Side Buttons */}
            <div className="absolute -right-[4px] top-24 w-[3px] h-9 rounded-r-sm bg-slate-400 border-l border-black shadow-md z-30" />
            <div className="absolute -left-[4px] top-20 w-[3px] h-8 rounded-l-sm bg-slate-400 border-r border-black shadow-md z-30" />
            <div className="absolute -left-[4px] top-30 w-[3px] h-8 rounded-l-sm bg-slate-400 border-r border-black shadow-md z-30" />

            {/* INNER DISPLAY SCREEN */}
            <div className="relative w-full h-full rounded-[2.4rem] sm:rounded-[2.8rem] overflow-hidden bg-slate-950 border border-slate-900 shadow-inner flex flex-col">
              
              {/* Top Notch Camera Hole & Speaker Grill */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center w-4 h-4 rounded-full bg-black border border-slate-800 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-900 border border-blue-500/60" />
              </div>

              {/* Status Bar Indicators (Time & Battery) */}
              <div className="absolute top-2 left-5 right-5 z-20 flex items-center justify-between text-[10px] font-bold text-slate-800 dark:text-slate-200 pointer-events-none px-1">
                <span>12.31</span>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2 rounded-2xs border border-current flex items-center p-0.5">
                    <div className="w-full h-full bg-current rounded-3xs" />
                  </div>
                </div>
              </div>

              {/* APP SCREENSHOT IMAGE */}
              <div className="relative w-full h-full overflow-hidden bg-slate-100">
                {!imgError ? (
                  <img
                    src={imageSrc}
                    alt="Less Legal Mobile App Showcase"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover object-top select-none pointer-events-none"
                  />
                ) : (
                  <div className="w-full h-full p-4 pt-10 flex flex-col justify-between bg-gradient-to-b from-[#0F172A] to-[#020617] text-white">
                    <div className="space-y-3">
                      <div className="h-20 rounded-2xl bg-blue-600/30 border border-blue-400/20 p-3 flex flex-col justify-end">
                        <div className="text-xs font-bold">Less Legal Smart App</div>
                        <div className="text-[10px] opacity-70">27+ Legal Tools</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Diagonal Glass Sheen */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 45%, transparent 65%)',
                  }}
                />
              </div>

              {/* Bottom Gesture Bar */}
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-30 w-20 h-1 rounded-full bg-black/40 dark:bg-white/40" />
            </div>
          </motion.div>

          {/* 3D REFLECTION ON THE GROUND ("Jamin" Glossy Reflection) */}
          <div 
            className="w-[200px] sm:w-[230px] md:w-[250px] h-[70px] rounded-[2.5rem] overflow-hidden opacity-25 dark:opacity-15 blur-[1px] pointer-events-none -mt-4 transform scale-y-[-1] mask-image-gradient"
            style={{
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
            }}
          >
            <img
              src={imageSrc}
              alt="Floor Reflection"
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Dynamic Floor Shadow */}
          <div className="w-[180px] sm:w-[220px] h-[18px] sm:h-[22px] rounded-[50%] bg-blue-950/20 dark:bg-black/80 blur-lg pointer-events-none -mt-10" />
        </div>

        {/* RIGHT COLUMN: 4 FLOATING GLASS CARDS + BOOKS + PLANT */}
        <div className="flex flex-col gap-3.5 sm:gap-4 w-full sm:w-auto items-center lg:items-start z-20">
          
          {/* Card 1: Go Premium */}
          <motion.a
            href="/premium"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-[240px] px-4 py-3 rounded-2xl bg-white/90 dark:bg-white/10 backdrop-blur-xl border border-white/80 dark:border-white/15 shadow-[0_10px_25px_-5px_rgba(234,179,8,0.15)] flex items-center justify-between group cursor-pointer transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-xs shrink-0">
                <Crown className="w-5 h-5 fill-amber-500 text-amber-500" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-white leading-tight">Go Premium</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Unlock More Features</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-red-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </motion.a>

          {/* Card 2: Trusted & Secure */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="w-full sm:w-[240px] px-4 py-3 rounded-2xl bg-white/90 dark:bg-white/10 backdrop-blur-xl border border-white/80 dark:border-white/15 shadow-[0_10px_25px_-5px_rgba(16,185,129,0.12)] flex items-center gap-3.5 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-white leading-tight">Trusted</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">& Secure</span>
            </div>
          </motion.div>

          {/* Card 3: Fast & Reliable */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="w-full sm:w-[240px] px-4 py-3 rounded-2xl bg-white/90 dark:bg-white/10 backdrop-blur-xl border border-white/80 dark:border-white/15 shadow-[0_10px_25px_-5px_rgba(239,68,68,0.12)] flex items-center gap-3.5 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 shadow-xs shrink-0">
              <Zap className="w-5 h-5 fill-red-500 text-red-500" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-white leading-tight">Fast</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">& Reliable</span>
            </div>
          </motion.div>

          {/* Card 4: Made for Law Students & Professionals */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="w-full sm:w-[240px] px-4 py-3 rounded-2xl bg-white/90 dark:bg-white/10 backdrop-blur-xl border border-white/80 dark:border-white/15 shadow-[0_10px_25px_-5px_rgba(245,158,11,0.12)] flex items-center gap-3.5 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-xs shrink-0">
              <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-white leading-tight">Made for</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Law Students & Professionals</span>
            </div>
          </motion.div>

          {/* BOTTOM DECORATIVE SECTION: PLANT + 3D BOOKS + CURSIVE TEXT */}
          <div className="pt-2 flex items-end gap-3 w-full sm:w-[240px] justify-between">
            
            {/* Plant Pot */}
            <div className="flex flex-col items-center shrink-0">
              {/* Leaves */}
              <div className="relative w-8 h-8 flex items-center justify-center -mb-1">
                <div className="w-4 h-6 rounded-full bg-emerald-500 transform -rotate-25 origin-bottom shadow-xs" />
                <div className="w-4 h-7 rounded-full bg-emerald-600 transform rotate-12 origin-bottom shadow-xs -ml-1" />
                <div className="w-3.5 h-5 rounded-full bg-emerald-400 transform rotate-40 origin-bottom shadow-xs -ml-1" />
              </div>
              {/* White Ceramic Pot */}
              <div className="w-7 h-8 rounded-b-lg bg-gradient-to-b from-white to-slate-200 border border-slate-300 shadow-md flex items-center justify-center">
                <div className="w-5 h-1 rounded-full bg-slate-300/60" />
              </div>
            </div>

            {/* Stack of 3 Realistic Books */}
            <div className="flex flex-col items-end gap-1 flex-1">
              {/* Cursive Companion Text */}
              <div className="text-right -mb-1">
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 font-serif italic block">
                  Your Legal Companion
                </span>
                <span className="text-sm sm:text-base font-black text-red-600 dark:text-red-400 font-serif italic block -mt-1">
                  Always
                </span>
              </div>

              {/* Book 1 (Top Blue) */}
              <div className="w-full py-1 px-2.5 rounded-md bg-[#1E3A8A] text-white text-[9px] font-black tracking-wider text-center shadow-sm border-l-4 border-blue-950">
                KNOW THE LAW
              </div>
              {/* Book 2 (Middle Orange) */}
              <div className="w-full py-1 px-2.5 rounded-md bg-[#EA580C] text-white text-[9px] font-black tracking-wider text-center shadow-sm border-l-4 border-amber-950">
                USE TECHNOLOGY
              </div>
              {/* Book 3 (Bottom Green) */}
              <div className="w-full py-1 px-2.5 rounded-md bg-[#047857] text-white text-[9px] font-black tracking-wider text-center shadow-sm border-l-4 border-emerald-950">
                EMPOWER YOURSELF
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
