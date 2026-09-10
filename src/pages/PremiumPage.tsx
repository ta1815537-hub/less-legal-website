import React from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { 
  Sparkles, CheckCircle2, ShieldCheck, 
  FileText, ArrowUpRight, ArrowLeft,
  Smartphone, Lock, Download, Check,
  Zap, HelpCircle, ShieldAlert, Award, Mail,
  CreditCard, Shield, Ban, Cpu, BookOpen, Scale,
  Calculator, MapPin, BookMarked, Layers, Lightbulb,
  ArrowRight
} from 'lucide-react';
import { 
  ScrollReveal, StaggerContainer, StaggerItem, 
  HeroAmbientGlow, GlowingButton 
} from '../components/MotionWrappers';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { launchLessLegalApp } from '../utils/deepLink';

interface PremiumPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const PremiumPage: React.FC<PremiumPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';

  // 120 Days countdown timer for the Lifetime Pass
  const [timeLeft, setTimeLeft] = React.useState({ days: 120, hours: 14, minutes: 28, seconds: 45 });
  const [targetTimestamp, setTargetTimestamp] = React.useState<number | null>(null);

  React.useEffect(() => {
    const STORAGE_KEY = 'less_legal_promo_target_120d_v1';
    let targetTime = localStorage.getItem(STORAGE_KEY);
    const ONE_HUNDRED_TWENTY_DAYS_MS = (120 * 24 * 3600 + 14 * 3600 + 28 * 60 + 45) * 1000;
    
    if (!targetTime) {
      const newTarget = Date.now() + ONE_HUNDRED_TWENTY_DAYS_MS;
      localStorage.setItem(STORAGE_KEY, newTarget.toString());
      targetTime = newTarget.toString();
    }
    
    setTargetTimestamp(parseInt(targetTime));

    const interval = setInterval(() => {
      const difference = parseInt(targetTime!) - Date.now();
      if (difference <= 0) {
        const newTarget = Date.now() + ONE_HUNDRED_TWENTY_DAYS_MS;
        localStorage.setItem(STORAGE_KEY, newTarget.toString());
        targetTime = newTarget.toString();
        setTargetTimestamp(newTarget);
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

  const formattedTargetDate = React.useMemo(() => {
    if (!targetTimestamp) return '';
    const date = new Date(targetTimestamp);
    
    const monthsHi = [
      'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 
      'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
    ];
    const weekdaysHi = [
      'रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'
    ];
    
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    const weekdayHi = weekdaysHi[date.getDay()];
    const monthHi = monthsHi[date.getMonth()];
    
    if (language === 'hi') {
      return `${day} ${monthHi} ${year} (${weekdayHi})`;
    }
    
    const monthsEn = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const weekdaysEn = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];
    const weekdayEn = weekdaysEn[date.getDay()];
    const monthEn = monthsEn[date.getMonth()];
    return `${day} ${monthEn} ${year} (${weekdayEn})`;
  }, [targetTimestamp, language]);

  const handleOpenAppOrDownload = () => {
    launchLessLegalApp('premium');
  };

  // What You Get Benefit cards according to master prompt Section 15
  const benefitCards = [
    {
      icon: Ban,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40',
      title: isHindi ? 'विज्ञापन-मुक्त अनुभव' : 'Ad-Free Experience',
      desc: isHindi ? 'बिना किसी रुकावट के पूरी तरह से स्वच्छ और केंद्रित कानूनी वर्कफ़्लो।' : '100% distraction-free workflow with zero banner or interstitial ads.'
    },
    {
      icon: FileText,
      color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/40 dark:text-sky-400 border border-sky-200/50 dark:border-sky-800/40',
      title: isHindi ? 'पीडीएफ टूल्स सुइट' : 'PDF Tools Suite',
      desc: isHindi ? 'पीडीएफ मर्ज, स्प्लिट, कंप्रेस और एन्क्रिप्ट करें तुरंत और सुरक्षित।' : 'Merge, split, compress, and organize legal documents seamlessly.'
    },
    {
      icon: Scale,
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/40',
      title: isHindi ? 'बेयर एक्ट्स संदर्भ' : 'Bare Acts Reference',
      desc: isHindi ? 'प्रमुख केंद्रीय और राज्य बेयर एक्ट्स तक तुरंत और ऑफलाइन पहुँच।' : 'Instant offline access to major Indian Central and State bare acts.'
    },
    {
      icon: BookOpen,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40',
      title: isHindi ? 'केस डायरी' : 'Case Diary Tracker',
      desc: isHindi ? 'सुनवाई की तारीखें ट्रैक करें, मुकदमों का विवरण और नोट्स व्यवस्थित रखें।' : 'Track hearings, manage client proceedings, and log case notes easily.'
    },
    {
      icon: Calculator,
      color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/40 dark:text-sky-400 border border-sky-200/50 dark:border-sky-800/40',
      title: isHindi ? 'कानूनी कैलकुलेटर' : 'Legal Calculators',
      desc: isHindi ? 'कोर्ट फीस, ब्याज, स्टैम्प ड्यूटी और परिसीमा (Limitation) गणना।' : 'Precise court fees, interest, stamp duty, and limitation calculators.'
    },
    {
      icon: MapPin,
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/40',
      title: isHindi ? 'भूमि इकाई परिवर्तक' : 'Land Unit Converter',
      desc: isHindi ? 'बीघा, बिस्वा, गुंठा, एकड़, हेक्टेयर का सटीक क्षेत्रीय रूपांतरण।' : 'Bigha, Biswa, Guntha, Acre, Hectare accurate regional unit conversion.'
    },
    {
      icon: Layers,
      color: 'text-violet-600 bg-violet-50 dark:bg-violet-950/40 dark:text-violet-400 border border-violet-200/50 dark:border-violet-800/40',
      title: isHindi ? 'कानूनी शब्दावली' : 'Legal Glossary',
      desc: isHindi ? 'द्विभाषी हिंदी और अंग्रेजी विधिक शब्दावली और व्याख्याएं।' : 'Bilingual legal terminology and clear judicial definitions.'
    },
    {
      icon: Cpu,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40',
      title: isHindi ? 'क्विक नोट्स' : 'Quick Notes',
      desc: isHindi ? 'ऑफलाइन केस टिप्पणियां, मुवक्किल विवरण और संदर्भ बिंदु सहेजें।' : 'Save offline case observations, client briefs, and citations safely.'
    },
    {
      icon: Zap,
      color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/40 dark:text-sky-400 border border-sky-200/50 dark:border-sky-800/40',
      title: isHindi ? 'फाइल टूल्स & लेस शेयर' : 'File Tools & Less Share',
      desc: isHindi ? 'सुरक्षित स्थानीय फ़ाइल स्थानांतरण और एन्क्रिप्टेड फ़ाइल स्टोरेज।' : 'Direct local file transfers and encrypted storage management.'
    },
    {
      icon: Award,
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/40',
      title: isHindi ? 'प्रीमियम यूटिलिटीज' : 'Premium Utilities',
      desc: isHindi ? 'प्राथमिकता प्रदर्शन, त्वरित अद्यतन और निरंतर नई सुविधाएं।' : 'Priority performance, instant updates, and offline accessibility.'
    }
  ];

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-24 sm:pb-32 space-y-8 sm:space-y-10 overflow-hidden">
      <HeroAmbientGlow />
      
      {/* 13. HERO SECTION */}
      <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto space-y-3 relative z-10">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <motion.button
            whileHover={{ x: -3 }}
            onClick={() => onNavigate('home')}
            className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap bg-white/85 dark:bg-slate-900/40 backdrop-blur-md border border-blue-200/40 dark:border-blue-800/20 hover:border-blue-400/30 px-3.5 py-1.5 rounded-full shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
            <span className="whitespace-nowrap">{t.common.backToHome}</span>
          </motion.button>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 text-xs font-black tracking-wider uppercase shadow-2xs cursor-default whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span className="whitespace-nowrap">{isHindi ? 'सीमित समय का विशेष ऑफर' : 'LIMITED TIME SPECIAL OFFER'}</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {isHindi ? 'Less Legal को हमेशा के लिए अनलॉक करें' : 'Unlock Less Legal Forever'}
        </h1>

        <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
          {isHindi 
            ? 'एक ही बार के आसान भुगतान के साथ सभी प्रीमियम कानूनी टूल्स का आनंद लें।' 
            : 'Get premium tools with a single one-time payment.'}
        </p>

        {/* Informative App Purchase Notice */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-800/40 text-blue-800 dark:text-blue-300 text-xs font-bold shadow-2xs max-w-full">
          <Smartphone className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="truncate">
            {isHindi 
              ? 'पास की सुरक्षित खरीदारी और सक्रियण Less Legal Android ऐप के अंदर होती है।' 
              : 'Pass checkout & instant activation is completed securely inside Less Legal Android App.'}
          </span>
        </div>
      </ScrollReveal>

      {/* 13 & 14. PRICING CARD & TRUST ELEMENTS */}
      <div className="max-w-xl mx-auto relative z-10 w-full">
        <ScrollReveal direction="up" delay={0.1} className="h-full">
          <div className="relative h-full">
            {/* Top Discount Badge */}
            <div className="absolute -top-3.5 right-6 sm:right-8 bg-gradient-to-r from-red-500 via-pink-600 to-amber-500 text-white text-[11px] sm:text-xs font-black uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md whitespace-nowrap z-20 border border-white/20">
              🔥 89.9% OFF
            </div>

            <motion.div 
              whileHover={{ y: -4 }} 
              transition={{ type: "spring", stiffness: 300, damping: 20 }} 
              className="p-5 sm:p-8 rounded-3xl border-2 border-red-500/30 dark:border-red-500/40 shadow-xl flex flex-col justify-between relative bg-gradient-to-br from-white via-red-50/20 to-amber-50/10 dark:from-[#090506] dark:via-[#150709] dark:to-[#0D0B10] h-full backdrop-blur-2xl transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-3 gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {isHindi ? 'लाइफटाइम पास' : 'LIFETIME PASS'}
                  </span>
                  <span className="text-[11px] font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-200/50 dark:border-[#D8BD82]/20 whitespace-nowrap">
                    {isHindi ? 'एकमुश्त पास' : 'One-Time Pass'}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mb-3">
                  {isHindi ? 'लेस लीगल स्थायी प्रीमियम मेंबरशिप' : 'Less Legal Permanent Lifetime Access'}
                </h2>
                
                {/* Price Display */}
                <div className="bg-gradient-to-br from-red-50 to-red-100/40 dark:from-[#21090D] dark:via-[#140406] dark:to-[#1C0609] border border-red-500/30 dark:border-red-500/40 rounded-2xl p-4 sm:p-5 my-4 relative overflow-hidden shadow-inner">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">₹99</span>
                      <span className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">/ {isHindi ? 'आजीवन' : 'Lifetime'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-bold text-red-500/80 dark:text-red-400/80 line-through decoration-red-600 decoration-2">
                        ₹899
                      </span>
                      <span className="text-xs font-black text-white bg-red-500 px-2.5 py-0.5 rounded-md whitespace-nowrap">
                        SAVE ₹800
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key Billing Highlights */}
                <div className="grid grid-cols-3 gap-1.5 py-2.5 my-3 border-y border-blue-200/40 dark:border-blue-800/20 bg-blue-500/5 dark:bg-blue-950/10 px-2.5 rounded-xl text-center">
                  <div className="space-y-0.5">
                    <p className="text-[10px] sm:text-[11px] font-black text-slate-800 dark:text-white whitespace-nowrap">{isHindi ? 'एक बार भुगतान' : 'One-time'}</p>
                    <p className="text-[9px] text-slate-500 dark:text-slate-400 whitespace-nowrap">{isHindi ? 'कोई छिपी लागत नहीं' : 'No hidden fees'}</p>
                  </div>
                  <div className="space-y-0.5 border-x border-blue-200/40 dark:border-blue-800/20">
                    <p className="text-[10px] sm:text-[11px] font-black text-slate-800 dark:text-white whitespace-nowrap">{isHindi ? 'कोई सब्स्क्रिप्शन नहीं' : 'No recurring'}</p>
                    <p className="text-[9px] text-slate-500 dark:text-slate-400 whitespace-nowrap">{isHindi ? 'कोई मासिक बिल नहीं' : 'Zero renewal'}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] sm:text-[11px] font-black text-slate-800 dark:text-white whitespace-nowrap">{isHindi ? 'आजीवन वैधता' : 'Lifetime valid'}</p>
                    <p className="text-[9px] text-slate-500 dark:text-slate-400 whitespace-nowrap">{isHindi ? 'सुरक्षित एक्सेस' : 'Never expires'}</p>
                  </div>
                </div>

                {/* Registered Email Binding Banner */}
                <div className="p-3 my-3 rounded-xl bg-blue-500/10 dark:bg-blue-950/35 border border-blue-300/40 dark:border-blue-800/40 flex items-start gap-2.5 text-xs text-blue-900 dark:text-blue-200">
                  <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div className="text-xs font-medium">
                    <strong className="font-bold">{isHindi ? 'पंजीकृत ईमेल आईडी सुरक्षा: ' : 'Email Pass Binding: '}</strong>
                    {isHindi 
                      ? 'आपका ₹99 का पास पंजीकृत ईमेल से जुड़ता है। नए फोन में भी तुरंत रीस्टोर करें।' 
                      : 'Binds access to your registered Email ID. Restore instantly on any Android device.'}
                  </div>
                </div>

                {/* Summary Feature Checkmarks */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>{isHindi ? 'पूरी तरह से विज्ञापन-मुक्त अनुभव' : '100% Ad-Free Experience across all tools'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>{isHindi ? 'सभी कानूनी टूल्स व पीडीएफ यूटिलिटीज का असीमित उपयोग' : 'Unlimited access to all Legal Utilities & PDF Workspace'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>{isHindi ? 'आजीवन वैधता — भविष्य के सभी अपडेट मुफ्त' : 'Lifetime validity & free future upgrades'}</span>
                  </div>
                </div>

                {/* Urgency Timer */}
                <div className="relative overflow-hidden rounded-xl p-3.5 sm:p-4 my-4 bg-gradient-to-br from-[#120E06] via-[#1A1408] to-[#0D0B05] border border-[#E5BA55]/40 select-none">
                  <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-center sm:text-left space-y-0.5">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#E5BA55]/15 text-[#E5BA55] text-[9.5px] font-black uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                        <span>{isHindi ? '⚡ विशेष ऑफर' : '⚡ SPECIAL OFFER'}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-200">
                        {isHindi ? '₹99 विशेष दर समाप्त होने में शेष:' : '₹99 rate closes in:'}
                      </div>
                    </div>
                    
                    {/* Countdown Tiles */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="flex flex-col items-center justify-center min-w-[44px] py-1 px-1 rounded-lg bg-black/60 border border-[#E5BA55]/35">
                        <span className="font-mono text-sm font-black text-[#F5D580] leading-none">
                          {timeLeft.days.toString().padStart(3, '0')}
                        </span>
                        <span className="text-[8px] font-extrabold uppercase text-[#B8943F] mt-0.5">
                          {isHindi ? 'दिन' : 'Days'}
                        </span>
                      </div>

                      <span className="text-[#E5BA55] font-black text-xs animate-pulse">:</span>

                      <div className="flex flex-col items-center justify-center min-w-[38px] py-1 px-1 rounded-lg bg-black/60 border border-[#E5BA55]/35">
                        <span className="font-mono text-sm font-black text-[#F5D580] leading-none">
                          {timeLeft.hours.toString().padStart(2, '0')}
                        </span>
                        <span className="text-[8px] font-extrabold uppercase text-[#B8943F] mt-0.5">
                          {isHindi ? 'घंटे' : 'Hrs'}
                        </span>
                      </div>

                      <span className="text-[#E5BA55] font-black text-xs animate-pulse">:</span>

                      <div className="flex flex-col items-center justify-center min-w-[38px] py-1 px-1 rounded-lg bg-black/60 border border-[#E5BA55]/35">
                        <span className="font-mono text-sm font-black text-[#F5D580] leading-none">
                          {timeLeft.minutes.toString().padStart(2, '0')}
                        </span>
                        <span className="text-[8px] font-extrabold uppercase text-[#B8943F] mt-0.5">
                          {isHindi ? 'मिनट' : 'Min'}
                        </span>
                      </div>

                      <span className="text-[#E5BA55] font-black text-xs animate-pulse">:</span>

                      <div className="flex flex-col items-center justify-center min-w-[38px] py-1 px-1 rounded-lg bg-black/70 border border-amber-400/50">
                        <span className="font-mono text-sm font-black text-amber-300 leading-none">
                          {timeLeft.seconds.toString().padStart(2, '0')}
                        </span>
                        <span className="text-[8px] font-extrabold uppercase text-amber-400/90 mt-0.5">
                          {isHindi ? 'सेकंड' : 'Sec'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA BUTTON & TRUST BADGES */}
              <div className="mt-4 pt-4 border-t border-blue-200/40 dark:border-blue-800/20 space-y-3">
                <button
                  id="btn-get-lifetime-pass-main"
                  onClick={handleOpenAppOrDownload}
                  className="w-full py-3.5 px-4 rounded-xl red-shimmer-button text-white text-xs sm:text-sm font-black shadow-lg whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4 shrink-0 fill-white text-white" />
                  <span className="whitespace-nowrap font-black">
                    {isHindi ? 'लाइफटाइम पास लें — ₹99' : 'Get Lifetime Pass — ₹99'}
                  </span>
                  <ArrowRight className="w-4 h-4 shrink-0 text-white" />
                </button>

                {/* Immediate Trust Badges */}
                <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-blue-200/40 dark:border-blue-800/25 space-y-1.5 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>{isHindi ? 'Razorpay द्वारा 100% सुरक्षित भुगतान' : '100% Secure payment processing by Razorpay'}</span>
                  </div>
                  <div className="flex items-center justify-center flex-wrap gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10">UPI (GPay, PhonePe, Paytm)</span>
                    <span className="px-2 py-0.5 rounded bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10">Cards</span>
                    <span className="px-2 py-0.5 rounded bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10">NetBanking</span>
                    <span className="px-2 py-0.5 rounded bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10">256-Bit SSL</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </ScrollReveal>
      </div>

      {/* 15. PREMIUM BENEFITS ("What You Get") */}
      <ScrollReveal direction="up" delay={0.14} className="space-y-5 relative z-10 pt-2">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-950/40 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black tracking-wider uppercase">
            {isHindi ? 'आपको क्या मिलेगा' : 'WHAT YOU GET'}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {isHindi ? 'आजीवन पास में शामिल सुविधाएं' : 'Everything Included in Lifetime Pass'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {benefitCards.map((b, idx) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-2xl bg-gradient-to-br from-white/95 to-blue-50/30 dark:from-[#111827]/95 dark:to-[#0F172A]/90 border border-blue-400/30 dark:border-blue-500/20 shadow-xs space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${b.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                    {b.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {b.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </ScrollReveal>

      {/* 16. HOW IT WORKS (3-Step Stepper) */}
      <ScrollReveal direction="up" delay={0.18} className="relative z-10 pt-2">
        <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-white/95 via-blue-50/40 to-indigo-50/20 dark:from-[#111827]/95 dark:via-[#0F172A]/90 dark:to-[#1E293B]/80 border border-blue-400/30 dark:border-blue-500/20 shadow-md space-y-5">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {isHindi ? 'सरल प्रक्रिया' : 'HOW IT WORKS'}
            </span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {isHindi ? 'सक्रियण के 3 आसान कदम' : '3 Simple Steps to Activate'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Step 1 */}
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/45 border border-blue-200/50 dark:border-blue-800/25 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 font-black text-xs flex items-center justify-center border border-blue-500/20">
                01
              </div>
              <h4 className="text-xs font-black text-slate-900 dark:text-white">
                {isHindi ? '01. भुगतान करें' : '01. Make Payment'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {isHindi 
                  ? 'Less Legal App में ₹99 का भुगतान UPI या कार्ड से करें।' 
                  : 'Complete a single ₹99 checkout via UPI or Cards inside Less Legal App.'}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/45 border border-blue-200/50 dark:border-blue-800/25 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400 font-black text-xs flex items-center justify-center border border-sky-500/20">
                02
              </div>
              <h4 className="text-xs font-black text-slate-900 dark:text-white">
                {isHindi ? '02. तुरंत सक्रियण' : '02. Instant Activation'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {isHindi 
                  ? 'आपका ईमेल आईडी तुरंत आजीवन प्रीमियम के रूप में सक्रिय हो जाता है।' 
                  : 'Your registered email is immediately bound to Lifetime Premium status.'}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/45 border border-blue-200/50 dark:border-blue-800/25 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-black text-xs flex items-center justify-center border border-indigo-500/20">
                03
              </div>
              <h4 className="text-xs font-black text-slate-900 dark:text-white">
                {isHindi ? '03. प्रीमियम का आनंद लें' : '03. Enjoy Premium Access'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {isHindi 
                  ? 'विज्ञापन-मुक्त अनुभव के साथ सभी टूल्स का आनंद लें।' 
                  : 'Enjoy unlimited ad-free access to all utilities forever.'}
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 17. FINAL CONVERSION CTA SECTION */}
      <ScrollReveal direction="up" delay={0.2} className="relative z-10 pt-1">
        <div className="p-6 sm:p-10 bg-gradient-to-br from-white/95 via-blue-50/50 to-indigo-50/30 dark:from-[#111827]/95 dark:via-[#0F172A]/90 dark:to-[#1E293B]/90 backdrop-blur-2xl rounded-3xl border border-blue-400/30 dark:border-blue-500/20 shadow-lg text-center space-y-4">
          <div className="max-w-xl mx-auto space-y-2.5 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-black tracking-wider uppercase border border-blue-500/20">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>{isHindi ? 'आज ही अपग्रेड करें' : 'READY TO UPGRADE?'}</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {isHindi ? 'क्या आप Less Legal अनलॉक करने के लिए तैयार हैं?' : 'Ready to unlock Less Legal?'}
            </h2>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="btn-get-lifetime-pass-bottom"
                onClick={handleOpenAppOrDownload}
                className="w-full sm:w-auto py-3.5 px-7 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white text-xs sm:text-sm font-black shadow-md whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.98]"
              >
                <Smartphone className="w-4 h-4 shrink-0" />
                <span>{isHindi ? 'लाइफटाइम पास प्राप्त करें — ₹99' : 'Get Lifetime Pass — ₹99'}</span>
              </button>

              <button
                onClick={() => onNavigate('contact')}
                className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-white/75 dark:bg-slate-900/40 text-slate-700 dark:text-[#B8B3AF] border border-blue-200/40 dark:border-blue-800/20 text-xs sm:text-sm font-bold shadow-xs transition-transform hover:scale-[1.01] active:scale-[0.98]"
              >
                <span>{isHindi ? 'सहायता से बात करें' : 'Contact Support'}</span>
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Mandatory Merchant Verification & Compliance Links */}
      <ScrollReveal direction="up" delay={0.22} className="relative z-10">
        <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-white/95 via-blue-50/40 to-indigo-50/20 dark:from-[#111827]/95 dark:via-[#0F172A]/90 dark:to-[#1E293B]/80 border border-blue-400/30 dark:border-blue-500/20 shadow-md space-y-3">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{isHindi ? 'नीतियों और शर्तें' : 'Policies & Terms'}</span>
          </h3>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <StaggerItem>
              <button
                id="premium-btn-terms"
                onClick={() => onNavigate('terms')}
                className="w-full p-3 bg-white/60 dark:bg-slate-900/45 hover:bg-blue-500/5 rounded-xl border border-blue-200/50 dark:border-blue-800/25 text-left transition-all group flex items-center justify-between cursor-pointer"
              >
                <span className="text-xs font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 whitespace-nowrap">
                  {isHindi ? 'नियम और शर्तें' : 'Terms & Conditions'}
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0 ml-1" />
              </button>
            </StaggerItem>

            <StaggerItem>
              <button
                id="premium-btn-refund"
                onClick={() => onNavigate('refund')}
                className="w-full p-3 bg-white/60 dark:bg-slate-900/45 hover:bg-blue-500/5 rounded-xl border border-blue-200/50 dark:border-blue-800/25 text-left transition-all group flex items-center justify-between cursor-pointer"
              >
                <span className="text-xs font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 whitespace-nowrap">
                  {isHindi ? 'धनवापसी नीति' : 'Refund Policy'}
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0 ml-1" />
              </button>
            </StaggerItem>

            <StaggerItem>
              <button
                id="premium-btn-contact"
                onClick={() => onNavigate('contact')}
                className="w-full p-3 bg-white/60 dark:bg-slate-900/45 hover:bg-blue-500/5 rounded-xl border border-blue-200/50 dark:border-blue-800/25 text-left transition-all group flex items-center justify-between cursor-pointer"
              >
                <span className="text-xs font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 whitespace-nowrap">
                  {isHindi ? 'सहायता केंद्र' : 'Contact Support'}
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0 ml-1" />
              </button>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </ScrollReveal>
    </div>
  );
};
