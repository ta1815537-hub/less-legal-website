import React, { useState, useEffect, useRef } from 'react';
import { PageRoute } from '../types';
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  BadgeCheck,
  FileText,
  Sparkles,
  CloudUpload,
  Ban,
  Calculator,
  Printer,
  Lock,
  ExternalLink,
  Smartphone,
  Download,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { launchLessLegalApp, DEFAULT_PLAY_STORE_URL } from '../utils/deepLink';
import { adminStorage } from '../utils/adminStorage';

interface PremiumPageProps {
  onNavigate: (route: PageRoute) => void;
}

interface RollingUnitProps {
  value: number;
  label: string;
}

const RollingCountdownUnit: React.FC<RollingUnitProps> = ({ value, label }) => {
  const formatted = String(value).padStart(2, '0');

  return (
    <div className="relative rounded-xl bg-[#070B12] border border-white/15 py-2.5 px-1.5 flex flex-col items-center justify-center overflow-hidden shadow-inner">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/45 to-transparent"
      />
      <div className="relative h-7 sm:h-8 w-full flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={formatted}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg sm:text-2xl font-extrabold text-white font-mono tabular-nums tracking-tight"
          >
            {formatted}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#C9A24B] mt-0.5">
        {label}
      </span>
    </div>
  );
};

export const PremiumPage: React.FC<PremiumPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [timeLeft, setTimeLeft] = useState({ days: 120, hours: 14, minutes: 28, seconds: 45 });
  const [playStoreUrl, setPlayStoreUrl] = useState<string>(DEFAULT_PLAY_STORE_URL);
  const [installPromptOpen, setInstallPromptOpen] = useState(false);
  const [redirectSeconds, setRedirectSeconds] = useState<number>(3);
  const redirectTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const cfg = adminStorage.getSiteAppConfig();
    if (cfg.playStoreUrl?.trim()) {
      setPlayStoreUrl(cfg.playStoreUrl.trim());
    }
    adminStorage
      .fetchSiteAppConfigFromCloud(false)
      .then((res) => {
        if (res?.playStoreUrl?.trim()) setPlayStoreUrl(res.playStoreUrl.trim());
      })
      .catch(() => {});
  }, []);

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
      const difference = parseInt(targetTime!, 10) - Date.now();
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

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) clearInterval(redirectTimerRef.current);
    };
  }, []);

  const handleClaimClick = () => {
    if (redirectTimerRef.current) clearInterval(redirectTimerRef.current);

    launchLessLegalApp('premium', {
      playStoreUrl,
      onAppNotInstalled: (storeUrl) => {
        setInstallPromptOpen(true);
        setRedirectSeconds(3);
        let secs = 3;
        redirectTimerRef.current = setInterval(() => {
          secs -= 1;
          setRedirectSeconds(secs);
          if (secs <= 0) {
            if (redirectTimerRef.current) clearInterval(redirectTimerRef.current);
            try {
              window.location.assign(storeUrl);
            } catch {}
          }
        }, 1000);
      }
    });
  };

  const closeInstallPrompt = () => {
    if (redirectTimerRef.current) clearInterval(redirectTimerRef.current);
    setInstallPromptOpen(false);
  };

  const passBenefits = isHindi
    ? [
        {
          icon: Ban,
          title: '100% विज्ञापन-मुक्त अनुभव (आजीवन)',
          desc: 'Less Legal Android App के अंदर कोई बैनर, पॉपअप या इंटरस्टिशियल विज्ञापन नहीं — बिना किसी रुकावट के काम करें।'
        },
        {
          icon: BadgeCheck,
          title: 'सत्यापित ब्लू प्रो बैज एवं प्रोफाइल रिंग',
          desc: 'आपके नाम के आगे आधिकारिक Verified Pro Blue Badge और प्रोफाइल रिंग सक्रिय हो जाती है।'
        },
        {
          icon: Sparkles,
          title: 'वॉटरमार्क-रहित पोस्टर एवं प्रो एक्सपोर्ट',
          desc: 'Poster Hub से अपनी फोटो व नाम के साथ दैनिक व त्योहार पोस्टर बिना किसी वॉटरमार्क के गैलरी में सेव करें।'
        },
        {
          icon: FileText,
          title: 'संपूर्ण PDF और डॉक्यूमेंट वर्कस्पेस',
          desc: '16 ऑन-डिवाइस PDF टूल्स (Doc Scanner, OCR, Merge, Compress, Password Lock/Unlock) और Legal Doc Writer।'
        },
        {
          icon: Calculator,
          title: 'बही खाता, बिलिंग और कंसल्टेशन टाइमर',
          desc: 'A4 PDF लेजर रिपोर्ट, Quick Scan GST बिलिंग, थर्मल प्रिंटर सपोर्ट, 18 कैलकुलेटर व 28 राज्यों का भूमि कन्वर्टर।'
        },
        {
          icon: CloudUpload,
          title: 'Google Drive बैकअप एवं सभी डिवाइस पर रिस्टोर',
          desc: 'आपका ₹99 पास हमेशा के लिए आपकी ईमेल आईडी से लिंक रहता है — नया फ़ोन लेने पर भी आसानी से रिस्टोर करें।'
        }
      ]
    : [
        {
          icon: Ban,
          title: '100% Ad-Free Experience Forever',
          desc: 'Zero banner, native, interstitial, or launch ads inside the Less Legal Android App — pure distraction-free speed.'
        },
        {
          icon: BadgeCheck,
          title: 'Verified Blue Pro Badge & Avatar Ring',
          desc: 'Unlock the official Verified Pro Blue Badge beside your profile name across the Less Legal Android App.'
        },
        {
          icon: Sparkles,
          title: 'Watermark-Free Posters & Clean Exports',
          desc: 'Download daily & festival posters with your custom photo and designation from Poster Hub completely watermark-free.'
        },
        {
          icon: FileText,
          title: 'Full 16 PDF Tools & Legal Doc Writer',
          desc: 'Unlimited access to Doc Scanner, OCR, Merge, Compress, Split, Password Lock/Unlock, RTI A4 PDF & Doc Writer.'
        },
        {
          icon: Printer,
          title: 'Bahi Khata, Quick Billing & Calculators',
          desc: 'A4 PDF Ledger Reports, Quick Scan Billing with Bluetooth Thermal Print, Consultation Timer & 28-State Land Converter.'
        },
        {
          icon: CloudUpload,
          title: 'Encrypted Drive Backup & Lifetime Restore',
          desc: 'Permanently bound to your registered Email ID via Razorpay / Google Play — restore anytime on any Android device.'
        }
      ];

  const comparisonRows = isHindi
    ? [
        { feature: 'विज्ञापन (Ads Inside App)', free: 'विज्ञापन सहित', pro: '100% विज्ञापन-मुक्त' },
        { feature: 'प्रोफाइल वेरिफाइड बैज', free: 'सामान्य खाता', pro: 'Verified Pro Badge' },
        { feature: 'पोस्टर हब डाउनलोड', free: 'वॉटरमार्क के साथ', pro: 'बिना वॉटरमार्क (HD)' },
        { feature: 'सभी PDF, बही खाता व कन्वर्टर टूल्स', free: 'सीमित / ऐड-सपोर्टेड', pro: 'असीमित आजीवन एक्सेस' },
        { feature: 'पेमेंट मॉडल', free: 'मुफ्त', pro: 'केवल ₹99 (एक बार, ऑटो-रिन्यू नहीं)' }
      ]
    : [
        { feature: 'In-App Experience', free: 'Ad-Supported', pro: '100% Ad-Free Forever' },
        { feature: 'Profile Identity', free: 'Standard Account', pro: 'Verified Blue Pro Badge' },
        { feature: 'Poster Hub Exports', free: 'With Watermark', pro: 'Watermark-Free HD' },
        { feature: 'PDF, Bahi Khata & Utility Suite', free: 'Ad-Supported Access', pro: 'Uninterrupted Pro Access' },
        { feature: 'Billing Model', free: 'Free', pro: '₹99 One-Time (Zero Auto-Renewal)' }
      ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 space-y-8 text-white">
      {/* Back Button */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => onNavigate('home')}
          className="text-xs font-semibold text-stone-300 hover:text-red-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full whitespace-nowrap"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span>{isHindi ? 'होमपेज पर लौटें' : 'Back to Home'}</span>
        </button>

        <button
          onClick={() => onNavigate('download')}
          className="text-xs font-semibold text-[#C9A24B] hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
        >
          <Smartphone className="w-3.5 h-3.5 shrink-0" />
          <span>{isHindi ? 'Less Legal App डाउनलोड करें' : 'Download Less Legal App'}</span>
        </button>
      </div>

      {/* Header with Less Legal App Identity (No Confusion With Website) */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#030509] border border-[#C9A24B]/35 shadow-md">
          <img
            src="/app_logo_512x512-3.png"
            alt="Less Legal Android App"
            className="w-5 h-5 rounded-md object-cover shrink-0"
          />
          <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-[#C9A24B]">
            {isHindi ? 'LESS LEGAL ANDROID APP • आजीवन वीआईपी पास' : 'LESS LEGAL ANDROID APP • LIFETIME VIP PASS'}
          </span>
        </div>

        <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight [text-wrap:balance]">
          {isHindi
            ? 'Less Legal App को ₹99 में आजीवन अनलॉक करें'
            : 'Unlock Less Legal App Forever for ₹99'}
        </h1>

        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          {isHindi
            ? 'यह ₹99 का एकमुश्त लाइफटाइम पास विशेष रूप से Less Legal Android App (विज्ञापन-मुक्त + Verified Pro Badge + प्रो टूल्स) के लिए है। lesscreation.com वेबसाइट का उपयोग सभी के लिए 100% मुफ्त है।'
            : 'This one-time ₹99 Lifetime Pass unlocks Pro & Ad-Free access inside the Less Legal Android App. Using lesscreation.com website remains 100% free for everyone.'}
        </p>
      </div>

      {/* Main Obsidian-Black Pricing & Animated Rolling Countdown Card */}
      <div className="max-w-lg mx-auto relative rounded-2xl sm:rounded-3xl bg-[#030509] bg-gradient-to-b from-[#0D1220] via-[#060911] to-[#030509] border border-red-500/35 shadow-[0_24px_60px_rgba(0,0,0,0.9)] p-6 sm:p-8 text-center space-y-6 overflow-hidden">
        {/* Subtle Crimson Top Edge Hairline */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent"
        />

        {/* App Lockup + Price */}
        <div className="flex flex-col items-center space-y-2.5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#070B12] border border-white/15 overflow-hidden shadow-lg shrink-0">
              <img
                src="/app_logo_512x512-3.png"
                alt="Less Legal App"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white">Less Legal Android App</div>
              <div className="text-[11px] text-[#C9A24B] font-semibold">
                {isHindi ? 'स्पेशल आजीवन सदस्यता ऑफर' : 'Special Lifetime Pro Pass'}
              </div>
            </div>
          </div>

          <div className="pt-1">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-[#C9A24B] font-mono tabular-nums">
                ₹99
              </span>
              <span className="text-sm text-stone-500 line-through font-mono">₹999</span>
            </div>
            <span className="block text-[11px] font-mono text-stone-400 uppercase tracking-widest mt-1">
              {isHindi ? 'एक बार का भुगतान • कोई मासिक शुल्क नहीं' : 'One-Time Payment • Never Recurring'}
            </span>
          </div>
        </div>

        {/* Stylish Obsidian Animated Rolling Countdown Timer */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold">
            {isHindi ? 'सीमित समय विशेष ऑफर समाप्त होने में शेष:' : 'Special Offer Ends In'}
          </div>
          <div className="grid grid-cols-4 gap-2 sm:gap-2.5 p-2.5 rounded-2xl bg-[#030509] border border-red-500/25 shadow-lg">
            <RollingCountdownUnit value={timeLeft.days} label={isHindi ? 'दिन' : 'Days'} />
            <RollingCountdownUnit value={timeLeft.hours} label={isHindi ? 'घंटे' : 'Hours'} />
            <RollingCountdownUnit value={timeLeft.minutes} label={isHindi ? 'मिनट' : 'Mins'} />
            <RollingCountdownUnit value={timeLeft.seconds} label={isHindi ? 'सेकंड' : 'Secs'} />
          </div>
        </div>

        {/* Key Value Highlights inside Card */}
        <ul className="text-left space-y-2.5 text-xs text-stone-200 border-t border-white/10 pt-4">
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
            <span>{isHindi ? 'Less Legal App में 100% विज्ञापन-मुक्त अनुभव (आजीवन)' : '100% Ad-Free Less Legal Android App Forever'}</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
            <span>{isHindi ? 'Verified Blue Pro Badge व वॉटरमार्क-रहित पोस्टर डाउनलोड' : 'Verified Blue Badge & Watermark-Free Poster Exports'}</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
            <span>{isHindi ? '16 PDF टूल्स, बही खाता PDF लेजर व कंसल्टेशन बिल मेमो' : '16 PDF Tools, Bahi Khata A4 Reports & Bill Memo'}</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
            <span>{isHindi ? 'आपकी ईमेल आईडी से स्थायी रूप से लिंक • Razorpay / Play Billing' : 'Forever Linked to Your Email ID via App Checkout'}</span>
          </li>
        </ul>

        {/* Primary Claim Button -> Opens Installed App Membership Screen or Prompts & Redirects to Play Store */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={handleClaimClick}
            className="w-full py-3.5 px-5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-600/25 cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all active:scale-[0.99]"
          >
            <span>{isHindi ? 'Less Legal App में ₹99 पास क्लेम करें' : 'Claim ₹99 Pass in Less Legal App'}</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>

          <p className="text-[11px] text-stone-400 leading-relaxed">
            {isHindi
              ? 'क्लिक करने पर आपके फ़ोन में इंस्टॉल Less Legal App का Membership सेक्शन खुलेगा। ऐप इंस्टॉल न होने पर Google Play Store पर रीडायरेक्ट किया जाएगा।'
              : 'Opens the Membership section inside your installed Less Legal app, or directs you to Google Play Store to install.'}
          </p>
        </div>
      </div>

      {/* Why Upgrade: Detailed Value & Benefits Grid */}
      <section className="space-y-4 pt-2">
        <div className="border-b border-white/10 pb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base sm:text-xl font-bold text-white tracking-tight">
            {isHindi ? '₹99 लाइफटाइम पास लेने के प्रमुख फायदे' : 'What You Unlock Forever with ₹99 Lifetime Pass'}
          </h2>
          <span className="text-[11px] font-mono text-[#C9A24B]">
            {isHindi ? 'सिर्फ एक बार • आजीवन वैधता' : 'One-Time Purchase • Lifetime Validity'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {passBenefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#0D1220] border border-white/10 hover:border-red-500/35 transition-colors space-y-2.5"
              >
                <div className="w-9 h-9 rounded-xl bg-red-600/15 border border-red-500/25 text-red-400 flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white leading-snug">{item.title}</h3>
                <p className="text-xs text-stone-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Free Account vs ₹99 Lifetime Pro Comparison */}
      <section className="rounded-2xl bg-[#030509] border border-white/10 overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-3">
          <h2 className="text-sm sm:text-base font-bold text-white">
            {isHindi ? 'फ्री अकाउंट बनाम ₹99 लाइफटाइम प्रो पास' : 'Free Account vs ₹99 Lifetime Pro Pass'}
          </h2>
          <span className="text-[11px] font-mono text-stone-400">Less Legal App</span>
        </div>

        <div className="divide-y divide-white/10 text-xs">
          {comparisonRows.map((row, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 px-4 sm:px-5 py-3 items-center">
              <div className="col-span-12 sm:col-span-5 font-semibold text-white">{row.feature}</div>
              <div className="col-span-6 sm:col-span-3 text-stone-400">{row.free}</div>
              <div className="col-span-6 sm:col-span-4 font-bold text-[#C9A24B]">{row.pro}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Transparent Billing Guarantees & Policy Links */}
      <section className="p-5 rounded-2xl bg-[#0D1220] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#C9A24B] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-white">
              {isHindi ? 'पूर्ण पारदर्शिता: कोई ऑटो-डेबिट या छिपा शुल्क नहीं' : '100% Transparent: Zero Auto-Debit or Hidden Charges'}
            </div>
            <p className="text-stone-400 leading-relaxed">
              {isHindi
                ? 'पेमेंट सीधे Less Legal Android App के अंदर प्रमाणित Razorpay / Google Play Billing से होता है।'
                : 'Checkout happens directly inside the Less Legal Android App via certified Razorpay / Google Play Billing.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 font-semibold">
          <button
            onClick={() => onNavigate('refund')}
            className="text-red-400 hover:text-red-300 cursor-pointer whitespace-nowrap"
          >
            {isHindi ? 'रिफंड नीति पढ़ें' : 'Refund Policy'}
          </button>
          <span aria-hidden="true" className="text-stone-600">·</span>
          <button
            onClick={() => onNavigate('terms')}
            className="text-stone-300 hover:text-white cursor-pointer whitespace-nowrap"
          >
            {isHindi ? 'नियम व शर्तें' : 'Terms'}
          </button>
        </div>
      </section>

      {/* In-Page Modal when Less Legal App is NOT Installed on Phone -> Prompt + Play Store Redirect */}
      <AnimatePresence>
        {installPromptOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md rounded-2xl bg-[#030509] border border-red-500/40 shadow-2xl p-6 space-y-5 text-center relative"
            >
              <button
                onClick={closeInstallPrompt}
                aria-label="Close modal"
                className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#070B12] border border-white/15 overflow-hidden shadow-lg">
                <img
                  src="/app_logo_512x512-3.png"
                  alt="Less Legal Android App"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#C9A24B] font-bold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'ऐप इंस्टॉल आवश्यक है' : 'LESS LEGAL APP REQUIRED'}</span>
                </div>

                <h3 className="text-lg font-bold text-white">
                  {isHindi
                    ? 'पहले Less Legal App इंस्टॉल करें'
                    : 'Install Less Legal App First'}
                </h3>

                <p className="text-xs text-stone-300 leading-relaxed">
                  {isHindi
                    ? 'आपके फ़ोन में Less Legal App इंस्टॉल नहीं मिला। ₹99 लाइफटाइम पास लेने और अनलॉक करने के लिए कृपया Google Play Store से Less Legal ऐप इंस्टॉल करें।'
                    : 'Less Legal App was not detected on this device. Please install Less Legal from Google Play Store to unlock your ₹99 Lifetime Pass inside the app.'}
                </p>

                {redirectSeconds > 0 && (
                  <p className="text-[11px] font-mono text-red-400 pt-1">
                    {isHindi
                      ? `${redirectSeconds} सेकंड में Play Store पर रीडायरेक्ट हो रहा है...`
                      : `Redirecting to Google Play Store in ${redirectSeconds}s...`}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <a
                  href={playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeInstallPrompt}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
                >
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  <span>{isHindi ? 'Play Store से इंस्टॉल करें' : 'Install on Google Play'}</span>
                </a>

                <button
                  onClick={() => {
                    closeInstallPrompt();
                    onNavigate('download');
                  }}
                  className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-stone-200 font-semibold text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors"
                >
                  <Download className="w-3.5 h-3.5 shrink-0" />
                  <span>{isHindi ? 'ऐप विवरण' : 'App Details'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
