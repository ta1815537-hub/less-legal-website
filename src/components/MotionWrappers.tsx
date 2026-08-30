import React, { ReactNode } from 'react';
import { motion, Variants } from 'motion/react';

// Common Easing Curve for Apple / Modern Glass Feel
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

// 4. HERO AMBIENT BACKGROUND GLOW (Crimson & Champagne Gold Orbs)
export const HeroAmbientGlow: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 select-none">
      {/* Deep Crimson Radial Light Orb 1 */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ willChange: "transform" }}
        className="absolute -top-32 left-1/4 w-[36rem] h-[36rem] bg-gradient-to-tr from-[#8B0000]/30 to-[#C21F2F]/20 rounded-full blur-[120px]"
      />

      {/* Champagne Gold Warm Ambient Orb 2 */}
      <motion.div
        animate={{
          scale: [1, 1.18, 1],
          x: [0, -35, 0],
          y: [0, 25, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.5,
        }}
        style={{ willChange: "transform" }}
        className="absolute top-1/3 right-12 w-[32rem] h-[32rem] bg-gradient-to-br from-[#D8BD82]/15 to-[#C7A96B]/10 rounded-full blur-[110px]"
      />

      {/* Architectural Smoked Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Subtle Dark Vignette Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#080808] to-transparent pointer-events-none" />
    </div>
  );
};

// 5. INTERACTIVE BUTTON WRAPPER WITH GLOW & SHIMMER
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
        return 'btn-crimson';
      case 'secondary':
        return 'btn-glass';
      case 'gold':
        return 'btn-gold';
      case 'outline':
        return 'bg-transparent border border-white/20 hover:border-white/40 text-[#F5F2EE] hover:bg-white/5 backdrop-blur-md';
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
      className={`relative group overflow-hidden transition-all rounded-xl font-semibold px-5 py-3 text-sm flex items-center justify-center gap-2 ${getVariantStyles()} ${className}`}
    >
      {/* Shimmer sweep effect */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};
