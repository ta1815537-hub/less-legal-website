const fs = require('fs');
let content = fs.readFileSync('src/components/MotionWrappers.tsx', 'utf8');

content = content.replace(
  /<motion\.button\n      id={id}\n      type={type}\n      onClick={onClick}\n      disabled={disabled}\n      whileTap={{ scale: 0.98 }}\n      transition={{ duration: 0.15, ease: EASING_SPRING }}/g,
  '<motion.button\n      id={id}\n      type={type}\n      onClick={onClick}\n      disabled={disabled}\n      whileHover={{ scale: 1.025 }}\n      whileTap={{ scale: 0.96 }}\n      transition={{ duration: 0.2, ease: EASING_SPRING }}'
);

fs.writeFileSync('src/components/MotionWrappers.tsx', content);
