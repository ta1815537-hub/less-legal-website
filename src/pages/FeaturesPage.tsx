import React, { useState } from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { 
  FileText, BookOpen, Edit3, Share2, Calendar, 
  Calculator, Compass, Layers, MapPin, BookMarked, 
  Scale, GraduationCap, Image, Award, Briefcase, 
  ExternalLink, Search, Check, ShieldCheck, Download,
  Phone, MessageCircle, QrCode, Clock, Receipt, HelpCircle,
  AlertTriangle, Monitor, Moon, Globe, Bug, MessageSquare, BarChart, ArrowLeft
} from 'lucide-react';
import { 
  ScrollReveal, HeroAmbientGlow, GlowingButton 
} from '../components/MotionWrappers';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface FeaturesPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { key: 'All', label: t.featuresPage.categories.all },
    { key: 'PDF & Files', label: t.featuresPage.categories.pdfFiles },
    { key: 'Legal Utilities', label: t.featuresPage.categories.legalUtilities },
    { key: 'Calculators & Converters', label: t.featuresPage.categories.calculatorsConverters },
    { key: 'Learning & Reference', label: t.featuresPage.categories.learningReference },
  ];

  // Category translation mapping
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'PDF & Files': return t.featuresPage.categories.pdfFiles;
      case 'Legal Utilities': return t.featuresPage.categories.legalUtilities;
      case 'Calculators & Converters': return t.featuresPage.categories.calculatorsConverters;
      case 'Learning & Reference': return t.featuresPage.categories.learningReference;
      default: return category;
    }
  };

  // Map icon names to Lucide icons
  const getIcon = (iconName: string) => {
    const props = { className: "w-5 h-5 text-[#E03A3E]" };
    switch (iconName) {
      case 'FileText': return <FileText {...props} />;
      case 'BookOpen': return <BookOpen {...props} />;
      case 'Edit3': return <Edit3 {...props} />;
      case 'Share2': return <Share2 {...props} />;
      case 'Calendar': return <Calendar {...props} />;
      case 'Calculator': return <Calculator {...props} />;
      case 'Compass': return <Compass {...props} />;
      case 'Layers': return <Layers {...props} />;
      case 'MapPin': return <MapPin {...props} />;
      case 'BookMarked': return <BookMarked {...props} />;
      case 'Scale': return <Scale {...props} />;
      case 'GraduationCap': return <GraduationCap {...props} />;
      case 'Image': return <Image {...props} />;
      case 'Award': return <Award {...props} />;
      case 'Briefcase': return <Briefcase {...props} />;
      case 'ExternalLink': return <ExternalLink {...props} />;
      case 'Phone': return <Phone {...props} />;
      case 'MessageCircle': return <MessageCircle {...props} />;
      case 'QrCode': return <QrCode {...props} />;
      case 'Clock': return <Clock {...props} />;
      case 'Receipt': return <Receipt {...props} />;
      case 'HelpCircle': return <HelpCircle {...props} />;
      case 'AlertTriangle': return <AlertTriangle {...props} />;
      case 'Monitor': return <Monitor {...props} />;
      case 'Moon': return <Moon {...props} />;
      case 'Globe': return <Globe {...props} />;
      case 'Bug': return <Bug {...props} />;
      case 'MessageSquare': return <MessageSquare {...props} />;
      case 'BarChart': return <BarChart {...props} />;
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      default: return <Scale {...props} />;
    }
  };

  const filteredFeatures = SITE_CONFIG.features.filter((feature) => {
    const matchesCategory = selectedCategory === 'All' || feature.category === selectedCategory;
    const matchesSearch = 
      feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-12 sm:pb-16 space-y-8 overflow-hidden bg-slate-50 dark:bg-[#080808] transition-colors duration-300">
      <HeroAmbientGlow />
      
      {/* Header */}
      <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto space-y-3 relative z-10">
        <motion.button
          whileHover={{ x: -3 }}
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-amber-800 dark:text-[#D8BD82] hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap bg-amber-500/10 dark:bg-white/5 border border-amber-600/30 dark:border-[#D8BD82]/30 px-3 py-1 rounded-full shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 shrink-0 text-[#C21F2F] dark:text-[#E03A3E]" />
          <span className="whitespace-nowrap">{t.common.backToHome}</span>
        </motion.button>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-white/5 border border-amber-600/30 dark:border-[#D8BD82]/30 text-amber-900 dark:text-[#D8BD82] text-xs font-bold shadow-xs cursor-default whitespace-nowrap"
        >
          <Layers className="w-3.5 h-3.5 text-[#C21F2F] dark:text-[#E03A3E] animate-pulse shrink-0" />
          <span className="whitespace-nowrap">{t.featuresPage.badge}</span>
        </motion.div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-[#F5F2EE] tracking-tight">
          {t.featuresPage.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-[#B8B3AF] leading-relaxed">
          {t.featuresPage.subtitle}
        </p>
      </ScrollReveal>

      {/* Verified Catalog Notice */}
      <ScrollReveal direction="up" delay={0.06} className="relative z-10">
        <div className="glass-panel rounded-2xl p-4 border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-[#B8B3AF] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-[#D8BD82] shrink-0" />
            <span>
              <strong className="text-slate-900 dark:text-[#F5F2EE]">{t.common.verifiedNotice}:</strong> {t.featuresPage.subtitle}
            </span>
          </div>
          <span className="text-[11px] font-bold text-amber-900 dark:text-[#D8BD82] bg-amber-500/10 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-amber-600/30 dark:border-[#D8BD82]/30 hidden sm:inline-block whitespace-nowrap">
            {SITE_CONFIG.features.length} {language === 'hi' ? 'सक्रिय सुविधाएँ' : 'Live Features'}
          </span>
        </div>
      </ScrollReveal>

      {/* Filter & Search Bar */}
      <ScrollReveal direction="up" delay={0.1} className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
        
        {/* Category Pills - Auto Screen Adjust & Single Line Text */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar flex-nowrap shrink-0">
          {categories.map((cat) => (
            <motion.button
              key={cat.key}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === cat.key
                  ? 'btn-crimson font-bold text-white shadow-md'
                  : 'glass-panel text-slate-700 dark:text-[#B8B3AF] hover:text-slate-900 dark:hover:text-[#F5F2EE]'
              }`}
            >
              {cat.label}
            </motion.button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="w-4 h-4 text-slate-400 dark:text-[#77736F] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.featuresPage.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 glass-input text-xs text-slate-900 dark:text-[#F5F2EE] rounded-xl"
          />
        </div>

      </ScrollReveal>

      {/* Features Grid */}
      <div className="relative z-10">
        <AnimatePresence mode="popLayout">
          {filteredFeatures.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredFeatures.map((feature, idx) => (
                <motion.div
                  layout
                  key={feature.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.3) }}
                  className="glass-card p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center font-bold">
                        {getIcon(feature.iconName)}
                      </div>
                      <span className="text-[10px] font-bold text-amber-900 dark:text-[#D8BD82] bg-amber-500/10 dark:bg-[#D8BD82]/15 px-2.5 py-1 rounded-full border border-amber-600/30 dark:border-[#D8BD82]/30 whitespace-nowrap">
                        {getCategoryLabel(feature.category)}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F2EE] mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-[#B8B3AF] leading-relaxed mb-4">
                      {feature.description}
                    </p>
                  </div>

                  <div>
                    <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#77736F]">
                        {language === 'hi' ? 'मुख्य विशेषताएं' : 'Key Highlights'}
                      </span>
                      <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600 dark:text-[#B8B3AF]">
                        {feature.highlights.map((highlight, hIdx) => (
                          <div key={hIdx} className="flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-amber-600 dark:text-[#D8BD82] shrink-0" />
                            <span className="line-clamp-1">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 glass-panel rounded-2xl p-8"
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-[#F5F2EE]">{t.featuresPage.noResults}</p>
              <button
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="mt-3 text-xs font-bold text-amber-800 dark:text-[#D8BD82] underline cursor-pointer"
              >
                {language === 'hi' ? 'फ़िल्टर रीसेट करें' : 'Reset filters'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <ScrollReveal direction="up" className="p-8 glass-panel-gradient rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 border border-slate-200 dark:border-white/15">
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-xl font-bold text-slate-900 dark:text-[#F5F2EE]">
            {language === 'hi' ? 'एंड्रॉइड पर इन टूल्स का उपयोग करने के लिए तैयार हैं?' : 'Ready to use these tools on Android?'}
          </h2>
          <p className="text-xs text-slate-600 dark:text-[#B8B3AF]">
            {t.home.heroSubtitle}
          </p>
        </div>
        <GlowingButton
          variant="primary"
          onClick={() => onNavigate('download')}
          className="px-6 py-3 text-xs whitespace-nowrap shrink-0"
        >
          <Download className="w-4 h-4 shrink-0" />
          <span className="whitespace-nowrap">{t.nav.downloadApp}</span>
        </GlowingButton>
      </ScrollReveal>

    </div>
  );
};
