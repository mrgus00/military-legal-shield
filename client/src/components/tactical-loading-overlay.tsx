import { motion, AnimatePresence } from "framer-motion";
import { Shield, Target, Radio, Satellite, Map, Clock } from "lucide-react";
import { useState, useEffect } from "react";

interface TacticalLoadingOverlayProps {
  isLoading: boolean;
  operation: string;
  progress?: number;
  onComplete?: () => void;
}

export default function TacticalLoadingOverlay({ 
  isLoading, 
  operation, 
  progress = 0, 
  onComplete 
}: TacticalLoadingOverlayProps) {
  const [scanPhase, setScanPhase] = useState(0);
  const [targetCount, setTargetCount] = useState(0);
  const [systemStatus, setSystemStatus] = useState("INITIALIZING");

  useEffect(() => {
    if (!isLoading) return;

    const phases = ["INITIALIZING", "SCANNING", "ANALYZING", "MATCHING", "COMPLETE"];
    const statusInterval = setInterval(() => {
      setScanPhase(prev => {
        const nextPhase = prev + 1;
        if (nextPhase < phases.length) {
          setSystemStatus(phases[nextPhase]);
          return nextPhase;
        }
        return prev;
      });
    }, 1000);

    const targetInterval = setInterval(() => {
      setTargetCount(prev => Math.min(prev + 1, 15));
    }, 300);

    return () => {
      clearInterval(statusInterval);
      clearInterval(targetInterval);
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center"
      >
        {/* Tactical Grid Background */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(0,255,0,0.1) 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, rgba(0,255,0,0.1) 2px, transparent 2px),
              linear-gradient(45deg, rgba(0,255,0,0.05) 1px, transparent 1px),
              linear-gradient(-45deg, rgba(0,255,0,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px, 50px 50px, 25px 25px, 25px 25px'
          }}
        />

        {/* Radar Sweep */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="absolute w-96 h-96 border border-green-500/30 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-64 h-64 border border-green-400/40 rounded-full"
            animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          />
        </div>

        {/* Main Interface */}
        <div className="relative z-10 max-w-md w-full mx-4">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-green-900/30 border border-green-500/50 rounded-full mb-4">
              <Radio className="w-5 h-5 text-green-400 animate-pulse" />
              <span className="text-green-400 font-mono text-sm tracking-wider">SECURE CHANNEL</span>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">TACTICAL OPERATION</h2>
            <p className="text-green-400 font-mono text-lg">{operation}</p>
          </motion.div>

          {/* Status Display */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-black/60 border border-green-500/30 rounded-lg p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-green-400 font-mono text-sm">SYSTEM STATUS:</span>
              <motion.span
                key={systemStatus}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-white font-mono font-bold"
              >
                {systemStatus}
              </motion.span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
              <motion.div
                className="h-2 bg-gradient-to-r from-green-600 to-green-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress + (scanPhase * 20), 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>

            {/* Scan Results */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Targets Identified:
                </span>
                <motion.span 
                  className="text-green-400 font-mono"
                  key={targetCount}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                >
                  {targetCount.toString().padStart(2, '0')}
                </motion.span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 flex items-center gap-2">
                  <Satellite className="w-4 h-4" />
                  Signal Strength:
                </span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`w-2 h-3 ${i < 4 ? 'bg-green-400' : 'bg-gray-600'}`}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: i * 0.1 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Animation Icons */}
          <div className="flex justify-center gap-6">
            <motion.div
              animate={{ rotateY: [0, 180, 360] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-12 h-12 border border-green-500/50 rounded-lg flex items-center justify-center bg-green-900/20"
            >
              <Shield className="w-6 h-6 text-green-400" />
            </motion.div>
            
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              className="w-12 h-12 border border-green-500/50 rounded-lg flex items-center justify-center bg-green-900/20"
            >
              <Map className="w-6 h-6 text-green-400" />
            </motion.div>
            
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border border-green-500/50 rounded-lg flex items-center justify-center bg-green-900/20"
            >
              <Clock className="w-6 h-6 text-green-400" />
            </motion.div>
          </div>

          {/* Footer Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-6"
          >
            <p className="text-gray-400 text-sm font-mono">
              CLASSIFIED OPERATION IN PROGRESS...
            </p>
            <div className="flex justify-center gap-1 mt-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-green-400 rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ 
                    duration: 1.2, 
                    repeat: Infinity, 
                    delay: i * 0.4 
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}