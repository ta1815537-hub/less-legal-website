const fs = require('fs');
let content = fs.readFileSync('src/pages/FeaturesPage.tsx', 'utf8');

content = content.replace(
  /<div\n                  key={idx}\n                  className="glass-card p-6 flex flex-col justify-between"/g,
  '<motion.div\n                  key={idx}\n                  whileHover={{ y: -8, scale: 1.02 }}\n                  transition={{ type: "spring", stiffness: 300, damping: 20 }}\n                  className="glass-card p-6 flex flex-col justify-between"'
);

content = content.replace(
  /<\/h4>\n                      <p className="text-sm text-slate-600 dark:text-\[\#B8B3AF\] leading-relaxed">\n                        {f\.desc}\n                      <\/p>\n                    <\/div>\n                  <\/div>\n                <\/div>/g,
  '</h4>\n                      <p className="text-sm text-slate-600 dark:text-[#B8B3AF] leading-relaxed">\n                        {f.desc}\n                      </p>\n                    </div>\n                  </div>\n                </motion.div>'
);

fs.writeFileSync('src/pages/FeaturesPage.tsx', content);
