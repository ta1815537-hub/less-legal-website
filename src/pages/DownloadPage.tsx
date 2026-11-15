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
  QrCode,
  ExternalLink,
  Smartphone,
  HardDrive,
  Lock,
  CheckCircle2,
  ArrowRight,
  Layers,
  BookOpen,
  Sparkles,
  CloudUpload,
  BadgeCheck,
  Search
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { adminStorage, SiteAppConfig } from '../utils/adminStorage';
import { DEFAULT_PLAY_STORE_URL } from '../utils/deepLink';

interface DownloadPageProps {
  onNavigate: (route: PageRoute) => void;
}

type FeatureGroupKey = 'all' | 'legal' | 'pdf' | 'calc' | 'tools';

interface FeatureGroup {
  key: Exclude<FeatureGroupKey, 'all'>;
  titleHi: string;
  titleEn: string;
  subtitleHi: string;
  subtitleEn: string;
  icon: React.ComponentType<{ className?: string }>;
  items: {
    headingHi: string;
    headingEn: string;
    pointsHi: string[];
    pointsEn: string[];
  }[];
}

export const DownloadPage: React.FC<DownloadPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [config, setConfig] = useState<SiteAppConfig>(() => adminStorage.getSiteAppConfig());
  const [activeGroup, setActiveGroup] = useState<FeatureGroupKey>('all');

  useEffect(() => {
    adminStorage
      .fetchSiteAppConfigFromCloud(false)
      .then((res) => {
        if (res) setConfig(res);
      })
      .catch(() => {});

    const unsub = adminStorage.subscribeToSiteAppConfig((updated) => {
      setConfig(updated);
    });
    return () => unsub();
  }, []);

  const featureGroups: FeatureGroup[] = [
    {
      key: 'legal',
      titleHi: 'विधिक सेवाएं, अध्ययन एवं गाइड्स',
      titleEn: 'Legal Services, Study & Guides',
      subtitleHi: '14 प्रमुख कानूनी सेवाएं, कोर्सेज, डेली क्विज़ एवं करियर अपडेट्स',
      subtitleEn: '14 core legal services, study reader, daily quiz & career hub',
      icon: Scale,
      items: [
        {
          headingHi: '14 प्रमुख कानूनी सेवाएं व त्वरित खोज',
          headingEn: '14 Core Legal Services & Voice Search',
          pointsHi: [
            'RTI जनरेटर (A4 PDF प्रारूप), नवीनतम निर्णय (बुकमार्क सहित) व लैंडमार्क साइटेशन',
            'अधिकार क्षेत्र खोजक (Jurisdiction Finder — राज्य, जिला एवं ग्राम स्तर)',
            'लीगल आर्टिकल्स, हाउ-टू गाइड्स, ट्रैफिक नियम व चालान, अपने अधिकार जानें, साइबर क्राइम गाइड व आधिकारिक पोर्टल',
            'ग्लोबल लाइव सर्च, वॉयस माइक, लीगल शब्दावली, कोर्ट शिष्टाचार व पुराने-नए कानून (BNS) कन्वर्टर'
          ],
          pointsEn: [
            'RTI Generator (A4 PDF), Latest Judgments with Bookmarks & Landmark Citations',
            'Jurisdiction Finder across Indian States, Districts & Villages',
            'Legal Articles, How-To Guides, Traffic Rules & Challan, Know Your Rights, Cyber Crime Guide & Official Portals',
            'Global Live & Voice Search across Legal Glossary, Courtroom Etiquette & Old-to-New Law (BNS) Converter'
          ]
        },
        {
          headingHi: 'लीगल कोर्स रीडर, डेली क्विज़ एवं लॉयर डेस्क',
          headingEn: 'Legal Course Reader, Daily Quiz & Lawyer Desk',
          pointsHi: [
            'कोर्स लेसन रीडर: Day / Sepia / Night / Focus थीम्स, फॉन्ट साइज कंट्रोल, ऑडियो रीड-अलाउड (TTS), हाइलाइटर व फ्रीहैंड स्केच कैनवास',
            'डेली लीगल क्विज़ (टाइमर, XP पॉइंट्स व इतिहास) और जॉब्स/इंटर्नशिप अलर्ट्स',
            'लॉयर डेस्क डायरेक्टरी, पसंदीदा अधिवक्ता बुकमार्क व नागरिक अनुभव (Citizen Stories)'
          ],
          pointsEn: [
            'Course & Lesson Reader with Day/Sepia/Night/Focus themes, TTS Audio Read-Aloud, Marker Highlighter & Sketch Canvas',
            'Daily Timed Quiz with XP & History plus Legal Jobs and Internships Alerts',
            'Lawyer Desk Directory, Favorite Counsel bookmarks & Community Stories'
          ]
        }
      ]
    },
    {
      key: 'pdf',
      titleHi: 'PDF, डॉक्यूमेंट राइटर व टेक्स्ट टूल्स',
      titleEn: '16 PDF Tools, Doc Writer & 10 Text Tools',
      subtitleHi: '100% ऑन-डिवाइस दस्तावेज़ प्रोसेसिंग और बिल्ट-इन रीडर',
      subtitleEn: 'On-device document processing, rich legal writer & multi-format reader',
      icon: FileText,
      items: [
        {
          headingHi: '16 स्मार्ट PDF टूल्स (ऑन-डिवाइस)',
          headingEn: '16 On-Device PDF Utilities',
          pointsHi: [
            'Doc Scanner, Merge PDF, Compress PDF, Image to PDF, Split PDF, PDF to Image एवं Text to PDF',
            'Organize Pages, PDF to Text (OCR), Share Long Image, PDF to ZIP, Protect Password व Unlock PDF',
            'Excel-to-PDF, सीधे प्रिंट व WhatsApp शेयर सपोर्ट और Google Drive लिंक टूल्स'
          ],
          pointsEn: [
            'Doc Scanner, Merge PDF, Compress PDF, Image to PDF, Split PDF, PDF to Image & Text to PDF',
            'Organize Pages, PDF to Text (OCR), Share Long Image, PDF to ZIP, Protect Password & Unlock PDF',
            'Excel-to-PDF conversion, instant print, WhatsApp sharing & Drive links'
          ]
        },
        {
          headingHi: 'लीगल डॉक राइटर, PDF रीडर एवं 10 टेक्स्ट टूल्स',
          headingEn: 'Legal Doc Writer, PDF Reader & 10 Text Tools',
          pointsHi: [
            'Legal Doc Writer: रिच फॉर्मेटिंग एडिटर, कोर्ट/एफिडेविट/वेरिफिकेशन हेडर टेम्पलेट्स, Undo/Redo व PDF एक्सपोर्ट',
            'PDF वर्कस्पेस व रीडर: वर्टिकल/हॉरिजॉन्टल/सिंगल पेज मोड, इन-PDF सर्च, एनोटेशन, बुकमार्क व Keep-Screen-On',
            'बाहरी फाइल ओपनर (Word, Excel, PPT, TXT, CSV, RTF, ODT) एवं 10 टेक्स्ट टूल्स (वर्ड काउंटर, केस बदलें, Find & Replace, Text Art)'
          ],
          pointsEn: [
            'Legal Doc Writer with Rich Formatting, Court/Affidavit/Verification headers & PDF export/print',
            'PDF Reader with 3 reading modes, In-PDF Search, Annotations, Bookmarks, TOC & Keep-Screen-On',
            'Open Word, Excel, PPT, TXT, CSV & RTF directly + 10 Text Tools (Counter, Case Convert, Find & Replace, ASCII Art)'
          ]
        }
      ]
    },
    {
      key: 'calc',
      titleHi: 'कैलकुलेटर, बही खाता एवं स्मार्ट बिलिंग',
      titleEn: 'Calculators, Bahi Khata & Smart Billing',
      subtitleHi: '18 कैलकुलेटर, 28 राज्यों का भूमि कन्वर्टर, लेजर व कंसल्टेशन बिलिंग',
      subtitleEn: '18 calculators, 28-state land converter, digital Bahi Khata & GST billing',
      icon: Calculator,
      items: [
        {
          headingHi: 'कैलकुलेटर हब एवं भूमि इकाई कन्वर्टर',
          headingEn: '18 Calculators & 28-State Land Converter',
          pointsHi: [
            '6 श्रेणियों में 18 कैलकुलेटर — सर्च, पसंदीदा और गणना इतिहास के साथ',
            '28 भारतीय राज्यों/क्षेत्रों के लिए सटीक भूमि कन्वर्टर (बीघा, बिस्वा, कट्ठा, गुंठा, सेंट आदि)',
            'विधिक उपयोगिता कैलकुलेटर (Limitation Period, Court Fee, Stamp Duty) एवं आयु कैलकुलेटर'
          ],
          pointsEn: [
            '18 Calculators across 6 categories with search, favorites & calculation history',
            'Land Converter covering 28 Indian states & regional units (Bigha, Biswa, Katha, Guntha, Cent, etc.)',
            'Legal Utility Calculators for Limitation Period, Court Fee, Stamp Duty & Age Calculator'
          ]
        },
        {
          headingHi: 'बही खाता प्रो, क्विक स्कैन बिलिंग व कंसल्टेशन टाइमर',
          headingEn: 'Bahi Khata, Quick Scan Billing & Consultation Timer',
          pointsHi: [
            'बही खाता: आय/व्यय/लेन-देन/एडवांस/लोन प्रविष्टियाँ, वॉयस एंट्री, A4 PDF लेजर रिपोर्ट व WhatsApp पेमेंट रिमाइंडर',
            'Quick Scan Billing: बारकोड कैमरा स्कैन, GST इन्वेंटरी, PDF रसीद व ब्लूटूथ थर्मल प्रिंटर सपोर्ट',
            'Consultation Timer: लाइव स्टॉपवॉच, प्रति-मिनट बिलिंग, QR स्कैनर व PDF बिल मेमो जनरेशन'
          ],
          pointsEn: [
            'Bahi Khata: Income/Expense/Advance/Loan ledgers, Voice Entry, A4 PDF Ledger Report & WhatsApp Reminders',
            'Quick Scan Billing: Barcode Camera Scan, GST Inventory, PDF Invoice & Bluetooth Thermal Printer Support',
            'Consultation Timer: Live Stopwatch, per-minute billing, QR scan & shareable PDF Bill Memo'
          ]
        }
      ]
    },
    {
      key: 'tools',
      titleHi: 'नोट्स, Less Share, पोस्टर हब एवं बैकअप',
      titleEn: 'Quick Notes, Less Share, Poster Hub & Backup',
      subtitleHi: 'ऑफलाइन P2P शेयर, QR सेंटर, Info Vault, सुरक्षित ऐप लॉक व क्लाउड बैकअप',
      subtitleEn: 'Offline file transfer, QR center, Info Vault, App Lock & Google Drive backup',
      icon: Layers,
      items: [
        {
          headingHi: 'क्विक नोट्स, Info Vault, QR सेंटर एवं Less Share',
          headingEn: 'Quick Notes, Info Vault, QR Center & Less Share',
          pointsHi: [
            'Quick Notes व Checklists (+ होम स्क्रीन विजेट): पिन, रिमाइंडर अलार्म, वॉयस नोट और पासवर्ड-लॉक्ड नोट्स',
            'Less Share: बिना इंटरनेट ऑफलाइन P2P व QR फाइल ट्रांसफर एवं 9 प्रकार के QR कोड निर्माण (UPI, Wi-Fi, vCard आदि)',
            'Info Vault: व्यक्तिगत, आपातकालीन, वाहन, बीमा व महत्वपूर्ण दस्तावेज़ों की सुरक्षित श्रेणियाँ'
          ],
          pointsEn: [
            'Quick Notes & Checklists with Home Screen Widget, Voice Notes, Reminders & Note Password Lock',
            'Less Share offline P2P & QR File Transfer + QR Generator (9 types: UPI, Wi-Fi, vCard, Website, etc.)',
            'Searchable Info Vault across 8 categories (Personal, Emergency, Docs, Vehicle, Insurance, Dates & Custom)'
          ]
        },
        {
          headingHi: 'पोस्टर हब, भाषा, ऐप लॉक व Google Drive बैकअप',
          headingEn: 'Poster Hub, Multilingual UI, App Lock & Drive Backup',
          pointsHi: [
            'Poster Hub: दैनिक व त्योहार पोस्टर एडिटर — अपनी फोटो, नाम व पद के साथ (Pro के लिए वॉटरमार्क-रहित)',
            'डायरेक्ट व्हाट्सएप (क्विक क्लाइंट टेक्स्ट टेम्पलेट्स), हिंदी/English भाषा व लाइट/डार्क थीम',
            'PIN / पैटर्न / बायोमेट्रिक ऐप लॉक, 24×7 इन-ऐप सहायता व Google Drive बैकअप / ऑफलाइन JSON एक्सपोर्ट'
          ],
          pointsEn: [
            'Poster Hub with daily/festival frames, custom photo & designation (Watermark-Free for Pro)',
            'Direct Client WhatsApp Templates, English/हिन्दी Instant Switch & Light/Dark App Theme',
            'PIN/Pattern/Biometric App Lock, 24×7 In-App Help Support & Google Drive / Offline JSON Backup'
          ]
        }
      ]
    }
  ];

  const tabs: { key: FeatureGroupKey; labelHi: string; labelEn: string }[] = [
    { key: 'all', labelHi: 'सभी सुविधाएँ', labelEn: 'All Features' },
    { key: 'legal', labelHi: 'विधिक सेवाएं', labelEn: 'Legal Services' },
    { key: 'pdf', labelHi: 'PDF व टेक्स्ट', labelEn: 'PDF & Text' },
    { key: 'calc', labelHi: 'कैलकुलेटर व बही खाता', labelEn: 'Calculators & Billing' },
    { key: 'tools', labelHi: 'नोट्स, शेयर व बैकअप', labelEn: 'Daily Tools & Backup' }
  ];

  const visibleGroups = activeGroup === 'all' ? featureGroups : featureGroups.filter((g) => g.key === activeGroup);

  const permissionsList = isHindi
    ? [
        'स्टोरेज एक्सेस — केवल आपके द्वारा चुनी गई PDF और दस्तावेज़ फ़ाइलों को स्थानीय रूप से पढ़ने व संपादित करने के लिए।',
        'कैमरा (वैकल्पिक) — डॉक्यूमेंट स्कैनर, QR/बारकोड स्कैनर व प्रोफाइल फोटो क्रॉप करने के लिए।',
        'वाई-फ़ाई और लोकल नेटवर्क — बिना इंटरनेट के Less Share द्वारा डिवाइस-टू-डिवाइस फ़ाइल ट्रांसफर के लिए।',
        'नोटिफ़िकेशन व माइक्रोफ़ोन (वैकल्पिक) — केस डायरी/बही खाता रिमाइंडर एवं वॉयस सर्च/वॉयस एंट्री के लिए।'
      ]
    : [
        'Storage Access — strictly used locally to open, edit, merge, and save PDFs you select.',
        'Camera (Optional) — used only for Document Scanner, QR/Barcode scanning, and profile photo framing.',
        'Wi-Fi & Local Network — used exclusively for direct offline Less Share device-to-device file transfer.',
        'Notifications & Microphone (Optional) — used for Case Diary/Payment reminders and voice search/entry.'
      ];

  const apkUrl = config.apkDownloadUrl?.trim() || 'https://github.com/lesscreation/app/releases/latest';
  const playStoreUrl = config.playStoreUrl?.trim() || DEFAULT_PLAY_STORE_URL;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 space-y-7 text-white">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => onNavigate('home')}
          className="text-xs font-semibold text-stone-300 hover:text-red-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full whitespace-nowrap"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span>{isHindi ? 'होमपेज पर लौटें' : 'Back to Home'}</span>
        </button>

        <button
          onClick={() => onNavigate('premium')}
          className="text-xs font-bold text-[#C9A24B] hover:text-white inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors"
        >
          <BadgeCheck className="w-3.5 h-3.5 shrink-0" />
          <span>{isHindi ? '₹99 लाइफटाइम पास देखें' : 'View ₹99 Lifetime Pass'}</span>
        </button>
      </div>

      {/* Main App Card with Authentic Doordarshan-Style Blue & White Less Legal Icon */}
      <section className="relative rounded-2xl sm:rounded-3xl bg-[#030509] bg-gradient-to-br from-[#060B18] via-[#030509] to-[#120509] border border-red-500/30 p-6 sm:p-8 shadow-2xl space-y-6 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent"
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
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

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Less Legal
              </h1>

              <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
                {isHindi
                  ? 'अधिवक्ताओं, विधि छात्रों और नागरिकों के लिए संपूर्ण ऑल-इन-वन विधिक एवं दैनिक उपयोगिता ऐप — 14 विधिक सेवाएं, 16 ऑन-डिवाइस PDF टूल्स, बही खाता, भूमि कन्वर्टर, पोस्टर हब और क्लाउड बैकअप।'
                  : 'Complete all-in-one legal & daily utility Android suite for advocates, law students, and citizens — 14 legal services, 16 on-device PDF tools, Bahi Khata, 28-state Land Converter, Poster Hub & Drive backup.'}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[11px] text-stone-400 pt-1">
                <span>{config.appVersion ? `v${config.appVersion.replace(/^v/i, '')}` : 'Official Release'}</span>
                <span aria-hidden="true">·</span>
                <span>{config.minAndroidVersion || 'Android 7.0+'}</span>
                <span aria-hidden="true">·</span>
                <span>{isHindi ? 'English व हिन्दी समर्थित' : 'English & हिन्दी'}</span>
              </div>
            </div>
          </div>

          {/* Primary Download Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <a
              href={playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs inline-flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-600/20 whitespace-nowrap transition-colors"
            >
              <ExternalLink className="w-4 h-4 shrink-0" />
              <span>{isHindi ? 'Google Play पर डाउनलोड करें' : 'Get it on Google Play'}</span>
            </a>

            <a
              href={apkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-stone-200 font-semibold text-xs inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap transition-colors"
            >
              <Download className="w-4 h-4 text-[#C9A24B] shrink-0" />
              <span>{isHindi ? 'सीधा APK डाउनलोड' : 'Direct APK Download'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Complete Organized Less Legal App Features (Clean User-Facing Only) */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <h2 className="text-base sm:text-xl font-bold text-white tracking-tight">
              {isHindi ? 'Less Legal App की संपूर्ण कार्यरत सुविधाएँ' : 'Complete Less Legal App Features'}
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              {isHindi
                ? 'ऐप में वर्तमान में उपलब्ध सभी प्रमुख टूल्स व सेवाएं श्रेणी के अनुसार देखें।'
                : 'Explore every user-facing tool and legal utility currently active inside the Android app.'}
            </p>
          </div>

          <button
            onClick={() => onNavigate('features')}
            className="text-xs font-bold text-red-400 hover:text-red-300 inline-flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>{isHindi ? 'विस्तृत कैटलॉग' : 'Interactive Catalog'}</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>

        {/* Clean Single-Line Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => {
            const isSelected = activeGroup === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveGroup(tab.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                  isSelected
                    ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/20'
                    : 'bg-[#0D1220] text-stone-300 border-white/10 hover:border-red-500/35 hover:text-white'
                }`}
              >
                {isHindi ? tab.labelHi : tab.labelEn}
              </button>
            );
          })}
        </div>

        {/* Organized Feature Category Cards */}
        <div className="space-y-5">
          {visibleGroups.map((group) => {
            const GroupIcon = group.icon;
            return (
              <div
                key={group.key}
                className="rounded-2xl bg-[#0D1220] border border-white/10 p-5 sm:p-6 space-y-5 shadow-lg"
              >
                <div className="flex items-start gap-3.5 pb-3 border-b border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-red-600/15 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
                    <GroupIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {isHindi ? group.titleHi : group.titleEn}
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {isHindi ? group.subtitleHi : group.subtitleEn}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.items.map((sub, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl bg-[#030509] border border-white/10 p-4 space-y-3"
                    >
                      <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#C9A24B]">
                        <Sparkles className="w-3.5 h-3.5 shrink-0" />
                        <span>{isHindi ? sub.headingHi : sub.headingEn}</span>
                      </div>
                      <ul className="space-y-2 text-xs text-stone-300 leading-relaxed">
                        {(isHindi ? sub.pointsHi : sub.pointsEn).map((pt, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Highlight Strip: Navigation & App Experience */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#030509] border border-white/10 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Search className="w-4 h-4 text-red-400 shrink-0" />
            <span>{isHindi ? 'कर्व्ड बॉटम नेविगेशन व क्विक टैब' : 'Fast 4-Tab & Less Share Dock'}</span>
          </div>
          <p className="text-[11px] text-stone-400 leading-relaxed">
            {isHindi
              ? 'Home, Calculator, Notes, Profile और बीच में झटपट Less Share फ्लोटिंग बटन।'
              : 'Instant switching between Home, Calculator Hub, Notes/Checklists, Profile & center Less Share button.'}
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#030509] border border-white/10 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <BookOpen className="w-4 h-4 text-[#C9A24B] shrink-0" />
            <span>{isHindi ? 'ऑफ़लाइन हिंदी अनुवाद व डायरी' : 'Offline Hindi & Encrypted Vault'}</span>
          </div>
          <p className="text-[11px] text-stone-400 leading-relaxed">
            {isHindi
              ? 'English / हिन्दी सपोर्ट, ऑफ़लाइन हिंदी मॉडल और पासवर्ड-लॉक्ड नोट्स व Info Vault।'
              : 'Instant bilingual English/हिन्दी experience with password-protected Quick Notes and Info Vault.'}
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#030509] border border-white/10 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <CloudUpload className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{isHindi ? 'Google Drive और JSON बैकअप' : 'Drive Cloud & Offline JSON Backup'}</span>
          </div>
          <p className="text-[11px] text-stone-400 leading-relaxed">
            {isHindi
              ? 'केस डायरी, बही खाता, नोट्स, QR इतिहास और इनवॉइस को सुरक्षित ZIP/JSON में बैकअप और रिस्टोर करें।'
              : 'Back up & restore Case Diary, Bahi Khata, Quick Notes, Invoices, QR History & Saved Judgments anytime.'}
          </p>
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
              <span>{isHindi ? 'हल्का साइज • स्मार्टफ़ोन व टैबलेट समर्थित' : 'Lightweight storage footprint • Smartphones & Tablets'}</span>
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
