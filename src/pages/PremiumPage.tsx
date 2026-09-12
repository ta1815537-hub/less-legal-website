import React from 'react';
import { PageRoute } from '../types';
import { 
  Sparkles, CheckCircle2, ShieldCheck, 
  FileText, ArrowUpRight, Smartphone, 
  Mail, Ban, BookOpen, Scale,
  Calculator, MapPin, Layers, Cpu, Zap, Award, ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { launchLessLegalApp } from '../utils/deepLink';

interface PremiumPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const PremiumPage: React.FC<PremiumPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

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

  const handleOpenAppOrDownload = () => {
    launchLessLegalApp('premium');
  };

  const benefitCards = [
    {
      icon: Ban,
      title: isHindi ? 'विज्ञापन-मुक्त अनुभव' : 'Ad-Free Experience',
      desc: isHindi ? 'बिना किसी रुकावट के पूरी तरह से केंद्रित कानूनी वर्कफ़्लो।' : '100% distraction-free workflow with zero banner or interstitial ads.'
    },
    {
      icon: FileText,
      title: isHindi ? 'पीडीएफ टूल्स सुइट' : 'PDF Tools Suite',
      desc: isHindi ? 'पीडीएफ मर्ज, स्प्लिट, कंप्रेस और एन्क्रिप्ट करें तुरंत और सुरक्षित।' : 'Merge, split, compress, and organize legal documents seamlessly.'
    },
    {
      icon: Scale,
      title: isHindi ? 'बेयर एक्ट्स संदर्भ' : 'Bare Acts Reference',
      desc: isHindi ? 'प्रमुख केंद्रीय और राज्य बेयर एक्ट्स तक तुरंत और ऑफलाइन पहुँच।' : 'Instant offline access to major Indian Central and State bare acts.'
    },
    {
      icon: BookOpen,
      title: isHindi ? 'केस डायरी' : 'Case Diary Tracker',
      desc: isHindi ? 'सुनवाई की तारीखें ट्रैक करें, मुकदमों का विवरण और नोट्स व्यवस्थित रखें।' : 'Track hearings, manage client proceedings, and log case notes easily.'
    },
    {
      icon: Calculator,
      title: isHindi ? 'कानूनी कैलकुलेटर' : 'Legal Calculators',
      desc: isHindi ? 'कोर्ट फीस, ब्याज, स्टैम्प ड्यूटी और परिसीमा गणना।' : 'Precise court fees, interest, stamp duty, and limitation calculators.'
    },
    {
      icon: MapPin,
      title: isHindi ? 'भूमि इकाई परिवर्तक' : 'Land Unit Converter',
      desc: isHindi ? 'बीघा, बिस्वा, गुंठा, एकड़, हेक्टेयर का सटीक क्षेत्रीय रूपांतरण।' : 'Bigha, Biswa, Guntha, Acre, Hectare accurate regional unit conversion.'
    },
    {
      icon: Layers,
      title: isHindi ? 'कानूनी शब्दावली' : 'Legal Glossary',
      desc: isHindi ? 'द्विभाषी हिंदी और अंग्रेजी विधिक शब्दावली और व्याख्याएं।' : 'Bilingual legal terminology and clear judicial definitions.'
    },
    {
      icon: Cpu,
      title: isHindi ? 'क्विक नोट्स' : 'Quick Notes',
      desc: isHindi ? 'ऑफलाइन केस टिप्पणियां, मुवक्किल विवरण और संदर्भ बिंदु सहेजें।' : 'Save offline case observations, client briefs, and citations safely.'
    },
    {
      icon: Zap,
      title: isHindi ? 'फाइल टूल्स & लेस शेयर' : 'File Tools & Less Share',
      desc: isHindi ? 'सुरक्षित स्थानीय फ़ाइल स्थानांतरण और एन्क्रिप्टेड फ़ाइल स्टोरेज।' : 'Direct local file transfers and encrypted storage management.'
    },
    {
      icon: Award,
      title: isHindi ? 'प्रीमियम यूटिलिटीज' : 'Premium Utilities',
      desc: isHindi ? 'प्राथमिकता प्रदर्शन, त्वरित अद्यतन और निरंतर नई सुविधाएं।' : 'Priority performance, instant updates, and offline accessibility.'
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-28 space-y-12">
      
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-[#16A34A] dark:text-[#22C55E]">
          {isHindi ? "आजीवन सदस्यता" : "LIFETIME MEMBERSHIP"}
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-[#111016] dark:text-white tracking-tight">
          {isHindi ? 'Less Legal को हमेशा के लिए अनलॉक करें' : 'Unlock Less Legal Forever'}
        </h1>
        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
          {isHindi 
            ? 'एक ही बार के आसान भुगतान के साथ सभी प्रीमियम कानूनी और उत्पादकता टूल्स का आनंद लें।' 
            : 'Get complete access to all legal suites and productivity tools with a single one-time pass.'}
        </p>
      </div>

      {/* Pricing Card */}
      <div className="max-w-xl mx-auto">
        <div className="rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#151720] p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#16A34A] dark:text-[#22C55E]">
              {isHindi ? 'लाइफटाइम पास' : 'LIFETIME PASS'}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-[#16A34A] dark:text-[#22C55E]">
              ONE-TIME
            </span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111016] dark:text-white">
              {isHindi ? 'लेस लीगल स्थायी मेंबरशिप' : 'Less Legal Permanent Pass'}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              {isHindi ? 'सभी कानूनी व पीडीएफ यूटिलिटीज का आजीवन एक्सेस' : 'Permanent access across all legal utilities'}
            </p>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 pt-2">
            <span className="text-4xl sm:text-5xl font-bold text-[#111016] dark:text-white tracking-tight">₹99</span>
            <span className="text-sm text-stone-500">/ {isHindi ? 'आजीवन' : 'Lifetime'}</span>
            <span className="text-base font-bold text-stone-400 line-through ml-2">₹899</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
              SAVE ₹800
            </span>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-stone-100 dark:border-white/5 text-center text-xs">
            <div>
              <p className="font-bold text-[#111016] dark:text-white">{isHindi ? 'एक बार भुगतान' : 'One-Time'}</p>
              <p className="text-[10px] text-stone-500">{isHindi ? 'कोई छिपी लागत नहीं' : 'No hidden fees'}</p>
            </div>
            <div>
              <p className="font-bold text-[#111016] dark:text-white">{isHindi ? 'नो सब्स्क्रिप्शन' : 'No Recurring'}</p>
              <p className="text-[10px] text-stone-500">{isHindi ? 'शून्य मासिक बिल' : 'Zero renewal'}</p>
            </div>
            <div>
              <p className="font-bold text-[#111016] dark:text-white">{isHindi ? 'आजीवन वैधता' : 'Lifetime'}</p>
              <p className="text-[10px] text-stone-500">{isHindi ? 'सुरक्षित एक्सेस' : 'Never expires'}</p>
            </div>
          </div>

          {/* Email Bind Note */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200/80 dark:border-white/5 text-xs text-stone-700 dark:text-stone-300">
            <Mail className="w-4 h-4 text-[#16A34A] dark:text-[#22C55E] shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">{isHindi ? 'पंजीकृत ईमेल सुरक्षा: ' : 'Email Pass Binding: '}</strong>
              {isHindi 
                ? 'आपका ₹99 का पास पंजीकृत ईमेल से जुड़ता है। नए फोन में भी तुरंत रीस्टोर करें।' 
                : 'Binds access to your registered Email ID. Restore instantly on any Android device.'}
            </div>
          </div>

          {/* Feature List */}
          <div className="space-y-2 pt-1 text-xs text-stone-700 dark:text-stone-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] dark:text-[#22C55E] shrink-0" />
              <span>{isHindi ? 'पूरी तरह से विज्ञापन-मुक्त अनुभव' : '100% Ad-Free Experience across all tools'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] dark:text-[#22C55E] shrink-0" />
              <span>{isHindi ? 'सभी कानूनी टूल्स व पीडीएफ यूटिलिटीज का असीमित उपयोग' : 'Unlimited access to all Legal Utilities & PDF Workspace'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] dark:text-[#22C55E] shrink-0" />
              <span>{isHindi ? 'आजीवन वैधता — भविष्य के सभी अपडेट मुफ्त' : 'Lifetime validity & free future upgrades'}</span>
            </div>
          </div>

          {/* Countdown timer */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-100 dark:bg-white/5 text-xs text-stone-600 dark:text-stone-400">
            <span className="font-medium">{isHindi ? 'विशेष दर शेष समय:' : 'Special offer ends in:'}</span>
            <span className="font-mono font-bold text-[#111016] dark:text-white">
              {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s
            </span>
          </div>

          {/* CTA */}
          <div className="space-y-3 pt-2">
            <button
              id="btn-get-lifetime-pass-main"
              onClick={handleOpenAppOrDownload}
              className="w-full py-3.5 px-4 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isHindi ? 'लाइफटाइम पास लें — ₹99' : 'Get Lifetime Pass — ₹99'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-stone-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{isHindi ? 'Razorpay द्वारा 100% सुरक्षित भुगतान' : '100% Secure payment by Razorpay'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="space-y-6 pt-6 border-t border-stone-200 dark:border-white/10">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-[#111016] dark:text-white">
            {isHindi ? 'आजीवन पास में शामिल सुविधाएं' : 'Everything Included in Lifetime Pass'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefitCards.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="border border-stone-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#151720] p-5 space-y-2 shadow-2xs"
              >
                <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-white/5 border border-stone-200/80 dark:border-white/10 flex items-center justify-center text-stone-800 dark:text-stone-200">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#111016] dark:text-white pt-1">
                  {b.title}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Policies */}
      <div className="pt-6 border-t border-stone-200 dark:border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-500">
        <button
          onClick={() => onNavigate('terms')}
          className="hover:text-[#16A34A] dark:hover:text-[#22C55E] transition-colors cursor-pointer flex items-center gap-1"
        >
          <span>{isHindi ? 'नियम और शर्तें' : 'Terms & Conditions'}</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
        <button
          onClick={() => onNavigate('refund')}
          className="hover:text-[#16A34A] dark:hover:text-[#22C55E] transition-colors cursor-pointer flex items-center gap-1"
        >
          <span>{isHindi ? 'धनवापसी नीति' : 'Refund Policy'}</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
        <button
          onClick={() => onNavigate('contact')}
          className="hover:text-[#16A34A] dark:hover:text-[#22C55E] transition-colors cursor-pointer flex items-center gap-1"
        >
          <span>{isHindi ? 'सहायता केंद्र' : 'Contact Support'}</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

    </div>
  );
};
