import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/zenkai.png';

const animeQuotes = [
  "Whatever you lose, you'll find it again. But what you throw away you'll never get back.",
  "Power comes in response to a need, not a desire.",
  "If you don't take risks, you can't create a future.",
  "The world isn't perfect. But it's there for us, doing the best it can.",
  "Fear is not evil. It tells you what your weakness is.",
  "It's not about whether you can or can't. You do it because you want to.",
];

const Preloader = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setQuote(animeQuotes[Math.floor(Math.random() * animeQuotes.length)]);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev === 100) {
          clearInterval(timer);
          setTimeout(onComplete, 800);
          return 100;
        }
        const diff = Math.random() * 8 + 2;
        return Math.min(prev + diff, 100);
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Manga panel animation sequence
  const panels = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    delay: i * 0.1,
  }));

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-[#0b0c15] via-[#1a0a1f] to-[#0b0c15] text-white overflow-hidden"
    >
      {/* Manga Panel Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className={`absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="0" x2="100" y2="0" stroke="white"/><line x1="0" y1="50" x2="100" y2="50" stroke="white"/><line x1="0" y1="100" x2="100" y2="100" stroke="white"/><line x1="0" y1="0" x2="0" y2="100" stroke="white"/><line x1="50" y1="0" x2="50" y2="100" stroke="white"/><line x1="100" y1="0" x2="100" y2="100" stroke="white"/></svg>')]`} />
      </div>

      {/* Anime-style Glowing Aura */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-pink-600/20 rounded-full blur-3xl"
      />

      <div className="relative z-10 flex flex-col items-center justify-center">
        
        {/* Manga Panel Animation - Top */}
        <motion.div
          className="mb-12 grid grid-cols-4 gap-2 w-72"
        >
          {panels.slice(0, 4).map((panel) => (
            <motion.div
              key={panel.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: panel.delay }}
              className="aspect-square rounded-lg border-2 border-blue-500/40 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-3 flex items-center justify-center"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: panel.delay * 2,
                }}
                className="w-full h-full border border-dashed border-blue-400/20 rounded"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Central Zenkai Logo with Anime Effect */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
          className="relative mb-12"
        >
          {/* Spiral Anime Energy */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, transparent, rgba(59,130,246,0.3), transparent)",
            }}
          />

          {/* Character Silhouette Style */}
          <motion.div
            animate={{
              boxShadow: [
                "0 0 30px rgba(59,130,246,0.4), 0 0 60px rgba(168,85,247,0.2)",
                "0 0 50px rgba(59,130,246,0.6), 0 0 100px rgba(168,85,247,0.3)",
                "0 0 30px rgba(59,130,246,0.4), 0 0 60px rgba(168,85,247,0.2)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center border-2 border-blue-400/50"
          >
            <motion.img
              src={logo}
              alt="Logo"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-20 h-20 object-contain drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]"
            />
          </motion.div>
        </motion.div>

        {/* Manga Panel Animation - Bottom */}
        <motion.div
          className="mb-12 grid grid-cols-4 gap-2 w-72"
        >
          {panels.slice(4, 8).map((panel) => (
            <motion.div
              key={panel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: panel.delay }}
              className="aspect-square rounded-lg border-2 border-purple-500/40 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 p-3 flex items-center justify-center"
            >
              <motion.div
                animate={{
                  y: [0, 10, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: panel.delay * 2,
                }}
                className="w-full h-full border border-dashed border-purple-400/20 rounded"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Anime-style Progress Counter - Japanese Style */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative mb-8 text-center"
        >
          <div className="text-6xl md:text-7xl font-black tracking-tighter tabular-nums mb-2">
            <motion.span
              animate={{
                color: ["#3b82f6", "#a78bfa", "#ec4899", "#3b82f6"],
                textShadow: [
                  "0 0 20px rgba(59,130,246,0.5)",
                  "0 0 30px rgba(167,139,250,0.6)",
                  "0 0 30px rgba(236,72,153,0.6)",
                  "0 0 20px rgba(59,130,246,0.5)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {Math.floor(count)}%
            </motion.span>
          </div>
          <motion.p
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-xs font-black uppercase tracking-[0.3em] text-blue-400"
          >
            Loading Story
          </motion.p>
        </motion.div>

        {/* Anime-style Progress Bar - Gradient Wave */}
        <motion.div
          className="w-80 md:w-96 mb-8 relative"
        >
          <div className="relative h-3 bg-white/5 rounded-full overflow-hidden border border-blue-500/30 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]">
            {/* Animated gradient bar */}
            <motion.div
              className="absolute inset-y-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500"
              style={{ width: `${count}%` }}
              animate={{
                boxShadow: [
                  "0 0 15px rgba(59,130,246,0.6), inset 0 0 10px rgba(255,255,255,0.2)",
                  "0 0 25px rgba(168,85,247,0.8), inset 0 0 15px rgba(255,255,255,0.3)",
                  "0 0 15px rgba(59,130,246,0.6), inset 0 0 10px rgba(255,255,255,0.2)",
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />

            {/* Wave effect overlay */}
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
          </div>

          {/* Decorative dots */}
          <div className="flex justify-between mt-2 px-1">
            {[25, 50, 75, 100].map((mark) => (
              <motion.div
                key={mark}
                animate={{ opacity: count >= mark ? 1 : 0.3 }}
                className="w-1.5 h-1.5 rounded-full bg-blue-500"
              />
            ))}
          </div>
        </motion.div>

        {/* Episode/Chapter Style Text */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 uppercase tracking-widest mb-6"
        >
          Episode {Math.floor(count / 10) + 1}: Begin
        </motion.div>

        {/* Anime Quote with Styled Border */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="relative max-w-2xl px-8 mb-4"
        >
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500/60" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500/60" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500/60" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500/60" />

          <p className="text-center text-sm md:text-base text-gray-200 italic font-light leading-relaxed">
            "{quote}"
          </p>
        </motion.div>

        {/* Anime Status - Japanese Characters Style */}
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="text-xs font-mono text-blue-400/70 uppercase tracking-widest"
        >
          ▬ Preparing Adventure ▬
        </motion.div>
      </div>

      {/* Anime-style Corner Accents */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute top-8 left-8 text-blue-500/40 font-black text-sm"
      >
        ◆
      </motion.div>

      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
        className="absolute top-8 right-8 text-purple-500/40 font-black text-sm"
      >
        ◆
      </motion.div>

      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
        className="absolute bottom-8 left-8 text-pink-500/40 font-black text-sm"
      >
        ◆
      </motion.div>

      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
        className="absolute bottom-8 right-8 text-blue-500/40 font-black text-sm"
      >
        ◆
      </motion.div>
    </motion.div>
  );
};

export default Preloader;