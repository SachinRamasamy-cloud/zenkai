import React, { useEffect, useState, useRef } from 'react';
import { animeApi } from '../../api/common'; 
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star, Calendar, Clock, ChevronRight, Plus, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [featuredAnime, setFeaturedAnime] = useState(null);
  const [trendingList, setTrendingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  // Mouse parallax effect state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 25;
    const y = (clientY / innerHeight - 0.5) * 25;
    setMousePosition({ x, y });
  };

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await animeApi.getTopAnime();
        const data = response.data;
        if (data && data.length > 0) {
          const randomIndex = Math.floor(Math.random() * Math.min(data.length, 10));
          setFeaturedAnime(data[randomIndex]);
          setTrendingList(data.filter((_, i) => i !== randomIndex).slice(0, 5));
        }
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
      <div className="w-full h-[100dvh] bg-[#0b0c15] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-blue-500 font-black tracking-[0.3em] uppercase text-sm animate-pulse">Initializing Zenkai</p>
        </motion.div>
      </div>
    );
  }

  if (!featuredAnime) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(15px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-[100dvh] overflow-hidden bg-[#0b0c15] text-white select-none"
    >
      
      {/* 1. BACKGROUND LAYER */}
      <AnimatePresence mode="wait">
        <motion.div
          key={featuredAnime.mal_id}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            x: mousePosition.x * -0.8,
            y: mousePosition.y * -0.8,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 z-0 overflow-hidden"
        >
          <motion.img 
            initial={{ scale: 1.2 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 25, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            src={featuredAnime.images.jpg.large_image_url} 
            alt="Background" 
            className="w-full h-full object-cover opacity-30 md:opacity-25"
          />
          
          {/* Enhanced Gradients for Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c15] via-[#0b0c15]/90 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c15] via-transparent to-transparent z-10" />
        </motion.div>
      </AnimatePresence>

      {/* 2. CONTENT LAYER */}
      <div className="relative z-20 h-full w-full max-w-[1400px] mx-auto px-6 md:px-12 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center w-full">
        
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 xl:col-span-8"
          >
          
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded">
                Featured
              </span>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star size={16} fill="currentColor" />
                <span className="text-sm font-bold">{featuredAnime.score} Rating</span>
              </div>  
              <span className="text-gray-400 text-sm font-bold">• {featuredAnime.type}</span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-6xl md:text-7xl xl:text-8xl font-black leading-tight mb-6 uppercase tracking-tighter"
            >
              {featuredAnime.title_english || featuredAnime.title}
            </motion.h1>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-6 text-gray-300 text-sm font-bold mb-8">
              <span className="flex items-center gap-2"><Calendar size={18} className="text-blue-500" /> {featuredAnime.year || '2024'}</span>
              <span className="flex items-center gap-2"><Clock size={18} className="text-blue-500" /> {featuredAnime.duration || '24m'}</span>
              <span className="px-2 py-0.5 bg-white/10 rounded text-xs border border-white/10">{featuredAnime.rating?.split(' ')[0] || 'PG-13'}</span>
            </motion.div>

            <motion.p 
              variants={itemVariants}
              className="hidden sm:block text-gray-400 text-lg md:text-xl leading-relaxed mb-10 line-clamp-3 max-w-2xl font-medium"
            >
              {featuredAnime.synopsis}
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-white text-black rounded-xl font-black flex items-center gap-3 transition-all hover:bg-blue-500 hover:text-white active:scale-95 shadow-xl">
                <Play size={20} fill="currentColor" />
                <span className="uppercase tracking-widest text-sm">Watch Now</span>
              </button>
              
              <Link to={`/anime/${featuredAnime.mal_id}`} className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl font-black flex items-center gap-3 transition-all hover:bg-white/20 active:scale-95 group">
                <Info size={20} />
                <span className="uppercase tracking-widest text-sm text-white">Details</span>
              </Link>

              <button className="p-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/20 transition-all">
                <Plus size={20} />
              </button>
            </motion.div>
          </motion.div>

          {/* Right Content - Spotlight Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="hidden lg:flex lg:col-span-5 xl:col-span-4 flex-col gap-6"
          >
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-2">Spotlight Trending</h3>
            <div className="flex flex-col gap-4">
              {trendingList.map((anime, idx) => (
                <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id}>
                  <motion.div 
                    whileHover={{ x: 10 }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                      <img src={anime.images.jpg.image_url} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <h4 className="text-[10px] font-bold line-clamp-1 text-gray-200">{anime.title_english || anime.title}</h4>
                      <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-bold">
                        <Star size={8} className="text-yellow-500" fill="currentColor" />
                        {anime.score}
                        <span className="text-gray-600 ml-auto">{anime.type}</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 md:h-64 bg-gradient-to-t from-[#0b0c15] to-transparent z-20 pointer-events-none" />
    </section>
  );
};

export default Hero;