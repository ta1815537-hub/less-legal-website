import React, { useState } from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG, FeatureItem } from '../config';
import { 
  FileText, BookOpen, Edit3, Share2, Calendar, 
  Calculator, Compass, Layers, MapPin, BookMarked, 
  Scale, GraduationCap, Image, Award, Briefcase, 
  ExternalLink, Search, Check, ShieldCheck, Download
} from 'lucide-react';

interface FeaturesPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'PDF & Files', 'Legal Utilities', 'Calculators & Converters', 'Learning & Reference'];

  // Map icon names to Lucide icons
  const getIcon = (iconName: string) => {
    const props = { className: "w-5 h-5" };
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold">
          <Layers className="w-3.5 h-3.5" />
          <span>Verified Feature Suite</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Everything Inside Less Legal
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Explore all verified tools, utilities, document handlers, and legal references built into the Less Legal Android application.
        </p>
      </div>

      {/* Verified Catalog Notice */}
      <div className="bg-slate-100/90 rounded-xl p-4 border border-slate-200 text-xs text-slate-600 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Verified Scope:</strong> This catalog includes only active, confirmed tools in the current Less Legal Android application.
          </span>
        </div>
        <span className="text-[11px] font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 hidden sm:inline-block">
          {SITE_CONFIG.features.length} Live Features
        </span>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

      </div>

      {/* Features Grid */}
      {filteredFeatures.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feature) => (
            <div
              key={feature.id}
              className="neo-box p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    {getIcon(feature.iconName)}
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                    {feature.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {feature.description}
                </p>
              </div>

              <div>
                <div className="pt-4 border-t border-slate-100 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Key Highlights
                  </span>
                  <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-700">
                    {feature.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="line-clamp-1">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
          <p className="text-sm font-semibold text-slate-700">No features found matching "{searchQuery}".</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="mt-3 text-xs font-bold text-indigo-600 underline"
          >
            Reset filters
          </button>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="p-8 bg-slate-900 text-white rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-xl font-bold">Ready to use these tools on Android?</h2>
          <p className="text-xs text-slate-300">
            Download Less Legal today to access on-device PDF utilities, case diary, and legal tools.
          </p>
        </div>
        <button
          onClick={() => onNavigate('download')}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          <span>Download Android App</span>
        </button>
      </div>

    </div>
  );
};
