const fs = require('fs');

// Update sitemap
let sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');
sitemap = sitemap.replace(/https:\/\/lesscreation\.com\//g, 'https://www.lesscreation.com/');
fs.writeFileSync('public/sitemap.xml', sitemap);

// Update robots.txt
let robots = fs.readFileSync('public/robots.txt', 'utf8');
robots = robots.replace(/https:\/\/lesscreation\.com\//g, 'https://www.lesscreation.com/');
fs.writeFileSync('public/robots.txt', robots);

// Update index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(/https:\/\/lesscreation\.com\//g, 'https://www.lesscreation.com/');
fs.writeFileSync('index.html', indexHtml);

// Update src/App.tsx
let appTsx = fs.readFileSync('src/App.tsx', 'utf8');
appTsx = appTsx.replace(/https:\/\/lesscreation\.com\/\$\{path\}/g, 'https://www.lesscreation.com/${path}');
fs.writeFileSync('src/App.tsx', appTsx);
