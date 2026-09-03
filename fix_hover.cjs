const fs = require('fs');
let content = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');

content = content.replace(
  /<div className="flex items-center justify-center gap-1.5 p-2.5 sm:p-3 rounded-2xl glass-panel border border-slate-200 dark:border-white\/10 whitespace-nowrap badge-one-line">/g,
  '<motion.div whileHover={{ y: -5, scale: 1.05 }} className="flex items-center justify-center gap-1.5 p-2.5 sm:p-3 rounded-2xl glass-panel border border-slate-200 dark:border-white/10 whitespace-nowrap badge-one-line cursor-default">'
);

content = content.replace(
  /<\/span>\n            <\/div>/g,
  '</span>\n            </motion.div>'
);

fs.writeFileSync('src/pages/HomePage.tsx', content);
