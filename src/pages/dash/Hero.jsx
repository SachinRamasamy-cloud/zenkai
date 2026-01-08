import React, { useEffect, useState } from 'react';
import { animeApi } from '../../api/common'; 
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Star } from 'lucide-react';

const Hero = () => {
  const [featuredAnime, setFeaturedAnime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await animeApi.getTopAnime();
        const data = response.data;
        const randomPick = data[Math.floor(Math.random() * data.length)];
        setFeaturedAnime(randomPick);
      } catch (error) {
        console.error("Failed to fetch hero anime:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen bg-[#0b0c15] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-t-blue-500 border-gray-800 animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!featuredAnime) return null;

  return (
    // h-[100dvh] fixes the "mobile browser address bar" scroll issue
    <section className="relative w-full h-[100dvh] overflow-hidden bg-[#0b0c15] text-white">
      
      {/* 1. BACKGROUND LAYER */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          {/* Desktop Gradient: Left to Right fade (reads better on wide screens) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c15] via-[#0b0c15]/60 to-transparent z-10 hidden md:block" />
          
          {/* Mobile Gradient: Bottom to Top fade (text sits at bottom on mobile) */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c15] via-[#0b0c15]/50 to-transparent z-10 md:hidden" />
          
          <img 
            src={featuredAnime.images.jpg.large_image_url} 
            alt="Background" 
            className="w-full h-full object-cover opacity-70 md:opacity-60 object-center"
          />
        </motion.div>
      </AnimatePresence>

      {/* 2. CONTENT LAYER 
          - Mobile: Items aligned to 'end' (bottom)
          - Desktop: Items aligned to 'center'
      */}
      <div className="relative z-20 h-full w-full max-w-[1920px] mx-auto px-6 md:px-16 lg:px-24 flex items-end md:items-center pb-20 md:pb-0">
        
        {/* Content Container: Width expands on large screens */}
        <div className="w-full max-w-lg md:max-w-3xl lg:max-w-4xl">
          
          {/* Badge / Rank */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center gap-3 mb-4 md:mb-6"
          >
            <span className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-400 text-[10px] md:text-xs font-bold tracking-widest rounded-full uppercase backdrop-blur-md">
              #{featuredAnime.rank || 'Trend'}
            </span>
            <span className="px-3 py-1 bg-white/5 border border-white/10 text-gray-300 text-[10px] md:text-xs font-bold tracking-widest rounded-full uppercase backdrop-blur-md">
               {featuredAnime.type}
            </span>
            <div className="flex items-center gap-1 text-yellow-400 ml-1">
              <Star size={16} fill="currentColor" />
              <span className="text-sm md:text-base font-bold">{featuredAnime.score}</span>
            </div>
          </motion.div>

          {/* Title - Responsive Sizing */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-4 md:mb-8 text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-500"
          >
            {featuredAnime.title_english || featuredAnime.title}
          </motion.h1>

          {/* Synopsis - Hidden on very small screens, expanded on desktop */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="hidden sm:block text-gray-300 text-sm md:text-lg lg:text-xl leading-relaxed mb-6 md:mb-10 line-clamp-3 md:line-clamp-4 max-w-2xl"
          >
            {featuredAnime.synopsis}
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto"
          >
            <button className="group relative w-full sm:w-auto px-8 py-3 md:py-4 bg-blue-600 rounded-xl font-bold flex justify-center items-center gap-3 overflow-hidden transition-all hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/20">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <Play size={20} fill="currentColor" />
              <span>Watch Trailer</span>
            </button>
            
            <button className="w-full sm:w-auto px-8 py-3 md:py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl font-bold flex justify-center items-center gap-3 transition-all hover:bg-white/10 hover:border-white/20 active:scale-95">
              <Info size={20} />
              <span>Details</span>
            </button>
          </motion.div>

          {/* Metadata Footer - Desktop Only */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="hidden md:flex mt-12 gap-12 border-t border-white/5 pt-6"
          >
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Status</p>
              <p className="text-white font-medium">{featuredAnime.status}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Episodes</p>
              <p className="text-white font-medium">{featuredAnime.episodes || '?'}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Studio</p>
              <p className="text-white font-medium">{featuredAnime.studios?.[0]?.name || 'Unknown'}</p>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Smooth scroll transition gradient */}
      <div className="absolute bottom-0 left-0 w-full h-24 md:h-48 bg-gradient-to-t from-[#0b0c15] to-transparent z-20 pointer-events-none" />
    </section>
  );
};

export default Hero;