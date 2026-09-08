import React, { useState, useEffect, useRef } from 'react';
import { ToolDefinition } from '../../types';
import { searchTools, TOOLS_REGISTRY } from '../../tools/toolRegistry';
import { 
  Search, Sparkles, Clock, ArrowRight, CornerDownRight, 
  Lightbulb, FileText, Image as ImageIcon, Calculator, QrCode, 
  CheckSquare, Scale, HelpCircle, Flame, ShieldAlert
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

interface TaskDiscoveryWidgetProps {
  onSelectTool?: (tool: ToolDefinition) => void;
}

const STORAGE_RECENT_KEY = 'less_creation_recent_tools';

export const TaskDiscoveryWidget: React.FC<TaskDiscoveryWidgetProps> = ({
  onSelectTool
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load recently used tools from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_RECENT_KEY);
      if (stored) {
        setRecentSlugs(JSON.parse(stored));
      }
    } catch {}
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Standard handler to launch a tool
  const handleLaunchTool = (tool: ToolDefinition) => {
    // Save to recently used list
    try {
      const updated = [tool.slug, ...recentSlugs.filter(s => s !== tool.slug)].slice(0, 6);
      localStorage.setItem(STORAGE_RECENT_KEY, JSON.stringify(updated));
      setRecentSlugs(updated);
    } catch {}

    if (onSelectTool) {
      onSelectTool(tool);
    } else {
      // Trigger navigation with history popstate
      try {
        const url = new URL(window.location.origin + '/tools');
        url.searchParams.set('tool', tool.slug);
        window.history.pushState({}, '', url.toString());
        window.dispatchEvent(new Event('popstate'));
      } catch {
        window.location.href = `/tools?tool=${tool.slug}`;
      }
    }
  };

  // Autocomplete search results
  const searchResults = query.trim() ? searchTools(query).slice(0, 5) : [];

  const recentTools = recentSlugs
    .map(slug => TOOLS_REGISTRY.find(t => t.slug === slug))
    .filter((t): t is ToolDefinition => Boolean(t))
    .slice(0, 4);

  // Guided task categories with high user intent phrases (Hindi + English)
  const GUIDED_TASKS = [
    {
      icon: FileText,
      title: isHindi ? 'पीडीएफ काम (PDF Utilities)' : 'PDF & Documents',
      color: 'from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400',
      tasks: [
        { label: isHindi ? 'पीडीएफ फाइल का साइज छोटा करें' : 'Make PDF smaller in size', slug: 'pdf-compress' },
        { label: isHindi ? 'कई पीडीएफ फाइलों को एक साथ जोड़ें' : 'Combine multiple PDFs into one', slug: 'pdf-merge' },
        { label: isHindi ? 'पीडीएफ से कुछ पेज अलग करें' : 'Extract pages from any PDF', slug: 'pdf-split' },
        { label: isHindi ? 'फोटो से पीडीएफ दस्तावेज बनाएं' : 'Convert photo/images to PDF', slug: 'images-to-pdf' },
      ]
    },
    {
      icon: ImageIcon,
      title: isHindi ? 'इमेज व फोटो काम' : 'Photos & Images',
      color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400',
      tasks: [
        { label: isHindi ? 'फोटो का केबी (KB) साइज घटाएं' : 'Reduce photo KB file size', slug: 'image-compressor' },
        { label: isHindi ? 'फोटो की चौड़ाई-ऊंचाई बदलें' : 'Resize picture pixel dimensions', slug: 'image-resizer' },
        { label: isHindi ? 'फोटो फॉर्मेट बदलें (JPG ⇆ WebP)' : 'Convert JPG to PNG or WebP', slug: 'image-converter' },
        { label: isHindi ? 'फोटो को चौकोर या फ्री क्रॉप करें' : 'Crop picture to square or 16:9', slug: 'image-crop' },
      ]
    },
    {
      icon: Calculator,
      title: isHindi ? 'हिसाब-किताब व कैलकुलेटर' : 'Finance & Calculators',
      color: 'from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-500',
      tasks: [
        { label: isHindi ? 'लोन की मासिक किस्त (EMI) निकालें' : 'Calculate home/car loan EMI', slug: 'emi-calculator' },
        { label: isHindi ? 'बिल का जीएसटी (GST) टैक्स निकालें' : 'Add/Remove GST tax from bill', slug: 'gst-calculator' },
        { label: isHindi ? 'बीघा, गुंठा को एकड़ में बदलें' : 'Convert Bigha, Guntha to Acre', slug: 'unit-converter' },
        { label: isHindi ? 'अपनी सटीक उम्र व जन्मदिन निकालें' : 'Calculate exact age & countdown', slug: 'age-calculator' },
      ]
    },
    {
      icon: QrCode,
      title: isHindi ? 'डिजिटल एवं सुरक्षा टूल्स' : 'Digital & Security',
      color: 'from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400',
      tasks: [
        { label: isHindi ? 'दुकान का यूपीआई भुगतान क्यूआर बनाएं' : 'Make UPI payment QR code', slug: 'qr-generator' },
        { label: isHindi ? 'वाई-फाई पासवर्ड का क्यूआर बनाएं' : 'Create Wi-Fi QR password code', slug: 'qr-generator' },
        { label: isHindi ? 'मजबूत और सुरक्षित पासवर्ड बनाएं' : 'Generate uncrackable password', slug: 'password-generator' },
        { label: isHindi ? 'कैमरे से क्यूआर कोड स्कैन करें' : 'Scan QR code from photo/camera', slug: 'qr-scanner' },
      ]
    }
  ];

  // Quick popular search triggers
  const POPULAR_SEARCHES = [
    { label: isHindi ? 'मर्ज पीडीएफ' : 'Merge PDF', slug: 'pdf-merge' },
    { label: isHindi ? 'कंप्रेस पीडीएफ' : 'Compress PDF', slug: 'pdf-compress' },
    { label: isHindi ? 'लोन ईएमआई' : 'Loan EMI', slug: 'emi-calculator' },
    { label: isHindi ? 'जीएसटी बिल' : 'GST Bill Tax', slug: 'gst-calculator' },
    { label: isHindi ? 'क्यूआर कोड बनाएं' : 'UPI QR Generator', slug: 'qr-generator' },
    { label: isHindi ? 'वर्ड काउंटर' : 'Count Words', slug: 'word-counter' },
    { label: isHindi ? 'फोटो रिसाइज' : 'Photo Resize', slug: 'image-resizer' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 select-none" ref={containerRef}>
      
      {/* Search Input and Autocomplete Dropdown */}
      <div className="relative">
        
        {/* Task Input Frame */}
        <div className={`flex items-center gap-3.5 px-4.5 py-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-300 shadow-sm ${
          isFocused 
            ? 'border-blue-500 ring-4 ring-blue-500/10 dark:ring-blue-500/20 shadow-md' 
            : 'border-slate-200 dark:border-white/10 hover:border-blue-400/60 dark:hover:border-white/20'
        }`}>
          <Search className={`w-5.5 h-5.5 transition-colors ${isFocused ? 'text-blue-500' : 'text-slate-400'}`} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={isHindi ? 'आपको क्या काम करना है? जैसे: "pdf small karna hai", "emi calculate"...' : 'What do you want to do? e.g. "make pdf smaller", "calculate loan emi", "make upi qr"...'}
            className="w-full bg-transparent text-sm sm:text-base font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-white/5 px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-950/40">
            100% PRIVATE
          </span>
        </div>

        {/* Dynamic Search Autocomplete Dropdown */}
        <AnimatePresence>
          {isFocused && (
            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden z-40 max-h-[420px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
              
              {/* If Query Is Empty: Show Recent and Popular */}
              {!query.trim() ? (
                <div className="p-4.5 space-y-4">
                  
                  {/* Recently Used Tools */}
                  {recentTools.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{isHindi ? 'हाल ही में किए गए कार्य' : 'Recently Done Tasks'}</span>
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {recentTools.map((tool) => (
                          <button
                            key={tool.id}
                            onClick={() => handleLaunchTool(tool)}
                            className="text-left p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-blue-500/10 dark:hover:bg-blue-500/10 border border-slate-200/60 dark:border-white/5 transition-all flex items-center justify-between gap-2 cursor-pointer group"
                          >
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                              {isHindi && tool.nameHi ? tool.nameHi : tool.name}
                            </span>
                            <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide shrink-0">
                              {tool.categoryLabel}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Searches */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{isHindi ? 'अक्सर की जाने वाली खोजें' : 'Frequent Task Keywords'}</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SEARCHES.map((search) => (
                        <button
                          key={search.slug}
                          onClick={() => {
                            const target = TOOLS_REGISTRY.find(t => t.slug === search.slug);
                            if (target) handleLaunchTool(target);
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-white/5 hover:bg-blue-500/15 hover:text-blue-600 dark:hover:text-blue-400 transition-colors border border-slate-200/40 dark:border-white/5 cursor-pointer"
                        >
                          {search.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Privacy Tip Footer */}
                  <div className="pt-3 border-t border-slate-100 dark:border-white/5 text-[10px] text-slate-500 dark:text-slate-400 text-center font-medium">
                    {isHindi ? 'सभी खोजें आपके ब्राउज़र में सुरक्षित हैं — कोई डेटा सर्वर पर नहीं भेजा जाता है।' : 'All matching is fully on-device — no search term query leaves your computer or phone.'}
                  </div>

                </div>
              ) : (
                
                /* If Query Exists: Show Filtered Autocomplete Results */
                <div className="p-3 space-y-1">
                  <div className="px-2.5 py-1 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    {searchResults.length} {isHindi ? 'उपयुक्त टूल्स मिले' : 'Matching Tools Found'}
                  </div>

                  {searchResults.length > 0 ? (
                    searchResults.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => handleLaunchTool(tool)}
                        className="w-full text-left p-3 rounded-xl hover:bg-blue-500/10 dark:hover:bg-white/5 transition-all flex items-center justify-between gap-3 group cursor-pointer border border-transparent hover:border-slate-200/60 dark:hover:border-white/10"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {isHindi && tool.nameHi ? tool.nameHi : tool.name}
                            </span>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-white/5">
                              {isHindi && tool.categoryLabelHi ? tool.categoryLabelHi : tool.categoryLabel}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">
                            {isHindi && tool.descriptionHi ? tool.descriptionHi : tool.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 font-bold text-xs text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform shrink-0">
                          <span>{tool.cta ? (isHindi ? tool.cta : tool.cta) : (isHindi ? 'शुरू करें' : 'Launch')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-6 text-center text-slate-500 dark:text-slate-400 space-y-2">
                      <ShieldAlert className="w-8 h-8 mx-auto text-amber-500" />
                      <p className="text-xs font-bold">{isHindi ? 'कोई मिलान नहीं मिला' : 'No tools matched your exact description'}</p>
                      <p className="text-[11px] text-slate-400">{isHindi ? 'कृपया आसान शब्दों में टाइप करें या नीचे सूचीबद्ध मुख्य कार्यों को देखें।' : 'Try using simpler keywords or look at our task list below.'}</p>
                    </div>
                  )}

                </div>
              )}

            </div>
          )}
        </AnimatePresence>

      </div>

      {/* Guided Bento Grid: Common User Intent Flows */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{isHindi ? 'मैं चाहता हूँ (I want to...)' : 'Task-First Discovery — I want to:'}</span>
          </h3>
          <span className="text-[10px] text-slate-400 font-bold">{isHindi ? 'तुरंत शुरू करें (क्लिक करें)' : 'Instant One-Click Launch'}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GUIDED_TASKS.map((group, idx) => (
            <div 
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col justify-between space-y-4"
            >
              {/* Category Header */}
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${group.color}`}>
                  <group.icon className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {group.title}
                </h4>
              </div>

              {/* Action Intent Task Rows */}
              <div className="space-y-2">
                {group.tasks.map((task, taskIdx) => (
                  <button
                    key={taskIdx}
                    onClick={() => {
                      const tool = TOOLS_REGISTRY.find(t => t.slug === task.slug);
                      if (tool) handleLaunchTool(tool);
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-blue-500/10 dark:hover:bg-blue-500/10 border border-slate-200/60 dark:border-white/5 transition-all flex items-center gap-2 group cursor-pointer"
                  >
                    <CornerDownRight className="w-3.5 h-3.5 text-blue-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                      {task.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
