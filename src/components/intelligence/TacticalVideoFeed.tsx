import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * TacticalVideoFeed: Simula o balanço de câmera e glitches digitais.
 */
export function TacticalVideoFeed({ children, isLocking = false }: { children: React.ReactNode, isLocking?: boolean }) {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const triggerGlitch = () => {
      if (Math.random() > 0.85 || isLocking) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), Math.random() * 200);
      }
    };
    const interval = setInterval(triggerGlitch, 1000);
    return () => clearInterval(interval);
  }, [isLocking]);

  return (
    <motion.div 
      animate={{ 
        x: [0, 2, -2, 1, 0],
        y: [0, -1, 1, -0.5, 0],
      }}
      transition={{ 
        repeat: Infinity, 
        duration: 8, 
        ease: "easeInOut" 
      }}
      className={cn(
        "relative w-full h-full overflow-hidden transition-all duration-300",
        glitch && "filter brightness-150 contrast-150 saturate-200"
      )}
    >
      {/* Video Content */}
      <div className="absolute inset-0">
        {children}
      </div>

      {/* Glitch Overlay */}
      <AnimatePresence>
        {glitch && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-cyan-500/10 mix-blend-overlay pointer-events-none"
            style={{
              clipPath: `inset(${Math.random() * 80}% 0 ${Math.random() * 20}% 0)`
            }}
          />
        )}
      </AnimatePresence>

      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none z-30 opacity-[0.05] bg-[linear-gradient(rgba(18,255,65,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
    </motion.div>
  );
}
