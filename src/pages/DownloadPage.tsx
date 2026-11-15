import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import {
  ArrowLeft,
  ShieldCheck,
  Download,
  FileText,
  Calculator,
  Scale,
  FolderOpen,
  Calendar,
  QrCode,
  MessageCircle,
  ExternalLink,
  Smartphone,
  HardDrive,
  Lock,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { adminStorage, SiteAppConfig } from '../utils/adminStorage';

interface DownloadPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const DownloadPage: React.FC<DownloadPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [config, setConfig] = useState<SiteAppConfig>(() => adminStorage.getSiteAppConfig());

  useEffect(() => {
    adminStorage.fetchSiteAppConfigFromCloud(false).then((res) => {
      if (res) setConfig(res);
    }).catch(() => {});

    const unsub = adminStorage.subscribeToSiteAppConfig((updated) => {
      setConfig(updated);
    });
    return () => unsub();
  }, []);

  const appFeatures = [
    {
      icon: FolderOpen,
      title: isHindi ? 'केस डायरी एवं क्लाइंट रिकॉर्ड' : 'Case Diary & Client Records',
      desc: isHindi
        ? 'सुनवाई की तारीखें, केस स्टेटस, वकालतनामा नोट्स और क्लाइंट हिस्ट्री सुरक्षित रूप से डिवाइस में सहेजें।'
        : 'Track hearing dates, case briefs, and client history locally on your device.'
    },
    {
      icon: FileText,
      title: isHindi ? 'ऑन-डिवाइस PDF वर्कस्पेस व डॉक्यूमेंट हब' : 'On-Device PDF Workspace & Document Hub',
      desc: isHindi
        ? 'PDF मर्ज, स्प्लिट, कंप्रेस, फॉर्मेट बदलें और लॉक करें — बिना किसी सर्वर अपलोड के सीधे फ़ोन में।'
        : 'Merge, split, compress, convert, and lock PDFs directly on your phone without cloud uploads.'
    },
    {
      icon: Scale,
      title: isHindi ? 'कानूनी ड्राफ्ट्स, RTI जनरेटर व ई-कोर्ट्स' : 'Legal Drafts, RTI Generator & e-Courts',
      desc: isHindi
        ? 'नोटिस, एफिडेविट, RTI आवेदन टेम्पलेट्स, लैंडमार्क निर्णय सार और आधिकारिक e-Courts शॉर्टकट्स।'
        : 'Ready notice & affidavit drafts, RTI application templates, judgment summaries, and e-Courts portals.'
    },
    {
      icon: Calculator,
      title: isHindi ? 'कैलकुलेटर हब एवं भूमि क्षेत्रफल कन्वर्टर' : 'Calculators & Land Unit Converters',
      desc: isHindi
        ? 'बीघा, कट्ठा, एकड़, हेक्टेयर रूपांतरण, ब्याज, कोर्ट फीस, स्टैम्प ड्यूटी, EMI व GST गणना।'
        : 'Accurate Bigha, Katha, Acre & Hectare conversion alongside Court Fee, Interest, EMI & GST calculators.'
    },
    {
      icon: Calendar,
      title: isHindi ? 'कैलेंडर, पंचांग एवं कोर्ट अवकाश' : 'Calendar, Panchang & Court Holidays',
      desc: isHindi
        ? 'न्यायालय अवकाश, महत्वपूर्ण तिथियाँ, कानूनी शब्दावली व सूचना तिजोरी (Info Vault) एक स्थान पर।'
        : 'Track court holidays, traditional Panchang dates, legal glossary, and reference vault.'
    },
    {
      icon: MessageCircle,
      title: isHindi ? 'डायरेक्ट व्हाट्सएप, QR व लेस-शेयर' : 'Direct WhatsApp, QR Tools & Less Share',
      desc: isHindi
        ? 'बिना नंबर सेव किए व्हाट्सएप चैट, दस्तावेज़ QR स्कैनर/जनरेटर और तेज़ लोकल फ़ाइल शेयरिंग।'
        : 'Instant WhatsApp messaging without saving numbers, document QR tools, and local Less Share transfer.'
    }
  ];

  const permissionsList = isHindi
    ? [
        'स्टोरेज एक्सेस — केवल आपके द्वारा चुनी गई PDF और दस्तावेज़ फ़ाइलों को स्थानीय रूप से पढ़ने व संपादित करने के लिए।',
        'वाई-फ़ाई और लोकल नेटवर्क — बिना इंटरनेट के Less Share द्वारा डिवाइस-टू-डिवाइस फ़ाइल ट्रांसफर के लिए।',
        'नोटिफ़िकेशन (वैकल्पिक) — केस डायरी में दर्ज सुनवाई की तारीखों के रिमाइंडर दिखाने के लिए।'
      ]
    : [
        'Storage Access — strictly used locally to open, edit, merge, and save PDFs you select.',
        'Wi-Fi & Local Network — used exclusively for direct offline Less Share device-to-device file transfer.',
        'Notifications (Optional) — used only to deliver hearing date reminders from your Case Diary.'
      ];

  const apkUrl = config.apkDownloadUrl?.trim() || 'https://github.com/lesscreation/app/releases/latest';
  const playStoreUrl = config.playStoreUrl?.trim() || 'https://play.google.com/store/apps/details?id=com.lesscreation.app';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 space-y-6 text-white">
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
          onClick={() => onNavigate('features')}
          className="text-xs font-semibold text-red-400 hover:text-red-300 inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
        >
          <span>{isHindi ? 'सभी टूल्स देखें' : 'All App Tools'}</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </button>
      </div>

      {/* Main App Card with Authentic Doordarshan-Style Blue & White Less Legal Icon */}
      <section className="rounded-3xl bg-[#030509] border border-white/15 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#070B12] border border-white/15 overflow-hidden flex items-center justify-center shrink-0 shadow-xl">
              <img
                src="/app_logo_512x512-3.png"
                alt="Less Legal Official Android App Logo"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#C9A24B] font-bold">
                {isHindi ? 'आधिकारिक एंड्रॉइड एप्लिकेशन' : 'OFFICIAL ANDROID APPLICATION'}
              </div>

              <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                Less Legal
              </h1>

              <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
                {isHindi
                  ? 'अधिवक्ताओं, विधि छात्रों और नागरिकों के लिए तेज़, गोपनीय ऑन-डिवाइस केस डायरी, PDF टूल्स, लीगल ड्राफ्ट्स, भूमि कन्वर्टर और दैनिक उपयोगिता सूट।'
                  : 'Privacy-first Android workspace for advocates, law students, and citizens — combining Case Diary, PDF Workspace, Legal Drafts, Land & Court Calculators, and Daily Utilities.'}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[11px] text-stone-400 pt-1">
                <span>{config.appVersion ? `v${config.appVersion.replace(/^v/i, '')}` : 'Official Release'}</span>
                <span aria-hidden="true">·</span>
                <span>{config.minAndroidVersion || 'Android 7.0+'}</span>
                <span aria-hidden="true">·</span>
                <span>{isHindi ? 'ऑन-डिवाइस प्राइवेसी' : 'On-Device Privacy'}</span>
              </div>
            </div>
          </div>

          {/* Primary Download Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <a
              href={apkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs inline-flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-600/20 whitespace-nowrap transition-colors"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span>{isHindi ? 'सीधा APK डाउनलोड करें' : 'Direct APK Download'}</span>
            </a>

            <a
              href={playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-stone-200 font-semibold text-xs inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-[#C9A24B] shrink-0" />
              <span>{isHindi ? 'Google Play पर देखें' : 'Get it on Google Play'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Complete Verified App Features Included */}
      <section className="space-y-4">
        <div className="border-b border-white/10 pb-3 flex items-center justify-between gap-3">
          <h2 className="text-base sm:text-xl font-bold text-white tracking-tight">
            {isHindi ? 'Less Legal ऐप की प्रमुख सुविधाएँ' : 'Features Inside Less Legal App'}
          </h2>
          <button
            onClick={() => onNavigate('features')}
            className="text-xs font-bold text-red-400 hover:text-red-300 cursor-pointer whitespace-nowrap"
          >
            {isHindi ? 'पूरा कैटलॉग →' : 'Full Catalog →'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {appFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#0D1220] border border-white/10 hover:border-red-500/35 transition-colors space-y-2.5"
              >
                <div className="w-9 h-9 rounded-xl bg-red-600/15 border border-red-500/25 text-red-400 flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white leading-snug">{feat.title}</h3>
                <p className="text-xs text-stone-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* System Requirements & Permissions Transparency */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0D1220] border border-white/10 space-y-4">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-5 h-5 text-[#C9A24B] shrink-0" />
            <h2 className="text-sm sm:text-base font-bold text-white">
              {isHindi ? 'सिस्टम आवश्यकताएँ (System Requirements)' : 'System Requirements'}
            </h2>
          </div>

          <ul className="space-y-2.5 text-xs text-stone-300">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{config.minAndroidVersion || (isHindi ? 'Android 7.0 (Nougat) या उससे ऊपर' : 'Android 7.0 (Nougat) or higher')}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <HardDrive className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{isHindi ? 'लगभग 25 MB स्टोरेज स्पेस (स्मार्टफ़ोन व टैबलेट समर्थित)' : 'Requires ~25 MB storage space (Smartphones & Tablets)'}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-red-400 shrink-0" />
              <span>{isHindi ? '₹99 आजीवन विज्ञापन-मुक्त पास (वैकल्पिक, केवल ऐप के भीतर)' : 'Optional ₹99 Lifetime Ad-Free Pass (exclusively inside Android app)'}</span>
            </li>
          </ul>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-[#0D1220] border border-white/10 space-y-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-red-400 shrink-0" />
            <h2 className="text-sm sm:text-base font-bold text-white">
              {isHindi ? 'ऐप अनुमतियाँ एवं गोपनीयता पारदर्शिता' : 'App Permissions & Privacy Transparency'}
            </h2>
          </div>

          <ul className="space-y-2.5 text-xs text-stone-300 leading-relaxed">
            {permissionsList.map((perm, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-400 font-bold mt-0.5">•</span>
                <span>{perm}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* App Legal & Account Compliance Links */}
      <section className="p-4 sm:p-5 rounded-2xl bg-[#030509] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="text-stone-400 font-medium">
          {isHindi ? 'ऐप अनुपालन एवं सहायता लिंक:' : 'App Compliance & Policy Links:'}
        </span>
        <div className="flex flex-wrap items-center gap-4 font-semibold">
          <button onClick={() => onNavigate('app-privacy')} className="text-stone-300 hover:text-red-400 cursor-pointer whitespace-nowrap">
            {isHindi ? 'ऐप गोपनीयता नीति' : 'App Privacy Policy'}
          </button>
          <button onClick={() => onNavigate('refund')} className="text-stone-300 hover:text-red-400 cursor-pointer whitespace-nowrap">
            {isHindi ? '₹99 रिफंड नीति' : '₹99 Refund Policy'}
          </button>
          <button onClick={() => onNavigate('app-delete-account')} className="text-red-400 hover:text-red-300 cursor-pointer whitespace-nowrap">
            {isHindi ? 'डेटा हटाएं' : 'Delete Account & Data'}
          </button>
        </div>
      </section>
    </div>
  );
};
