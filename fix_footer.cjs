const fs = require('fs');
let content = fs.readFileSync('src/components/Footer.tsx', 'utf8');

content = content.replace(
  /<p className="whitespace-nowrap text-\[clamp\(7px,2\.4vw,12px\)\] text-center md:text-left">/,
  '<p className="whitespace-nowrap text-[clamp(6px,2.2vw,12px)] sm:text-xs tracking-tight text-center md:text-left">'
);

content = content.replace(
  /<p className="text-\[clamp\(9px,2\.8vw,12px\)\] font-bold text-amber-800/,
  '<p className="text-[clamp(8px,2.5vw,12px)] sm:text-xs font-bold text-amber-800'
);

fs.writeFileSync('src/components/Footer.tsx', content);
