const fs = require('fs');
let code = fs.readFileSync('src/components/Footer.tsx', 'utf8');

// Replace the motion.div wrapper with an 'a' tag
code = code.replace(
    /<motion\.div\s+whileHover=\{\{ x: 2 \}\}\s+className="flex items-center gap-3 cursor-pointer inline-flex"\s+onClick=\{\(\) => onNavigate\('home'\)\}\s*>/,
    `<a href="/" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="flex items-center gap-3 cursor-pointer inline-flex" style={{ display: 'inline-flex' }}>`
);
code = code.replace(
    /<\/span>\s*<\/div>\s*<\/motion\.div>/,
    `</span>\n              </div>\n            </a>`
);

// Replace button links in columns
const routes = [
    { name: 'home', path: '/' },
    { name: 'about', path: '/about' },
    { name: 'founder', path: '/founder' },
    { name: 'features', path: '/features' },
    { name: 'premium', path: '/premium' },
    { name: 'contact', path: '/contact' },
    { name: 'privacy', path: '/privacy-policy' },
    { name: 'terms', path: '/terms' },
    { name: 'refund', path: '/refund' },
    { name: 'disclaimer', path: '/disclaimer' },
    { name: 'app-privacy', path: '/less-legal/privacy-policy' },
    { name: 'app-delete-account', path: '/less-legal/delete-account' }
];

for (const route of routes) {
    code = code.replace(
        new RegExp(`<button\\s+onClick=\\{\\(\\) => onNavigate\\('${route.name}'\\)\\}\\s+className="([^"]+)"\\s*>`),
        `<a href="${route.path}" onClick={(e) => { e.preventDefault(); onNavigate('${route.name}'); }} className="$1">`
    );
}

// Replace all </button> that follow one of the translation texts with </a>
// Since the structure is:
// <a ...>
//   {t.footer...}
// </button>
// It's easier to just globally replace </button> to </a> for the specific lines.
// Let's just write the output out and do a quick `sed` or replace on known line offsets? No, the line offsets changed.
// Better: Regex to match `<a ... > \s* {t.footer.[a-zA-Z]+} \s* </button>`

code = code.replace(/(<a[^>]+onClick=\{\(e\)[^>]+>[\s\S]*?)<\/button>/g, '$1</a>');

// One more button for disclaimer (line 295):
code = code.replace(
    /<button\s+onClick=\{\(\) => onNavigate\('disclaimer'\)\}\s+className="([^"]+)"\s*>\s*\{t\.footer\.readFullDisclaimer\}\s*<\/button>/,
    `<a href="/disclaimer" onClick={(e) => { e.preventDefault(); onNavigate('disclaimer'); }} className="$1">\n              {t.footer.readFullDisclaimer}\n            </a>`
);

fs.writeFileSync('src/components/Footer.tsx', code);
