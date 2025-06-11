import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Star, Target, Zap } from "lucide-react";

interface PageTransitionProps {
  isTransitioning: boolean;
  direction?: "enter" | "exit";
  variant?: "default" | "tactical" | "security" | "emergency";
  children: React.ReactNode;
}

const transitionVariants = {
  default: {
    enter: {
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      scale: 1.05,
      y: -20,
    },
  },
  tactical: {
    enter: {
      opacity: 0,
      x: -100,
      rotateY: -15,
    },
    visible: {
      opacity: 1,
      x: 0,
      rotateY: 0,
    },
    exit: {
      opacity: 0,
      x: 100,
      rotateY: 15,
    },
  },
  security: {
    enter: {
      opacity: 0,
      scale: 0.8,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
    },
    exit: {
      opacity: 0,
      scale: 1.2,
      filter: "blur(4px)",
    },
  },
  emergency: {
    enter: {
      opacity: 0,
      y: -50,
      scale: 0.9,
      filter: "brightness(0.7)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "brightness(1)",
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      filter: "brightness(0.7)",
    },
  },
};

export default function MilitaryPageTransition({ 
  isTransitioning, 
  variant = "default", 
  children 
}: PageTransitionProps) {
  const [showOverlay, setShowOverlay] = useState(false);
  
  useEffect(() => {
    if (isTransitioning) {
      setShowOverlay(true);
      const timer = setTimeout(() => setShowOverlay(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const variants = transitionVariants[variant];

  return (
    <>
      {/* Military Transition Overlay */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center border-4 border-yellow-400"
              >
                <Shield className="w-8 h-8 text-yellow-400" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-yellow-400 font-bold tracking-wider"
              >
                TRANSITIONING...
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Content with Military Transition */}
      <motion.div
        initial={variants.enter}
        animate={variants.visible}
        exit={variants.exit}
        transition={{
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className="relative"
      >
        {children}
      </motion.div>
    </>
  );
}

// Military-themed route wrapper component
export function MilitaryRoute({ 
  children, 
  variant = "default" 
}: { 
  children: React.ReactNode;
  variant?: "default" | "tactical" | "security" | "emergency";
}) {
  return (
    <MilitaryPageTransition variant={variant} isTransitioning={false}>
      {children}
    </MilitaryPageTransition>
  );
}