const fs = require('fs');
let content = fs.readFileSync('src/pages/PremiumPage.tsx', 'utf8');

content = content.replace(
  '            </div>\n            <motion.div \n              initial={{ scale: 0.9 }}',
  '            </div>\n          </div>\n            <motion.div \n              initial={{ scale: 0.9 }}'
);

fs.writeFileSync('src/pages/PremiumPage.tsx', content);
