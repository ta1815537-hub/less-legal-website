import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { ArrowLeft, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Zap, Calculator, Layers, Cpu, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { launchLessLegalApp } from '../utils/deepLink';

interface PremiumPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const PremiumPage: React.FC<PremiumPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [timeLeft, setTimeLeft] = useState({ days: 120, hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    const STORAGE_KEY = 'less_legal_promo_target_120d_v1';
    let targetTime = localStorage.getItem(STORAGE_KEY);
    const ONE_HUNDRED_TWENTY_DAYS_MS = (120 * 24 * 3600 + 14 * 3600 + 28 * 60 + 45) * 1000;
    
    if (!targetTime) {
      const newTarget = Date.now() + ONE_HUNDRED_TWENTY_DAYS_MS;
      localStorage.setItem(STORAGE_KEY, newTarget.toString());
      targetTime = newTarget.toString();
    }
    
    const interval = setInterval(() => {
      const difference = parseInt(targetTime!) - Date.now();
      if (difference <= 0) {
        const newTarget = Date.now() + ONE_HUNDRED_TWENTY_DAYS_MS;
        localStorage.setItem(STORAGE_KEY, newTarget.toString());
        targetTime = newTarget.toString();
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 space-y-8 text-white">
      {/* Back Button */}
      <div className="flex items-center justify-start">
        <button
          onClick={() => onNavigate('home')}
          className="text-xs font-semibold text-stone-300 hover:text-red-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-red-400" />
          <span>{isHindi ? "होमपेज पर लौटें" : "Back to Home"}</span>
        </button>
      </div>

      {/* Header - Reduced Headline */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="px-2.5 py-0.5 rounded bg-[#C9A24B]/20 text-[#C9A24B] border border-[#C9A24B]/40 text-[10px] font-bold uppercase tracking-wider">
          {isHindi ? "आजीवन सदस्यता" : "LIFETIME VIP ACCESS"}
        </span>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
          {isHindi ? 'Less Creation को हमेशा के लिए अनलॉक करें' : 'Unlock Less Creation Forever'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          {isHindi 
            ? 'केवल ₹99 के एकमुश्त सहयोग के साथ सभी प्रीमियम कानूनी और उत्पादकता टूल्स का आजीवन आनंद लें।' 
            : 'Get permanent access to all advanced document suites and security tools with a single one-time pass.'}
        </p>
      </div>

      {/* Pricing Card */}
      <div className="max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-[#0D1220] border border-[#C9A24B]/40 shadow-2xl text-center space-y-5">
        <div className="space-y-1">
          <span className="text-3xl sm:text-4xl font-extrabold text-[#C9A24B] font-mono">₹99</span>
          <span className="block text-[11px] text-stone-400 uppercase tracking-widest">{isHindi ? "एकमुश्त आजीवन पहुंच" : "One-Time Lifetime Access"}</span>
        </div>

        {/* Countdown */}
        <div className="grid grid-cols-4 gap-1.5 bg-black/40 border border-white/10 p-2.5 rounded-xl text-center">
          <div>
            <span className="block text-sm font-bold text-white font-mono">{timeLeft.days}</span>
            <span className="text-[8px] text-stone-400 uppercase">Days</span>
          </div>
          <div>
            <span className="block text-sm font-bold text-white font-mono">{timeLeft.hours}</span>
            <span className="text-[8px] text-stone-400 uppercase">Hours</span>
          </div>
          <div>
            <span className="block text-sm font-bold text-white font-mono">{timeLeft.minutes}</span>
            <span className="text-[8px] text-stone-400 uppercase">Mins</span>
          </div>
          <div>
            <span className="block text-sm font-bold text-white font-mono">{timeLeft.seconds}</span>
            <span className="text-[8px] text-stone-400 uppercase">Secs</span>
          </div>
        </div>

        <ul className="text-left space-y-2 text-xs text-stone-300 border-t border-white/10 pt-4">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
            <span>{isHindi ? "100% विज्ञापन-मुक्त अनुभव" : "100% Ad-Free Clean UI"}</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
            <span>{isHindi ? "असीमित ऑन-डिवाइस PDF व विधिक टूल्स" : "Unlimited On-Device Document Utilities"}</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
            <span>{isHindi ? "सुरक्षित केस डायरी एवं ऑफलाइन संदर्भ" : "Encrypted Case Diary & Offline Reference"}</span>
          </li>
        </ul>

        <button
          onClick={() => launchLessLegalApp('premium')}
          className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-950/60 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>{isHindi ? "₹99 में वीआईपी पास प्राप्त करें" : "Claim VIP Pass for ₹99"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
