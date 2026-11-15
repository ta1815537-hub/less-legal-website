import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { Mail, Youtube, Instagram, Facebook, Globe, MessageCircle } from 'lucide-react';
import { LTLogo } from './LTLogo';
import { useLanguage } from '../context/LanguageContext';
import { adminStorage, SocialChannelLink, DEFAULT_SOCIAL_CHANNELS } from '../utils/adminStorage';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [socialLinks, setSocialLinks] = useState<SocialChannelLink[]>(DEFAULT_SOCIAL_CHANNELS);

  useEffect(() => {
    adminStorage.fetchSocialChannelsFromCloud().catch(() => {});
    const unsub = adminStorage.subscribeToSocialChannels((channels) => {
      if (channels && channels.length > 0) {
        setSocialLinks(channels);
      }
    });
    return () => unsub();
  }, []);

  const getChannelUrl = (platform: SocialChannelLink['platform'], fallback: string) => {
    const found = socialLinks.find(c => c.platform === platform && c.isActive !== false && c.url?.trim());
    return found ? found.url : fallback;
  };

  const facebookUrl = getChannelUrl('facebook', 'https://facebook.com/lesscreation');
  const instagramUrl = getChannelUrl('instagram', 'https://instagram.com/lesscreation');
  const youtubeUrl = getChannelUrl('youtube', 'https://youtube.com/@lesscreation');
  const twitterUrl = getChannelUrl('twitter', 'https://x.com/lesscreation');

  return (
    <footer className="bg-[#070B12] text-stone-400 border-t border-white/10 pb-10 pt-10 sm:pt-14 w-full mt-auto shrink-0 select-none relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Brand Row (Logo + Name only, no subtitle text) */}
        <div className="pb-8 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <LTLogo className="w-9 h-9 shrink-0" />
            <div className="text-lg font-bold text-white tracking-tight leading-none">
              Less Creation
            </div>
          </div>
        </div>

        {/* Directory Links Grid: 4 Columns */}
        <div className="py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
          
          {/* Utilities */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>{isHindi ? 'उत्पाद व टूल्स' : 'Utilities'}</span>
            </h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button onClick={() => onNavigate('tools')} className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left">
                  {isHindi ? 'संपूर्ण 29 टूल्स डायरेक्टरी' : 'All 29+ Local Tools'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('premium')} className="text-stone-400 hover:text-[#C9A24B] transition-colors cursor-pointer text-left font-bold">
                  {isHindi ? 'लाइफटाइम पास (₹99)' : 'Lifetime Pass (₹99)'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('download')} className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left">
                  {isHindi ? 'एंड्रॉयड ऐप डाउनलोड' : 'Android App Download'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left">
                  {isHindi ? 'हमारे बारे में' : 'About Less Creation'}
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24B]" />
              <span>{isHindi ? 'विधिक संसाधन' : 'Resources'}</span>
            </h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button onClick={() => onNavigate('articles')} className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left">
                  {isHindi ? 'लेख व साइबर सुरक्षा गाइड' : 'Cyber Safety Guides'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('founder')} className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left">
                  {isHindi ? 'संस्थापक विवरण' : 'Founder Dossier'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left">
                  {isHindi ? 'सहायता और संपर्क' : 'Contact & Support'}
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Policies */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              {isHindi ? 'कानूनी नीतियां' : 'Legal Policies'}
            </h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button onClick={() => onNavigate('privacy')} className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left">
                  {isHindi ? 'गोपनीयता नीति' : 'Website Privacy Policy'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left">
                  {isHindi ? 'सेवा की शर्तें' : 'Terms of Service'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('refund')} className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left">
                  {isHindi ? 'रिफंड व रद्दीकरण' : 'Refund Policy'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('disclaimer')} className="text-stone-400 hover:text-white transition-colors cursor-pointer text-left">
                  {isHindi ? 'विधिक अस्वीकरण' : 'Legal Disclaimer'}
                </button>
              </li>
            </ul>
          </div>

          {/* Connect (Facebook, Instagram, Email, YouTube, X) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              {isHindi ? 'संपर्क व सोशल' : 'Connect'}
            </h3>
            <div className="flex flex-wrap gap-2 pt-1">
              <a 
                href={facebookUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 text-stone-300 hover:text-red-400 border border-white/10 flex items-center justify-center transition-all cursor-pointer"
                title="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>

              <a 
                href={instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 text-stone-300 hover:text-red-400 border border-white/10 flex items-center justify-center transition-all cursor-pointer"
                title="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>

              <a 
                href="mailto:support@lesscreation.com" 
                aria-label="Email"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 text-stone-300 hover:text-red-400 border border-white/10 flex items-center justify-center transition-all cursor-pointer"
                title="Email Support"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>

              <a 
                href={youtubeUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 text-stone-300 hover:text-red-400 border border-white/10 flex items-center justify-center transition-all cursor-pointer"
                title="YouTube"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>

              <a 
                href={twitterUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="X (Twitter)"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 text-stone-300 hover:text-red-400 border border-white/10 flex items-center justify-center transition-all cursor-pointer"
                title="X (Twitter)"
              >
                <span className="text-xs font-bold leading-none">𝕏</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Support Bar (Admin Lock moved discreetly inside Top 3-Line Menu) */}
        <div className="pt-6 pb-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px]">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <a
              href="mailto:support@lesscreation.com"
              className="inline-flex items-center px-2.5 py-1 rounded bg-red-500/5 hover:bg-red-500/10 border border-red-500/15 text-red-400 font-mono text-[10px] font-semibold transition-all cursor-pointer whitespace-nowrap"
              title="Support"
            >
              <span className="uppercase tracking-tight">support@lesscreation.com</span>
            </a>

            <span className="text-stone-500 font-medium whitespace-nowrap">
              © 2026 Less Creation. All rights reserved.
            </span>
          </div>

          <span className="text-stone-500 font-mono text-[10px] whitespace-nowrap">
            {isHindi ? 'विधिक जागरूकता एवं ऑन-डिवाइस गोपनीयता' : 'Legal Awareness & On-Device Privacy'}
          </span>
        </div>

      </div>
    </footer>
  );
};
