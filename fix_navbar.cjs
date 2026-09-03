const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Replace brand button with anchor
code = code.replace(
  /<button\s+id="nav-brand-logo"\s+onClick=\{[^}]+\}\s+className="/,
  `<a \n            id="nav-brand-logo"\n            href="/"\n            onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}\n            className="`
);
code = code.replace(/<\/div>\n\s*<\/button>/, '</div>\n          </a>');

// Replace navLinks buttons with anchors in desktop nav
code = code.replace(
  /<button\s+key=\{item\.route\}\s+id=\{`nav-link-\$\{item\.route\}`\}\s+onClick=\{[^}]+\}/,
  `<a
                  key={item.route}
                  href={\`/\${item.route === 'home' ? '' : item.route}\`}
                  id={\`nav-link-\${item.route}\`}
                  onClick={(e) => { e.preventDefault(); handleNavClick(item.route); }}`
);
code = code.replace(/<\/button>\n\s*\}\)\}/, '</a>\n            ))}');

// Wait, the mobile nav might also have buttons
code = code.replace(
  /<button\s+key=\{item\.route\}\s+onClick=\{[^}]+\}\s+className=\{`block w-full text-left/,
  `<a
                        key={item.route}
                        href={\`/\${item.route === 'home' ? '' : item.route}\`}
                        onClick={(e) => { e.preventDefault(); handleNavClick(item.route); }}
                        className={\`block w-full text-left`
);
// we need to be careful with global replacements. Let's write a safer script.

fs.writeFileSync('src/components/Navbar.tsx', code);
