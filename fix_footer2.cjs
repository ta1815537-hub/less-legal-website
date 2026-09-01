const fs = require('fs');
let file = fs.readFileSync('src/components/Footer.tsx', 'utf8');

file = file.replace(
  'relative mt-16 transition-colors duration-300"',
  'relative overflow-hidden mt-16 transition-colors duration-300"'
);

const overscrollStr = '{/* Overscroll blocker to hide fixed backgrounds when bouncing at the bottom */}\n      <div className="absolute top-full left-0 right-0 h-[100vh] bg-slate-50 dark:bg-[#080808] pointer-events-none" />';

file = file.replace(overscrollStr, '');
// Just in case it's on a single line
file = file.replace(/\{\/\* Overscroll blocker.*?\/>/g, '');

fs.writeFileSync('src/components/Footer.tsx', file, 'utf8');
