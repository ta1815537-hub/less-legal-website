import React, { useState } from 'react';
import { PageRoute } from '../types';
import { 
  FileText, BookOpen, Edit3, Calendar, 
  Calculator, Layers, MapPin, BookMarked, 
  Scale, ArrowLeft, Search, SlidersHorizontal,
  ChevronRight, ArrowRight, ArrowUpRight, ShieldCheck, Download,
  Phone, QrCode, Clock, HelpCircle,
  MessageCircle, ExternalLink, Award, Check, Sparkles,
  Zap, Compass, Landmark, Lightbulb, Cpu, FolderOpen, Info,
  RefreshCw, FileSpreadsheet, Eye, Printer, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface FeaturesPageProps {
  onNavigate: (route: PageRoute) => void;
}

interface FeatureItemData {
  id: string;
  title: string;
  category: string;
  description: string;
  badge?: 'Popular' | 'New';
  themeColor: 'red' | 'blue' | 'emerald' | 'purple' | 'amber' | 'rose' | 'teal' | 'indigo' | 'cyan';
  icon: any;
  tags: string[];
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalFeature, setActiveModalFeature] = useState<FeatureItemData | null>(null);

  // Categories matching the reference image exactly
  const filterCategories = [
    { key: 'All', label: 'All', icon: Layers },
    { key: 'Legal Utilities', label: 'Legal Utilities', icon: Scale },
    { key: 'Calculators & Converters', label: 'Calculators & Converters', icon: Calculator },
    { key: 'Learning & Reference', label: 'Learning & Reference', icon: BookOpen },
    { key: 'PDF & Files', label: 'PDF & Files', icon: FileText },
    { key: 'Productivity', label: 'Productivity', icon: Cpu },
    { key: 'Daily Tools', label: 'Daily Tools', icon: Lightbulb },
    { key: 'Government', label: 'Government', icon: Landmark },
  ];

  // Comprehensive 22+ features dataset designed to match image
  const featuresList: FeatureItemData[] = [
    {
      id: 'f-calendar',
      title: 'कैलेंडर एवं पंचांग (Calendar & Panchang)',
      category: 'Legal Utilities',
      description: 'महत्वपूर्ण तिथियों, कानूनी छुट्टियों और पारंपरिक पंचांगों को ट्रैक करें।',
      badge: 'Popular',
      themeColor: 'red',
      icon: Calendar,
      tags: ['• कानूनी छुट्टियां', 'धार्मिक पंचांग', 'न्यायालय अवकाश', '+1']
    },
    {
      id: 'f-pdf-workspace',
      title: 'पीडीएफ वर्कस्पेस (PDF Workspace)',
      category: 'PDF & Files',
      description: 'पीडीएफ मर्ज करें, स्प्लिट करें, फाइल साइज कम करें और फॉर्मेट बदलें।',
      badge: 'Popular',
      themeColor: 'blue',
      icon: FileText,
      tags: ['मर्ज और स्प्लिट', 'कंप्रेस पीडीएफ', 'फॉर्मेट बदलें', '+2']
    },
    {
      id: 'f-document-hub',
      title: 'दस्तावेज़ हब (Document Hub)',
      category: 'PDF & Files',
      description: 'कानूनी ड्राफ्ट, टेम्पलेट और केस फाइलों के लिए एक सुरक्षित तिजोरी।',
      badge: 'Popular',
      themeColor: 'emerald',
      icon: Layers,
      tags: ['केंद्रीकृत भंडारण', 'तैयार टेम्पलेट', 'केस फाइल', '+1']
    },
    {
      id: 'f-text-tools',
      title: 'टेक्स्ट टूल्स (Text Tools)',
      category: 'Legal Utilities',
      description: 'टेक्स्ट फॉर्मेटिंग, केस-कन्वर्ट और वर्ड काउंटिंग के लिए त्वरित टूल्स।',
      badge: 'New',
      themeColor: 'purple',
      icon: Edit3,
      tags: ['फॉर्मेटिंग', 'केस-कन्वर्ट', 'वर्ड काउंट', '+1']
    },
    {
      id: 'f-case-diary',
      title: 'केस डायरी (Case Diary)',
      category: 'Legal Utilities',
      description: 'सुनवाई की तारीखों को ट्रैक करने और क्लाइंट रिकॉर्ड बनाए रखने के लिए स्मार्ट डायरी।',
      themeColor: 'amber',
      icon: FolderOpen,
      tags: ['तारीख ट्रैकिंग', 'क्लाइंट रिकॉर्ड', 'नोट्स', '+1']
    },
    {
      id: 'f-info-vault',
      title: 'सूचना तिजोरी (Info Vault)',
      category: 'Legal Utilities',
      description: 'महत्वपूर्ण कानूनी जानकारी, नोट्स और रेफरेंस एक स्थान पर।',
      themeColor: 'rose',
      icon: Info,
      tags: ['कानूनी नोट्स', 'रेफरेंस लिंक', 'त्वरित खोज', '+1']
    },
    {
      id: 'f-calculators',
      title: 'कैलकुलेटर (Calculators)',
      category: 'Calculators & Converters',
      description: 'ब्याज, कोर्ट फीस, स्टैम्प ड्यूटी और दैनिक वित्तीय गणना आसानी से करें।',
      badge: 'Popular',
      themeColor: 'teal',
      icon: Calculator,
      tags: ['साधारण ब्याज', 'कोर्ट फीस', 'ईएमआई', '+2']
    },
    {
      id: 'f-converters',
      title: 'कन्वर्टर (Converters)',
      category: 'Calculators & Converters',
      description: 'बीघा, कट्ठा, एकड़, हेक्टेयर और सभी क्षेत्रीय भूमि क्षेत्रफल का सटीक रूपांतरण।',
      themeColor: 'blue',
      icon: RefreshCw,
      tags: ['बीघा-एकड़', 'क्षेत्रीय इकाइयाँ', 'लंबाई-क्षेत्रफल', '+1']
    },
    {
      id: 'f-learning-hub',
      title: 'कानूनी अध्ययन (Learning Hub)',
      category: 'Learning & Reference',
      description: 'भारतीय संविधान, आईपीसी/बीएनएस, सीआरपीसी/बीएनएसएस और प्रमुख न्यायिक सिद्धांत।',
      badge: 'Popular',
      themeColor: 'purple',
      icon: BookOpen,
      tags: ['बेयर एक्ट्स', 'संविधान', 'कानूनी सिद्धांत', '+3']
    },
    {
      id: 'f-bare-acts',
      title: 'डिजिटल बेयर एक्ट्स (Digital Bare Acts)',
      category: 'Learning & Reference',
      description: 'सभी केंद्रीय एवं राज्य स्तरीय अधिनियमों का संपूर्ण ऑफ़लाइन संग्रह।',
      badge: 'Popular',
      themeColor: 'indigo',
      icon: BookMarked,
      tags: ['धारा-वार खोज', 'ऑफ़लाइन एक्सेस', 'अद्यतन संशोधन', '+2']
    },
    {
      id: 'f-landmark-judgments',
      title: 'लैंडमार्क निर्णय (Landmark Judgments)',
      category: 'Learning & Reference',
      description: 'सुप्रीम कोर्ट के ऐतिहासिक फैसलों और साइटेशन्स का सार-संक्षेप।',
      themeColor: 'amber',
      icon: Scale,
      tags: ['सुप्रीम कोर्ट', 'ऐतिहासिक निर्णय', 'हेडनोट्स', '+1']
    },
    {
      id: 'f-rti-generator',
      title: 'आरटीआई जनरेटर (RTI Generator)',
      category: 'Government',
      description: 'विभिन्न सरकारी विभागों के लिए सटीक आरटीआई आवेदन प्रारूप तैयार करें।',
      themeColor: 'red',
      icon: FileSpreadsheet,
      tags: ['आवेदन ड्राफ्ट', 'शुल्क विवरण', 'विभाग सूची', '+1']
    },
    {
      id: 'f-ecourts-portal',
      title: 'ई-कोर्ट पोर्टल (e-Courts Portal)',
      category: 'Government',
      description: 'डिस्ट्रिक्ट कोर्ट, हाईकोर्ट और सुप्रीम कोर्ट के केस स्टेटस की सीधी जाँच।',
      badge: 'Popular',
      themeColor: 'cyan',
      icon: Landmark,
      tags: ['केस स्टेटस', 'कॉज़ लिस्ट', 'आदेश कॉपी', '+2']
    },
    {
      id: 'f-direct-whatsapp',
      title: 'डायरेक्ट व्हाट्सएप (Direct WhatsApp)',
      category: 'Daily Tools',
      description: 'बिना नंबर सेव किए तुरंत क्लाइंट या एडवोकेट से व्हाट्सएप पर संपर्क करें।',
      themeColor: 'emerald',
      icon: MessageCircle,
      tags: ['नंबर सेव नहीं', 'क्विक चैट', 'दस्तावेज़ शेयर', '+1']
    },
    {
      id: 'f-qr-tools',
      title: 'क्यूआर और बारकोड (QR & Barcode)',
      category: 'Daily Tools',
      description: 'केस फाइलों, क्लाइंट प्रोफाइल्स और आधिकारिक दस्तावेजों के लिए क्यूआर स्कैनर।',
      themeColor: 'teal',
      icon: QrCode,
      tags: ['स्कैनर', 'क्यूआर जनरेटर', 'फाइल लिंकिंग', '+1']
    },
    {
      id: 'f-court-fees',
      title: 'कोर्ट फीस एस्टिमेटर (Court Fee Estimator)',
      category: 'Calculators & Converters',
      description: 'वाद मूल्यांकन एवं राज्यवार कोर्ट फीस का तुरंत सटीक अनुमान लगाएं।',
      themeColor: 'rose',
      icon: Calculator,
      tags: ['मूल्यांकन', 'न्यायिक स्टाम्प', 'राज्य दरें', '+1']
    },
    {
      id: 'f-legal-drafts',
      title: 'कानूनी ड्राफ्ट्स (Legal Drafts)',
      category: 'Productivity',
      description: 'नोटिस, एफिडेविट, वकालतनामा और विभिन्न अनुबंधों के रेडी-टू-यूज़ टेम्पलेट्स।',
      badge: 'Popular',
      themeColor: 'purple',
      icon: Edit3,
      tags: ['वकालतनामा', 'एफिडेविट', 'नोटिस प्रारूप', '+4']
    },
    {
      id: 'f-client-vault',
      title: 'क्लाइंट रिकॉर्ड मैनेजर (Client Records)',
      category: 'Productivity',
      description: 'क्लाइंट्स के संपर्क, केस हिस्ट्री, वकालतनामा और भुगतान स्थिति सुरक्षित रखें।',
      themeColor: 'blue',
      icon: FolderOpen,
      tags: ['क्लाइंट हिस्ट्री', 'पेमेंट रिकॉर्ड', 'सुरक्षित फाइलें', '+1']
    },
  ];

  // Helper styles based on color
  const getColorStyles = (color: FeatureItemData['themeColor']) => {
    switch (color) {
      case 'red':
        return {
          iconBg: 'bg-red-100 dark:bg-red-950/40 text-[#E02636]',
          badgeBg: 'bg-red-500 text-white',
          catBg: 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200/70',
          btnBg: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 group-hover:bg-[#E02636] group-hover:text-white',
          hoverBorder: 'hover:border-red-200 dark:hover:border-red-800/40',
        };
      case 'blue':
        return {
          iconBg: 'bg-blue-100 dark:bg-blue-950/40 text-[#2563EB]',
          badgeBg: 'bg-blue-600 text-white',
          catBg: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200/70',
          btnBg: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 group-hover:bg-[#2563EB] group-hover:text-white',
          hoverBorder: 'hover:border-blue-200 dark:hover:border-blue-800/40',
        };
      case 'emerald':
        return {
          iconBg: 'bg-emerald-100 dark:bg-emerald-950/40 text-[#059669]',
          badgeBg: 'bg-emerald-600 text-white',
          catBg: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200/70',
          btnBg: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 group-hover:bg-[#059669] group-hover:text-white',
          hoverBorder: 'hover:border-emerald-200 dark:hover:border-emerald-800/40',
        };
      case 'purple':
        return {
          iconBg: 'bg-purple-100 dark:bg-purple-950/40 text-[#7C3AED]',
          badgeBg: 'bg-purple-600 text-white',
          catBg: 'bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border-purple-200/70',
          btnBg: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 group-hover:bg-[#7C3AED] group-hover:text-white',
          hoverBorder: 'hover:border-purple-200 dark:hover:border-purple-800/40',
        };
      case 'amber':
        return {
          iconBg: 'bg-amber-100 dark:bg-amber-950/40 text-[#D97706]',
          badgeBg: 'bg-amber-600 text-white',
          catBg: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200/70',
          btnBg: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300 group-hover:bg-[#D97706] group-hover:text-white',
          hoverBorder: 'hover:border-amber-200 dark:hover:border-amber-800/40',
        };
      case 'rose':
        return {
          iconBg: 'bg-rose-100 dark:bg-rose-950/40 text-[#E11D48]',
          badgeBg: 'bg-rose-600 text-white',
          catBg: 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border-rose-200/70',
          btnBg: 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300 group-hover:bg-[#E11D48] group-hover:text-white',
          hoverBorder: 'hover:border-rose-200 dark:hover:border-rose-800/40',
        };
      case 'teal':
        return {
          iconBg: 'bg-teal-100 dark:bg-teal-950/40 text-[#0D9488]',
          badgeBg: 'bg-teal-600 text-white',
          catBg: 'bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 border-teal-200/70',
          btnBg: 'bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-300 group-hover:bg-[#0D9488] group-hover:text-white',
          hoverBorder: 'hover:border-teal-200 dark:hover:border-teal-800/40',
        };
      case 'cyan':
        return {
          iconBg: 'bg-cyan-100 dark:bg-cyan-950/40 text-[#0891B2]',
          badgeBg: 'bg-cyan-600 text-white',
          catBg: 'bg-cyan-50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300 border-cyan-200/70',
          btnBg: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-300 group-hover:bg-[#0891B2] group-hover:text-white',
          hoverBorder: 'hover:border-cyan-200 dark:hover:border-cyan-800/40',
        };
      default:
        return {
          iconBg: 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300',
          badgeBg: 'bg-slate-600 text-white',
          catBg: 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border-slate-200',
          btnBg: 'bg-slate-100 text-slate-700 group-hover:bg-slate-800 group-hover:text-white',
          hoverBorder: 'hover:border-slate-300 dark:hover:border-white/20',
        };
    }
  };

  const filtered = featuresList.filter((f) => {
    const matchesCat = selectedCategory === 'All' || f.category === selectedCategory;
    const matchesQuery = 
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-16 space-y-8 sm:space-y-10 overflow-hidden">
      
      {/* 1. HERO SECTION WITH 3D PHONE SHOWCASE & HANDWRITTEN ANNOTATIONS */}
      <section className="relative pt-4 sm:pt-6 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Heading, Subtitle & Search */}
          <div className="lg:col-span-7 space-y-5 text-center sm:text-left flex flex-col items-center sm:items-start">
            
            {/* Top Badge: Complete Utility Suite */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100/80 dark:bg-red-950/40 border border-red-200/80 dark:border-red-800/40 text-[#E02636] dark:text-red-400 text-xs font-black tracking-wider uppercase shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>COMPLETE UTILITY SUITE</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-black text-slate-900 dark:text-white tracking-tight leading-[1.05]">
              Explore <span className="text-[#E02636]">22+</span> Integrated <span className="text-[#2563EB] dark:text-[#3B82F6]">Utilities</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium max-w-xl leading-relaxed">
              From instant PDF merging to regional land converters, examine all tools available inside the app.
            </p>

            {/* Search Bar with Filter Button */}
            <div className="flex items-center gap-3 w-full max-w-xl pt-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search features (e.g. Bare Acts, Bigha, PDF, Calculator...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/95 dark:bg-white/10 border border-slate-200 dark:border-white/15 text-sm text-slate-900 dark:text-white placeholder-slate-400 shadow-xs focus:ring-2 focus:ring-[#2563EB] outline-none backdrop-blur-md transition-all"
                />
              </div>
              <button
                onClick={() => setSelectedCategory('All')}
                className="p-3.5 rounded-2xl bg-white/95 dark:bg-white/10 border border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-200 shadow-xs hover:bg-slate-100 dark:hover:bg-white/15 transition-all cursor-pointer flex items-center justify-center shrink-0"
                title="Reset / Show All Filters"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>

          </div>

          {/* Right Column: 3D Angled Phone & Handwritten Notes */}
          <div className="lg:col-span-5 relative flex justify-center items-center py-4">
            
            {/* Top Left Cursive Handwritten: Your Complete Legal Companion */}
            <div className="absolute top-2 left-2 sm:left-4 z-20 transform -rotate-6">
              <span className="font-serif italic font-extrabold text-base sm:text-lg text-blue-900 dark:text-blue-300 block">
                Your Complete
              </span>
              <span className="font-serif italic font-extrabold text-lg sm:text-xl text-[#C21F2F] dark:text-[#E03A3E] block -mt-1">
                Legal Companion
              </span>
              {/* Curved Red Doodle Line */}
              <svg className="w-28 h-5 text-[#C21F2F] dark:text-[#E03A3E]" viewBox="0 0 100 20" fill="none">
                <path d="M5 5 Q 50 18, 95 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>

            {/* Bottom Right Cursive Handwritten: One App Many Possibilities */}
            <div className="absolute bottom-2 right-2 sm:right-4 z-20 transform rotate-6 text-right">
              <span className="font-serif italic font-extrabold text-sm sm:text-base text-blue-800 dark:text-blue-300 block">
                One App
              </span>
              <span className="font-serif italic font-extrabold text-base sm:text-lg text-[#2563EB] dark:text-blue-400 block -mt-1">
                Many Possibilities
              </span>
              {/* Curved Blue Doodle Arrow */}
              <svg className="w-20 h-6 text-[#2563EB] dark:text-blue-400 ml-auto" viewBox="0 0 80 20" fill="none">
                <path d="M10 15 Q 40 5, 70 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M65 8 L 72 12 L 67 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            {/* Phone Mockup Frame */}
            <motion.div
              initial={{ rotate: 8, y: 0 }}
              animate={{ rotate: [7, 9, 7], y: [-3, 3, -3] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              className="relative w-[210px] sm:w-[230px] h-[430px] sm:h-[470px] rounded-[2.8rem] bg-gradient-to-b from-slate-800 via-slate-900 to-black p-[6px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] border border-slate-700/80 z-10"
            >
              {/* Inner Screen */}
              <div className="relative w-full h-full rounded-[2.4rem] overflow-hidden bg-slate-950 flex flex-col">
                
                {/* Phone Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 w-3 h-3 rounded-full bg-black border border-slate-800" />
                
                {/* Status Bar */}
                <div className="flex items-center justify-between px-5 pt-2.5 text-[9px] font-bold text-slate-300 z-20">
                  <span>9:41</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-1.5 rounded-2xs bg-slate-300" />
                  </div>
                </div>

                {/* Simulated Less Legal App Header */}
                <div className="p-3.5 pt-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <img src="/app_logo_512x512-3.png" alt="Logo" className="w-6 h-6 rounded-md object-cover" />
                      <span className="text-[11px] font-black text-white">Less Legal</span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-[10px] text-blue-300 font-bold">
                      👤
                    </div>
                  </div>

                  {/* Hero Card inside phone */}
                  <div className="rounded-2xl bg-gradient-to-br from-blue-900/40 via-slate-800 to-slate-900 border border-blue-500/30 p-3 text-center space-y-1">
                    <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 text-xl shadow-xs">
                      ⚖️
                    </div>
                    <div className="text-[11px] font-extrabold text-white">Knowledge • Tools</div>
                    <div className="text-[9px] font-bold text-amber-300">Simpler Life</div>
                  </div>

                  {/* 3 Quick Action Tiles inside phone */}
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    <div className="rounded-xl bg-emerald-950/50 border border-emerald-500/30 p-2 flex flex-col items-center gap-1">
                      <BookOpen className="w-4 h-4 text-emerald-400" />
                      <span className="text-[8px] font-bold text-emerald-200">Bare Acts</span>
                    </div>
                    <div className="rounded-xl bg-red-950/50 border border-red-500/30 p-2 flex flex-col items-center gap-1">
                      <FileText className="w-4 h-4 text-red-400" />
                      <span className="text-[8px] font-bold text-red-200">PDF Tools</span>
                    </div>
                    <div className="rounded-xl bg-amber-950/50 border border-amber-500/30 p-2 flex flex-col items-center gap-1">
                      <Calculator className="w-4 h-4 text-amber-400" />
                      <span className="text-[8px] font-bold text-amber-200">Calculator</span>
                    </div>
                  </div>
                </div>

                {/* Glass Light Sheen */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.02) 40%, transparent 60%)',
                  }}
                />

                {/* Bottom Gesture Line */}
                <div className="mt-auto mb-1.5 mx-auto w-16 h-1 rounded-full bg-white/40" />
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* 2. CATEGORY PILLS BAR (SINGLE-LINE SCROLLABLE / WRAPPER) */}
      <section className="relative z-10">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {filterCategories.map((cat) => {
            const isActive = selectedCategory === cat.key;
            const Icon = cat.icon;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#E02636] to-[#C21F2F] text-white shadow-[0_4px_12px_rgba(224,38,54,0.35)] scale-[1.02]'
                    : 'bg-white/90 dark:bg-white/10 hover:bg-white text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 shadow-2xs hover:scale-[1.01]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. 3-COLUMN FEATURE CARDS GRID (EXACT LAYOUT FROM REFERENCE IMAGE) */}
      <section className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          <AnimatePresence>
            {filtered.map((item) => {
              const styles = getColorStyles(item.themeColor);
              const ItemIcon = item.icon;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  whileHover={{ y: -4 }}
                  className={`rounded-[24px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_35px_-8px_rgba(0,0,0,0.08)] ${styles.hoverBorder} p-5 sm:p-6 flex flex-col justify-between transition-all group backdrop-blur-xl`}
                >
                  {/* Top Area: Icon + Badges */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-4">
                      {/* Squircle Pastel Icon */}
                      <div className={`w-13 h-13 rounded-2xl ${styles.iconBg} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}>
                        <ItemIcon className="w-6 h-6" />
                      </div>

                      {/* Right Tag + Popular/New Pill */}
                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${styles.catBg} leading-tight whitespace-nowrap`}>
                          {item.category}
                        </span>
                        {item.badge && (
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${styles.badgeBg} shadow-2xs leading-tight whitespace-nowrap flex items-center gap-1`}>
                            {item.badge === 'Popular' ? '★ Popular' : '✦ New'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-2 leading-snug">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Bottom Area: Highlight Tags + Open Tool Action */}
                  <div className="space-y-4 pt-2">
                    
                    {/* Mini Highlight Pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {item.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-300 leading-tight"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Card Footer: Open Tool Link & Round Arrow Button */}
                    <div 
                      onClick={() => setActiveModalFeature(item)}
                      className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between cursor-pointer"
                    >
                      <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA] transition-colors flex items-center gap-1.5">
                        <span>Open Tool</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>

                      {/* Circle Arrow Action Button */}
                      <div className={`w-8 h-8 rounded-full ${styles.btnBg} flex items-center justify-center transition-all shadow-xs`}>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>

                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 rounded-3xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8">
            <p className="text-base font-bold text-slate-800 dark:text-white">कोई परिणाम नहीं मिला (No tools found)</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="mt-3 px-4 py-2 rounded-full bg-[#E02636] text-white text-xs font-bold cursor-pointer hover:bg-[#C21F2F]"
            >
              फ़िल्टर रीसेट करें (Reset filters)
            </button>
          </div>
        )}
      </section>

      {/* 4. MODAL FOR TOOL DETAILS & DOWNLOAD ACCESS */}
      <AnimatePresence>
        {activeModalFeature && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-white/40 dark:border-white/10 shadow-2xl p-6 sm:p-8 space-y-5 text-left"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                  {activeModalFeature.category}
                </span>
                <button
                  onClick={() => setActiveModalFeature(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {activeModalFeature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeModalFeature.description}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/40 space-y-2 text-xs text-blue-900 dark:text-blue-200">
                <div className="font-extrabold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Less Legal Android App Tool</span>
                </div>
                <p>
                  यह सुविधा Less Legal मोबाइल ऐप में पूरी तरह ऑफ़लाइन व सुरक्षित रूप से उपलब्ध है। इसे अपने फ़ोन में तुरंत एक्सेस करने के लिए ऐप डाउनलोड करें।
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    setActiveModalFeature(null);
                    onNavigate('download');
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#E02636] hover:bg-[#C21F2F] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download App to Use</span>
                </button>
                <button
                  onClick={() => setActiveModalFeature(null)}
                  className="py-3 px-5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 font-bold text-sm hover:bg-slate-200 dark:hover:bg-white/20 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. APP COMPLIANCE & LEGAL BOTTOM BAR */}
      <section className="pt-4">
        <div className="rounded-3xl bg-white/90 dark:bg-white/5 backdrop-blur-xl border border-white/80 dark:border-white/10 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/10">
            <div>
              <div className="text-xs font-black text-[#E02636] uppercase tracking-wider">
                Less Legal Official Utility Suite
              </div>
              <div className="text-sm font-bold text-slate-800 dark:text-white">
                All 22+ Tools Verified & Maintained by Less Creation
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-lg">
              com.lesslegal.app
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
            <button
              onClick={() => onNavigate('app-privacy')}
              className="hover:text-[#E02636] transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>गोपनीयता नीति (Privacy Policy)</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-blue-600" />
            </button>
            <button
              onClick={() => onNavigate('app-delete-account')}
              className="text-[#E02636] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>खाता और डेटा हटाएं (Delete Account & Data)</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('terms')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              नियम और शर्तें (Terms & Conditions)
            </button>
            <button
              onClick={() => onNavigate('refund')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              धनवापसी नीति (Refund Policy)
            </button>
            <button
              onClick={() => onNavigate('disclaimer')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              अस्वीकरण (Disclaimer)
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
