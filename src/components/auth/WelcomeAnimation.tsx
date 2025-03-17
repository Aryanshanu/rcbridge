
import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface WelcomeAnimationProps {
  onComplete?: () => void;
  redirectPath?: string;
}

export const WelcomeAnimation = ({ 
  onComplete,
  redirectPath = "/" 
}: WelcomeAnimationProps) => {
  const { user } = useAuth();
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Friend";
  
  const handleGoToHome = () => {
    setVisible(false);
    if (onComplete) onComplete();
    navigate(redirectPath);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 5000); // Increased to 5 seconds
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-white/90 backdrop-blur-sm overflow-hidden"
        >
          <div className="relative z-10 p-8 bg-white/90 rounded-lg shadow-md text-center max-w-md">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-[#4285f4]"
            >
              <Check className="text-white w-8 h-8" />
            </motion.div>
            
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl font-medium text-[#202124] mb-2"
            >
              Welcome!
            </motion.h2>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-lg text-[#5f6368] mb-8"
            >
              Good to see you, <span className="font-medium text-[#1a73e8]">{displayName}</span>
            </motion.p>
            
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              onClick={handleGoToHome}
              className="bg-[#1a73e8] text-white py-3 px-6 rounded-full text-base font-medium hover:bg-[#0d66d0] transition-colors"
            >
              Go to Home
            </motion.button>
            
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
              {/* Celebration effect */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute inset-0"
              >
                {[...Array(60)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      x: Math.random() * window.innerWidth / 2 + window.innerWidth / 4, 
                      y: Math.random() * window.innerHeight / 2 + window.innerHeight / 4, 
                      opacity: 0,
                      scale: Math.random() * 0.5 + 0.5,
                      rotate: 0
                    }}
                    animate={{ 
                      x: Math.random() * window.innerWidth,
                      y: Math.random() * window.innerHeight,
                      opacity: [0, 1, 1, 0],
                      rotate: Math.random() * 360
                    }}
                    transition={{ 
                      duration: 2 + Math.random() * 3, // 2-5 seconds
                      delay: Math.random() * 2, // Staggered start
                      ease: "easeOut"
                    }}
                    className="absolute"
                    style={{ zIndex: 5 }}
                  >
                    {i % 4 === 0 ? (
                      <div className="text-[#fbbc04]">★</div> // Star - yellow
                    ) : i % 4 === 1 ? (
                      <div className="text-[#4285f4]">✿</div> // Flower - blue
                    ) : i % 4 === 2 ? (
                      <div className="text-[#ea4335]">❀</div> // Flower - red
                    ) : (
                      <div className="text-[#0f9d58]">✾</div> // Flower - green
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
