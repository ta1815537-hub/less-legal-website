import React, { ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';

// Common Easing Curve for Apple / Modern SaaS Feel
export const EASING_SPRING = [0.22, 1, 0.36, 1] as const;

// 1. GLOBAL PAGE TRANSITION WRAPPER
interface PageTransitionProps {
  children: ReactNode;
  routeKey: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, routeKey }) => {
  return (
    <motion.div
      key={routeKey}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: EASING_SPRING }}
      className="w-full flex-1"
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
};

// 2. SCROLL REVEAL SECTION
interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 24,
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: distance, x: 0 };
      case 'down': return { y: -distance, x: 0 };
      case 'left': return { x: distance, y: 0 };
      case 'right': return { x: -distance, y: 0 };
      case 'none': return { x: 0, y: 0 };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, ...getInitialPosition() }}
      whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay, ease: EASING_SPRING }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// 3. STAGGERED GRID CONTAINER & ITEMS
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className = '',
  staggerDelay = 0.08,
}) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.05,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.45, ease: EASING_SPRING },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
};

// 4. HERO AMBIENT BACKGROUND GLOW
export const HeroAmbientGlow: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 select-none">
      {/* Soft Purple/Indigo Radial Orb 1 */}
      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          x: [0, 20, 0],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ willChange: "transform" }}
        className="absolute -top-24 left-1/4 w-96 h-96 sm:w-[32rem] sm:h-[32rem] bg-gradient-to-tr from-indigo-400/15 to-purple-400/10 rounded-full blur-3xl"
      />

      {/* Cyan/Sky Ambient Glow Orb 2 */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          x: [0, -25, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        style={{ willChange: "transform" }}
        className="absolute top-1/3 right-10 w-80 h-80 sm:w-[28rem] sm:h-[28rem] bg-gradient-to-br from-sky-400/15 to-indigo-500/10 rounded-full blur-3xl"
      />

      {/* Subtle Bottom Light Spread */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-32 bg-gradient-to-t from-white/80 to-transparent" />
    </div>
  );
};

// 5. INTERACTIVE BUTTON WRAPPER WITH GLOW & SHIMMER
interface GlowingButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'dark' | 'outline';
  id?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const GlowingButton: React.FC<GlowingButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  id,
  type = 'button',
  disabled = false,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-md shadow-indigo-600/25 hover:shadow-xl hover:shadow-indigo-600/35 border border-indigo-500/30';
      case 'secondary':
        return 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-indigo-200';
      case 'dark':
        return 'bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/30 hover:shadow-xl hover:shadow-slate-900/40 border border-slate-700/50';
      case 'outline':
        return 'bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-2xs hover:shadow-xs';
    }
  };

  return (
    <motion.button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ y: -2, scale: 1.015 }}
      whileTap={{ scale: 0.975 }}
      transition={{ duration: 0.2, ease: EASING_SPRING }}
      className={`relative group overflow-hidden transition-colors rounded-xl font-bold ${getVariantStyles()} ${className}`}
    >
      {/* Shimmer sweep effect */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};
