import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, ChevronRight, List, X, Clock, Calendar, 
  ArrowLeft, Share2, Copy, Check, ThumbsUp, ThumbsDown, Tag, PenTool,
  AlertCircle, Bookmark, ArrowUp, Info, HelpCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getDirectCloudImageUrl } from '../utils/adminStorage';

export interface ContentBlock {
  type: 'h1' | 'h2' | 'h3' | 'paragraph' | 'quote' | 'bullet-list' | 'numbered-list' | 'image' | 'divider' | 'callout';
  text: string;
  id?: string;
  listItems?: string[];
  imageUrl?: string;
  imageCaption?: string;
}

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

// -------------------------------------------------------------
// Reliable Markdown and Structured Content Parser
// -------------------------------------------------------------
export const parseMarkdown = (content: string): ContentBlock[] => {
  if (!content) return [];
  
  const normalized = content.replace(/\r\n/g, '\n');
  const rawBlocks = normalized.split(/\n\s*\n+/);
  
  const blocks: ContentBlock[] = [];
  let h2Count = 0;
  let h3Count = 0;
  
  rawBlocks.forEach((block) => {
    const trimmed = block.trim();
    if (!trimmed) return;
    
    // 1. Heading 1
    if (trimmed.startsWith('# ')) {
      blocks.push({
        type: 'h1',
        text: trimmed.replace(/^#\s+/, '')
      });
      return;
    }
    
    // 2. Heading 2
    if (trimmed.startsWith('## ')) {
      h2Count++;
      h3Count = 0;
      const text = trimmed.replace(/^##\s+/, '');
      const id = `sec-${h2Count}`;
      blocks.push({
        type: 'h2',
        text,
        id
      });
      return;
    }
    
    // 3. Heading 3
    if (trimmed.startsWith('### ')) {
      h3Count++;
      const text = trimmed.replace(/^###\s+/, '');
      const id = `sec-${h2Count}-${h3Count}`;
      blocks.push({
        type: 'h3',
        text,
        id
      });
      return;
    }
    
    // 4. Divider
    if (trimmed === '---') {
      blocks.push({
        type: 'divider',
        text: ''
      });
      return;
    }
    
    // 5. Image Markdown: ![caption](url)
    const imageMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imageMatch) {
      blocks.push({
        type: 'image',
        text: '',
        imageUrl: imageMatch[2],
        imageCaption: imageMatch[1]
      });
      return;
    }
    
    // 6. Blockquote or Callout
    if (trimmed.startsWith('> ')) {
      const quoteLines = trimmed.split('\n').map(l => l.trim().replace(/^>\s*/, ''));
      const quoteText = quoteLines.join('\n');
      
      // Determine if callout / alert block
      const lower = quoteText.toLowerCase();
      const isCallout = quoteText.startsWith('**') || quoteText.startsWith('Note:') || quoteText.startsWith('महत्वपूर्ण:') || quoteText.startsWith('⚠️') || lower.includes('alert') || lower.includes('warning') || lower.includes('info:');
      
      blocks.push({
        type: isCallout ? 'callout' : 'quote',
        text: quoteText
      });
      return;
    }
    
    // 7. Bullet List
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const lines = trimmed.split('\n').map(l => l.trim());
      const listItems = lines.map(line => line.replace(/^[-*]\s+/, ''));
      blocks.push({
        type: 'bullet-list',
        text: '',
        listItems
      });
      return;
    }
    
    // 8. Numbered List
    if (/^\d+\.\s+/.test(trimmed)) {
      const lines = trimmed.split('\n').map(l => l.trim());
      const listItems = lines.map(line => line.replace(/^\d+\.\s+/, ''));
      blocks.push({
        type: 'numbered-list',
        text: '',
        listItems
      });
      return;
    }
    
    // 9. Standard Paragraph
    blocks.push({
      type: 'paragraph',
      text: trimmed
    });
  });
  
  return blocks;
};

// -------------------------------------------------------------
// Generates Table of Contents dynamically from Heading blocks
// -------------------------------------------------------------
export const generateToc = (blocks: ContentBlock[]): TocItem[] => {
  const toc: TocItem[] = [];
  blocks.forEach((block) => {
    if (block.type === 'h2' && block.id) {
      toc.push({
        id: block.id,
        text: block.text,
        level: 2
      });
    } else if (block.type === 'h3' && block.id) {
      toc.push({
        id: block.id,
        text: block.text,
        level: 3
      });
    }
  });
  return toc;
};

// -------------------------------------------------------------
// Format Inline Bold, Italics, and Links safely
// -------------------------------------------------------------
export const formatInlineMarkdown = (text: string): string => {
  if (!text) return '';
  let html = text;
  
  // Replace links: [label](url) -> <a href="..." target="_blank" rel="noopener noreferrer">label</a>
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, (match, label, url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 font-bold underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors">${label}</a>`;
  });
  
  // Replace bold: **text** -> <strong>text</strong>
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-slate-950 dark:text-white">$1</strong>');
  
  // Replace italic: *text* -> <em>text</em>
  html = html.replace(/\*(.*?)\*/g, '<em class="italic font-medium text-slate-800 dark:text-slate-200">$1</em>');
  
  return html;
};

interface ArticleRendererProps {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  publishedAt?: string;
  createdAt?: string;
  readingTime?: string;
  featuredImage?: string;
  tags?: string[];
  isPreviewMode?: boolean;
  onBack?: () => void;
  feedbackSystem?: {
    usefulYesCount: number;
    usefulNoCount: number;
    userVote: 'yes' | 'no' | null;
    feedbackSubmitted: boolean;
    onVote: (isUseful: boolean) => void;
  };
  socialShareSystem?: {
    currentUrl: string;
    onCopyLink: () => void;
    copiedShare: boolean;
    onShareWhatsApp: () => void;
    onShareTelegram: () => void;
    onShareX: () => void;
  };
  relatedArticlesComponent?: React.ReactNode;
}

export const ArticleRenderer: React.FC<ArticleRendererProps> = ({
  title,
  excerpt,
  content,
  category,
  publishedAt,
  createdAt,
  readingTime = '5 min read',
  featuredImage,
  tags = [],
  isPreviewMode = false,
  onBack,
  feedbackSystem,
  socialShareSystem,
  relatedArticlesComponent
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  
  const blocks = React.useMemo(() => parseMarkdown(content), [content]);
  const toc = React.useMemo(() => generateToc(blocks), [blocks]);
  
  const [activeSection, setActiveSection] = useState<string>('');
  const [mobileTocOpen, setMobileTocOpen] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Scroll details & Progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for active Table of Contents item
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    const headingElements = blocks
      .filter(b => (b.type === 'h2' || b.type === 'h3') && b.id)
      .map(b => document.getElementById(b.id!))
      .filter(Boolean) as HTMLElement[];

    if (headingElements.length === 0) return;

    observerRef.current = new IntersectionObserver((entries) => {
      // Find elements intersecting near the top of the viewport
      const visible = entries.filter(e => e.isIntersecting);
      if (visible.length > 0) {
        // Pick the first visible heading from top
        const firstVisible = visible.reduce((acc, curr) => {
          return curr.boundingClientRect.top < acc.boundingClientRect.top ? curr : acc;
        });
        setActiveSection(firstVisible.target.id);
      }
    }, {
      rootMargin: '-80px 0px -60% 0px', // focused near the top 40% of viewport
      threshold: 0
    });

    headingElements.forEach(el => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [blocks]);

  // Smooth scroll helper
  const handleScrollToSection = (id: string) => {
    setMobileTocOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const navbarOffset = 90; // offset for sticky header
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Fallback update active TOC status in case observer delay
      setActiveSection(id);
    }
  };

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const formatArticleDate = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="w-full text-slate-900 dark:text-[#EAE5E0] transition-colors duration-200 relative pb-16">
      
      {/* 1. Light Premium Sticky Top Scroll Progress Indicator */}
      <div className="fixed top-[60px] sm:top-[72px] left-0 w-full h-[3px] bg-slate-200/50 dark:bg-white/10 z-40 pointer-events-none">
        <div 
          className="h-full bg-blue-600 dark:bg-blue-400 rounded-r-full transition-all duration-150 ease-out" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Back to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleScrollTop}
            className="fixed bottom-6 right-6 p-3 rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 transition-all z-40 cursor-pointer active:scale-95"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 2. Main Article Structural Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Back navigation & Metadata row */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-white/5">
          {onBack ? (
            <button
              onClick={onBack}
              className="px-3.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-950 inline-flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isHindi ? "सभी लेख" : "Back to Articles"}</span>
            </button>
          ) : <div />}

          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              {readingTime}
            </span>
            {isPreviewMode && (
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold uppercase tracking-widest text-[10px]">
                Preview Mode
              </span>
            )}
          </div>
        </div>

        {/* 3. PREMIUM EDITORIAL TITLE BLOCK */}
        <header className="py-8 space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="px-3 py-1 rounded bg-blue-600/10 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 font-extrabold tracking-wider uppercase text-[10.5px]">
              {category}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="font-mono text-slate-600 dark:text-slate-300 font-bold flex items-center gap-1 text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              {formatArticleDate(publishedAt || createdAt || new Date().toISOString())}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-tight sm:leading-snug">
            {title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-[#B3AEAA] leading-relaxed max-w-3xl border-l-4 border-blue-600 pl-4 py-1 font-medium italic">
            {excerpt}
          </p>

          {/* Premium attribution bar */}
          <div className="flex items-center justify-between pt-4 pb-2 border-b border-slate-100 dark:border-white/5 max-w-3xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center overflow-hidden shrink-0 pointer-events-none select-none">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <span className="block font-black text-slate-950 dark:text-white text-sm flex items-center gap-1.5">
                  <span>By Less Team</span>
                  <PenTool className="w-3.5 h-3.5 text-blue-500" />
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                  Editorial & Research Staff • Less Creation
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Hero image styled professionally */}
        {featuredImage && (
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 aspect-video w-full max-w-5xl bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center shadow-md mb-8">
            <img 
              src={getDirectCloudImageUrl(featuredImage)} 
              alt={title} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain bg-slate-50 dark:bg-[#070b13]" 
              loading="eager"
            />
          </div>
        )}

        {/* 4. MOBILE / COMPACT TABLE OF CONTENTS (Near the top of article content) */}
        {toc.length > 0 && (
          <div className="block lg:hidden my-6">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 shadow-inner">
              <button
                onClick={() => setMobileTocOpen(!mobileTocOpen)}
                className="w-full flex items-center justify-between font-black text-xs sm:text-sm text-slate-900 dark:text-white tracking-wide uppercase cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <List className="w-4 h-4 text-blue-500" />
                  <span>{isHindi ? "विषय सूची" : "Table of Contents"}</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300 font-mono font-black">
                  {toc.filter(t => t.level === 2).length} {isHindi ? "मुख्य खंड" : "Sections"}
                </span>
              </button>

              <AnimatePresence>
                {mobileTocOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden mt-3 pt-3 border-t border-slate-200 dark:border-white/10"
                  >
                    <nav className="space-y-1 max-h-[350px] overflow-y-auto pr-1">
                      {toc.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleScrollToSection(item.id)}
                          className={`w-full text-left py-2 px-2.5 rounded-lg text-xs transition-colors flex items-start gap-2 cursor-pointer ${
                            item.level === 3 ? 'pl-6 border-l border-slate-200 dark:border-slate-800' : 'font-semibold'
                          } ${
                            activeSection === item.id
                              ? 'bg-blue-600/10 text-blue-700 dark:text-blue-300 font-bold border-l-2 border-blue-600'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                          }`}
                        >
                          <ChevronRight className={`w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5 ${item.level === 3 ? 'hidden' : ''}`} />
                          <span className="leading-tight">{item.text}</span>
                        </button>
                      ))}
                    </nav>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* 5. SPLIT LAYOUT (Desktop Sticky Sidebar TOC + Left Reading Column) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-4 items-start relative">
          
          {/* Main Reading Column (span 8 of 12) */}
          <main className="lg:col-span-8 space-y-6 max-w-3xl leading-relaxed">
            
            <article className="space-y-6 text-slate-800 dark:text-[#E2DDD9] prose prose-slate dark:prose-invert max-w-none">
              {blocks.map((block, idx) => {
                const formattedText = block.text;

                switch (block.type) {
                  case 'h1':
                    return (
                      <h1 key={idx} className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white pt-6 pb-2 tracking-tight">
                        {formattedText}
                      </h1>
                    );

                  case 'h2':
                    return (
                      <h2 
                        id={block.id} 
                        key={idx} 
                        className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white pt-8 pb-2 tracking-tight border-b border-slate-100 dark:border-white/5 scroll-mt-24 flex items-center gap-2 group"
                      >
                        <span className="text-blue-600 dark:text-blue-400 font-bold mr-1 font-mono text-lg select-none">#</span>
                        <span>{formattedText}</span>
                      </h2>
                    );

                  case 'h3':
                    return (
                      <h3 
                        id={block.id} 
                        key={idx} 
                        className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-[#F3EFEA] pt-6 pb-1 tracking-tight scroll-mt-24 flex items-center gap-1.5"
                      >
                        <span className="text-slate-400 dark:text-slate-600 font-bold font-mono text-sm select-none">##</span>
                        <span>{formattedText}</span>
                      </h3>
                    );

                  case 'quote':
                    return (
                      <blockquote key={idx} className="my-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/30 border-l-4 border-slate-400 dark:border-slate-600 text-slate-700 dark:text-[#D5CFC9] text-base italic leading-relaxed shadow-xs">
                        <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(formattedText) }} />
                      </blockquote>
                    );

                  case 'callout':
                    return (
                      <div key={idx} className="my-6 p-5 rounded-2xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 dark:border-blue-500/20 text-slate-800 dark:text-[#D1E1FA] leading-relaxed shadow-inner flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <div className="text-sm sm:text-base space-y-1">
                          <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(formattedText) }} />
                        </div>
                      </div>
                    );

                  case 'divider':
                    return <hr key={idx} className="my-8 border-slate-100 dark:border-white/5" />;

                  case 'image':
                    return (
                      <figure key={idx} className="my-6 space-y-2">
                        <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-slate-900 flex items-center justify-center max-h-[500px]">
                          <img 
                            src={getDirectCloudImageUrl(block.imageUrl)} 
                            alt={block.imageCaption || "Article Graphic"} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain max-h-[500px] bg-slate-50 dark:bg-slate-950"
                            loading="lazy"
                          />
                        </div>
                        {block.imageCaption && (
                          <figcaption className="text-center text-xs text-slate-500 dark:text-slate-400 italic">
                            {block.imageCaption}
                          </figcaption>
                        )}
                      </figure>
                    );

                  case 'bullet-list':
                    return (
                      <ul key={idx} className="my-5 pl-5 list-disc space-y-2 text-slate-800 dark:text-[#DDD9D4] text-base sm:text-[17px] leading-relaxed">
                        {block.listItems?.map((item, i) => (
                          <li key={i} className="pl-1 text-slate-800 dark:text-[#D9D3CD]">
                            <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }} />
                          </li>
                        ))}
                      </ul>
                    );

                  case 'numbered-list':
                    return (
                      <ol key={idx} className="my-5 pl-5 list-decimal space-y-2 text-slate-800 dark:text-[#DDD9D4] text-base sm:text-[17px] leading-relaxed">
                        {block.listItems?.map((item, i) => (
                          <li key={i} className="pl-1 text-slate-800 dark:text-[#D9D3CD]">
                            <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }} />
                          </li>
                        ))}
                      </ol>
                    );

                  case 'paragraph':
                  default:
                    return (
                      <p key={idx} className="text-slate-800 dark:text-[#DED9D4] text-base sm:text-[18px] leading-relaxed sm:leading-[1.8] tracking-normal font-normal">
                        <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(formattedText) }} />
                      </p>
                    );
                }
              })}
            </article>

            {/* Article Tags section */}
            {tags.length > 0 && (
              <div className="pt-8 mt-8 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center gap-2">
                <span className="text-xs font-black text-slate-400 flex items-center gap-1 mr-1 uppercase tracking-wider">
                  <Tag className="w-3.5 h-3.5 text-blue-500" />
                  <span>Tags:</span>
                </span>
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* 6. SOCIAL FEEDBACK & SHARING PANEL */}
            {(feedbackSystem || socialShareSystem) && (
              <div className="py-6 my-8 border-y border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-visible relative">
                
                {feedbackSystem && (
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isHindi ? "क्या यह लेख उपयोगी रहा?" : "Was this article useful?"}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => feedbackSystem.onVote(true)}
                        disabled={feedbackSystem.feedbackSubmitted}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border shrink-0 cursor-pointer ${
                          feedbackSystem.feedbackSubmitted
                            ? feedbackSystem.userVote === 'yes'
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/40 shadow-xs'
                              : 'bg-slate-50 dark:bg-[#111827]/40 text-slate-400 border-slate-200/50 dark:border-slate-800 opacity-60'
                            : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/5 shadow-xs'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{isHindi ? "हाँ" : "Yes"}</span>
                        <span className="px-1.5 py-0.2 text-[10px] rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-black shrink-0">
                          {feedbackSystem.usefulYesCount || 0}
                        </span>
                      </button>

                      <button
                        onClick={() => feedbackSystem.onVote(false)}
                        disabled={feedbackSystem.feedbackSubmitted}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border shrink-0 cursor-pointer ${
                          feedbackSystem.feedbackSubmitted
                            ? feedbackSystem.userVote === 'no'
                              ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/40 shadow-xs'
                              : 'bg-slate-50 dark:bg-[#111827]/40 text-slate-400 border-slate-200/50 dark:border-slate-800 opacity-60'
                            : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/5 shadow-xs'
                        }`}
                      >
                        <ThumbsDown className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{isHindi ? "नहीं" : "No"}</span>
                        <span className="px-1.5 py-0.2 text-[10px] rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono font-black shrink-0">
                          {feedbackSystem.usefulNoCount || 0}
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {socialShareSystem && (
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
                      <Share2 className="w-3.5 h-3.5 text-blue-500" />
                      <span>Share:</span>
                    </span>

                    <button
                      onClick={socialShareSystem.onCopyLink}
                      title="Copy Link"
                      className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                    >
                      {socialShareSystem.copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={socialShareSystem.onShareWhatsApp}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold transition-all cursor-pointer"
                    >
                      WhatsApp
                    </button>

                    <button
                      onClick={socialShareSystem.onShareTelegram}
                      className="px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/20 text-xs font-bold transition-all cursor-pointer"
                    >
                      Telegram
                    </button>

                    <button
                      onClick={socialShareSystem.onShareX}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      X
                    </button>
                  </div>
                )}

              </div>
            )}

            {/* Related Articles Component section */}
            {relatedArticlesComponent && (
              <div className="pt-4">
                {relatedArticlesComponent}
              </div>
            )}

          </main>

          {/* Sticky Table of Contents Sidebar (span 4 of 12) */}
          {toc.length > 0 && (
            <aside className="hidden lg:block lg:col-span-4 sticky top-28 self-start max-h-[75vh] overflow-y-auto pl-6 border-l border-slate-100 dark:border-white/5 pr-1 scrollbar-thin">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-[11px] font-black uppercase tracking-widest">
                  <List className="w-4 h-4 text-blue-500" />
                  <span>{isHindi ? "लेख की अनुक्रमणिका" : "Table of Contents"}</span>
                </div>

                <nav className="space-y-1.5">
                  {toc.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleScrollToSection(item.id)}
                      className={`w-full text-left py-1.5 px-2 rounded-lg text-xs leading-normal transition-all flex items-start gap-1.5 cursor-pointer ${
                        item.level === 3 
                          ? 'pl-5 text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white' 
                          : 'font-bold'
                      } ${
                        activeSection === item.id
                          ? 'bg-blue-600/10 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 font-extrabold border-l-2 border-blue-600 pl-3'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                      }`}
                    >
                      {item.level === 2 && (
                        <ChevronRight className={`w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0 mt-0.5 ${activeSection === item.id ? 'text-blue-500' : ''}`} />
                      )}
                      <span className="line-clamp-2">{item.text}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </aside>
          )}

        </div>

      </div>

    </div>
  );
};
