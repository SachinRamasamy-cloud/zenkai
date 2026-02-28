import React, { useEffect, useState, useRef } from 'react';
import { animeApi } from '../../api/common'; 
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star, Calendar, Clock, ChevronRight, Loader2 } from 'lucide-react';
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
          className="absolute inset-0 z-0"
        >
          <motion.img 
            initial={{ scale: 1.3 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 25, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            src={featuredAnime.images.jpg.large_image_url} 
            alt="Background" 
            className="w-full h-full object-cover opacity-30 md:opacity-25"
          />
          
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c15] via-[#0b0c15]/80 to-transparent z-10 hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c15] via-[#0b0c15]/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-black/20 z-10" />
        </motion.div>
      </AnimatePresence>

      {/* 2. CONTENT LAYER */}
      <div className="relative z-20 h-full w-full max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
        
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-8 xl:col-span-7"
          >
          
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-4 py-1.5 bg-blue-600 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest shadow-[0_0_25px_rgba(37,99,235,0.5)]">
                Top #{featuredAnime.rank || 'Trend'}
              </span>
              <span className="px-4 py-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-[10px] md:text-xs font-bold text-gray-300 uppercase tracking-widest">
                {featuredAnime.type}
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-500">
                <Star size={14} fill="currentColor" />
                <span className="text-xs md:text-sm font-black">{featuredAnime.score}</span>
              </div>
            </motion.div>

            <motion.h1 
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.02, delayChildren: 0.2 }
              }
            }}
              className="text-5xl sm:text-6xl md:text-8xl xl:text-9xl font-black leading-[0.85] tracking-tighter mb-8 uppercase"
            >
            <span className="sr-only">{featuredAnime.title_english || featuredAnime.title}</span>
            <span className="block text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]" aria-hidden="true">
              {(featuredAnime.title_english || featuredAnime.title).split("").map((char, index) => (
                <span key={index} className="inline-block overflow-hidden">
                  <motion.span
                    variants={{
                      hidden: { y: "100%", rotate: 10 },
                      visible: { 
                        y: 0, rotate: 0,
                        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
                      }
                    }}
                    className="inline-block origin-left"
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                </span>
              ))}
            </span>
            </motion.h1>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-6 text-gray-400 text-xs md:text-sm font-black uppercase tracking-[0.2em] mb-8">
              <span className="flex items-center gap-2"><Calendar size={16} className="text-blue-500" /> {featuredAnime.year || 'N/A'}</span>
              <span className="flex items-center gap-2"><Clock size={16} className="text-blue-500" /> {featuredAnime.duration || '24m'}</span>
              <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] border border-white/10 text-white">{featuredAnime.rating?.split(' ')[0] || 'PG-13'}</span>
            </motion.div>

            <motion.p 
              variants={itemVariants}
              className="hidden sm:block text-gray-400 text-base md:text-xl leading-relaxed mb-10 line-clamp-3 max-w-3xl font-medium"
            >
              {featuredAnime.synopsis}
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <button className="group relative px-10 py-4 bg-white text-black rounded-2xl font-black flex justify-center items-center gap-3 overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                <Play size={20} fill="currentColor" />
                <span className="uppercase tracking-tighter">Watch Now</span>
              </button>
              
              <Link to={`/anime/${featuredAnime.mal_id}`} className="px-10 py-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl font-black flex justify-center items-center gap-3 transition-all hover:bg-white/10 hover:border-white/20 active:scale-95 group">
                <span className="uppercase tracking-tighter text-gray-300 group-hover:text-white">View Details</span>
                <ChevronRight size={20} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Content - Trending Thumbnails */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="hidden xl:flex xl:col-span-5 flex-col gap-6"
          >
            <div className="flex items-center gap-4 mb-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-blue-500/50" />
              <h3 className="text-sm font-black uppercase tracking-[0.3em] text-blue-500">Trending Now</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {trendingList.map((anime, idx) => (
                <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id}>
                  <motion.div 
                    whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.05)" }}
                    className="flex flex-col gap-3 p-3 rounded-2xl transition-colors border border-transparent hover:border-white/10"
                  >
                    <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg border border-white/5">
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