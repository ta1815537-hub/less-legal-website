const fs = require('fs');
let code = fs.readFileSync('src/components/Footer.tsx', 'utf8');

// The safest way is to just swap 'button' for 'a' using exact string replacements for the known exact classNames or lines.
// Since the buttons don't have hrefs, let's just do a replace for the specific known links in Footer.
const replacements = [
    { target: "onNavigate('home')", href: '/' },
    { target: "onNavigate('about')", href: '/about' },
    { target: "onNavigate('founder')", href: '/founder' },
    { target: "onNavigate('features')", href: '/features' },
    { target: "onNavigate('premium')", href: '/premium' },
    { target: "onNavigate('download')", href: '/download' },
    { target: "onNavigate('contact')", href: '/contact' },
    { target: "onNavigate('privacy')", href: '/privacy-policy' },
    { target: "onNavigate('terms')", href: '/terms' },
    { target: "onNavigate('refund')", href: '/refund' },
    { target: "onNavigate('disclaimer')", href: '/disclaimer' },
    { target: "onNavigate('app-privacy')", href: '/less-legal/privacy-policy' },
    { target: "onNavigate('app-delete-account')", href: '/less-legal/delete-account' }
];

for (const rep of replacements) {
    code = code.replaceAll(
        `onClick={() => ${rep.target}}`,
        `href="${rep.href}" onClick={(e) => { e.preventDefault(); ${rep.target}; }}`
    );
}

// Now we have `<button href="..." onClick={...}` which is invalid HTML, but browsers will render it, and Googlebot will ignore the href on a button. Wait, we MUST change `<button` to `<a`.

code = code.replace(/<button([^>]+href="[^"]+"[^>]*)>/g, '<a$1>');

fs.writeFileSync('src/components/Footer.tsx', code);
