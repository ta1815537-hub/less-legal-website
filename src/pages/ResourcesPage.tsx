import React, { useState } from 'react';
import { PageRoute } from '../types';
import { 
  BookOpen, FileText, Scale, Calculator, ArrowLeft, 
  ExternalLink, Search, CheckCircle2, Clock, 
  Compass, ShieldCheck, Sparkles, FolderOpen, ArrowRight,
  HelpCircle, AlertCircle, Layers, Lightbulb
} from 'lucide-react';
import { HeroAmbientGlow } from '../components/MotionWrappers';
import { useLanguage } from '../context/LanguageContext';

interface ResourcesPageProps {
  onNavigate: (route: PageRoute) => void;
}

interface ResourceItem {
  id: string;
  title: string;
  category: 'Guides' | 'Bare Acts' | 'Utilities' | 'Educational' | 'Roadmap';
  description: string;
  status: 'Available in App' | 'Web Guide' | 'Interactive' | 'Upcoming Roadmap';
  badgeColor: 'emerald' | 'blue' | 'amber' | 'purple';
  actionType: 'app' | 'tool' | 'read' | 'planned';
  targetRoute?: PageRoute;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { key: 'All', label: isHindi ? 'सभी संसाधन' : 'All Resources' },
    { key: 'Guides', label: isHindi ? 'कानूनी गाइड' : 'Legal Guides' },
    { key: 'Bare Acts', label: isHindi ? 'बेयर एक्ट्स' : 'Bare Acts' },
    { key: 'Utilities', label: isHindi ? 'यूटिलिटीज' : 'Utilities' },
    { key: 'Educational', label: isHindi ? 'शैक्षिक सामग्री' : 'Educational' },
    { key: 'Roadmap', label: isHindi ? 'आगामी योजनाएं' : 'Roadmap / Planned' },
  ];

  const resourcesData: ResourceItem[] = [
    {
      id: 'res-bare-acts',
      title: isHindi ? 'नवीन भारतीय कानून (BNS, BNSS, BSA) संदर्भ' : 'New Criminal Statutes (BNS, BNSS, BSA) Reference',
      category: 'Bare Acts',
      description: isHindi ? 'भारतीय न्याय संहिता, नागरिक सुरक्षा संहिता और साक्ष्य अधिनियम की सभी धाराओं की त्वरित खोज।' : 'Quick search and reference of Bharatiya Nyaya Sanhita, BNSS, and Bharatiya Sakshya Adhiniyam.',
      status: 'Available in App',
      badgeColor: 'emerald',
      actionType: 'app',
      targetRoute: 'less-legal'
    },
    {
      id: 'res-rti-guide',
      title: isHindi ? 'आरटीआई (RTI) कैसे दायर करें — चरणबद्ध मार्गदर्शिका' : 'How to File an RTI (Right to Information) Guide',
      category: 'Guides',
      description: isHindi ? 'जन सूचना अधिकारी को सही आवेदन लिखने, शुल्क भुगतान और प्रथम अपील करने के व्यावहारिक नियम।' : 'Step-by-step guidance on drafting RTI queries, fee payments, and filing first appeals.',
      status: 'Web Guide',
      badgeColor: 'blue',
      actionType: 'read'
    },
    {
      id: 'res-land-converter',
      title: isHindi ? 'भूमि क्षेत्रफल कनवर्टर (बीघा, एकड़, गुंठा, वर्ग फुट)' : 'Land Area Converter (Bigha, Acre, Guntha, Sq. Ft.)',
      category: 'Utilities',
      description: isHindi ? 'उत्तर, पश्चिम और दक्षिण भारत की क्षेत्रीय भूमि इकाइयों का सटीक मानक वर्ग फुट में रूपांतरण।' : 'Accurate conversion between standard and regional Indian land measurement units.',
      status: 'Interactive',
      badgeColor: 'purple',
      actionType: 'tool',
      targetRoute: 'home'
    },
    {
      id: 'res-legal-notice',
      title: isHindi ? 'लीगल नोटिस क्या है और इसका उत्तर कैसे दें?' : 'Understanding Legal Notices & How to Respond',
      category: 'Guides',
      description: isHindi ? 'चेक बाउंस, अनुबंध उल्लंघन या संपत्ति विवाद में भेजे जाने वाले लीगल नोटिस की मूल बातें।' : 'Essential guide on statutory notice requirements, timelines, and response etiquette.',
      status: 'Web Guide',
      badgeColor: 'blue',
      actionType: 'read'
    },
    {
      id: 'res-case-diary',
      title: isHindi ? 'डिजिटल केस डायरी व सुनवाई ट्रैकर' : 'Digital Case Diary & Hearing Tracker',
      category: 'Utilities',
      description: isHindi ? 'वकीलों और मुवक्किलों के लिए अगली तारीख, केस नंबर और कोर्ट नोट्स का सुरक्षित रिकॉर्ड।' : 'Court hearing schedule tracking, client records, and procedural note organizer.',
      status: 'Available in App',
      badgeColor: 'emerald',
      actionType: 'app',
      targetRoute: 'less-legal'
    },
    {
      id: 'res-consumer-court',
      title: isHindi ? 'उपभोक्ता फोरम में शिकायत दर्ज करने की प्रक्रिया' : 'Filing a Complaint in Consumer Disputes Commission',
      category: 'Guides',
      description: isHindi ? 'दोषपूर्ण सामान या सेवा में कमी के खिलाफ जिला उपभोक्ता आयोग में ई-दाखिल प्रक्रिया।' : 'Guide to consumer rights, jurisdiction thresholds, and filing claims via e-daakhil.',
      status: 'Web Guide',
      badgeColor: 'blue',
      actionType: 'read'
    },
    {
      id: 'res-court-etiquette',
      title: isHindi ? 'अदालती शिष्टाचार व कानून छात्रों के लिए बेसिक्स' : 'Court Etiquette & Law Student Practical Primer',
      category: 'Educational',
      description: isHindi ? 'कोर्ट रूम संबोधन के नियम, केस फाइलिंग का क्रम और इंटर्नशिप के दौरान जरूरी व्यवहार।' : 'Fundamental dress codes, addressing presiding judges, and filing documentation etiquette.',
      status: 'Web Guide',
      badgeColor: 'blue',
      actionType: 'read'
    },
    {
      id: 'res-legal-glossary',
      title: isHindi ? 'हिन्दी-अंग्रेजी कानूनी शब्दावली (Legal Glossary)' : 'Hindi-English Vernacular Legal Glossary',
      category: 'Roadmap',
      description: isHindi ? 'जटिल कानूनी और अदालती उर्दू/फारसी शब्दों का सरल हिन्दी और अंग्रेजी अनुवाद संकलन।' : 'Comprehensive legal glossary simplifying archaic court terms into plain Hindi & English.',
      status: 'Upcoming Roadmap',
      badgeColor: 'amber',
      actionType: 'planned'
    },
    {
      id: 'res-drafting-templates',
      title: isHindi ? 'मानक कानूनी ड्राफ्ट्स व एग्रीमेंट टेम्पलेट्स' : 'Standard Legal Drafts & Agreement Templates',
      category: 'Roadmap',
      description: isHindi ? 'किरायानामा, शपथ पत्र, जनरल पावर ऑफ अटॉर्नी और नोटिस के संपादन योग्य प्रारूप।' : 'Curated draft formats for rent agreements, affidavits, GPA, and common representations.',
      status: 'Upcoming Roadmap',
      badgeColor: 'amber',
      actionType: 'planned'
    },
    {
      id: 'res-bare-acts-pdf',
      title: isHindi ? 'संवैधानिक संशोधन व प्रमुख नियम पीडीएफ रिपोजिटरी' : 'Constitutional Amendments & Rules PDF Repository',
      category: 'Roadmap',
      description: isHindi ? 'नवीनतम संशोधन गजट अधिसूचनाओं का संरचित और सत्यापित डिजिटल संग्रह।' : 'Verified central gazette notifications and constitutional amendment archives.',
      status: 'Upcoming Roadmap',
      badgeColor: 'amber',
      actionType: 'planned'
    }
  ];

  const filteredResources = resourcesData.filter(item => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-4 sm:pb-6 space-y-12 overflow-hidden">
      <HeroAmbientGlow />

      {/* Breadcrumbs */}
      <div className="flex items-center justify-between relative z-10">
        <button
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 px-3.5 py-1.5 rounded-full shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
          <span>{isHindi ? 'होम पर वापस जाएं' : 'Back to Home'}</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-extrabold tracking-wide">
          <BookOpen className="w-3 h-3 text-emerald-600" />
          <span>{isHindi ? 'संसाधन एवं ज्ञान हब' : 'Knowledge & Resource Hub'}</span>
        </div>
      </div>

      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-600 dark:text-blue-400 text-xs font-black tracking-wider uppercase shadow-2xs">
          <Layers className="w-3.5 h-3.5" />
          <span>{isHindi ? 'सार्वजनिक कानूनी संसाधन' : 'Public Legal Resources & Utilities'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {isHindi ? 'संसाधन, गाइड और उपयोगिताएं' : 'Resources, Guides & Utilities'}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {isHindi
            ? 'भारतीय कानूनों, सार्वजनिक प्रक्रियाओं, आवश्यक टूल्स और आगामी शैक्षिक सामग्रियों का व्यवस्थित संकलन।'
            : 'A curated collection of practical legal references, citizen guides, calculation tools, and future educational resources.'}
        </p>

        {/* Search Input */}
        <div className="pt-2 max-w-md mx-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHindi ? 'गाइड या संसाधन खोजें...' : 'Search resources, acts, or guides...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/90 dark:bg-[#121622] border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <div className="flex items-center justify-center flex-wrap gap-2 relative z-10">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeCategory === cat.key
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white/80 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
        {filteredResources.map((item) => {
          const isPlanned = item.status === 'Upcoming Roadmap';
          return (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-white/95 dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header row with status badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                      item.badgeColor === 'emerald'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : item.badgeColor === 'blue'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                        : item.badgeColor === 'purple'
                        ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                        : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Action area */}
              <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                {item.actionType === 'app' && (
                  <button
                    onClick={() => onNavigate('less-legal')}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isHindi ? 'लेस लीगल में खोलें' : 'Open in Less Legal'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {item.actionType === 'tool' && (
                  <button
                    onClick={() => onNavigate('home')}
                    className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isHindi ? 'कैलकुलेटर इस्तेमाल करें' : 'Use Calculator'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {item.actionType === 'read' && (
                  <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                    <span>{isHindi ? 'सत्यापित मार्गदर्शिका' : 'Verified Guide'}</span>
                  </div>
                )}

                {item.actionType === 'planned' && (
                  <div className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>{isHindi ? 'विकास योजना में' : 'In Active Planning'}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Non-Governmental Declaration Note */}
      <section className="relative z-10 p-5 rounded-2xl bg-amber-50/70 dark:bg-white/5 border border-amber-200/80 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{isHindi ? 'सार्वजनिक कानूनी सूचना अस्वीकरण' : 'Public Legal Information Notice'}</span>
        </div>
        <p className="leading-relaxed text-[11.5px] text-slate-600 dark:text-slate-400">
          {isHindi
            ? 'इस पृष्ठ पर दिए गए संसाधन, दिशानिर्देश और बेयर एक्ट्स संदर्भ केवल सूचनात्मक एवं सामान्य जागरूकता के लिए हैं। यह किसी न्यायालय या प्राधिकृत अधिवक्ता की औपचारिक कानूनी सलाह का विकल्प नहीं है। लेस क्रिएशन किसी भी सरकारी संस्था का प्रतिनिधित्व नहीं करता।'
            : 'All resources, guides, and statutory references provided here are for general educational and informational purposes only. They do not constitute formal legal counsel or advocate-client representation. Less Creation does not represent any judicial or governmental body.'}
        </p>
      </section>

      {/* Suggest a Resource or Connect Banner */}
      <section className="relative z-10 p-8 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center space-y-4 shadow-lg shadow-blue-500/20">
        <h2 className="text-xl sm:text-2xl font-black">
          {isHindi ? 'क्या आप किसी विशिष्ट कानूनी विषय पर संसाधन चाहते हैं?' : 'Need a Specific Legal Topic or Resource Guide?'}
        </h2>
        <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto">
          {isHindi
            ? 'हम नियमित रूप से भारतीय कानून और नागरिक अधिकारों से जुड़ी नई व्यावहारिक गाइड जोड़ रहे हैं। अपनी सलाह साझा करें।'
            : 'We continuously expand our practical guides and digital tools for advocates and citizens. Feel free to request additions.'}
        </p>
        <div className="pt-1">
          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-2.5 rounded-full bg-white text-blue-700 font-extrabold text-xs hover:bg-blue-50 transition-colors shadow-sm cursor-pointer"
          >
            <span>{isHindi ? 'सुझाव भेजें' : 'Send Resource Request'}</span>
          </button>
        </div>
      </section>
    </div>
  );
};
