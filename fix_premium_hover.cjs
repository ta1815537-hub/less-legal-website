const fs = require('fs');
let content = fs.readFileSync('src/pages/PremiumPage.tsx', 'utf8');

content = content.replace(
  /<div className="glass-panel shine-sweep-overlay/g,
  '<motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="glass-panel shine-sweep-overlay'
);
content = content.replace(
  /<div className="glass-panel-crimson glow-crimson-gold shine-sweep-overlay/g,
  '<motion.div whileHover={{ y: -10, scale: 1.03 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="glass-panel-crimson glow-crimson-gold shine-sweep-overlay'
);

// Close tags properly
content = content.replace(
  /<\/div>\n          <\/ScrollReveal>/g,
  '</motion.div>\n          </ScrollReveal>'
);

fs.writeFileSync('src/pages/PremiumPage.tsx', content);
