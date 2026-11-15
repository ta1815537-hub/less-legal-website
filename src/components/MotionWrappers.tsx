import React from 'react';
import { motion } from 'motion/react';

export const EASING_SPRING = [0.16, 1, 0.3, 1] as const;

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  className = ''
}) => {
  const getInitial = () => {
    switch (direction) {
      case 'up': return { opacity: 0, y: 16 };
      case 'down': return { opacity: 0, y: -16 };
      case 'left': return { opacity: 0, x: 16 };
      case 'right': return { opacity: 0, x: -16 };
    }
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
