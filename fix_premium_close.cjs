const fs = require('fs');
let content = fs.readFileSync('src/pages/PremiumPage.tsx', 'utf8');
content = content.replace(
  '            </motion.div>\n          </div>\n        </ScrollReveal>\n      </div>\n\n      {/* Mandatory PayU / Merchant Verification Compliance Links */}',
  '            </motion.div>\n          </div>\n          </div>\n        </ScrollReveal>\n      </div>\n\n      {/* Mandatory PayU / Merchant Verification Compliance Links */}'
);
fs.writeFileSync('src/pages/PremiumPage.tsx', content);
