import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Crown, ShieldCheck, Zap, Layers, Sparkles, Smartphone } from 'lucide-react';

interface ThreeDDeviceShowcaseProps {
  imageSrc?: string;
  language?: 'hi' | 'en';
}

export const ThreeDDeviceShowcase: React.FC<ThreeDDeviceShowcaseProps> = ({
  imageSrc = '/Screenshot.jpg',
  language = 'en',
}) => {
  const [imgError, setImgError] = useState(false);
  const isHindi = language === 'hi';

  return (
    <div className="relative w-full flex items-center justify-center select-none overflow-visible py-2">
      
      {/* Ambient Backlight */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 overflow-hidden">
        <div className="w-[300px] h-[300px] sm:w-[460px] sm:h-[460px] rounded-full bg-gradient-to-tr from-blue-500/15 via-sky-400/10 to-transparent dark:from-blue-600/20 dark:via-indigo-900/15 to-transparent blur-[70px] sm:blur-[90px]" />
      </div>

      {/* Composite Showcase Layout */}
      <div className="relative flex flex-col lg:flex-row items-center justify-center gap-6 xl:gap-8 w-full max-w-2xl">
        
        {/* Smartphone Device Stage */}
        <div className="relative flex flex-col items-center justify-center">
          
          {/* Device Frame */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [-3, 3, -3] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            className="relative w-[215px] h-[440px] sm:w-[245px] sm:h-[500px] md:w-[265px] md:h-[540px] rounded-[2.8rem] sm:rounded-[3.2rem] bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 p-[6px] sm:p-[7px] shadow-[0_25px_60px_-15px_rgba(30,58,138,0.25),0_12px_28px_-8px_rgba(0,0,0,0.35)] border-2 border-slate-700/60 z-20"
          >
            {/* Bezel Rim Reflection */}
            <div className="absolute inset-0 rounded-[2.8rem] sm:rounded-[3.2rem] border border-blue-400/20 pointer-events-none" />

            {/* Hardware Side Buttons */}
            <div className="absolute -right-[4px] top-24 w-[3px] h-9 rounded-r-xs bg-slate-400 border-l border-black/40 shadow-xs z-30" />
            <div className="absolute -left-[4px] top-20 w-[3px] h-8 rounded-l-xs bg-slate-400 border-r border-black/40 shadow-xs z-30" />
            <div className="absolute -left-[4px] top-30 w-[3px] h-8 rounded-l-xs bg-slate-400 border-r border-black/40 shadow-xs z-30" />

            {/* Inner Display Screen */}
            <div className="relative w-full h-full rounded-[2.4rem] sm:rounded-[2.8rem] overflow-hidden bg-slate-950 border border-slate-900 shadow-inner flex flex-col">
              
              {/* Camera Notch */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center w-4 h-4 rounded-full bg-black border border-slate-800 shadow-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-900 border border-blue-500/50" />
              </div>

              {/* Status Bar */}
              <div className="absolute top-2 left-5 right-5 z-20 flex items-center justify-between text-[10px] font-bold text-slate-700 dark:text-slate-300 pointer-events-none px-1">
                <span>12:30</span>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2 rounded-2xs border border-current flex items-center p-0.5">
                    <div className="w-full h-full bg-current rounded-3xs" />
                  </div>
                </div>
              </div>

              {/* App Screen Content */}
              <div className="relative w-full h-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                {!imgError ? (
                  <img
                    src={imageSrc}
                    alt="Less Legal Mobile App Interface"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover object-top select-none pointer-events-none"
                  />
                ) : (
                  <div className="w-full h-full p-4 pt-10 flex flex-col justify-between bg-gradient-to-b from-slate-900 to-slate-950 text-white">
                    <div className="space-y-3">
                      <div className="h-20 rounded-2xl bg-blue-600/20 border border-blue-400/20 p-3 flex flex-col justify-end">
                        <div className="text-xs font-bold text-white">Less Legal App</div>
                        <div className="text-[10px] text-blue-200">Legal Utilities & Reference</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Subtle Screen Sheen */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 40%, transparent 60%)',
                  }}
                />
              </div>

              {/* Bottom Gesture Bar */}
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-30 w-20 h-1 rounded-full bg-black/40 dark:bg-white/30" />
            </div>
          </motion.div>

          {/* Floor Reflection */}
          <div 
            className="w-[200px] sm:w-[230px] md:w-[250px] h-[55px] rounded-[2rem] overflow-hidden opacity-20 dark:opacity-10 blur-[1px] pointer-events-none -mt-4 transform scale-y-[-1]"
            style={{
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 80%)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 80%)',
            }}
          >
            <img
              src={imageSrc}
              alt=""
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Soft Shadow */}
          <div className="w-[170px] sm:w-[210px] h-[16px] rounded-[50%] bg-slate-900/20 dark:bg-black/60 blur-md pointer-events-none -mt-8" />
        </div>

        {/* Feature Highlights Column */}
        <div className="flex flex-col gap-3 w-full sm:w-auto items-center lg:items-start z-20">
          
          {/* Card 1: Lifetime Pass */}
          <motion.a
            href="/premium"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-[250px] p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-sm hover:border-blue-500/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Crown className="w-4 h-4 fill-amber-500/20" />
              </div>
              <div className="flex flex-col text-left min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {isHindi ? 'लाइफटाइम पास' : 'Lifetime Access'}
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300">
                    ₹99
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {isHindi ? 'विज्ञापन-मुक्त • एकमुश्त' : 'Ad-free • One-time purchase'}
                </span>
              </div>
            </div>
          </motion.a>

          {/* Card 2: Local & Private */}
          <div className="w-full sm:w-[250px] p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {isHindi ? 'ऑन-डिवाइस प्रोसेसिंग' : 'On-Device Privacy'}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {isHindi ? 'दस्तावेज़ आपके फोन पर सुरक्षित' : 'Files processed locally'}
              </span>
            </div>
          </div>

          {/* Card 3: Lightweight & Fast */}
          <div className="w-full sm:w-[250px] p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 fill-blue-500/20" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {isHindi ? 'त्वरित एवं हल्का ऐप' : 'Fast & Lightweight'}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {isHindi ? 'बिना रुकावट त्वरित प्रदर्शन' : 'Responsive native execution'}
              </span>
            </div>
          </div>

          {/* Card 4: Built for Practitioners & Citizens */}
          <div className="w-full sm:w-[250px] p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {isHindi ? 'व्यापक उपयोगिताएँ' : 'Integrated Toolkit'}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {isHindi ? 'पीडीएफ, कैलकुलेटर व संदर्भ' : 'PDF, calculators & reference'}
              </span>
            </div>
          </div>

          {/* Android Target Tag */}
          <div className="w-full sm:w-[250px] pt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Smartphone className="w-3.5 h-3.5 text-blue-500" />
              Android 7.0+
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              v8.7.5
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
