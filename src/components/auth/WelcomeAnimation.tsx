
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
    // Create particles for celebration effect
    const createCelebration = () => {
      const container = document.querySelector('.celebration-container');
      if (!container) return;
      
      // Clear any existing particles
      container.innerHTML = '';
      
      // Define particle types and characters
      const particles = [
        { char: '★', color: '#fbbc04' }, // Star - yellow
        { char: '✿', color: '#4285f4' }, // Flower - blue
        { char: '❀', color: '#ea4335' }, // Flower - red
        { char: '✾', color: '#0f9d58' }  // Flower - green
      ];
      
      // Create 60 particles
      for (let i = 0; i < 60; i++) {
        setTimeout(() => {
          if (!container) return;
          
          const particle = document.createElement('div');
          const randomParticle = particles[Math.floor(Math.random() * particles.length)];
          
          // Set styling
          particle.style.position = 'absolute';
          particle.style.color = randomParticle.color;
          particle.style.fontSize = `${Math.random() * 16 + 12}px`;
          particle.style.userSelect = 'none';
          particle.style.pointerEvents = 'none';
          particle.style.zIndex = '5';
          particle.style.opacity = '0';
          particle.style.top = `${50 + (Math.random() - 0.5) * 20}%`;
          particle.style.left = `${50 + (Math.random() - 0.5) * 20}%`;
          
          // Set content
          particle.textContent = randomParticle.char;
          
          // Create animation
          const moveX = (Math.random() - 0.5) * 300;
          const moveY = (Math.random() - 0.5) * 300;
          const rotate = Math.random() * 360;
          const duration = 2 + Math.random() * 3; // 2-5 seconds
          
          particle.style.transition = `transform ${duration}s ease-out, opacity ${duration}s ease-out`;
          
          // Add to container
          container.appendChild(particle);
          
          // Start animation after a short delay (for browser to process)
          setTimeout(() => {
            particle.style.opacity = '1';
            particle.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotate}deg)`;
            
            // Remove after animation completes
            setTimeout(() => {
              particle.style.opacity = '0';
              setTimeout(() => particle.remove(), 1000);
            }, (duration - 1) * 1000);
          }, 10);
        }, i * 50); // Stagger the creation
      }
    };
    
    // Start celebration animation
    if (visible) {
      createCelebration();
    }
    
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 5000); // 5 seconds total duration
    
    return () => clearTimeout(timer);
  }, [onComplete, visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden"
          style={{ backgroundColor: 'rgba(248, 249, 250, 0.9)' }}
        >
          <div className="celebration-container absolute inset-0 overflow-hidden pointer-events-none" />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 p-8 bg-white/90 rounded-lg shadow-md text-center max-w-md"
          >
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
