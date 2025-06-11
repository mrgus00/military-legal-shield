import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Star, Users, Clock } from "lucide-react";

export default function InteractiveHeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const features = [
    {
      icon: Shield,
      title: "24/7 Protection",
      description: "Round-the-clock legal support",
      color: "bg-blue-500"
    },
    {
      icon: Users,
      title: "Expert Attorneys",
      description: "Military legal specialists",
      color: "bg-green-500"
    },
    {
      icon: Star,
      title: "Proven Results",
      description: "50,000+ successful cases",
      color: "bg-yellow-500"
    },
    {
      icon: Clock,
      title: "Rapid Response",
      description: "Emergency consultation within minutes",
      color: "bg-red-500"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="grid grid-cols-2 gap-8 opacity-20">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          const isActive = index === activeIndex;
          
          return (
            <motion.div
              key={index}
              className={`w-24 h-24 rounded-full flex items-center justify-center ${feature.color}`}
              animate={{
                scale: isActive ? 1.2 : 0.8,
                opacity: isActive ? 0.8 : 0.3,
                rotate: isActive ? 360 : 0
              }}
              transition={{
                duration: 1,
                ease: "easeInOut"
              }}
            >
              <IconComponent className="w-12 h-12 text-white" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}