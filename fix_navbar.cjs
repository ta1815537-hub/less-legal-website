const fs = require('fs');
let file = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

file = file.replace(
  /\{\/\* Download App Primary Crimson Button \*\/\}([\s\S]*?)onClick=\{\(\) => handleNavClick\('download'\)\}([\s\S]*?)<Download className="w-3\.5 h-3\.5 sm:w-4 sm:h-4 group-hover:translate-y-0\.5 transition-transform duration-200 shrink-0" \/>\s*<span className="whitespace-nowrap">\{t\.nav\.download\}<\/span>/,
  `{/* Useful Features Primary Crimson Button */}
            <motion.button
              id="nav-features-btn"
              onClick={() => handleNavClick('features')}
              whileHover={{ y: -1, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.2, ease: EASING_SPRING }}
              className="relative group overflow-hidden px-2.5 lg:px-3.5 py-1.5 rounded-xl text-[11px] lg:text-sm font-bold btn-crimson flex items-center gap-1 lg:gap-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-y-0.5 transition-transform duration-200 shrink-0" />
              <span className="whitespace-nowrap">{language === 'en' ? 'Useful Features' : 'उपयोगी सुविधाएँ'}</span>`
);

file = file.replace(
  /id="nav-mobile-download-icon"\s*onClick=\{\(\) => handleNavClick\('download'\)\}([\s\S]*?)aria-label="Download App"\s*>\s*<Download className="w-4 h-4" \/>/,
  `id="nav-mobile-features-icon"
              onClick={() => handleNavClick('features')}
              whileTap={{ scale: 0.92 }}
              className="p-2 rounded-xl bg-[#C21F2F]/15 dark:bg-[#C21F2F]/20 text-[#C21F2F] dark:text-[#E03A3E] border border-[#C21F2F]/30 dark:border-[#C21F2F]/40 sm:hidden cursor-pointer shrink-0"
              aria-label="Useful Features"
            >
              <Layers className="w-4 h-4" />`
);

file = file.replace(
  /id="mobile-download-drawer-btn"\s*onClick=\{\(\) => handleNavClick\('download'\)\}([\s\S]*?)<Download className="w-3\.5 h-3\.5 shrink-0" \/>\s*<span className="whitespace-nowrap">\{t\.nav\.download\}<\/span>/,
  `id="mobile-features-drawer-btn"
                  onClick={() => handleNavClick('features')}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white btn-crimson text-center flex items-center justify-center gap-1.5 active:scale-95 transition-transform cursor-pointer whitespace-nowrap"
                >
                  <Layers className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">{language === 'en' ? 'Useful Features' : 'उपयोगी सुविधाएँ'}</span>`
);

fs.writeFileSync('src/components/Navbar.tsx', file, 'utf8');
