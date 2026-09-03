const fs = require('fs');
let code = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');

code = code.replace(
  /<span className="sr-only">Less Legal - <\/span>/,
  '<span className="sr-only">Download Less Legal : All in one app - Less Creation</span>'
);

fs.writeFileSync('src/pages/HomePage.tsx', code);
