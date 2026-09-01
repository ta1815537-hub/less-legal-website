const fs = require('fs');
let content = fs.readFileSync('src/pages/PremiumPage.tsx', 'utf8');

// Remove from Plan 1
const badgeBlock = `
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2.5 }}
              className="absolute -top-3.5 right-8 bg-gradient-to-r from-amber-600 to-amber-700 dark:from-[#D8BD82] dark:to-[#C7A96B] text-white dark:text-[#080808] text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg whitespace-nowrap z-10"
            >
              {t.premiumPage.bestValueBadge}
            </motion.div>`;

content = content.replace(badgeBlock, '');

// Add to Plan 2 end
const plan2End = `                </GlowingButton>
              </a>
            </div>
          </div>
        </ScrollReveal>`;

const plan2EndWithBadge = `                </GlowingButton>
              </a>
            </div>${badgeBlock}
          </div>
        </ScrollReveal>`;

content = content.replace(plan2End, plan2EndWithBadge);
fs.writeFileSync('src/pages/PremiumPage.tsx', content);
