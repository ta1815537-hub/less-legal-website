const fs = require('fs');
let content = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');

const target = `            {/* 1 Year Pass (Best Value) */}
            <div className="glass-panel-crimson glow-crimson-gold rounded-2xl p-6 border-2 relative flex flex-col justify-between space-y-6">
              <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-[#D8BD82] to-[#C7A96B] text-[#080808] text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-lg">
                Best Value
              </div>`;

const replacement = `            {/* 1 Year Pass (Best Value) */}
            <div className="relative">
              <div className="glass-panel-crimson glow-crimson-gold rounded-2xl p-6 border-2 flex flex-col justify-between space-y-6 h-full">
              <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-[#D8BD82] to-[#C7A96B] text-[#080808] text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-lg z-10">
                Best Value
              </div>`;

content = content.replace(target, replacement);

const closeTarget = `                <ul className="space-y-2 text-xs text-slate-700 dark:text-[#B8B3AF]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E] dark:text-[#22C55E] shrink-0" />
                    <span>Ad-free tool navigation & PDF utilities</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E] dark:text-[#22C55E] shrink-0" />
                    <span>Strict one-time purchase (No recurring fee)</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => onNavigate('premium')}
                className="btn-crimson w-full py-3 rounded-xl font-bold text-sm text-center shadow-lg text-white"
              >
                View Pass Terms
              </button>
            </div>
          </div>`;

const closeReplacement = `                <ul className="space-y-2 text-xs text-slate-700 dark:text-[#B8B3AF]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E] dark:text-[#22C55E] shrink-0" />
                    <span>Ad-free tool navigation & PDF utilities</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E] dark:text-[#22C55E] shrink-0" />
                    <span>Strict one-time purchase (No recurring fee)</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => onNavigate('premium')}
                className="btn-crimson w-full py-3 rounded-xl font-bold text-sm text-center shadow-lg text-white"
              >
                View Pass Terms
              </button>
            </div>
            </div>
          </div>`;

content = content.replace(closeTarget, closeReplacement);

fs.writeFileSync('src/pages/HomePage.tsx', content);
