const fs = require('fs');
let code = fs.readFileSync('src/components/Footer.tsx', 'utf8');

// Replace any <button ... onClick={() => onNavigate('route')} ...> with <a href="/route" ... onClick={(e) => { e.preventDefault(); onNavigate('route'); }} ...>
// This is best done with a careful regex.

code = code.replace(/<button([^>]*)onClick=\{\(\) => onNavigate\('([^']+)'\)\}([^>]*)>/g, (match, before, route, after) => {
    let href = route === 'home' ? '/' : (route === 'privacy' ? '/privacy-policy' : (route === 'app-privacy' ? '/less-legal/privacy-policy' : (route === 'app-delete-account' ? '/less-legal/delete-account' : `/${route}`)));
    return `<a${before}href="${href}" onClick={(e) => { e.preventDefault(); onNavigate('${route}'); }}${after}>`;
});

// Since we changed <button to <a, we need to change corresponding </button> to </a>.
// This is tricky because Footer.tsx has other buttons. But actually, Footer.tsx might ONLY have buttons for navigation!
// Let's check if there are any other buttons in Footer.tsx.
