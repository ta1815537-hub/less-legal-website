const fs = require('fs');
let content = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');

const startIdx = content.indexOf('{/* 1 Year Pass (Best Value) */}');
const endIdx = content.indexOf('<div className="pt-2 text-xs text-slate-500 dark:text-[#77736F]">');

if (startIdx !== -1 && endIdx !== -1) {
  const newBlock = `{/* 1 Year Pass (Best Value) */}
            <div className="relative h-full">
              <div className="glass-panel-crimson glow-crimson-gold rounded-2xl p-6 border-2 flex flex-col justify-between space-y-6 h-full">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-[#C21F2F] dark:text-[#E03A3E]">1 Year Pass</span>
                    <span className="text-[10px] font-bold text-amber-700 dark:text-[#D8BD82] bg-amber-500/20 dark:bg-[#D8BD82]/20 px-2.5 py-0.5 rounded-full border border-amber-600/40 dark:border-[#D8BD82]/40">
                      365 Days Validity
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-extrabold text-[#C21F2F] dark:text-[#E03A3E]">₹179</span>
                    <span className="text-xs text-slate-600 dark:text-[#B8B3AF]">/ one-time payment</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-[#B8B3AF] mb-4">
                    Best value ad-free experience for 365 full days
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-[#B8B3AF]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E] dark:text-[#22C55E] shrink-0" />
                      <span>365 days uninterrupted validity</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E] dark:text-[#22C55E] shrink-0" />
                      <span>Strict one-time purchase (No recurring fee)</span>
                    </li>
                  </ul>
                </div>
                <button 
                  onClick={() => onNavigate('premium')}
                  className="w-full py-3 rounded-xl btn-crimson font-bold text-xs cursor-pointer text-white shadow-lg"
                >
                  Get 1 Year Pass
                </button>
              </div>
              <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-[#D8BD82] to-[#C7A96B] text-[#080808] text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-lg z-10">
                Best Value
              </div>
            </div>
          </div>
          `;
  
  content = content.substring(0, startIdx) + newBlock + content.substring(endIdx);
  fs.writeFileSync('src/pages/HomePage.tsx', content);
}
