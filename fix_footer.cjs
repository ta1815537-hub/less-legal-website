const fs = require('fs');
let file = fs.readFileSync('src/components/Footer.tsx', 'utf8');

// Put overflow-hidden back
file = file.replace(
  /<footer className="bg-slate-50 dark:bg-\[#080808\] text-slate-600 dark:text-\[#B8B3AF\] pt-16 pb-12 border-t border-slate-200 dark:border-white\/10 relative mt-16 transition-colors duration-300">/g,
  '<footer className="bg-slate-50 dark:bg-[#080808] text-slate-600 dark:text-[#B8B3AF] pt-16 pb-12 border-t border-slate-200 dark:border-white/10 relative overflow-hidden mt-16 transition-colors duration-300">'
);

// Remove the overscroll blocker div
file = file.replace(
  /\s*\{\/\* Overscroll blocker to hide fixed backgrounds when bouncing at the bottom \*\/\}\s*<div className="absolute top-full left-0 right-0 h-\[100vh\] bg-slate-50 dark:bg-\\[#080808\\] pointer-events-none" \/>/g,
  ''
);

fs.writeFileSync('src/components/Footer.tsx', file, 'utf8');
