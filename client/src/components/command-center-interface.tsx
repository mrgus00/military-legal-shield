import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Shield, Radar, Target, Satellite, Radio, Clock, Map, Users, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CommandCenterProps {
  isActive: boolean;
  operation: string;
  onComplete?: () => void;
}

interface TacticalData {
  coordinates: string;
  elevation: number;
  bearing: number;
  distance: number;
  status: "scanning" | "locked" | "acquired";
}

export default function CommandCenterInterface({ isActive, operation, onComplete }: CommandCenterProps) {
  const [scanProgress, setScanProgress] = useState(0);
  const [activeTargets, setActiveTargets] = useState<TacticalData[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<string[]>([]);
  const [operationPhase, setOperationPhase] = useState("INITIALIZING");

  useEffect(() => {
    if (!isActive) return;

    const phases = ["INITIALIZING", "SCANNING PERIMETER", "ACQUIRING TARGETS", "ANALYZING INTEL", "MISSION COMPLETE"];
    let phaseIndex = 0;

    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          onComplete?.();
          return 100;
        }
        return newProgress;
      });
    }, 80);

    const phaseInterval = setInterval(() => {
      if (phaseIndex < phases.length - 1) {
        phaseIndex++;
        setOperationPhase(phases[phaseIndex]);
      }
    }, 1500);

    const targetInterval = setInterval(() => {
      if (activeTargets.length < 8) {
        const newTarget: TacticalData = {
          coordinates: `${(Math.random() * 90).toFixed(4)}°N, ${(Math.random() * 180).toFixed(4)}°W`,
          elevation: Math.floor(Math.random() * 5000) + 100,
          bearing: Math.floor(Math.random() * 360),
          distance: Math.floor(Math.random() * 50) + 5,
          status: Math.random() > 0.7 ? "locked" : "scanning"
        };
        setActiveTargets(prev => [...prev, newTarget]);
      }
    }, 600);

    const alertInterval = setInterval(() => {
      const alerts = [
        "SECURE CHANNEL ESTABLISHED",
        "ENCRYPTION PROTOCOL ACTIVE", 
        "INTEL STREAM INCOMING",
        "TARGET ACQUISITION NOMINAL",
        "TACTICAL OVERLAY UPDATED"
      ];
      
      if (systemAlerts.length < 5) {
        const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
        setSystemAlerts(prev => [randomAlert, ...prev.slice(0, 3)]);
      }
    }, 1200);

    return () => {
      clearInterval(progressInterval);
      clearInterval(phaseInterval);
      clearInterval(targetInterval);
      clearInterval(alertInterval);
    };
  }, [isActive, activeTargets.length, systemAlerts.length, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/98 backdrop-blur-sm">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(0,255,0,0.15) 1px, transparent 0),
            linear-gradient(rgba(0,255,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,0,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px, 50px 50px, 50px 50px'
        }}
      />

      {/* Command Interface */}
      <div className="relative z-10 h-full p-6 overflow-hidden">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-900/30 border border-green-500/50 rounded">
              <Radio className="w-5 h-5 text-green-400 animate-pulse" />
              <span className="text-green-400 font-mono text-sm">TACTICAL OPS CENTER</span>
            </div>
            <Badge variant="outline" className="border-green-500/50 text-green-400">
              CLEARANCE: TOP SECRET
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-green-400 font-mono">
            <Clock className="w-4 h-4" />
            {new Date().toISOString().slice(11, 19)} UTC
          </div>
        </motion.div>

        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
          {/* Main Radar Display */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="col-span-8 relative"
          >
            <Card className="h-full bg-black/60 border-green-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-green-400 font-mono flex items-center gap-2">
                  <Radar className="w-5 h-5" />
                  TACTICAL RADAR - {operation}
                </CardTitle>
              </CardHeader>
              <CardContent className="h-full relative">
                {/* Radar Circle */}
                <div className="absolute inset-4 rounded-full border-2 border-green-500/30 flex items-center justify-center">
                  <div className="absolute inset-8 rounded-full border border-green-500/20" />
                  <div className="absolute inset-16 rounded-full border border-green-500/15" />
                  
                  {/* Rotating Sweep */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(from 0deg, transparent 0deg, rgba(0,255,0,0.1) 30deg, transparent 60deg)`
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  />

                  {/* Center Hub */}
                  <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse" />
                  
                  {/* Target Blips */}
                  {activeTargets.map((target, index) => (
                    <motion.div
                      key={index}
                      className={`absolute w-3 h-3 rounded-full ${
                        target.status === "locked" ? "bg-red-400" : "bg-green-400"
                      }`}
                      style={{
                        top: `${20 + Math.random() * 60}%`,
                        left: `${20 + Math.random() * 60}%`
                      }}
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  ))}
                </div>

                {/* Operation Status */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/80 border border-green-500/30 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-green-400 font-mono text-sm">OPERATION STATUS:</span>
                      <motion.span
                        key={operationPhase}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-white font-mono font-bold"
                      >
                        {operationPhase}
                      </motion.span>
                    </div>
                    
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <motion.div
                        className="h-2 bg-gradient-to-r from-green-600 to-green-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${scanProgress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    
                    <div className="text-center text-green-400 font-mono text-sm mt-1">
                      {scanProgress}% COMPLETE
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Side Panels */}
          <div className="col-span-4 space-y-6">
            {/* Target Analysis */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-black/60 border-green-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-400 font-mono flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    TARGET ANALYSIS
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-64 overflow-y-auto">
                  {activeTargets.slice(0, 5).map((target, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-2 bg-green-900/20 border border-green-500/20 rounded text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-green-400 font-mono">TARGET {index + 1}</span>
                        <Badge variant={target.status === "locked" ? "destructive" : "secondary"}>
                          {target.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-gray-300 space-y-1">
                        <div>Coords: {target.coordinates}</div>
                        <div>Elevation: {target.elevation}ft</div>
                        <div>Distance: {target.distance}km</div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* System Alerts */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-black/60 border-green-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-400 font-mono flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    SYSTEM ALERTS
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-48 overflow-y-auto">
                  <AnimatePresence>
                    {systemAlerts.map((alert, index) => (
                      <motion.div
                        key={`${alert}-${index}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center gap-2 p-2 bg-green-900/20 border border-green-500/20 rounded text-xs"
                      >
                        <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 font-mono">{alert}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>

            {/* Mission Control */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="bg-black/60 border-green-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-400 font-mono flex items-center gap-2">
                    <Satellite className="w-4 h-4" />
                    MISSION CONTROL
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-green-900/20 border border-green-500/20 rounded text-center">
                      <div className="text-green-400 font-mono">ACTIVE</div>
                      <div className="text-white font-bold">{activeTargets.length}</div>
                    </div>
                    <div className="p-2 bg-green-900/20 border border-green-500/20 rounded text-center">
                      <div className="text-green-400 font-mono">LOCKED</div>
                      <div className="text-white font-bold">
                        {activeTargets.filter(t => t.status === "locked").length}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-gray-300 font-mono">OPERATION NOMINAL</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}