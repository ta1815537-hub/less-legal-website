import React, { ReactNode } from 'react';
import { motion, Variants } from 'motion/react';

// Common Easing Curve for Apple / Modern Glass Feel
export const EASING_SPRING = [0.22, 1, 0.36, 1] as const;
export const EASING_SMOOTH = [0.16, 1, 0.3, 1] as const;

// 1. GLOBAL PAGE TRANSITION WRAPPER (Ultra Snappy & Smooth Page Switching)
interface PageTransitionProps {
  children: ReactNode;
  routeKey: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, routeKey }) => {
  return (
    <motion.div
      key={routeKey}
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.6, ease: EASING_SMOOTH }}
      className="w-full flex-1"
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </motion.div>
  );
};

// 2. GLOBAL ANIMATED SMOKE BACKGROUND COMPONENT
export const SmokeBackground: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none hidden dark:block"
      style={{ contain: 'strict' }}
    >
      {/* Smoke Cloud 1 - Crimson / Ruby Ambient Vapor (Dark mode only) */}
      <div className="vapor-orb-1 absolute -top-40 -left-40 w-[35rem] sm:w-[45rem] h-[35rem] sm:h-[45rem] bg-gradient-to-br from-[#8B0000]/20 via-[#C21F2F]/15 to-transparent rounded-full blur-[60px] sm:blur-[100px] opacity-50" />

      {/* Smoke Cloud 2 - Subtle Crimson Vapor (Dark mode only) */}
      <div className="vapor-orb-2 absolute top-1/4 -right-40 w-[30rem] sm:w-[40rem] h-[30rem] sm:h-[40rem] bg-gradient-to-bl from-[#C21F2F]/15 via-[#8B0000]/10 to-transparent rounded-full blur-[50px] sm:blur-[90px] opacity-40" />
    </div>
  );
};

// 3. SCROLL REVEAL SECTION
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
      initial={{ opacity: 0, scale: 0.93, ...getInitialPosition() }}
      whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      viewport={{ once: false, margin: '-10% 0px -10% 0px' }}
      transition={{ duration: 1.0, delay, ease: EASING_SMOOTH }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// 4. STAGGERED GRID CONTAINER & ITEMS
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className = '',
  staggerDelay = 0.12,
}) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: '-8% 0px -8% 0px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem: React.FC<{ children: ReactNode; className?: string; interactive?: boolean }> = ({
  children,
  className = '',
  interactive = false,
}) => {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.92 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: EASING_SMOOTH },
    },
  };

  return (
    <motion.div 
      variants={itemVariants} 
      className={className}
      whileHover={interactive ? { y: -6, scale: 1.015, transition: { duration: 0.3, ease: "easeOut" } } : undefined}
    >
      {children}
    </motion.div>
  );
};

// 5. HERO AMBIENT BACKGROUND GLOW (Studio Sky-Blue, Gold & Glossy Stage Floor)
export const HeroAmbientGlow: React.FC = () => {
  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden -z-10 select-none"
      style={{ contain: 'strict' }}
    >
      {/* Soft Sky Blue / Powder Blue Atmospheric Lighting (Center-Left) */}
      <div 
        className="vapor-orb-1 absolute -top-24 left-[5%] sm:left-[15%] w-[32rem] sm:w-[46rem] h-[32rem] sm:h-[46rem] bg-gradient-to-tr from-[#BFDBFE]/50 via-[#DBEAFE]/40 to-[#EFF6FF]/20 dark:from-[#1E3A8A]/25 dark:via-[#172554]/20 to-transparent rounded-full blur-[80px] sm:blur-[130px]"
      />

      {/* Warm Golden Sunlight Ambient Orb (Top Right) */}
      <div 
        className="vapor-orb-2 absolute top-0 right-[2%] sm:right-[8%] w-[26rem] sm:w-[38rem] h-[26rem] sm:h-[38rem] bg-gradient-to-br from-[#FEF3C7]/40 via-[#FDE68A]/25 to-[#DBEAFE]/30 dark:from-[#78350F]/20 dark:via-[#854D0E]/15 to-transparent rounded-full blur-[70px] sm:blur-[110px]"
      />

      {/* Luminous Periwinkle Backlight behind phone (Center Right) */}
      <div 
        className="absolute top-1/3 right-[15%] sm:right-[22%] w-[24rem] sm:w-[34rem] h-[24rem] sm:h-[34rem] bg-gradient-to-bl from-[#93C5FD]/45 via-[#C7D2FE]/30 to-transparent rounded-full blur-[60px] sm:blur-[100px] opacity-70"
      />

      {/* Glossy Floor Surface Highlight ("Jamin" reflection plane) */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-48 sm:h-64 bg-gradient-to-t from-white/70 via-white/30 to-transparent dark:from-[#0B0D13]/90 dark:via-[#0B0D13]/40 dark:to-transparent pointer-events-none"
      />

      {/* Architectural Studio Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '36px 36px'
        }}
      />
    </div>
  );
};

// 6. INTERACTIVE BUTTON WRAPPER WITH CONTINUOUS SHINE & GLOW
interface GlowingButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'gold' | 'outline';
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
        return 'btn-crimson shine-sweep-overlay';
      case 'secondary':
        return 'btn-glass shine-sweep-overlay';
      case 'gold':
        return 'btn-gold shine-sweep-overlay';
      case 'outline':
        return 'bg-white/90 dark:bg-transparent border border-slate-300 dark:border-white/20 hover:border-slate-400 dark:hover:border-white/40 text-slate-900 dark:text-[#F5F2EE] hover:bg-slate-100 dark:hover:bg-white/5 backdrop-blur-md shine-sweep-overlay shadow-xs dark:shadow-none';
    }
  };

  return (
    <motion.button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.2, ease: EASING_SPRING }}
      className={`relative group overflow-hidden transition-all rounded-xl font-semibold px-5 py-3 text-sm flex items-center justify-center gap-2 ${getVariantStyles()} ${className}`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

