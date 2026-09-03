const fs = require('fs');
let content = fs.readFileSync('src/pages/AboutPage.tsx', 'utf8');

content = content.replace(
  /<div className="p-6 sm:p-8 glass-panel-crimson/g,
  '<motion.div whileHover={{ scale: 1.015, y: -5 }} transition={{ type: "spring", stiffness: 300 }} className="p-6 sm:p-8 glass-panel-crimson'
);
content = content.replace(
  /<\/div>\n      <\/section>\n\n      {\/\* The Vision \*\/}/g,
  '</motion.div>\n      </section>\n\n      {/* The Vision */}'
);

content = content.replace(
  /className="p-8 glass-panel-gradient rounded-3xl text-center space-y-4 relative z-10 border border-slate-200 dark:border-white\/15"/g,
  'className="p-8 glass-panel-gradient rounded-3xl text-center space-y-4 relative z-10 border border-slate-200 dark:border-white/15"\n        whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 300 }}'
);

fs.writeFileSync('src/pages/AboutPage.tsx', content);
