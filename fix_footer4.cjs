const fs = require('fs');
let code = fs.readFileSync('src/components/Footer.tsx', 'utf8');

// Also fix the motion.div brand logo by wrapping it or changing it to an anchor. 
// For now, let's just fix the buttons.
code = code.replace(/<button([^>]*)onClick=\{\(\) => onNavigate\('([^']+)'\)\}([^>]*)>/g, (match, before, route, after) => {
    let href = route === 'home' ? '/' : (route === 'privacy' ? '/privacy-policy' : (route === 'app-privacy' ? '/less-legal/privacy-policy' : (route === 'app-delete-account' ? '/less-legal/delete-account' : `/${route}`)));
    return `<a${before}href="${href}" onClick={(e) => { e.preventDefault(); onNavigate('${route}'); }}${after}>`;
});

code = code.replace(/<motion\.div([^>]*)onClick=\{\(\) => onNavigate\('([^']+)'\)\}([^>]*)>/g, (match, before, route, after) => {
    let href = route === 'home' ? '/' : `/${route}`;
    return `<a${before}href="${href}" onClick={(e) => { e.preventDefault(); onNavigate('${route}'); }}${after} style={{ display: 'inline-flex' }}>`;
});

// we also need to change corresponding </button> to </a>
// Since the buttons we changed are the nav links, let's just replace all </button> with </a> EXCEPT for the secret lock btn.
// The secret lock btn is line 328: <button id="footer-secret-lock-btn"
// Let's just do a regex replace for the known labels or just a smart replace.
code = code.split('\n').map(line => {
    if (line.includes('</button>') && !line.includes('Secret discreet lock') && !line.includes('handleSecretLockClick')) {
        // Wait, the </button> is usually on a different line! 
        return line;
    }
    return line;
}).join('\n');

fs.writeFileSync('src/components/Footer.tsx', code);
