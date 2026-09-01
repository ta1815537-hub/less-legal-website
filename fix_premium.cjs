const fs = require('fs');
let content = fs.readFileSync('src/pages/PremiumPage.tsx', 'utf8');

// I will fix the messed up part manually
// Plan 1 ends around here:
//                 <GlowingButton variant="secondary" className="w-full py-3 text-xs font-bold whitespace-nowrap">
//                   <span>{language === 'hi' ? 'खरीदने के लिए Less Legal ऐप खोलें' : 'Open Less Legal App to Purchase'}</span>
//                 </GlowingButton>
//               </a>
//             </div>
//             <motion.div ... > ... </motion.div>
//           </div>
//         </ScrollReveal>
//         {/* Plan 2: ₹179 / 1 Year (Best Value) */}

// Let's replace the whole block from Plan 1's end to Plan 2's start.

content = content.replace(
  '              </a>\n            </div>\n            <motion.div \n              initial={{ scale: 0.9 }}\n              animate={{ scale: 1 }}\n              transition={{ repeat: Infinity, repeatType: \'reverse\', duration: 2.5 }}\n              className="absolute -top-3.5 right-8 bg-gradient-to-r from-amber-600 to-amber-700 dark:from-[#D8BD82] dark:to-[#C7A96B] text-white dark:text-[#080808] text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg whitespace-nowrap z-10"\n            >\n              {t.premiumPage.bestValueBadge}\n            </motion.div>\n          </div>\n        </ScrollReveal>\n\n        {/* Plan 2: ₹179 / 1 Year (Best Value) */}\n        <ScrollReveal direction="up" delay={0.16} className="h-full">\n          <div className="relative h-full">\n            <div className="glass-panel-crimson glow-crimson-gold shine-sweep-overlay p-6 sm:p-8 rounded-3xl border-2 flex flex-col justify-between h-full">\n            <div>',
  '              </a>\n            </div>\n          </div>\n        </ScrollReveal>\n\n        {/* Plan 2: ₹179 / 1 Year (Best Value) */}\n        <ScrollReveal direction="up" delay={0.16} className="h-full">\n          <div className="relative h-full">\n            <div className="glass-panel-crimson glow-crimson-gold shine-sweep-overlay p-6 sm:p-8 rounded-3xl border-2 flex flex-col justify-between h-full w-full">\n            <div>'
);

fs.writeFileSync('src/pages/PremiumPage.tsx', content);
