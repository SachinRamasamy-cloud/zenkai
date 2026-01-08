import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const animeQuotes = [
  "Whatever you lose, you'll find it again. But what you throw away you'll never get back.", // Rurouni Kenshin
  "Power comes in response to a need, not a desire.", // Goku
  "If you don't take risks, you can't create a future.", // Monkey D. Luffy
  "The world isn't perfect. But it's there for us, doing the best it can.", // Roy Mustang
  "Fear is not evil. It tells you what your weakness is.", // Gildarts
  "It's not about whether you can or can't. You do it because you want to.", // Haikyuu
];

const Preloader = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [quote, setQuote] = useState("");

  // Select random quote on mount
  useEffect(() => {
    setQuote(animeQuotes[Math.floor(Math.random() * animeQuotes.length)]);
  }, []);

  // Handle Counter Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev === 100) {
          clearInterval(timer);
          setTimeout(onComplete, 800); // Wait a bit after 100% before lifting curtain
          return 100;
        }
        // Random speed increment for realistic effect
        const diff = Math.random() * 10;
        return Math.min(prev + diff, 100);
      });
    }, 150);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0b0c15] text-white overflow-hidden"
    >
      {/* BACKGROUND PARTICLES (Subtle) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-[100px] animate-pulse" />
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* CENTRAL LOGO & GLOW */}
      <div className="relative mb-12">
        {/* Pulsing Rings */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"
        />
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-24 h-24 md:w-32 md:h-32"
        >
           <img 
            src="/zenkai.png" 
            alt="Zenkai" 
            className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(59,130,246,0.6)]" 
           />
        </motion.div>
      </div>

      {/* PERCENTAGE COUNTER (Big Typography) */}
      <div className="relative z-10 font-black text-6xl md:text-8xl tracking-tighter tabular-nums mb-4">
        <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600">
          {Math.floor(count)}%
        </span>
      </div>

      {/* PROGRESS BAR */}
      <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mb-8 relative">
        <motion.div 
          className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.8)]"
          style={{ width: `${count}%` }}
        />
      </div>

      {/* ANIME QUOTE */}
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-gray-400 text-sm md:text-base font-medium text-center max-w-md px-6 italic"
      >
        "{quote}"
      </motion.p>

      {/* BOTTOM TAGLINE */}
      <div className="absolute bottom-8 text-xs font-bold tracking-[0.2em] text-blue-500/50 uppercase">
        System Synchronization
      </div>

    </motion.div>
  );
};

export default Preloader;