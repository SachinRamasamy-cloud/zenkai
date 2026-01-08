import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Zap, AlertTriangle } from 'lucide-react';

// --- ANIMATED PARTICLE COMPONENT ---
const Particle = ({ delay }) => {
  const randomTop = Math.random() * 100;
  const randomLeft = Math.random() * 100;
  const size = Math.random() * 4 + 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 0.8, 0], 
        y: [0, -100], 
        scale: [0, 1.5, 0] 
      }}
      transition={{ 
        duration: Math.random() * 5 + 3, 
        repeat: Infinity, 
        delay: delay,
        ease: "linear"
      }}
      style={{ top: `${randomTop}%`, left: `${randomLeft}%`, width: size, height: size }}
      className="absolute bg-blue-500/50 rounded-full blur-[1px]"
    />
  );
};

// --- MAIN 404 COMPONENT ---
const NotFound = () => {
  const navigate = useNavigate();
  const [particles, setParticles] = useState([]);

  // Generate particles on mount
  useEffect(() => {
    setParticles([...Array(20)].map((_, i) => i));
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0b0c15] flex items-center justify-center overflow-hidden font-sans text-white selection:bg-red-500/30">
      
      {/* 1. BACKGROUND LAYERS */}
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((i) => (
          <Particle key={i} delay={i * 0.2} />
        ))}
      </div>

      {/* Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      {/* 2. MAIN CONTENT WRAPPER */}
      <div className="relative z-10 text-center px-6">
        
        {/* WARNING BADGE */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 font-bold text-xs tracking-widest uppercase mb-8 backdrop-blur-md"
        >
          <AlertTriangle size={14} />
          <span>Timeline Breach Detected</span>
        </motion.div>

        {/* GLITCHING 404 TEXT */}
        <div className="relative mb-6">
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-[150px] md:text-[220px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-800 relative z-10"
          >
            404
          </motion.h1>
          
          {/* Glitch Shadow Effect */}
          <motion.h1
            animate={{ 
              x: [-2, 2, -1, 0], 
              opacity: [0.5, 0.8, 0.5] 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 0.2, 
              repeatType: "mirror" 
            }}
            className="text-[150px] md:text-[220px] font-black leading-none tracking-tighter text-blue-600 absolute top-0 left-0 w-full h-full mix-blend-screen opacity-50 z-0 blur-[2px]"
          >
            404
          </motion.h1>
          
          <motion.h1
            animate={{ 
              x: [2, -2, 1, 0], 
              opacity: [0.5, 0.8, 0.5] 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 0.3, 
              repeatType: "mirror" 
            }}
            className="text-[150px] md:text-[220px] font-black leading-none tracking-tighter text-red-600 absolute top-0 left-0 w-full h-full mix-blend-screen opacity-50 z-0 blur-[2px]"
          >
            404
          </motion.h1>
        </div>

        {/* MESSAGE */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-md mx-auto space-y-4 mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Connection Lost
          </h2>
          <p className="text-gray-400 text-lg">
            You've ventured too far into the void. The anime you are looking for does not exist in this reality.
          </p>
        </motion.div>

        {/* ACTIONS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link 
            to="/" 
            className="group relative px-8 py-4 bg-white text-black font-bold rounded-xl overflow-hidden shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] transition-all hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            <span className="relative flex items-center gap-2">
              <Home size={20} /> Return to Safety
            </span>
          </Link>

          <button 
            onClick={() => navigate(-1)}
            className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 hover:border-white/30 backdrop-blur-md transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            <ArrowLeft size={20} /> Go Back
          </button>
        </motion.div>

      </div>

      {/* 3. TV STATIC OVERLAY (Subtle Noise) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
      
    </div>
  );
};

export default NotFound;