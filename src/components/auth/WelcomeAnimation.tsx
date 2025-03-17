
import React, { useEffect, useState } from "react";
import { Sparkles, PartyPopper, Star, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

interface WelcomeAnimationProps {
  onComplete?: () => void;
}

export const WelcomeAnimation = ({ onComplete }: WelcomeAnimationProps) => {
  const { user } = useAuth();
  const [visible, setVisible] = useState(true);
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Friend";

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-white/90 backdrop-blur-sm"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-gradient-to-r from-blue-500 to-primary"
            >
              <Check className="text-white w-10 h-10" />
            </motion.div>
            
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl font-bold text-gray-800 mb-2"
            >
              Welcome!
            </motion.h2>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-xl text-gray-700"
            >
              Good to see you, <span className="font-bold text-primary">{displayName}</span>
            </motion.p>
            
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              {/* Confetti effect */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute inset-0"
              >
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      x: Math.random() * window.innerWidth, 
                      y: -50, 
                      opacity: 1,
                      scale: Math.random() * 0.5 + 0.5
                    }}
                    animate={{ 
                      y: window.innerHeight + 50,
                      opacity: 0,
                      rotate: Math.random() * 360
                    }}
                    transition={{ 
                      duration: Math.random() * 2 + 2,
                      delay: Math.random() * 0.5,
                      ease: "easeOut"
                    }}
                    className="absolute"
                  >
                    {i % 3 === 0 ? (
                      <Sparkles className="text-yellow-500" />
                    ) : i % 3 === 1 ? (
                      <PartyPopper className="text-green-500" />
                    ) : (
                      <Star className="text-blue-500" />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
