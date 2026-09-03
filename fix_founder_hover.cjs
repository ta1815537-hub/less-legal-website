const fs = require('fs');
let content = fs.readFileSync('src/pages/FounderPage.tsx', 'utf8');

content = content.replace(
  /<div className="glass-panel p-6 sm:p-10 lg:p-12/g,
  '<motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 300 }} className="glass-panel p-6 sm:p-10 lg:p-12'
);
content = content.replace(
  /<\/div>\n      <\/ScrollReveal>\n\n      {\/\* Philosophy & Mission \*\//g,
  '</motion.div>\n      </ScrollReveal>\n\n      {/* Philosophy & Mission */'
);

content = content.replace(
  /<div className="glass-panel p-6 sm:p-10 rounded-3xl/g,
  '<motion.div whileHover={{ scale: 1.01, y: -5 }} transition={{ type: "spring", stiffness: 300 }} className="glass-panel p-6 sm:p-10 rounded-3xl'
);
content = content.replace(
  /<\/div>\n      <\/ScrollReveal>\n\n      {\/\* Less Creation Products Ecosystem \*\//g,
  '</motion.div>\n      </ScrollReveal>\n\n      {/* Less Creation Products Ecosystem */'
);

content = content.replace(
  /<div className="p-6 sm:p-10 glass-panel-gradient/g,
  '<motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 300 }} className="p-6 sm:p-10 glass-panel-gradient'
);
content = content.replace(
  /<\/div>\n      <\/ScrollReveal>\n\n      {\/\* Life Path \/ Timeline \*\//g,
  '</motion.div>\n      </ScrollReveal>\n\n      {/* Life Path / Timeline */'
);

fs.writeFileSync('src/pages/FounderPage.tsx', content);
